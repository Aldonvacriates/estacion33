'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { Database } from '@estacion33/core';
import { getServerSupabase } from '@/lib/supabase/server';

type OrderStatus = Database['estacion33']['Enums']['order_status'];
type ReservationStatus = Database['estacion33']['Enums']['reservation_status'];

const orderStatuses: OrderStatus[] = [
  'pending',
  'paid',
  'preparing',
  'ready',
  'out_for_delivery',
  'delivered',
  'cancelled',
];

const reservationStatuses: ReservationStatus[] = [
  'pending',
  'confirmed',
  'cancelled',
  'no_show',
];

export type AdminResult = { ok: true } | { ok: false; error: string };

async function requireAdmin() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, isAdmin: false };
  const { data } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();
  return { supabase, user, isAdmin: !!data?.is_admin };
}

export async function setOrderStatusAction(input: {
  orderId: string;
  status: string;
}): Promise<AdminResult> {
  if (!orderStatuses.includes(input.status as OrderStatus)) {
    return { ok: false, error: 'invalid_status' };
  }
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { ok: false, error: 'not_admin' };

  const { error } = await supabase
    .from('orders')
    .update({ status: input.status as OrderStatus })
    .eq('id', input.orderId);
  if (error) return { ok: false, error: error.message };

  revalidatePath('/admin/ordenes');
  return { ok: true };
}

export async function setReservationStatusAction(input: {
  reservationId: string;
  status: string;
}): Promise<AdminResult> {
  if (!reservationStatuses.includes(input.status as ReservationStatus)) {
    return { ok: false, error: 'invalid_status' };
  }
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { ok: false, error: 'not_admin' };

  const { error } = await supabase
    .from('reservations')
    .update({ status: input.status as ReservationStatus })
    .eq('id', input.reservationId);
  if (error) return { ok: false, error: error.message };

  revalidatePath('/admin/reservas');
  return { ok: true };
}

const productUpdateSchema = z.object({
  productId: z.string().uuid(),
  name: z.string().min(2).max(120).optional(),
  description: z.string().max(2000).nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  available: z.boolean().optional(),
  basePriceCents: z.number().int().min(0).max(1_000_000).optional(),
  sortOrder: z.number().int().min(0).max(10_000).optional(),
});

export async function updateProductAction(input: {
  productId: string;
  name?: string;
  description?: string | null;
  imageUrl?: string | null;
  available?: boolean;
  basePriceCents?: number;
  sortOrder?: number;
}): Promise<AdminResult> {
  const parsed = productUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'invalid_input' };
  }

  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { ok: false, error: 'not_admin' };

  const update: Database['estacion33']['Tables']['products']['Update'] = {};
  if (parsed.data.name !== undefined) update.name = parsed.data.name;
  if (parsed.data.description !== undefined) update.description = parsed.data.description;
  if (parsed.data.imageUrl !== undefined) update.image_url = parsed.data.imageUrl;
  if (parsed.data.available !== undefined) update.available = parsed.data.available;
  if (parsed.data.basePriceCents !== undefined)
    update.base_price_cents = parsed.data.basePriceCents;
  if (parsed.data.sortOrder !== undefined) update.sort_order = parsed.data.sortOrder;

  const { error } = await supabase
    .from('products')
    .update(update)
    .eq('id', parsed.data.productId);
  if (error) return { ok: false, error: error.message };

  revalidatePath('/admin/menu');
  revalidatePath('/menu');
  revalidatePath(`/menu/${parsed.data.productId}`); // best effort; slug is the real key
  return { ok: true };
}

export type UploadResult =
  | { ok: true; publicUrl: string }
  | { ok: false; error: string };

/**
 * Accepts a FormData payload with `file` (image) + `productId` (uuid),
 * uploads to the menu-images bucket, patches products.image_url, returns
 * the public URL. Bucket is public, so the URL is shareable.
 */
export async function uploadProductImageAction(formData: FormData): Promise<UploadResult> {
  const productId = formData.get('productId');
  const file = formData.get('file');
  if (typeof productId !== 'string' || !productId) {
    return { ok: false, error: 'productId_required' };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: 'file_required' };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { ok: false, error: 'file_too_large' };
  }
  if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
    return { ok: false, error: 'invalid_image_type' };
  }

  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { ok: false, error: 'not_admin' };

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `${productId}/${Date.now()}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from('menu-images')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });
  if (upErr) return { ok: false, error: `upload: ${upErr.message}` };

  const { data: urlData } = supabase.storage.from('menu-images').getPublicUrl(path);
  const publicUrl = urlData.publicUrl;

  const { error: updErr } = await supabase
    .from('products')
    .update({ image_url: publicUrl })
    .eq('id', productId);
  if (updErr) return { ok: false, error: `update: ${updErr.message}` };

  revalidatePath('/admin/menu');
  revalidatePath('/menu');
  return { ok: true, publicUrl };
}
