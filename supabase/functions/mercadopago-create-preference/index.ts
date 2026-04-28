// POST /functions/v1/mercadopago-create-preference
//
// Body: { orderId: string }  (uuid in estacion33.orders)
//
// 1. Loads the order + items (service-role bypasses RLS).
// 2. Builds a MercadoPago Checkout Pro preference.
// 3. Persists `mp_preference_id` on the order.
// 4. Returns { initPoint } — the URL the client redirects to for payment.
//
// Env vars required:
//   MERCADOPAGO_ACCESS_TOKEN  (Supabase secret)
//   PUBLIC_WEB_URL            (Supabase secret, e.g. https://estacion33.mx
//                              or https://localhost:3000 for dev)

import { corsHeaders } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';

type RequestBody = { orderId?: string };

type OrderItemRow = {
  qty: number;
  unit_price_cents: number;
  product: { name: string } | null;
};

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'content-type': 'application/json' },
  });

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }
  const orderId = body.orderId;
  if (!orderId || typeof orderId !== 'string') {
    return json({ error: 'orderId_required' }, 400);
  }

  const accessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
  const publicWebUrl = Deno.env.get('PUBLIC_WEB_URL') ?? 'http://localhost:3000';
  if (!accessToken) return json({ error: 'mp_token_missing' }, 500);

  const sb = getServiceClient();

  const { data: order, error: orderErr } = await sb
    .from('orders')
    .select('id, total_cents, payment_status, status')
    .eq('id', orderId)
    .single();

  if (orderErr || !order) return json({ error: 'order_not_found' }, 404);

  if (order.payment_status !== 'pending') {
    return json({ error: 'order_already_paid_or_failed' }, 409);
  }

  const { data: items, error: itemsErr } = await sb
    .from('order_items')
    .select('qty, unit_price_cents, product:products(name)')
    .eq('order_id', orderId)
    .returns<OrderItemRow[]>();

  if (itemsErr || !items || items.length === 0) {
    return json({ error: 'order_items_missing' }, 400);
  }

  const mpItems = items.map((it, idx) => ({
    id: `${orderId}-${idx}`,
    title: it.product?.name ?? 'Producto',
    quantity: it.qty,
    unit_price: Number((it.unit_price_cents / 100).toFixed(2)),
    currency_id: 'MXN',
  }));

  const preferenceBody = {
    items: mpItems,
    external_reference: orderId,
    back_urls: {
      success: `${publicWebUrl}/orden/${orderId}?status=success`,
      failure: `${publicWebUrl}/orden/${orderId}?status=failure`,
      pending: `${publicWebUrl}/orden/${orderId}?status=pending`,
    },
    auto_return: 'approved',
    statement_descriptor: 'ESTACION33',
    notification_url:
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/mercadopago-webhook`,
  };

  const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(preferenceBody),
  });

  const mpJson = (await mpRes.json()) as {
    id?: string;
    init_point?: string;
    sandbox_init_point?: string;
    message?: string;
  };

  if (!mpRes.ok || !mpJson.id) {
    return json(
      { error: 'mp_preference_failed', detail: mpJson.message ?? mpJson },
      502,
    );
  }

  const { error: updateErr } = await sb
    .from('orders')
    .update({ mp_preference_id: mpJson.id })
    .eq('id', orderId);

  if (updateErr) {
    // Non-fatal — preference exists at MP, but our DB didn't save the id.
    // Webhook still works via external_reference.
    console.warn('failed_to_persist_preference_id', updateErr);
  }

  // For TEST credentials, MP returns sandbox_init_point. Use whichever is set.
  const initPoint = mpJson.sandbox_init_point ?? mpJson.init_point;
  return json({ preferenceId: mpJson.id, initPoint });
});
