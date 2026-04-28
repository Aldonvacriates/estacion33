import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatMxn, i18n } from '@estacion33/core';
import { getServerSupabase } from '@/lib/supabase/server';
import {
  buildWaLink,
  customerToRestaurantOrderMessage,
  restaurantWhatsApp,
} from '@/lib/whatsapp';
import { OrderLive } from './OrderLive';

export const dynamic = 'force-dynamic'; // never cache an order page

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  pending: 'Pendiente de pago',
  paid: 'Pagado',
  failed: 'Falló el pago',
  refunded: 'Reembolsado',
};

type SearchParams = { status?: string };

type OrderItemRow = {
  id: string;
  qty: number;
  unit_price_cents: number;
  selected_options: { optionId: string; valueIds: string[] }[];
  product: { name: string; slug: string } | null;
};

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

  const [{ data: order, error }, { data: items }] = await Promise.all([
    supabase
      .from('orders')
      .select(
        'id, status, fulfillment, scheduled_for, subtotal_cents, delivery_fee_cents, total_cents, payment_status, notes, created_at',
      )
      .eq('id', id)
      .single(),
    supabase
      .from('order_items')
      .select(
        'id, qty, unit_price_cents, selected_options, product:products(name, slug)',
      )
      .eq('order_id', id)
      .returns<OrderItemRow[]>(),
  ]);

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
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(36px, 6vw, 52px)',
            fontWeight: 400,
            color: 'var(--color-brand-ink)',
            lineHeight: 1,
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

      <section>
        <h2 style={sectionHeading}>Estado del pedido</h2>
        <OrderLive
          orderId={order.id}
          initial={{
            id: order.id,
            status: order.status,
            fulfillment: order.fulfillment,
            payment_status: order.payment_status,
          }}
          paymentStatusFromUrl={mpStatus}
        />
      </section>

      <section style={detailCard}>
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
        {order.notes ? <Row label="Notas" value={order.notes} /> : null}
      </section>

      {items && items.length > 0 ? (
        <section>
          <h2 style={sectionHeading}>Tu pedido</h2>
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
            {items.map((item) => (
              <li
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3)',
                  background: 'var(--color-neutral-0)',
                  border: '1px solid var(--color-neutral-200)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600 }}>
                    {item.qty}× {item.product?.name ?? 'Producto'}
                  </div>
                  {item.selected_options.length > 0 ? (
                    <div
                      style={{
                        fontSize: 13,
                        color: 'var(--color-neutral-500)',
                        marginTop: 2,
                      }}
                    >
                      {item.selected_options.length} opción{item.selected_options.length === 1 ? '' : 'es'} seleccionada{item.selected_options.length === 1 ? '' : 's'}
                    </div>
                  ) : null}
                </div>
                <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {formatMxn(item.unit_price_cents * item.qty)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section style={detailCard}>
        <Row label={t.cart.subtotal} value={formatMxn(order.subtotal_cents)} />
        <Row label={t.cart.deliveryFee} value={formatMxn(order.delivery_fee_cents)} />
        <hr
          style={{
            border: 'none',
            borderTop: '1px solid var(--color-neutral-200)',
            margin: '4px 0',
          }}
        />
        <Row label={t.cart.total} value={formatMxn(order.total_cents)} bold />
      </section>

      <WhatsAppConfirmButton
        order={{
          id: order.id,
          total_cents: order.total_cents,
          fulfillment: order.fulfillment,
          scheduled_for: order.scheduled_for,
        }}
      />

      <Link href="/menu" style={{ alignSelf: 'center' }}>
        <span
          style={{
            color: 'var(--color-brand-primaryDark)',
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

function WhatsAppConfirmButton({
  order,
}: {
  order: {
    id: string;
    total_cents: number;
    fulfillment: 'delivery' | 'pickup';
    scheduled_for: string;
  };
}) {
  const number = restaurantWhatsApp();
  if (!number) return null; // env var missing — silently hide
  const href = buildWaLink(number, customerToRestaurantOrderMessage(order));
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        alignSelf: 'center',
        background: 'var(--color-brand-whatsapp)',
        color: '#FFFFFF',
        padding: '12px 24px',
        borderRadius: '999px',
        fontWeight: 700,
        fontSize: 15,
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.08))',
      }}
    >
      <span aria-hidden style={{ fontSize: 18, lineHeight: 1 }}>💬</span>
      Confirmar por WhatsApp
    </a>
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

const sectionHeading: React.CSSProperties = {
  margin: '0 0 var(--space-3) 0',
  fontSize: 16,
  fontWeight: 600,
  color: 'var(--color-neutral-900)',
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
