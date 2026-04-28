import Link from 'next/link';
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

export default async function OrdenesPage() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: orders } = await supabase
    .from('orders')
    .select('id, status, fulfillment, scheduled_for, total_cents, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (!orders || orders.length === 0) {
    return (
      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'var(--color-brand-primaryDark)' }}>
          Mis pedidos
        </h1>
        <p style={{ color: 'var(--color-neutral-500)' }}>
          Aún no tienes pedidos. <Link href="/menu" style={{ color: 'var(--color-brand-primary)' }}>Ver el menú</Link>.
        </p>
      </section>
    );
  }

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'var(--color-brand-primaryDark)' }}>
        Mis pedidos
      </h1>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
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
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>
                  Folio <code>{o.id.slice(0, 8)}</code>
                </span>
                <span style={{ fontSize: 13, color: 'var(--color-neutral-500)' }}>
                  {new Date(o.created_at).toLocaleString('es-MX', {
                    day: 'numeric',
                    month: 'short',
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
    </section>
  );
}
