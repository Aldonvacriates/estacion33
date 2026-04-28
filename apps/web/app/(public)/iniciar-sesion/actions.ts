'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { getServerSupabase } from '@/lib/supabase/server';

const signInSchema = z.object({
  email: z.string().email().max(200),
});

export type SignInResult = { ok: true } | { ok: false; error: string };

export async function sendMagicLinkAction(input: {
  email: string;
}): Promise<SignInResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'invalid_email' };

  const supabase = await getServerSupabase();

  // Build the absolute URL the email link should land on.
  const h = await headers();
  const origin =
    h.get('origin') ??
    `https://${h.get('host') ?? 'localhost:3000'}`;

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/cuenta`,
    },
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function signOutAction(): Promise<void> {
  const supabase = await getServerSupabase();
  await supabase.auth.signOut();
}
