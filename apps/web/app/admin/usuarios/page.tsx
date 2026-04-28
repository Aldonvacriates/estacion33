import { getServerSupabase } from '@/lib/supabase/server';
import { UsuariosTable } from './UsuariosTable';

// Admin user roster. The data comes from the `admin_list_users()` SQL
// function (security definer, admin-gated) which joins profiles with
// auth.users.email so an admin can see who's behind each row.

export const dynamic = 'force-dynamic';

export type AdminUserRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  is_admin: boolean;
  is_repartidor: boolean;
  created_at: string;
};

export default async function AdminUsuariosPage() {
  const supabase = await getServerSupabase();

  // The function is typed as Database['estacion33']['Functions'] but TS may
  // not have it generated yet — cast minimally.
  const { data, error } = await (supabase.rpc as unknown as (
    fn: string,
  ) => Promise<{ data: AdminUserRow[] | null; error: { message: string } | null }>)(
    'admin_list_users',
  );

  const users = data ?? [];

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
          La gente
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
          Usuarios
        </h1>
        <p
          style={{
            margin: '4px 0 0',
            fontSize: 13,
            color: 'var(--color-neutral-700)',
          }}
        >
          {users.length}{' '}
          {users.length === 1 ? 'persona registrada' : 'personas registradas'}.
          Activa o desactiva los roles de admin y repartidor.
        </p>
      </header>

      {error ? (
        <div
          style={{
            background: 'var(--color-semantic-dangerBg)',
            color: 'var(--color-semantic-dangerFg)',
            border: '1px solid var(--color-brand-chili)',
            padding: 'var(--space-3)',
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          Error: {error.message}
        </div>
      ) : null}

      <UsuariosTable users={users} />
    </div>
  );
}
