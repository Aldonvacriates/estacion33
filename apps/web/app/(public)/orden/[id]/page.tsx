import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatMxn, i18n } from '@estacion33/core';
import { getServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic'; // never cache an order page

const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: 'Recibido',
  paid: 'Confirmado',
  preparing: 'En preparación',
  ready: 'Listo',
  out_for_delivery: 'En camino',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  pending: 'Pendiente de pago',
  paid: 'Pagado',
  failed: 'Falló el pago',
  refunded: 'Reembolsado',
};

type SearchParams = { status?: string };

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const { status: mpStatus } = await searchParams;
  const t = i18n.es;
  const supabase = await getServerSupabase();

  const { data: order, error } = await supabase
    .from('orders')
    .select(
      'id, status, fulfillment, scheduled_for, subtotal_cents, delivery_fee_cents, total_cents, payment_status, notes, created_at',
    )
    .eq('id', id)
    .single();

  if (error || !order) notFound();

  return (
    <main
      style={{
        maxWidth: 'var(--size-containerSm)',
        margin: '0 auto',
        padding: 'var(--space-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
      }}
    >
      <header
        style={{
          background:
            order.status === 'cancelled'
              ? 'var(--color-semantic-dangerBg)'
              : 'var(--color-brand-primary50)',
          padding: 'var(--space-5)',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--color-brand-primaryDark)',
          }}
        >
          ¡Pedido recibido!
        </h1>
        <p style={{ margin: 0, color: 'var(--color-neutral-700)' }}>
          Folio: <code style={{ fontWeight: 600 }}>{order.id.slice(0, 8)}</code>
        </p>
      </header>

      {mpStatus === 'success' ? (
        <Banner kind="success">
          ✓ MercadoPago confirmó tu pago. Te avisaremos cuando esté en preparación.
        </Banner>
      ) : mpStatus === 'failure' ? (
        <Banner kind="danger">
          El pago no se completó. Puedes intentar de nuevo o cambiar a efectivo.
        </Banner>
      ) : mpStatus === 'pending' ? (
        <Banner kind="warning">
          Tu pago está pendiente. Te confirmaremos por correo cuando MercadoPago lo procese.
        </Banner>
      ) : null}

      <section style={detailCard}>
        <Row
          label="Estado"
          value={ORDER_STATUS_LABEL[order.status] ?? order.status}
        />
        <Row
          label="Pago"
          value={PAYMENT_STATUS_LABEL[order.payment_status] ?? order.payment_status}
        />
        <Row
          label="Tipo"
          value={order.fulfillment === 'delivery' ? t.checkout.delivery : t.checkout.pickup}
        />
        <Row
          label="Programado para"
          value={new Date(order.scheduled_for).toLocaleString('es-MX', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        />
        {order.notes ? (
          <Row label="Notas" value={order.notes} />
        ) : null}
      </section>

      <section style={detailCard}>
        <Row label={t.cart.subtotal} value={formatMxn(order.subtotal_cents)} />
        <Row label={t.cart.deliveryFee} value={formatMxn(order.delivery_fee_cents)} />
        <hr style={{ border: 'none', borderTop: '1px solid var(--color-neutral-200)', margin: '4px 0' }} />
        <Row label={t.cart.total} value={formatMxn(order.total_cents)} bold />
      </section>

      <Link href="/menu" style={{ alignSelf: 'center' }}>
        <span
          style={{
            color: 'var(--color-brand-primary)',
            fontWeight: 600,
            textDecoration: 'underline',
          }}
        >
          Volver al menú
        </span>
      </Link>
    </main>
  );
}

const detailCard: React.CSSProperties = {
  background: 'var(--color-neutral-50)',
  padding: 'var(--space-4)',
  borderRadius: 'var(--radius-lg)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-2)',
};

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: React.ReactNode;
  bold?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 'var(--space-3)',
        fontSize: bold ? 16 : 14,
        alignItems: 'flex-start',
      }}
    >
      <span style={{ color: 'var(--color-neutral-700)', flexShrink: 0 }}>{label}</span>
      <span
        style={{
          fontWeight: bold ? 700 : 500,
          color: 'var(--color-neutral-900)',
          textAlign: 'right',
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Banner({
  kind,
  children,
}: {
  kind: 'success' | 'danger' | 'warning';
  children: React.ReactNode;
}) {
  const palette = {
    success: { bg: 'var(--color-semantic-successBg)', fg: 'var(--color-semantic-successFg)' },
    danger: { bg: 'var(--color-semantic-dangerBg)', fg: 'var(--color-semantic-dangerFg)' },
    warning: { bg: 'var(--color-semantic-warningBg)', fg: 'var(--color-semantic-warningFg)' },
  }[kind];
  return (
    <div
      style={{
        background: palette.bg,
        color: palette.fg,
        padding: 'var(--space-3)',
        borderRadius: 'var(--radius-md)',
        fontSize: 14,
      }}
    >
      {children}
    </div>
  );
}
