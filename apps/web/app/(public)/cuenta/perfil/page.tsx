import { getServerSupabase } from '@/lib/supabase/server';
import { ProfileForm } from '../ProfileForm';

// Profile editor moved here so /cuenta is free to be the dashboard. The
// auth gate in (cuenta)/layout.tsx covers this route too.
export default async function PerfilPage() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
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
