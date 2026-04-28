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

const createProductSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(2).max(120).default('Nuevo producto'),
});

export type CreateProductResult =
  | { ok: true; productId: string; slug: string }
  | { ok: false; error: string };

/**
 * Insert a placeholder product into a category. Default values are intentionally
 * conservative — `available: false` so it doesn't appear on the public menu
 * until the admin fills it in. Slug derives from the name + a random suffix
 * so two "Nuevo producto" inserts don't collide.
 */
export async function createProductAction(input: {
  categoryId: string;
  name?: string;
}): Promise<CreateProductResult> {
  const parsed = createProductSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'invalid_input' };
  }

  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { ok: false, error: 'not_admin' };

  const slugBase = parsed.data.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'nuevo';
  const slug = `${slugBase}-${Math.random().toString(36).slice(2, 6)}`;

  // Place new products at the end of the category by default.
  const { data: maxRow } = await supabase
    .from('products')
    .select('sort_order')
    .eq('category_id', parsed.data.categoryId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single();
  const sortOrder = (maxRow?.sort_order ?? 0) + 1;

  const { data, error } = await supabase
    .from('products')
    .insert({
      category_id: parsed.data.categoryId,
      slug,
      name: parsed.data.name,
      base_price_cents: 0,
      available: false,
      sort_order: sortOrder,
    })
    .select('id, slug')
    .single();
  if (error || !data) {
    return { ok: false, error: error?.message ?? 'insert_failed' };
  }

  revalidatePath('/admin/menu');
  revalidatePath('/menu');
  return { ok: true, productId: data.id, slug: data.slug };
}

export async function deleteProductAction(input: {
  productId: string;
}): Promise<AdminResult> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { ok: false, error: 'not_admin' };

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', input.productId);
  if (error) {
    // Most common failure: foreign-key violation from order_items referencing
    // this product. Tell the admin to archive instead.
    if (/foreign key|reference/i.test(error.message)) {
      return {
        ok: false,
        error:
          'No se puede eliminar — tiene pedidos asociados. Archívalo en su lugar.',
      };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath('/admin/menu');
  revalidatePath('/menu');
  return { ok: true };
}

export async function setRepartidorRoleAction(input: {
  profileId: string;
  enabled: boolean;
}): Promise<AdminResult> {
  const parsed = z
    .object({ profileId: z.string().uuid(), enabled: z.boolean() })
    .safeParse(input);
  if (!parsed.success) return { ok: false, error: 'invalid_input' };

  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { ok: false, error: 'not_admin' };

  const { error } = await supabase
    .from('profiles')
    .update({ is_repartidor: parsed.data.enabled })
    .eq('id', parsed.data.profileId);
  if (error) return { ok: false, error: error.message };

  revalidatePath('/admin/repartidores');
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
