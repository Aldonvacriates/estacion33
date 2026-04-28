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
import { DeliveryMap } from './DeliveryMap';

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
        'id, status, fulfillment, scheduled_for, subtotal_cents, delivery_fee_cents, total_cents, payment_status, notes, created_at, delivery_proof_path, delivery_completed_at, address_id',
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

  // Sign the proof photo URL if the order has been delivered with a photo.
  let proofUrl: string | null = null;
  if (order.delivery_proof_path && order.status === 'delivered') {
    const { data: signed } = await supabase.storage
      .from('delivery-proofs')
      .createSignedUrl(order.delivery_proof_path, 3600);
    proofUrl = signed?.signedUrl ?? null;
  }

  // For the live map: pull the latest GPS ping + the destination coords if
  // the address has them. Both are server-rendered as initial state; the
  // map subscribes to realtime for updates.
  type PingRow = { lat: number; lng: number; recorded_at: string };
  let initialPing: PingRow | null = null;
  let destination: { lat: number; lng: number; label: string } | null = null;
  if (order.status === 'out_for_delivery') {
    const { data: pingRow } = await supabase
      .from('delivery_locations')
      .select('lat, lng, recorded_at')
      .eq('order_id', order.id)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .maybeSingle<PingRow>();
    initialPing = pingRow;

    if (order.address_id) {
      const { data: addr } = await supabase
        .from('addresses')
        .select('line1, lat, lng')
        .eq('id', order.address_id)
        .single<{ line1: string; lat: number | null; lng: number | null }>();
      if (addr?.lat != null && addr?.lng != null) {
        destination = { lat: addr.lat, lng: addr.lng, label: addr.line1 };
      }
    }
  }

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

      {order.status === 'out_for_delivery' ? (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 style={sectionHeading}>Tu repartidor en camino</h2>
          <DeliveryMap
            orderId={order.id}
            initialPing={initialPing}
            destination={destination}
          />
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: 'var(--color-neutral-500)',
              textAlign: 'center',
            }}
          >
            La ubicación se actualiza cada ~20 segundos mientras el
            repartidor lleva tu pedido.
          </p>
        </section>
      ) : null}

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

      {proofUrl ? (
        <section
          style={{
            background: 'var(--color-neutral-0)',
            border: '2px solid var(--color-brand-ink)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: 24,
              color: 'var(--color-brand-chili)',
              lineHeight: 1,
            }}
          >
            Tu pedido en la puerta
          </div>
          {order.delivery_completed_at ? (
            <div
              style={{
                fontSize: 12,
                color: 'var(--color-neutral-700)',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Entregado{' '}
              {new Date(order.delivery_completed_at).toLocaleString('es-MX', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </div>
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={proofUrl}
            alt="Foto de tu pedido al ser entregado"
            style={{
              width: '100%',
              borderRadius: 8,
              border: '1px solid var(--color-neutral-300)',
              maxHeight: 480,
              objectFit: 'cover',
            }}
          />
        </section>
      ) : null}

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
