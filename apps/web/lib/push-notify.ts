import 'server-only';
import { getServerSupabase } from '@/lib/supabase/server';
import { type NotificationPayload, sendPushTo } from '@/lib/push';

// Fan-out helpers used by server actions when an order needs a driver.
// Pulls subscriptions out of repartidor_push_subs, sends in parallel,
// and prunes dead subscriptions (404/410 responses).

export type OfferContext = {
  orderId: string;
  totalCents: number;
  addressLine: string | null;
};

/**
 * Notify ALL subscribed repartidores that a new order is ready in the
 * shared queue. Used when admin moves an order to `ready` and it's
 * still unassigned.
 */
export async function notifyAllRepartidoresAboutOffer(
  ctx: OfferContext,
): Promise<void> {
  const supabase = await getServerSupabase();
  // Only drivers who currently have is_repartidor — pull through a join
  // to avoid pinging stale subs whose role was revoked.
  const { data: subs } = await supabase
    .from('repartidor_push_subs')
    .select('id, endpoint, p256dh, auth, driver_id, profiles!inner(is_repartidor)')
    .eq('profiles.is_repartidor', true)
    .returns<
      {
        id: string;
        endpoint: string;
        p256dh: string;
        auth: string;
        driver_id: string;
      }[]
    >();
  if (!subs || subs.length === 0) return;

  const total = formatMxnCents(ctx.totalCents);
  const payload: NotificationPayload = {
    title: '🍔 Nuevo pedido',
    body: ctx.addressLine
      ? `${total} · ${ctx.addressLine}`
      : `${total} — toca para tomarlo`,
    url: '/repartidor',
    tag: `offer-${ctx.orderId}`,
  };

  await fanOut(supabase, subs, payload);
}

/**
 * Notify a single driver — used when admin manually assigns an order to
 * a specific repartidor.
 */
export async function notifyDriverAboutAssignment(
  driverId: string,
  ctx: OfferContext,
): Promise<void> {
  const supabase = await getServerSupabase();
  const { data: subs } = await supabase
    .from('repartidor_push_subs')
    .select('id, endpoint, p256dh, auth')
    .eq('driver_id', driverId)
    .returns<{ id: string; endpoint: string; p256dh: string; auth: string }[]>();
  if (!subs || subs.length === 0) return;

  const total = formatMxnCents(ctx.totalCents);
  const payload: NotificationPayload = {
    title: '🛵 Pedido asignado',
    body: ctx.addressLine
      ? `${total} · ${ctx.addressLine}`
      : `${total} — está listo para entregar`,
    url: `/repartidor/orden/${ctx.orderId}`,
    tag: `assigned-${ctx.orderId}`,
  };

  await fanOut(supabase, subs, payload);
}

async function fanOut(
  supabase: Awaited<ReturnType<typeof getServerSupabase>>,
  subs: {
    id: string;
    endpoint: string;
    p256dh: string;
    auth: string;
  }[],
  payload: NotificationPayload,
  table: 'repartidor_push_subs' | 'customer_push_subs' = 'repartidor_push_subs',
): Promise<void> {
  const results = await Promise.all(
    subs.map((s) =>
      sendPushTo(
        { endpoint: s.endpoint, p256dh: s.p256dh, auth: s.auth },
        payload,
      ).then((r) => ({ id: s.id, result: r })),
    ),
  );

  // Garbage-collect dead subscriptions (404 = endpoint not found,
  // 410 = subscription expired/unsubscribed).
  const deadIds = results
    .filter((r) => !r.result.ok && (r.result.status === 404 || r.result.status === 410))
    .map((r) => r.id);
  if (deadIds.length > 0) {
    await supabase.from(table).delete().in('id', deadIds);
  }
}

// ---------------------------------------------------------------------------
// Customer-side: notify the customer when their order moves through statuses.
// ---------------------------------------------------------------------------

export type CustomerStatusChange = {
  orderId: string;
  // The status the order JUST transitioned to. We only ship a notification
  // for a curated subset — the ones the customer actually cares about.
  newStatus: string;
};

const CUSTOMER_STATUS_COPY: Record<string, { title: string; body: string } | undefined> = {
  paid: {
    title: '✅ Pago confirmado',
    body: 'Recibimos tu pago. Empezamos a preparar tu pedido.',
  },
  preparing: {
    title: '👨‍🍳 En preparación',
    body: 'Tu pedido está en la cocina.',
  },
  ready: {
    title: '🍔 Listo para recoger',
    body: 'Pasa por tu pedido cuando puedas.',
  },
  out_for_delivery: {
    title: '🛵 En camino',
    body: 'Tu pedido salió. Sigue al repartidor en vivo en la app.',
  },
  delivered: {
    title: '✅ Entregado',
    body: '¡Buen provecho! Gracias por pedir en Estación 33.',
  },
  cancelled: {
    title: '❌ Pedido cancelado',
    body: 'Tu pedido fue cancelado. Si tienes dudas, contáctanos.',
  },
};

/**
 * Notify a single customer that their order changed status. Looks up the
 * order's user_id internally so callers (server actions on the admin side)
 * don't have to pass it.
 *
 * Best-effort: failures are logged and swallowed — a missed push must never
 * roll back the underlying status change.
 */
export async function notifyCustomerAboutStatusChange(
  ctx: CustomerStatusChange,
): Promise<void> {
  const copy = CUSTOMER_STATUS_COPY[ctx.newStatus];
  if (!copy) return; // status change we don't notify on

  const supabase = await getServerSupabase();

  // Resolve the customer's user_id from the order. Skip guest orders —
  // they have no account to push to.
  const { data: order } = await supabase
    .from('orders')
    .select('user_id, fulfillment')
    .eq('id', ctx.orderId)
    .single<{ user_id: string | null; fulfillment: string }>();
  if (!order || !order.user_id) return;

  // For pickup orders, "ready" means come pick up; for delivery, "ready"
  // means it's about to be assigned to a driver — less actionable for the
  // customer, so skip it on delivery to avoid noise.
  if (ctx.newStatus === 'ready' && order.fulfillment === 'delivery') return;

  const { data: subs } = await supabase
    .from('customer_push_subs')
    .select('id, endpoint, p256dh, auth')
    .eq('user_id', order.user_id)
    .returns<{ id: string; endpoint: string; p256dh: string; auth: string }[]>();
  if (!subs || subs.length === 0) return;

  const payload: NotificationPayload = {
    title: copy.title,
    body: copy.body,
    url: `/orden/${ctx.orderId}`,
    tag: `order-${ctx.orderId}-${ctx.newStatus}`,
  };

  await fanOut(supabase, subs, payload, 'customer_push_subs');
}

function formatMxnCents(cents: number): string {
  return (cents / 100).toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  });
}
