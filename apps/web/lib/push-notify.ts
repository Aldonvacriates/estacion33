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
    await supabase
      .from('repartidor_push_subs')
      .delete()
      .in('id', deadIds);
  }
}

function formatMxnCents(cents: number): string {
  return (cents / 100).toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  });
}
