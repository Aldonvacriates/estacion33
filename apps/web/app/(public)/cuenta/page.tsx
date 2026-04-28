import Link from 'next/link';
import { formatMxn } from '@estacion33/core';
import { getServerSupabase } from '@/lib/supabase/server';
import { quoteOfTheDay } from '@/lib/quotes';

// Dashboard. Shown when the user lands on /cuenta. The actual profile
// editor lives at /cuenta/perfil now.

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

export default async function CuentaDashboardPage() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  const { data: orders } = await supabase
    .from('orders')
    .select('id, status, fulfillment, scheduled_for, total_cents, payment_status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  const totalOrders = orders?.length ?? 0;
  const totalSpentCents = (orders ?? [])
    .filter((o) => o.payment_status === 'paid')
    .reduce((sum, o) => sum + (o.total_cents ?? 0), 0);
  const lastOrder = orders?.[0];

  const firstName =
    profile?.full_name?.split(' ')[0] ??
    user.email?.split('@')[0] ??
    'amig@';

  const quote = quoteOfTheDay();

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Greeting */}
      <header style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span
          style={{
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(32px, 6vw, 48px)',
            color: 'var(--color-brand-chili)',
            lineHeight: 1,
          }}
        >
          Hola de nuevo
        </span>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 400,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--color-brand-ink)',
          }}
        >
          {firstName}
        </h1>
      </header>

      {/* Daily quote — yellow band, brush-script attribution */}
      <article
        aria-label="Cita del día"
        style={{
          background: 'var(--color-brand-primary)',
          color: 'var(--color-brand-ink)',
          padding: 'var(--space-5)',
          borderRadius: 12,
          border: '2px solid var(--color-brand-ink)',
          boxShadow: '4px 4px 0 var(--color-brand-ink)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            opacity: 0.6,
          }}
        >
          Pensamiento del día
        </div>
        <blockquote
          style={{
            margin: 0,
            fontSize: 'clamp(18px, 2.5vw, 24px)',
            lineHeight: 1.4,
            fontStyle: 'italic',
            fontWeight: 500,
          }}
        >
          “{quote.text}”
        </blockquote>
        {quote.author ? (
          <cite
            style={{
              fontFamily: 'var(--font-script)',
              fontStyle: 'normal',
              fontSize: 22,
              color: 'var(--color-brand-chili)',
              alignSelf: 'flex-end',
            }}
          >
            — {quote.author}
          </cite>
        ) : null}
      </article>

      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 'var(--space-3)',
        }}
      >
        <StatCard label="Pedidos" value={String(totalOrders)} />
        <StatCard label="Pagado" value={formatMxn(totalSpentCents)} />
        <StatCard
          label="Último pedido"
          value={
            lastOrder
              ? new Date(lastOrder.created_at).toLocaleDateString('es-MX', {
                  day: 'numeric',
                  month: 'short',
                })
              : '—'
          }
        />
      </div>

      {/* Last order summary */}
      {lastOrder ? (
        <article
          style={{
            background: 'var(--color-neutral-0)',
            border: '2px solid var(--color-brand-ink)',
            borderRadius: 12,
            padding: 'var(--space-5)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 14,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-brand-ink)',
              }}
            >
              Tu último pedido
            </span>
            <span
              style={{
                background:
                  lastOrder.status === 'cancelled'
                    ? 'var(--color-brand-chili)'
                    : 'var(--color-brand-primary)',
                color:
                  lastOrder.status === 'cancelled'
                    ? 'var(--color-neutral-0)'
                    : 'var(--color-brand-ink)',
                padding: '3px 10px',
                borderRadius: 999,
                fontFamily: 'var(--font-heading)',
                fontSize: 11,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              {STATUS_LABEL[lastOrder.status] ?? lastOrder.status}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <span style={{ color: 'var(--color-neutral-700)', fontSize: 14 }}>
              {lastOrder.fulfillment === 'delivery' ? 'A domicilio' : 'Para recoger'}
              {' · '}
              {new Date(lastOrder.scheduled_for).toLocaleString('es-MX', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 22,
                color: 'var(--color-brand-ink)',
                letterSpacing: '0.02em',
              }}
            >
              {formatMxn(lastOrder.total_cents)}
            </span>
          </div>
          <Link
            href={`/orden/${lastOrder.id}`}
            style={{
              alignSelf: 'flex-start',
              background: 'var(--color-brand-ink)',
              color: 'var(--color-brand-primary)',
              padding: '8px 16px',
              borderRadius: 999,
              fontFamily: 'var(--font-heading)',
              fontSize: 12,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontWeight: 400,
              textDecoration: 'none',
            }}
          >
            Ver detalles
          </Link>
        </article>
      ) : (
        <article
          style={{
            background: 'var(--color-neutral-0)',
            border: '2px dashed var(--color-neutral-400)',
            borderRadius: 12,
            padding: 'var(--space-5)',
            textAlign: 'center',
            color: 'var(--color-neutral-700)',
          }}
        >
          <p style={{ margin: 0, fontSize: 15 }}>
            Aún no tienes pedidos. ¿Listo para tu primera hamburguesa?
          </p>
          <Link
            href="/menu"
            style={{
              display: 'inline-block',
              marginTop: 12,
              background: 'var(--color-brand-primary)',
              color: 'var(--color-brand-ink)',
              padding: '10px 20px',
              borderRadius: 999,
              fontFamily: 'var(--font-heading)',
              fontSize: 14,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontWeight: 400,
              textDecoration: 'none',
            }}
          >
            Ver el menú
          </Link>
        </article>
      )}

      {/* Quick links */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 'var(--space-3)',
        }}
      >
        <QuickLink href="/menu" label="Pedir ahora" tone="primary" />
        <QuickLink href="/cuenta/ordenes" label="Mis pedidos" />
        <QuickLink href="/cuenta/direcciones" label="Direcciones" />
        <QuickLink href="/cuenta/perfil" label="Editar perfil" />
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
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
          fontSize: 'clamp(20px, 3vw, 26px)',
          color: 'var(--color-brand-ink)',
          letterSpacing: '0.02em',
        }}
      >
        {value}
      </span>
    </div>
  );
}

function QuickLink({
  href,
  label,
  tone,
}: {
  href: string;
  label: string;
  tone?: 'primary';
}) {
  const isPrimary = tone === 'primary';
  return (
    <Link
      href={href}
      style={{
        background: isPrimary ? 'var(--color-brand-primary)' : 'var(--color-neutral-0)',
        color: 'var(--color-brand-ink)',
        border: '2px solid var(--color-brand-ink)',
        padding: 'var(--space-4) var(--space-3)',
        borderRadius: 12,
        textAlign: 'center',
        fontFamily: 'var(--font-heading)',
        fontSize: 14,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontWeight: 400,
        textDecoration: 'none',
      }}
    >
      {label}
    </Link>
  );
}
