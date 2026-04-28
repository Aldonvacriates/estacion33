import { getServerSupabase } from '@/lib/supabase/server';
import { RepartidoresTable } from './RepartidoresTable';

// Admin roster: list every profile, toggle is_repartidor on/off. Phase 1
// is read + flip; phase 3 will add "active deliveries" + last ping time.

export const dynamic = 'force-dynamic';

type ProfileRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  is_repartidor: boolean;
  is_admin: boolean;
};

export default async function AdminRepartidoresPage() {
  const supabase = await getServerSupabase();

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, phone, is_repartidor, is_admin')
    .order('is_repartidor', { ascending: false })
    .order('full_name', { ascending: true })
    .returns<ProfileRow[]>();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span
          style={{
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(28px, 5vw, 40px)',
            color: 'var(--color-brand-chili)',
            lineHeight: 1,
          }}
        >
          El equipo
        </span>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(22px, 3vw, 28px)',
            fontWeight: 400,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--color-brand-ink)',
          }}
        >
          Repartidores
        </h1>
        <p
          style={{
            margin: '4px 0 0',
            fontSize: 13,
            color: 'var(--color-neutral-700)',
          }}
        >
          Activa el rol de repartidor para que el chofer vea la cola en{' '}
          <code>/repartidor</code>.
        </p>
      </header>

      <RepartidoresTable profiles={profiles ?? []} />
    </div>
  );
}
