import Link from 'next/link';
import { formatMxn } from '@estacion33/core';
import { getServerSupabase } from '@/lib/supabase/server';

// Cola — orders ready to deliver, none of them claimed yet. The repartidor
// taps a card → /repartidor/orden/[id] to see full details and claim it.

export const dynamic = 'force-dynamic';

type QueueRow = {
  id: string;
  scheduled_for: string;
  total_cents: number;
  notes: string | null;
  payment_status: string;
  address: {
    line1: string;
    line2: string | null;
    city: string;
  } | null;
};

export default async function RepartidorQueuePage() {
  const supabase = await getServerSupabase();

  const { data: orders } = await supabase
    .from('orders')
    .select(
      'id, scheduled_for, total_cents, notes, payment_status, address:addresses(line1, line2, city)',
    )
    .eq('status', 'ready')
    .eq('fulfillment', 'delivery')
    .is('delivery_driver_id', null)
    .order('scheduled_for', { ascending: true })
    .limit(50)
    .returns<QueueRow[]>();

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
          Por entregar
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
          Cola de pedidos
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--color-neutral-700)' }}>
          Toma el que quieras. Una vez tomado, baja a Activo para entregarlo.
        </p>
      </header>

      {!orders || orders.length === 0 ? (
        <EmptyQueue />
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
                  background: 'var(--color-neutral-0)',
                  border: '2px solid var(--color-brand-ink)',
                  borderRadius: 12,
                  textDecoration: 'none',
                  color: 'inherit',
                  boxShadow: '3px 3px 0 var(--color-brand-primary)',
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
                      color: 'var(--color-brand-ink)',
                    }}
                  >
                    Pedido #{o.id.slice(0, 6)}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 18,
                      color: 'var(--color-brand-ink)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {formatMxn(o.total_cents)}
                  </span>
                </div>
                <div style={{ fontSize: 14, color: 'var(--color-neutral-900)' }}>
                  {o.address?.line1 ?? '—'}
                  {o.address?.line2 ? `, ${o.address.line2}` : ''}
                  {o.address?.city ? `, ${o.address.city}` : ''}
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 12,
                    fontSize: 12,
                    color: 'var(--color-neutral-700)',
                    flexWrap: 'wrap',
                  }}
                >
                  <span>
                    🕐{' '}
                    {new Date(o.scheduled_for).toLocaleString('es-MX', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </span>
                  {o.payment_status === 'pending' ? (
                    <span
                      style={{
                        background: 'var(--color-brand-chili)',
                        color: 'var(--color-neutral-0)',
                        padding: '1px 8px',
                        borderRadius: 999,
                        fontFamily: 'var(--font-heading)',
                        fontSize: 10,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Cobrar efectivo
                    </span>
                  ) : (
                    <span
                      style={{
                        background: 'var(--color-brand-primary)',
                        color: 'var(--color-brand-ink)',
                        padding: '1px 8px',
                        borderRadius: 999,
                        fontFamily: 'var(--font-heading)',
                        fontSize: 10,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Pagado
                    </span>
                  )}
                </div>
                {o.notes ? (
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--color-neutral-700)',
                      fontStyle: 'italic',
                      borderLeft: '3px solid var(--color-brand-primary)',
                      paddingLeft: 8,
                      marginTop: 4,
                    }}
                  >
                    “{o.notes}”
                  </div>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function EmptyQueue() {
  return (
    <div
      style={{
        background: 'var(--color-neutral-0)',
        border: '2px dashed var(--color-neutral-400)',
        borderRadius: 12,
        padding: 'var(--space-6)',
        textAlign: 'center',
        color: 'var(--color-neutral-700)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-script)',
          fontSize: 32,
          color: 'var(--color-brand-chili)',
          marginBottom: 6,
        }}
      >
        Todo limpio
      </div>
      <p style={{ margin: 0, fontSize: 14 }}>
        No hay pedidos esperando reparto. Vuelve a revisar en unos minutos.
      </p>
    </div>
  );
}
