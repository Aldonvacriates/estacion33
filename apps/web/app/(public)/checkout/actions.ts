'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getServerSupabase } from '@/lib/supabase/server';

// Server-trusted shape. Prices are NOT trusted from the client — we re-resolve
// every product + option price from the DB before computing totals.
const checkoutSchema = z.object({
  fulfillment: z.enum(['delivery', 'pickup']),
  paymentMethod: z.enum(['cash', 'mercadopago']),
  scheduledFor: z.string().datetime(),
  notes: z.string().max(500).optional(),
  guestName: z.string().min(2).max(80),
  phone: z.string().min(8).max(20),
  // delivery-only
  addressLine1: z.string().max(200).optional(),
  addressLine2: z.string().max(200).optional(),
  addressNotes: z.string().max(500).optional(),
  // cart payload
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        qty: z.number().int().min(1).max(20),
        selectedOptions: z.array(
          z.object({
            optionId: z.string().uuid(),
            valueIds: z.array(z.string().uuid()),
          }),
        ),
      }),
    )
    .min(1),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export type CheckoutResult =
  | { ok: true; orderId: string; redirectUrl?: string }
  | { ok: false; error: string };

const DELIVERY_FEE_CENTS = 3000; // $30 MXN flat — placeholder until owner sets real fee

export async function createOrderAction(input: CheckoutInput): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'invalid_input' };
  }
  const data = parsed.data;

  if (data.fulfillment === 'delivery' && !data.addressLine1) {
    return { ok: false, error: 'address_required_for_delivery' };
  }

  const supabase = await getServerSupabase();

  // 1. Re-resolve all product + option prices server-side.
  const productIds = Array.from(new Set(data.items.map((i) => i.productId)));
  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select('id, name, base_price_cents, available')
    .in('id', productIds);

  if (prodErr) return { ok: false, error: `products_lookup: ${prodErr.message}` };
  if (!products || products.length !== productIds.length) {
    return { ok: false, error: 'product_not_found' };
  }
  const unavailable = products.find((p) => !p.available);
  if (unavailable) {
    return { ok: false, error: `product_unavailable: ${unavailable.name}` };
  }

  const allValueIds = Array.from(
    new Set(data.items.flatMap((i) => i.selectedOptions.flatMap((o) => o.valueIds))),
  );
  const valuePriceMap = new Map<string, number>();
  if (allValueIds.length > 0) {
    const { data: optValues, error: optErr } = await supabase
      .from('option_values')
      .select('id, price_delta_cents')
      .in('id', allValueIds);
    if (optErr) return { ok: false, error: `options_lookup: ${optErr.message}` };
    for (const v of optValues ?? []) valuePriceMap.set(v.id, v.price_delta_cents);
  }

  // 2. Compute server-trusted line totals.
  type LineCalc = {
    productId: string;
    qty: number;
    unit_price_cents: number;
    selected_options: { optionId: string; valueIds: string[] }[];
  };
  const lines: LineCalc[] = data.items.map((it) => {
    const product = products.find((p) => p.id === it.productId)!;
    const optionsTotal = it.selectedOptions
      .flatMap((o) => o.valueIds)
      .reduce((sum, vid) => sum + (valuePriceMap.get(vid) ?? 0), 0);
    return {
      productId: it.productId,
      qty: it.qty,
      unit_price_cents: product.base_price_cents + optionsTotal,
      selected_options: it.selectedOptions,
    };
  });

  const subtotalCents = lines.reduce((s, l) => s + l.unit_price_cents * l.qty, 0);
  const deliveryFeeCents = data.fulfillment === 'delivery' ? DELIVERY_FEE_CENTS : 0;
  const totalCents = subtotalCents + deliveryFeeCents;

  // 3. Insert address (delivery only).
  // For guest checkout we DON'T have an authenticated user, so we can't insert
  // into estacion33.addresses (RLS requires user_id = auth.uid()). For guests,
  // the address details live as text in the order's notes for now.
  // (When auth lands in slice 4.7, we save into addresses + link via address_id.)

  const guestAddressBlob =
    data.fulfillment === 'delivery'
      ? `Entrega: ${data.addressLine1}` +
        (data.addressLine2 ? ` · ${data.addressLine2}` : '') +
        (data.addressNotes ? ` · Ref: ${data.addressNotes}` : '')
      : `Recoger en sucursal — ${data.guestName} (${data.phone})`;

  const orderNotes = [guestAddressBlob, data.notes?.trim()].filter(Boolean).join(' | ');

  // 4. Insert the order.
  const { data: orderRow, error: orderErr } = await supabase
    .from('orders')
    .insert({
      user_id: null,
      status: 'pending',
      fulfillment: data.fulfillment,
      address_id: null,
      scheduled_for: data.scheduledFor,
      subtotal_cents: subtotalCents,
      delivery_fee_cents: deliveryFeeCents,
      total_cents: totalCents,
      payment_status: 'pending',
      notes: orderNotes,
    })
    .select('id')
    .single();

  if (orderErr || !orderRow) {
    return { ok: false, error: `order_insert: ${orderErr?.message ?? 'unknown'}` };
  }
  const orderId = orderRow.id;

  // 5. Insert order items.
  const { error: itemsErr } = await supabase.from('order_items').insert(
    lines.map((l) => ({
      order_id: orderId,
      product_id: l.productId,
      qty: l.qty,
      unit_price_cents: l.unit_price_cents,
      selected_options: l.selected_options,
    })),
  );
  if (itemsErr) {
    return { ok: false, error: `items_insert: ${itemsErr.message}` };
  }

  // 6. Route by payment method.
  if (data.paymentMethod === 'cash') {
    return { ok: true, orderId };
  }

  // MercadoPago path — invoke the edge function we deployed in Phase 3.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  const fnRes = await fetch(`${supabaseUrl}/functions/v1/mercadopago-create-preference`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      apikey: publishableKey,
      authorization: `Bearer ${publishableKey}`,
    },
    body: JSON.stringify({ orderId }),
  });

  const fnBodyText = await fnRes.text();
  let fnBody: { initPoint?: string; error?: string; detail?: unknown } = {};
  try {
    fnBody = JSON.parse(fnBodyText);
  } catch {
    // non-JSON body
  }

  if (!fnRes.ok || !fnBody.initPoint) {
    // Surface the failure into the Next.js dev terminal so we can debug.
    console.error('[checkout] mercadopago preference failed', {
      orderId,
      status: fnRes.status,
      body: fnBodyText.slice(0, 500),
    });
    // Order is already saved as pending. User can retry from the order page.
    return {
      ok: true,
      orderId,
      // No redirectUrl signals "MP failed but order exists" — the client navigates
      // to /orden/[id] where they see status + retry option (slice 4.5).
    };
  }

  return { ok: true, orderId, redirectUrl: fnBody.initPoint };
}

/** Server-action wrapper that redirects after creating the order. */
export async function submitCheckout(input: CheckoutInput): Promise<void> {
  const result = await createOrderAction(input);
  if (!result.ok) {
    // Re-throw so the form can catch and display. Server actions surface
    // thrown errors to the calling client component as rejected promises.
    throw new Error(result.error);
  }
  if (result.redirectUrl) {
    redirect(result.redirectUrl);
  }
  redirect(`/orden/${result.orderId}`);
}
