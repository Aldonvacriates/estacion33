// Magic-link landing point. Supabase appends ?code=... when the user
// clicks the email link; we exchange it for a session and redirect to
// the originally requested page (?next=/cuenta by default).
//
// Also auto-creates a profiles row on first sign-in so downstream code
// can rely on it existing.

import { NextResponse, type NextRequest } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/cuenta';

  if (!code) {
    return NextResponse.redirect(`${origin}/iniciar-sesion?error=missing_code`);
  }

  const supabase = await getServerSupabase();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/iniciar-sesion?error=${encodeURIComponent(error?.message ?? 'session_failed')}`);
  }

  // Idempotently ensure a profile row exists. RLS allows the user to
  // insert their own row (id = auth.uid()).
  await supabase.from('profiles').upsert(
    {
      id: data.user.id,
      full_name: data.user.user_metadata?.full_name ?? null,
      locale: 'es',
    },
    { onConflict: 'id', ignoreDuplicates: true },
  );

  return NextResponse.redirect(`${origin}${next}`);
}
