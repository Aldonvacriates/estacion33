import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';
import { SignInForm } from './SignInForm';

// Skip the form entirely if the user already has a valid session — drop
// them straight on /cuenta. Avoids "why is the magic link form showing if
// I'm already logged in?" confusion.
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Allow ?next=/some-path to override the default destination, but only
    // when it's a same-origin path (no full URLs / open-redirect).
    const safeNext =
      next && next.startsWith('/') && !next.startsWith('//') ? next : '/cuenta';
    redirect(safeNext);
  }

  return <SignInForm />;
}
