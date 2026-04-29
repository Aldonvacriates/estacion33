'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@estacion33/ui/web';
import { formatMxn, getUpcomingSlots, i18n } from '@estacion33/core';
import { selectCartSubtotalCents, useCart } from '@/lib/cart';
import { createOrderAction } from './actions';
import { BurgerLoader } from './BurgerLoader';
import { PaymentsRow } from '../PaymentsRow';

// No artificial minimum — the burger overlay stays up via isRedirecting
// until the next page (MercadoPago / order confirmation) actually renders.
// User only sees as much burger as the network needs.

const DELIVERY_FEE_CENTS = 3000;

const slotFormatter = new Intl.DateTimeFormat('es-MX', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export default function CheckoutPage() {
  const t = i18n.es;
  const lines = useCart((s) => s.lines);
  const subtotalCents = useCart(selectCartSubtotalCents);
  const clearCart = useCart((s) => s.clear);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const [fulfillment, setFulfillment] = useState<'delivery' | 'pickup'>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mercadopago'>('cash');
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [addressNotes, setAddressNotes] = useState('');
  const [notes, setNotes] = useState('');
  const [scheduledFor, setScheduledFor] = useState<string>('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // Stays true forever once MP/order navigation kicks off — the browser
  // is still loading the next page, but our React tree shouldn't flip
  // back to the form/empty-cart UI in the meantime.
  const [isRedirecting, setIsRedirecting] = useState(false);

  const slots = useMemo(() => getUpcomingSlots(new Date(), undefined, { maxSlots: 16 }), []);

  // Pick the first slot by default once hydrated.
  useEffect(() => {
    if (!scheduledFor && slots[0]) setScheduledFor(slots[0].toISOString());
  }, [scheduledFor, slots]);

  const deliveryFeeCents = fulfillment === 'delivery' ? DELIVERY_FEE_CENTS : 0;
  const totalCents = subtotalCents + deliveryFeeCents;

  if (!hydrated) {
    return <main style={{ padding: 'var(--space-7)', textAlign: 'center' }}>Cargando…</main>;
  }

  const loaderActive = isPending || isRedirecting;

  // While we're waiting for MP / the order page to load, ALWAYS show the
  // full-screen burger overlay — never the empty-cart fallback or the
  // form. This holds visual continuity through the cross-origin redirect.
  if (loaderActive) {
    return (
      <BurgerLoader
        message={
          paymentMethod === 'mercadopago'
            ? 'Preparando tu pago con MercadoPago…'
            : 'Confirmando tu pedido…'
        }
      />
    );
  }

  if (lines.length === 0) {
    return (
      <main
        style={{
          padding: 'var(--space-7) var(--space-5)',
          textAlign: 'center',
          maxWidth: 480,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0, color: 'var(--color-brand-primaryDark)' }}>
          Tu carrito está vacío
        </h1>
        <Link href="/menu">
          <Button variant="primary" size="lg">Ver menú</Button>
        </Link>
      </main>
    );
  }

  const canSubmit =
    guestName.trim().length >= 2 &&
    phone.trim().length >= 8 &&
    scheduledFor.length > 0 &&
    (fulfillment === 'pickup' || addressLine1.trim().length > 0) &&
    !isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitError(null);

    startTransition(async () => {
      const result = await createOrderAction({
        fulfillment,
        paymentMethod,
        scheduledFor,
        notes: notes.trim() || undefined,
        guestName: guestName.trim(),
        phone: phone.trim(),
        addressLine1: fulfillment === 'delivery' ? addressLine1.trim() : undefined,
        addressLine2: addressLine2.trim() || undefined,
        addressNotes: addressNotes.trim() || undefined,
        items: lines.map((l) => ({
          productId: l.productId,
          qty: l.qty,
          selectedOptions: l.selectedOptions,
        })),
      });

      if (!result.ok) {
        setSubmitError(result.error);
        return;
      }

      if (result.redirectUrl) {
        // External (MercadoPago). Set isRedirecting so the burger stays
        // up while the browser loads MP. We don't clear the cart here —
        // if the user comes back without paying, their cart is intact.
        // /orden/[id]?status=success will clear on confirmed payment
        // (handled in slice 4.5).
        setIsRedirecting(true);
        window.location.href = result.redirectUrl;
        return;
      }
      // Cash path — internal navigation, safe to clear cart now.
      setIsRedirecting(true);
      router.push(`/orden/${result.orderId}`);
      clearCart();
    });
  };

  return (
    <>
    <main
      style={{
        maxWidth: 'var(--size-containerSm)',
        margin: '0 auto',
        padding: 'var(--space-5)',
        paddingBottom: 96,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
      }}
    >
      <Link
        href="/carrito"
        style={{
          color: 'var(--color-brand-primaryDark)',
          fontSize: 14,
          fontWeight: 500,
          textDecoration: 'none',
        }}
      >
        ← Volver al carrito
      </Link>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span
          style={{
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(28px, 5vw, 40px)',
            color: 'var(--color-brand-chili)',
            lineHeight: 1,
          }}
        >
          Casi listo
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
          Finalizar pedido
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}
      >
        <Section title="Tipo de entrega">
          <SegmentedToggle
            options={[
              { value: 'pickup', label: t.checkout.pickup },
              { value: 'delivery', label: t.checkout.delivery },
            ]}
            value={fulfillment}
            onChange={(v) => setFulfillment(v as 'pickup' | 'delivery')}
          />
        </Section>

        <Section title="Tus datos">
          <Field label="Nombre completo" required>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
              minLength={2}
              maxLength={80}
              autoComplete="name"
              style={inputStyle}
            />
          </Field>
          <Field label="Teléfono" required>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              minLength={8}
              maxLength={20}
              autoComplete="tel"
              style={inputStyle}
            />
          </Field>
        </Section>

        {fulfillment === 'delivery' ? (
          <Section title="Dirección de entrega">
            <Field label="Calle y número" required>
              <input
                type="text"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                required
                maxLength={200}
                autoComplete="street-address"
                style={inputStyle}
              />
            </Field>
            <Field label="Colonia / Interior (opcional)">
              <input
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                maxLength={200}
                style={inputStyle}
              />
            </Field>
            <Field label="Referencias (opcional)">
              <input
                type="text"
                value={addressNotes}
                onChange={(e) => setAddressNotes(e.target.value)}
                maxLength={500}
                placeholder="Ej. casa azul, portón negro"
                style={inputStyle}
              />
            </Field>
          </Section>
        ) : null}

        <Section title="Horario">
          <Field label="¿Cuándo lo quieres?" required>
            {slots.length === 0 ? (
              <p style={{ color: 'var(--color-semantic-warningFg)', margin: 0 }}>
                No hay horarios disponibles en los próximos 14 días.
              </p>
            ) : (
              <select
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                required
                style={inputStyle}
              >
                {slots.map((slot) => {
                  const iso = slot.toISOString();
                  return (
                    <option key={iso} value={iso}>
                      {slotFormatter.format(slot)}
                    </option>
                  );
                })}
              </select>
            )}
          </Field>
        </Section>

        <Section title="Notas (opcional)">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Sin cebolla, etc."
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
          />
        </Section>

        <Section title="Método de pago">
          <RadioCard
            name="payment"
            value="cash"
            selected={paymentMethod === 'cash'}
            onChange={() => setPaymentMethod('cash')}
            label={fulfillment === 'pickup' ? 'Pago en sucursal' : 'Efectivo al recibir'}
            description="Sin comisiones."
          />
          <RadioCard
            name="payment"
            value="mercadopago"
            selected={paymentMethod === 'mercadopago'}
            onChange={() => setPaymentMethod('mercadopago')}
            label="MercadoPago"
            description="Tarjeta, OXXO o transferencia."
          />
        </Section>

        <Totals
          subtotalCents={subtotalCents}
          deliveryFeeCents={deliveryFeeCents}
          totalCents={totalCents}
        />

        <PaymentsRow />

        <p
          style={{
            margin: 0,
            textAlign: 'center',
            fontSize: 11,
            color: 'var(--color-neutral-500)',
            lineHeight: 1.5,
          }}
        >
          Al confirmar tu pedido aceptas los{' '}
          <Link
            href="/terminos-y-condiciones"
            style={{ color: 'var(--color-brand-primaryDark, #B8860B)', textDecoration: 'underline' }}
          >
            Términos y Condiciones
          </Link>{' '}
          y el{' '}
          <Link
            href="/aviso-de-privacidad"
            style={{ color: 'var(--color-brand-primaryDark, #B8860B)', textDecoration: 'underline' }}
          >
            Aviso de Privacidad
          </Link>
          .
        </p>

        {submitError ? (
          <div
            style={{
              background: 'var(--color-semantic-dangerBg)',
              color: 'var(--color-semantic-dangerFg)',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              fontSize: 14,
            }}
          >
            Error: {submitError}
          </div>
        ) : null}

        <div
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            padding: 'var(--space-3) var(--space-5)',
            background: 'var(--color-neutral-0)',
            borderTop: '1px solid var(--color-neutral-200)',
            boxShadow: 'var(--shadow-md)',
            zIndex: 10,
          }}
        >
          <div
            style={{
              maxWidth: 'var(--size-containerSm)',
              margin: '0 auto',
              display: 'flex',
              gap: 'var(--space-3)',
              alignItems: 'center',
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 18 }}>{formatMxn(totalCents)}</span>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={!canSubmit}
              style={{ marginLeft: 'auto', flex: 1 }}
            >
              {isPending
                ? 'Procesando…'
                : paymentMethod === 'mercadopago'
                  ? 'Pagar con MercadoPago'
                  : 'Confirmar pedido'}
            </Button>
          </div>
        </div>
      </form>
    </main>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 44,
  padding: '0 12px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-neutral-300)',
  fontSize: 16,
  fontFamily: 'inherit',
  background: 'var(--color-neutral-0)',
  color: 'var(--color-neutral-900)',
  boxSizing: 'border-box',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--color-neutral-900)' }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 14, color: 'var(--color-neutral-700)' }}>
        {label}
        {required ? <span style={{ color: 'var(--color-semantic-danger)' }}> *</span> : null}
      </span>
      {children}
    </label>
  );
}

