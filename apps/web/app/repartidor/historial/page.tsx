import { formatMxn } from '@estacion33/core';
import { getServerSupabase } from '@/lib/supabase/server';

// Last 30 days of completed/cancelled deliveries for this driver. Read-only.

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const STATUS_TONE: Record<string, { bg: string; fg: string }> = {
  delivered: {
    bg: 'var(--color-brand-primary)',
    fg: 'var(--color-brand-ink)',
  },
  cancelled: {
    bg: 'var(--color-brand-chili)',
    fg: 'var(--color-neutral-0)',
  },
};

type HistoryRow = {
  id: string;
  status: string;
  total_cents: number;
  cash_collected: boolean;
  delivery_completed_at: string | null;
  address: { line1: string; line2: string | null; city: string } | null;
};

export default async function RepartidorHistoryPage() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();

  const { data: orders } = await supabase
    .from('orders')
    .select(
      'id, status, total_cents, cash_collected, delivery_completed_at, address:addresses(line1, line2, city)',
    )
    .eq('delivery_driver_id', user.id)
    .in('status', ['delivered', 'cancelled'])
    .gte('delivery_completed_at', since)
    .order('delivery_completed_at', { ascending: false })
    .limit(100)
    .returns<HistoryRow[]>();

  const totalDelivered = (orders ?? []).filter((o) => o.status === 'delivered').length;
  const totalCashCollectedCents = (orders ?? [])
    .filter((o) => o.cash_collected)
    .reduce((s, o) => s + o.total_cents, 0);

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
          Historial
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
          Últimos 30 días
        </h1>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 'var(--space-3)',
        }}
      >
        <Stat label="Entregas" value={String(totalDelivered)} />
        <Stat label="Efectivo cobrado" value={formatMxn(totalCashCollectedCents)} />
      </div>

      {!orders || orders.length === 0 ? (
        <p style={{ fontSize: 14, color: 'var(--color-neutral-700)' }}>
          Aún no tienes entregas registradas.
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
          {orders.map((o) => {
            const tone = STATUS_TONE[o.status] ?? {
              bg: 'var(--color-neutral-300)',
              fg: 'var(--color-neutral-900)',
            };
            return (
              <li
                key={o.id}
                style={{
                  background: 'var(--color-neutral-0)',
                  border: '2px solid var(--color-neutral-300)',
                  borderRadius: 12,
                  padding: 'var(--space-4)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
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
                      fontSize: 14,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'var(--color-brand-ink)',
                    }}
                  >
                    #{o.id.slice(0, 6)}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 16,
                      color: 'var(--color-brand-ink)',
                    }}
                  >
                    {formatMxn(o.total_cents)}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: 'var(--color-neutral-700)',
                  }}
                >
                  {o.address?.line1 ?? '—'}
                  {o.address?.line2 ? `, ${o.address.line2}` : ''}
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    marginTop: 4,
                  }}
                >
                  <span
                    style={{
                      background: tone.bg,
                      color: tone.fg,
                      padding: '2px 10px',
                      borderRadius: 999,
                      fontFamily: 'var(--font-heading)',
                      fontSize: 11,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {STATUS_LABEL[o.status] ?? o.status}
                  </span>
                  {o.cash_collected ? (
                    <span
                      style={{
                        background: 'var(--color-brand-ink)',
                        color: 'var(--color-brand-primary)',
                        padding: '2px 10px',
                        borderRadius: 999,
                        fontFamily: 'var(--font-heading)',
                        fontSize: 11,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Efectivo
                    </span>
                  ) : null}
                  <span
                    style={{
                      fontSize: 11,
                      color: 'var(--color-neutral-500)',
                      marginLeft: 'auto',
                    }}
                  >
                    {o.delivery_completed_at
                      ? new Date(o.delivery_completed_at).toLocaleString('es-MX', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })
                      : ''}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: 'var(--color-neutral-0)',
        border: '2px solid var(--color-brand-ink)',
        borderRadius: 12,
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 11,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--color-neutral-700)',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 22,
          color: 'var(--color-brand-ink)',
        }}
      >
        {value}
      </span>
    </div>
  );
}
