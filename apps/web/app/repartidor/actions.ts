'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { Database } from '@estacion33/core';
import { getServerSupabase } from '@/lib/supabase/server';

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
