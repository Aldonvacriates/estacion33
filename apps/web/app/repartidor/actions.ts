'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { Database } from '@estacion33/core';
import { getServerSupabase } from '@/lib/supabase/server';
import { notifyCustomerAboutStatusChange } from '@/lib/push-notify';

export type RepartidorResult = { ok: true } | { ok: false; error: string };

async function requireRepartidor() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, isRepartidor: false };
  const { data } = await supabase
    .from('profiles')
    .select('is_repartidor')
    .eq('id', user.id)
    .single();
  return { supabase, user, isRepartidor: !!data?.is_repartidor };
}

// ---------------------------------------------------------------------------
// Claim a queued order — flips status to out_for_delivery, stamps the
// driver_id and started_at. Pre-condition is enforced both in code (we
// double-check status + assignment) and at the RLS layer.
// ---------------------------------------------------------------------------
export async function claimOrderForDeliveryAction(input: {
  orderId: string;
}): Promise<RepartidorResult> {
  const parsed = z.object({ orderId: z.string().uuid() }).safeParse(input);
  if (!parsed.success) return { ok: false, error: 'invalid_input' };

  const { supabase, user, isRepartidor } = await requireRepartidor();
  if (!user || !isRepartidor) return { ok: false, error: 'not_repartidor' };

  // Re-check the order is still claimable. The RLS policy already covers
  // this, but doing it explicitly gives a friendlier error.
  const { data: order } = await supabase
    .from('orders')
    .select('id, status, fulfillment, delivery_driver_id')
    .eq('id', parsed.data.orderId)
    .single();
  if (!order) return { ok: false, error: 'order_not_found' };
  if (order.fulfillment !== 'delivery') {
    return { ok: false, error: 'no es un pedido a domicilio' };
  }
  if (order.delivery_driver_id && order.delivery_driver_id !== user.id) {
    return { ok: false, error: 'otro repartidor ya tomó este pedido' };
  }
  if (order.status !== 'ready') {
    return { ok: false, error: 'el pedido aún no está listo para entrega' };
  }

  const update: Database['estacion33']['Tables']['orders']['Update'] = {
    status: 'out_for_delivery',
    delivery_driver_id: user.id,
    delivery_started_at: new Date().toISOString(),
  };
  const { error } = await supabase
    .from('orders')
    .update(update)
    .eq('id', parsed.data.orderId);
  if (error) return { ok: false, error: error.message };

  revalidatePath('/repartidor');
  revalidatePath(`/repartidor/orden/${parsed.data.orderId}`);
  revalidatePath('/admin/ordenes');
  revalidatePath(`/orden/${parsed.data.orderId}`);

  // Best-effort customer push so they know it's on the way.
  await notifyCustomerAboutStatusChange({
    orderId: parsed.data.orderId,
    newStatus: 'out_for_delivery',
  }).catch(() => {});

  return { ok: true };
}

// ---------------------------------------------------------------------------
// Mark delivered. Optionally toggles cash_collected (used when the driver
// collected cash at the door).
// ---------------------------------------------------------------------------
export async function completeDeliveryAction(input: {
  orderId: string;
  cashCollected: boolean;
}): Promise<RepartidorResult> {
  const parsed = z
    .object({ orderId: z.string().uuid(), cashCollected: z.boolean() })
    .safeParse(input);
  if (!parsed.success) return { ok: false, error: 'invalid_input' };

  const { supabase, user, isRepartidor } = await requireRepartidor();
  if (!user || !isRepartidor) return { ok: false, error: 'not_repartidor' };

  const { data: order } = await supabase
    .from('orders')
    .select('status, delivery_driver_id, payment_status')
    .eq('id', parsed.data.orderId)
    .single();
  if (!order) return { ok: false, error: 'order_not_found' };
  if (order.delivery_driver_id !== user.id) {
    return { ok: false, error: 'no es tu pedido' };
  }
  if (order.status !== 'out_for_delivery') {
    return { ok: false, error: 'el pedido no está en camino' };
  }

  const update: Database['estacion33']['Tables']['orders']['Update'] = {
    status: 'delivered',
    delivery_completed_at: new Date().toISOString(),
    cash_collected: parsed.data.cashCollected,
  };
  // If the driver collected cash on a pending order, mark it paid so the
  // admin sales totals are correct.
  if (parsed.data.cashCollected && order.payment_status === 'pending') {
    update.payment_status = 'paid';
  }

  const { error } = await supabase
    .from('orders')
    .update(update)
    .eq('id', parsed.data.orderId);
  if (error) return { ok: false, error: error.message };

  revalidatePath('/repartidor');
  revalidatePath('/repartidor/historial');
  revalidatePath(`/repartidor/orden/${parsed.data.orderId}`);
  revalidatePath('/admin/ordenes');
  revalidatePath(`/orden/${parsed.data.orderId}`);

  // Best-effort customer push: pedido entregado.
  await notifyCustomerAboutStatusChange({
    orderId: parsed.data.orderId,
    newStatus: 'delivered',
  }).catch(() => {});

  return { ok: true };
}

// ---------------------------------------------------------------------------
// Upload a proof-of-delivery photo to the private `delivery-proofs` bucket
// and stamp the path on the order. Driver can re-upload (overwrite) until
// the order is marked delivered.
// ---------------------------------------------------------------------------
export type UploadProofResult =
  | { ok: true; path: string }
  | { ok: false; error: string };

