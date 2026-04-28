import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatMxn } from '@estacion33/core';
import { getServerSupabase } from '@/lib/supabase/server';
import { buildWaLink } from '@/lib/whatsapp';
import { DeliveryActions } from './DeliveryActions';
import { GpsPinger } from './GpsPinger';

export const dynamic = 'force-dynamic';

type OrderDetail = {
  id: string;
  status: string;
  payment_status: string;
  total_cents: number;
  subtotal_cents: number;
  delivery_fee_cents: number;
  scheduled_for: string;
  notes: string | null;
  delivery_driver_id: string | null;
  cash_collected: boolean;
  delivery_started_at: string | null;
  delivery_proof_path: string | null;
  fulfillment: string;
  user_id: string | null;
  address: { line1: string; line2: string | null; city: string; notes: string | null } | null;
};

type ItemRow = {
  id: string;
  qty: number;
  unit_price_cents: number;
  product: { name: string } | null;
};

type ProfileRow = {
  full_name: string | null;
  phone: string | null;
};

export default async function RepartidorOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: order }, { data: items }] = await Promise.all([
    supabase
      .from('orders')
      .select(
        'id, status, payment_status, total_cents, subtotal_cents, delivery_fee_cents, scheduled_for, notes, delivery_driver_id, cash_collected, delivery_started_at, delivery_proof_path, fulfillment, user_id, address:addresses(line1, line2, city, notes)',
      )
      .eq('id', id)
      .single<OrderDetail>(),
    supabase
      .from('order_items')
      .select('id, qty, unit_price_cents, product:products(name)')
      .eq('order_id', id)
      .returns<ItemRow[]>(),
  ]);

  if (!order) notFound();

  // Sign the existing proof URL (private bucket) so the driver can preview
  // the photo they already uploaded. 1 hour TTL is plenty for this flow.
  let proofUrl: string | null = null;
  if (order.delivery_proof_path) {
    const { data: signed } = await supabase.storage
      .from('delivery-proofs')
      .createSignedUrl(order.delivery_proof_path, 3600);
    proofUrl = signed?.signedUrl ?? null;
  }

  // Fetch the customer's name + phone, if any. Guests won't have a profile.
  let customer: ProfileRow | null = null;
  if (order.user_id) {
    const { data: prof } = await supabase
      .from('profiles')
      .select('full_name, phone')
      .eq('id', order.user_id)
      .single<ProfileRow>();
    customer = prof ?? null;
  }

  const claimedByMe = order.delivery_driver_id === user.id;
  const queueable =
    order.status === 'ready' &&
    order.fulfillment === 'delivery' &&
    !order.delivery_driver_id;
  const inTransit = order.status === 'out_for_delivery' && claimedByMe;
  const completed = order.status === 'delivered';

  const fullAddress = [
    order.address?.line1,
    order.address?.line2,
    order.address?.city,
  ]
    .filter(Boolean)
    .join(', ');

  const mapsUrl = fullAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
    : null;

  const waUrl = customer?.phone
    ? buildWaLink(
        customer.phone,
        `Hola ${customer.full_name?.split(' ')[0] ?? ''}, soy de Estación 33, llevo tu pedido #${order.id.slice(0, 6)}.`,
      )
    : null;

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <Link
        href="/repartidor"
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 12,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-brand-ink)',
          textDecoration: 'none',
        }}
      >
        ← Cola
      </Link>

      <header style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span
          style={{
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(28px, 5vw, 40px)',
            color: 'var(--color-brand-chili)',
            lineHeight: 1,
          }}
        >
          Pedido
        </span>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(24px, 4vw, 32px)',
            fontWeight: 400,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--color-brand-ink)',
          }}
        >
          #{order.id.slice(0, 8)}
        </h1>
      </header>

      {/* Customer + address card */}
      <article
        style={{
          background: 'var(--color-neutral-0)',
          border: '2px solid var(--color-brand-ink)',
          borderRadius: 12,
          padding: 'var(--space-4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-neutral-700)',
              marginBottom: 2,
            }}
          >
            Cliente
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-brand-ink)' }}>
            {customer?.full_name ?? 'Invitado'}
          </div>
        </div>

        <div>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-neutral-700)',
              marginBottom: 2,
            }}
          >
            Dirección
          </div>
          <div style={{ fontSize: 15, color: 'var(--color-brand-ink)' }}>
            {fullAddress || '—'}
          </div>
          {order.address?.notes ? (
            <div style={{ fontSize: 12, color: 'var(--color-neutral-700)', marginTop: 2 }}>
              {order.address.notes}
            </div>
          ) : null}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {mapsUrl ? (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={pillFilled}
            >
              <span aria-hidden>📍</span> Abrir en Maps
            </a>
          ) : null}
          {waUrl ? (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...pillFilled,
                background: 'var(--color-brand-whatsapp)',
                color: '#FFFFFF',
              }}
            >
              <span aria-hidden>💬</span> WhatsApp
            </a>
          ) : null}
          {customer?.phone ? (
            <a href={`tel:${customer.phone}`} style={pillOutline}>
              <span aria-hidden>📞</span> Llamar
            </a>
          ) : null}
        </div>
      </article>

      {/* Items + totals */}
      {items && items.length > 0 ? (
        <article
          style={{
            background: 'var(--color-neutral-0)',
            border: '2px solid var(--color-neutral-300)',
            borderRadius: 12,
            padding: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-neutral-700)',
              marginBottom: 4,
            }}
          >
            Pedido
          </div>
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {items.map((it) => (
              <li
                key={it.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 14,
                  color: 'var(--color-brand-ink)',
                }}
              >
                <span>
                  {it.qty}× {it.product?.name ?? 'Producto'}
                </span>
                <span style={{ fontWeight: 500 }}>
                  {formatMxn(it.unit_price_cents * it.qty)}
                </span>
              </li>
            ))}
          </ul>
          <hr style={{ border: 'none', borderTop: '1px dashed var(--color-neutral-300)', margin: '8px 0 0' }} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-heading)',
              fontSize: 16,
              letterSpacing: '0.04em',
              color: 'var(--color-brand-ink)',
            }}
          >
            <span>Total</span>
            <span>{formatMxn(order.total_cents)}</span>
          </div>
          {order.notes ? (
            <div
              style={{
                fontSize: 12,
                color: 'var(--color-neutral-700)',
                fontStyle: 'italic',
                borderLeft: '3px solid var(--color-brand-primary)',
                paddingLeft: 8,
                marginTop: 6,
              }}
            >
              Nota: {order.notes}
            </div>
          ) : null}
        </article>
      ) : null}

      {/* Action zone — claim, in-transit toggle, complete */}
      {completed ? (
        <article
          style={{
            background: 'var(--color-brand-primary)',
            border: '2px solid var(--color-brand-ink)',
            borderRadius: 12,
            padding: 'var(--space-4)',
            color: 'var(--color-brand-ink)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div
            style={{
              textAlign: 'center',
              fontFamily: 'var(--font-heading)',
              fontSize: 14,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            ✓ Entregado
          </div>
          {proofUrl ? (
            <div
              style={{
                width: '100%',
                aspectRatio: '4 / 3',
                borderRadius: 10,
                border: '2px solid var(--color-brand-ink)',
                background: `center/cover no-repeat url(${proofUrl}), var(--color-neutral-200)`,
              }}
              aria-label="Foto de entrega"
            />
          ) : null}
        </article>
      ) : queueable ? (
        <DeliveryActions mode="claim" orderId={order.id} />
      ) : inTransit ? (
        <>
          <GpsPinger orderId={order.id} />
          <DeliveryActions
            mode="complete"
            orderId={order.id}
            paymentPending={order.payment_status === 'pending'}
            existingProofPath={order.delivery_proof_path}
            existingProofUrl={proofUrl}
          />
        </>
      ) : (
        <article
          style={{
            background: 'var(--color-neutral-0)',
            border: '2px dashed var(--color-neutral-400)',
            borderRadius: 12,
            padding: 'var(--space-4)',
            color: 'var(--color-neutral-700)',
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          Este pedido ya no está disponible para reparto.
        </article>
      )}
    </section>
  );
}

const pillFilled: React.CSSProperties = {
  background: 'var(--color-brand-ink)',
  color: 'var(--color-brand-primary)',
  padding: '8px 14px',
  borderRadius: 999,
  fontFamily: 'var(--font-heading)',
  fontSize: 12,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  fontWeight: 400,
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
};

const pillOutline: React.CSSProperties = {
  background: 'transparent',
  color: 'var(--color-brand-ink)',
  padding: '8px 14px',
  borderRadius: 999,
  fontFamily: 'var(--font-heading)',
  fontSize: 12,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  fontWeight: 400,
  textDecoration: 'none',
  border: '2px solid var(--color-brand-ink)',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
};
