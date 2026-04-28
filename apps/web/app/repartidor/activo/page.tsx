import Link from 'next/link';
import { formatMxn } from '@estacion33/core';
import { getServerSupabase } from '@/lib/supabase/server';

// Activo — orders this driver has claimed and are currently in transit.
// In v1 there's typically just one (the one being delivered now), but the
// model supports multiple pickups in a single trip later.

export const dynamic = 'force-dynamic';

type ActiveRow = {
  id: string;
  total_cents: number;
  payment_status: string;
  delivery_started_at: string | null;
  address: {
    line1: string;
    line2: string | null;
    city: string;
  } | null;
};

export default async function RepartidorActiveDeliveriesPage() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: orders } = await supabase
    .from('orders')
    .select(
      'id, total_cents, payment_status, delivery_started_at, address:addresses(line1, line2, city)',
    )
    .eq('delivery_driver_id', user.id)
    .eq('status', 'out_for_delivery')
    .order('delivery_started_at', { ascending: true })
    .returns<ActiveRow[]>();

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span
          style={{
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(28px, 5vw, 40px)',
            color: 'var(--color-brand-chili)',
            lineHeight: 1,
          }}
        >
          En camino
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
          Pedidos activos
        </h1>
      </header>

      {!orders || orders.length === 0 ? (
        <div
          style={{
            background: 'var(--color-neutral-0)',
            border: '2px dashed var(--color-neutral-400)',
            borderRadius: 12,
            padding: 'var(--space-6)',
            textAlign: 'center',
            color: 'var(--color-neutral-700)',
            fontSize: 14,
          }}
        >
          No tienes pedidos en camino. Toma uno de la{' '}
          <Link
            href="/repartidor"
            style={{
              color: 'var(--color-brand-ink)',
              fontWeight: 600,
              textDecoration: 'underline',
            }}
          >
            cola
          </Link>
          .
        </div>
      ) : (
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
          }}
        >
          {orders.map((o) => (
            <li key={o.id}>
              <Link
                href={`/repartidor/orden/${o.id}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  padding: 'var(--space-4)',
                  background: 'var(--color-brand-primary)',
                  border: '2px solid var(--color-brand-ink)',
                  borderRadius: 12,
                  textDecoration: 'none',
                  color: 'var(--color-brand-ink)',
                  boxShadow: '3px 3px 0 var(--color-brand-ink)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 16,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Pedido #{o.id.slice(0, 6)}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 18,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {formatMxn(o.total_cents)}
                  </span>
                </div>
                <div style={{ fontSize: 14 }}>
                  {o.address?.line1 ?? '—'}
                  {o.address?.line2 ? `, ${o.address.line2}` : ''}
                </div>
                {o.payment_status === 'pending' ? (
                  <span
                    style={{
                      alignSelf: 'flex-start',
                      background: 'var(--color-brand-chili)',
                      color: 'var(--color-neutral-0)',
                      padding: '2px 10px',
                      borderRadius: 999,
                      fontFamily: 'var(--font-heading)',
                      fontSize: 11,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Cobrar al entregar
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