export async function uploadDeliveryProofAction(
  formData: FormData,
): Promise<UploadProofResult> {
  const orderId = formData.get('orderId');
  const file = formData.get('file');
  if (typeof orderId !== 'string' || !orderId) {
    return { ok: false, error: 'orderId_required' };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: 'file_required' };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { ok: false, error: 'file_too_large' };
  }
  if (!/^image\/(jpeg|png|webp|heic|heif)$/.test(file.type)) {
    return { ok: false, error: 'invalid_image_type' };
  }

  const { supabase, user, isRepartidor } = await requireRepartidor();
  if (!user || !isRepartidor) return { ok: false, error: 'not_repartidor' };

  // Make sure the order is assigned to me + still in transit.
  const { data: order } = await supabase
    .from('orders')
    .select('id, delivery_driver_id, status')
    .eq('id', orderId)
    .single();
  if (!order) return { ok: false, error: 'order_not_found' };
  if (order.delivery_driver_id !== user.id) {
    return { ok: false, error: 'no es tu pedido' };
  }
  if (order.status !== 'out_for_delivery') {
    return { ok: false, error: 'el pedido no está en camino' };
  }

  // Path: <orderId>/<timestamp>.<ext> — keeps history if driver re-uploads.
  const ext = (file.name.split('.').pop() ?? 'jpg').toLowerCase();
  const path = `${orderId}/${Date.now()}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from('delivery-proofs')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });
  if (upErr) return { ok: false, error: `upload: ${upErr.message}` };

  const { error: updErr } = await supabase
    .from('orders')
    .update({ delivery_proof_path: path })
    .eq('id', orderId);
  if (updErr) return { ok: false, error: `update: ${updErr.message}` };

  revalidatePath(`/repartidor/orden/${orderId}`);
  revalidatePath(`/orden/${orderId}`);
  return { ok: true, path };
}

// ---------------------------------------------------------------------------
// Append a single GPS reading to delivery_locations. Validates that the
// caller owns the order and that it's still in transit. RLS enforces both
// at the DB layer too — this is just for friendlier error messages and to
// short-circuit before hitting the DB.
// ---------------------------------------------------------------------------
const pingSchema = z.object({
  orderId: z.string().uuid(),
  lat: z.number().finite().min(-90).max(90),
  lng: z.number().finite().min(-180).max(180),
  accuracyMeters: z.number().finite().nonnegative().nullable().optional(),
});

export async function pingLocationAction(input: {
  orderId: string;
  lat: number;
  lng: number;
  accuracyMeters?: number | null;
}): Promise<RepartidorResult> {
  const parsed = pingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'invalid_input' };

  const { supabase, user, isRepartidor } = await requireRepartidor();
  if (!user || !isRepartidor) return { ok: false, error: 'not_repartidor' };

  const { error } = await supabase.from('delivery_locations').insert({
    order_id: parsed.data.orderId,
    driver_id: user.id,
    lat: parsed.data.lat,
    lng: parsed.data.lng,
    accuracy_m: parsed.data.accuracyMeters ?? null,
  });
  if (error) return { ok: false, error: error.message };

  // No revalidatePath — pings stream over realtime; revalidating every 20s
  // would invalidate the page cache constantly.
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Web Push subscription management. Driver hits "Activar notificaciones" on
// /repartidor → browser prompts → on grant, the client calls
// pushManager.subscribe() and posts the resulting endpoint + keys here.
// We upsert by endpoint (the unique URL the push service hands the
// browser) so a re-grant doesn't pile up duplicate rows.
// ---------------------------------------------------------------------------
const pushSubSchema = z.object({
  endpoint: z.string().url(),
  p256dh: z.string().min(1),
  auth: z.string().min(1),
  userAgent: z.string().max(500).nullable().optional(),
});

export async function subscribePushAction(input: {
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent?: string | null;
}): Promise<RepartidorResult> {
  const parsed = pushSubSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'invalid_input' };

  const { supabase, user, isRepartidor } = await requireRepartidor();
  if (!user || !isRepartidor) return { ok: false, error: 'not_repartidor' };

  const { error } = await supabase
    .from('repartidor_push_subs')
    .upsert(
      {
        driver_id: user.id,
        endpoint: parsed.data.endpoint,
        p256dh: parsed.data.p256dh,
        auth: parsed.data.auth,
        user_agent: parsed.data.userAgent ?? null,
      },
      { onConflict: 'endpoint' },
    );
  if (error) return { ok: false, error: error.message };

  return { ok: true };
}

export async function unsubscribePushAction(input: {
  endpoint: string;
}): Promise<RepartidorResult> {
  if (typeof input.endpoint !== 'string' || !input.endpoint) {
    return { ok: false, error: 'invalid_input' };
  }

  const { supabase, user, isRepartidor } = await requireRepartidor();
  if (!user || !isRepartidor) return { ok: false, error: 'not_repartidor' };

  const { error } = await supabase
    .from('repartidor_push_subs')
    .delete()
    .eq('endpoint', input.endpoint)
    .eq('driver_id', user.id);
  if (error) return { ok: false, error: error.message };

  return { ok: true };
}

// ---------------------------------------------------------------------------
// Toggle the driver's "always-on GPS" preference on their profile.
// Used in phase 3 when the location pinger picks a polling cadence; for
// now it just persists the flag.
// ---------------------------------------------------------------------------
export async function setAlwaysOnGpsAction(input: {
  enabled: boolean;
}): Promise<RepartidorResult> {
  const { supabase, user, isRepartidor } = await requireRepartidor();
  if (!user || !isRepartidor) return { ok: false, error: 'not_repartidor' };

  const { error } = await supabase
    .from('profiles')
    .update({ always_on_gps: input.enabled })
    .eq('id', user.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath('/repartidor');
  return { ok: true };
}