function SegmentedToggle({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        background: 'var(--color-neutral-100)',
        padding: 4,
        borderRadius: 'var(--radius-pill)',
        gap: 4,
      }}
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: active ? 'var(--color-brand-primary)' : 'transparent',
              color: active ? 'var(--color-neutral-0)' : 'var(--color-neutral-700)',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'background 120ms ease',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function RadioCard({
  name,
  value,
  selected,
  onChange,
  label,
  description,
}: {
  name: string;
  value: string;
  selected: boolean;
  onChange: () => void;
  label: string;
  description: string;
}) {
  return (
    <label
      style={{
        display: 'flex',
        gap: 'var(--space-3)',
        padding: 'var(--space-3)',
        border: `1px solid ${selected ? 'var(--color-brand-primary)' : 'var(--color-neutral-200)'}`,
        background: selected ? 'var(--color-brand-primary50)' : 'transparent',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
      }}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={onChange}
        style={{ accentColor: 'var(--color-brand-primary)' }}
      />
      <div>
        <div style={{ fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 14, color: 'var(--color-neutral-500)' }}>{description}</div>
      </div>
    </label>
  );
}

function Totals({
  subtotalCents,
  deliveryFeeCents,
  totalCents,
}: {
  subtotalCents: number;
  deliveryFeeCents: number;
  totalCents: number;
}) {
  const t = i18n.es;
  return (
    <div
      style={{
        background: 'var(--color-neutral-50)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
      }}
    >
      <Row label={t.cart.subtotal} value={formatMxn(subtotalCents)} />
      <Row
        label={t.cart.deliveryFee}
        value={deliveryFeeCents > 0 ? formatMxn(deliveryFeeCents) : 'Sin costo'}
      />
      <hr style={{ border: 'none', borderTop: '1px solid var(--color-neutral-200)', margin: '4px 0' }} />
      <Row label={t.cart.total} value={formatMxn(totalCents)} bold />
    </div>
  );
}

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
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: bold ? 16 : 14 }}>
      <span style={{ color: bold ? 'var(--color-neutral-900)' : 'var(--color-neutral-700)' }}>
        {label}
      </span>
      <span style={{ fontWeight: bold ? 700 : 500 }}>{value}</span>
    </div>
  );
}
