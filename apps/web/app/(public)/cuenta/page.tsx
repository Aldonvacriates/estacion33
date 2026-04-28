import { getServerSupabase } from '@/lib/supabase/server';
import { ProfileForm } from './ProfileForm';

export default async function CuentaPage() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // layout.tsx already redirects if no user, but TS doesn't know that.
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone')
    .eq('id', user.id)
    .single();

  return (
    <ProfileForm
      email={user.email ?? ''}
      initialFullName={profile?.full_name ?? ''}
      initialPhone={profile?.phone ?? ''}
    />
  );
}
