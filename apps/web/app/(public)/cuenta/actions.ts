'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getServerSupabase } from '@/lib/supabase/server';

const profileSchema = z.object({
  fullName: z.string().min(2).max(80),
  phone: z.string().min(8).max(20).optional().or(z.literal('')),
});

export type UpdateProfileResult = { ok: true } | { ok: false; error: string };

export async function updateProfileAction(input: {
  fullName: string;
  phone: string;
}): Promise<UpdateProfileResult> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'invalid_input' };

  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'not_signed_in' };

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    full_name: parsed.data.fullName,
    phone: parsed.data.phone || null,
    locale: 'es',
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath('/cuenta');
  return { ok: true };
}

export async function signOutAction(): Promise<void> {
  const supabase = await getServerSupabase();
  await supabase.auth.signOut();
  redirect('/');
}

const addressSchema = z.object({
  label: z.string().max(50).optional().or(z.literal('')),
  line1: z.string().min(3).max(200),
  line2: z.string().max(200).optional().or(z.literal('')),
  notes: z.string().max(500).optional().or(z.literal('')),
});

export type AddressResult = { ok: true } | { ok: false; error: string };

export async function addAddressAction(input: {
  label: string;
  line1: string;
  line2: string;
  notes: string;
}): Promise<AddressResult> {
  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'invalid_input' };

  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'not_signed_in' };

  const { error } = await supabase.from('addresses').insert({
    user_id: user.id,
    label: parsed.data.label || null,
    line1: parsed.data.line1,
    line2: parsed.data.line2 || null,
    notes: parsed.data.notes || null,
    city: 'Mexico',
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath('/cuenta/direcciones');
  return { ok: true };
}

export async function deleteAddressAction(input: {
  id: string;
}): Promise<AddressResult> {
  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'not_signed_in' };

  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', input.id)
    .eq('user_id', user.id);

  if (error) return { ok: false, error: error.message };
  revalidatePath('/cuenta/direcciones');
  return { ok: true };
}
