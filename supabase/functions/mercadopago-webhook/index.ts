// POST /functions/v1/mercadopago-webhook
//
// Receives MercadoPago IPN-style notifications about payment lifecycle.
// MercadoPago sends events like:
//   { action: "payment.updated", data: { id: "<payment_id>" }, type: "payment", ... }
//
// We:
//   1. Verify HMAC-SHA256 signature against MERCADOPAGO_WEBHOOK_SECRET.
//   2. For payment.* events, fetch the payment from MP (status, external_reference).
//   3. Map MP status → our `payment_status` + `order.status`.
//   4. Award loyalty points (1 point per $10 MXN) if newly paid.
//   5. Idempotent on `mp_payment_id`.
//
// Env vars:
//   MERCADOPAGO_ACCESS_TOKEN
//   MERCADOPAGO_WEBHOOK_SECRET   (from MP dashboard → Webhooks → secret)

import { corsHeaders } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';

type MpEvent = {
  action?: string;
  type?: string;
  data?: { id?: string | number };
};

type MpPayment = {
  id: number;
  status:
    | 'approved'
    | 'pending'
    | 'in_process'
    | 'rejected'
    | 'refunded'
    | 'cancelled'
    | 'charged_back';
  external_reference: string | null;
  transaction_amount: number;
};

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'content-type': 'application/json' },
  });

async function verifySignature(
  req: Request,
  rawBody: string,
  secret: string,
): Promise<boolean> {
  const sigHeader = req.headers.get('x-signature');
  const requestId = req.headers.get('x-request-id');
  if (!sigHeader || !requestId) return false;

  // x-signature looks like: "ts=1700000000,v1=hex"
  const parts = Object.fromEntries(
    sigHeader.split(',').map((p) => {
      const [k, v] = p.split('=');
      return [k.trim(), v?.trim() ?? ''];
    }),
  );
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  const url = new URL(req.url);
  const dataId = url.searchParams.get('data.id') ?? '';
  // MP-documented manifest format:
  //   id:<data.id>;request-id:<x-request-id>;ts:<ts>;
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(manifest));
  const expected = Array.from(new Uint8Array(sigBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // Constant-time compare
  if (expected.length !== v1.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ v1.charCodeAt(i);
  }
  return mismatch === 0;
}

function mapPaymentStatus(mp: MpPayment['status']): {
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  order_status?: 'paid' | 'preparing' | 'cancelled';
} {
  switch (mp) {
    case 'approved':
      return { payment_status: 'paid', order_status: 'paid' };
    case 'pending':
    case 'in_process':
      return { payment_status: 'pending' };
    case 'rejected':
    case 'cancelled':
      return { payment_status: 'failed', order_status: 'cancelled' };
    case 'refunded':
    case 'charged_back':
      return { payment_status: 'refunded' };
    default:
      return { payment_status: 'pending' };
  }
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const accessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
  const webhookSecret = Deno.env.get('MERCADOPAGO_WEBHOOK_SECRET');
  if (!accessToken) return json({ error: 'mp_token_missing' }, 500);

  const rawBody = await req.text();

  // In dev / first-setup the secret may be unset — log loudly but don't refuse.
  // Once the secret is configured in MP + Supabase secrets, signature is enforced.
  if (webhookSecret) {
    const ok = await verifySignature(req, rawBody, webhookSecret);
    if (!ok) return json({ error: 'invalid_signature' }, 401);
  } else {
    console.warn('mercadopago-webhook: MERCADOPAGO_WEBHOOK_SECRET not set; skipping signature check');
  }

  let event: MpEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const isPayment =
    event.type === 'payment' || (event.action ?? '').startsWith('payment.');
  if (!isPayment) {
    // Acknowledge non-payment events so MP stops retrying.
    return json({ received: true, ignored: event.type ?? event.action });
  }

  const paymentId = event.data?.id;
  if (!paymentId) return json({ error: 'missing_payment_id' }, 400);

  // Fetch full payment object from MP.
  const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { authorization: `Bearer ${accessToken}` },
  });
  if (!mpRes.ok) {
    return json({ error: 'mp_fetch_failed', status: mpRes.status }, 502);
  }
  const payment = (await mpRes.json()) as MpPayment;

  const orderId = payment.external_reference;
  if (!orderId) return json({ error: 'missing_external_reference' }, 400);

  const sb = getServiceClient();

  // Idempotency: if we already processed this payment, no-op.
  const { data: existing } = await sb
    .from('orders')
    .select('id, payment_status, mp_payment_id, total_cents, user_id')
    .eq('id', orderId)
    .single();

  if (!existing) return json({ error: 'order_not_found' }, 404);
  if (existing.mp_payment_id === String(payment.id) && existing.payment_status === 'paid') {
    return json({ received: true, already_processed: true });
  }

  const mapped = mapPaymentStatus(payment.status);

  const updates: Record<string, unknown> = {
    payment_status: mapped.payment_status,
    mp_payment_id: String(payment.id),
  };
  if (mapped.order_status) updates.status = mapped.order_status;

  const { error: updateErr } = await sb.from('orders').update(updates).eq('id', orderId);
  if (updateErr) {
    return json({ error: 'order_update_failed', detail: updateErr.message }, 500);
  }

  // Award loyalty points: 1 point per $10 MXN, on first transition to paid.
  const transitionedToPaid =
    mapped.payment_status === 'paid' && existing.payment_status !== 'paid';
  if (transitionedToPaid && existing.user_id) {
    const points = Math.floor(existing.total_cents / 1000); // cents → points
    if (points > 0) {
      await sb.from('loyalty_points').insert({
        user_id: existing.user_id,
        points,
        source: 'order_paid',
        order_id: orderId,
      });
    }
  }

  return json({ received: true, orderId, status: mapped.payment_status });
});
