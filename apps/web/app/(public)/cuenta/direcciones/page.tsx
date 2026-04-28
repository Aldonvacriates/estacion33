import { getServerSupabase } from '@/lib/supabase/server';
import { AddressManager } from './AddressManager';

export const dynamic = 'force-dynamic';

export default async function DireccionesPage() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: addresses } = await supabase
    .from('addresses')
    .select('id, label, line1, line2, notes, is_default, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return <AddressManager initial={addresses ?? []} />;
}
