import { getServerSupabase } from '@/lib/supabase/server';
import { ReservationsAdminTable } from './ReservationsAdminTable';

export const dynamic = 'force-dynamic';

export default async function AdminReservasPage() {
  const supabase = await getServerSupabase();

  const { data: reservations } = await supabase
    .from('reservations')
    .select('id, guest_name, phone, party_size, slot_at, status, notes, created_at')
    .order('slot_at', { ascending: true })
    .limit(200);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <h1 style={{ margin: 0, color: 'var(--color-brand-primaryDark)' }}>Reservas</h1>
        <p style={{ color: 'var(--color-neutral-500)', fontSize: 14, margin: 0 }}>
          Confirma reservas y marca cancelaciones / no-shows.
        </p>
      </header>
      <ReservationsAdminTable rows={reservations ?? []} />
    </div>
  );
}
