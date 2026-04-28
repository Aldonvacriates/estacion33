import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatMxn } from '@estacion33/core';
import { getServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  pending: 'Recibido',
  paid: 'Confirmado',
  preparing: 'En preparación',
  ready: 'Listo',
  out_for_delivery: 'En camino',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const STATUS_COLOR: Record<string, string> = {
  pending: 'var(--color-semantic-warning)',
  paid: 'var(--color-brand-primary)',
  preparing: 'var(--color-brand-primary)',
  ready: 'var(--color-brand-primary)',
  out_for_delivery: 'var(--color-brand-primary)',
  delivered: 'var(--color-neutral-500)',
  cancelled: 'var(--color-semantic-danger)',
};

type OrderRow = {
  id: string;
  status: string;
  fulfillment: string;
  scheduled_for: string;
  total_cents: number;
  payment_status: string;
  created_at: string;
  archived_at: string | null;
};

export default async function AdminUserOrdersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await getServerSupabase();

  // Verify the viewer is admin (RLS already protects but a 404 is friendlier
  // than an empty list).
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();
  const { data: me } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();
  if (!me?.is_admin) notFound();

  // Fetch the target profile + their orders. Includes archived (admin view).
  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name, phone')
      .eq('id', id)
      .single<{ id: string; full_name: string | null; phone: string | null }>(),
    supabase
      .from('orders')
      .select(
        'id, status, fulfillment, scheduled_for, total_cents, payment_status, created_at, archived_at',
      )
      .eq('user_id', id)
      .order('created_at', { ascending: false })
      .limit(100)
      .returns<OrderRow[]>(),
  ]);

  if (!profile) notFound();

  const totalSpent = (orders ?? []).reduce((s, o) => s + o.total_cents, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <Link
          href="/admin/usuarios"
          style={{
            color: 'var(--color-neutral-700)',
            fontSize: 13,
            textDecoration: 'none',
          }}
        >
          ← Volver a Usuarios
        </Link>
        <h1 style={{ margin: 0, color: 'var(--color-brand-primaryDark)' }}>
          Pedidos de {profile.full_name ?? '(sin nombre)'}
        </h1>
        <p style={{ margin: 0, color: 'var(--color-neutral-500)', fontSize: 14 }}>
          {(orders ?? []).length} pedido{(orders ?? []).length === 1 ? '' : 's'}{' '}
          · Total histórico: <strong>{formatMxn(totalSpent)}</strong>
          {profile.phone ? ` · ${profile.phone}` : ''}
        </p>
      </header>

      {!orders || orders.length === 0 ? (
        <p style={{ color: 'var(--color-neutral-500)' }}>
          Este cliente todavía no ha hecho ningún pedido.
        </p>
      ) : (
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
          }}
        >
          {orders.map((o) => (
            <li key={o.id}>
              <Link
                href={`/orden/${o.id}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-4)',
                  background: 'var(--color-neutral-0)',
                  border: '1px solid var(--color-neutral-200)',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  color: 'inherit',
                  opacity: o.archived_at ? 0.6 : 1,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>
                      Folio <code>{o.id.slice(0, 8)}</code>
                    </span>
                    {o.archived_at ? (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: 'var(--color-neutral-500)',
                          border: '1px solid var(--color-neutral-300)',
                          padding: '2px 6px',
                          borderRadius: 999,
                        }}
                      >
                        Archivado
                      </span>
                    ) : null}
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--color-neutral-500)' }}>
                    {new Date(o.created_at).toLocaleString('es-MX', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {' · '}
                    {o.fulfillment === 'delivery' ? 'Entrega' : 'Recoger'}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: STATUS_COLOR[o.status] ?? 'var(--color-neutral-700)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {STATUS_LABEL[o.status] ?? o.status}
                  </span>
                </div>
                <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-brand-primaryDark)' }}>
                  {formatMxn(o.total_cents)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
