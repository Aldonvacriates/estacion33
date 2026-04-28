'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@estacion33/ui/web';
import { formatMxn, i18n } from '@estacion33/core';
import { selectCartSubtotalCents, useCart } from '@/lib/cart';

export default function CartPage() {
  const t = i18n.es;
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const subtotalCents = useCart(selectCartSubtotalCents);

  // Avoid hydration mismatch — Zustand persisted state only exists in the browser.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated) {
    return (
      <main style={{ padding: 'var(--space-7)', textAlign: 'center', color: 'var(--color-neutral-500)' }}>
        Cargando carrito…
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main
        style={{
          maxWidth: 'var(--size-containerSm)',
          margin: '0 auto',
          padding: 'var(--space-7) var(--space-5)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--color-brand-primaryDark)' }}>
          {t.cart.empty}
        </h1>
        <p style={{ color: 'var(--color-neutral-500)', margin: 0 }}>
          Agrega algo del menú para empezar tu pedido.
        </p>
        <Link href="/menu" style={{ marginTop: 'var(--space-3)' }}>
          <Button variant="primary" size="lg">
            Ver menú
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: 'var(--size-containerMd)',
        margin: '0 auto',
        padding: 'var(--space-5)',
        paddingBottom: 96,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
      }}
    >
      <Link
        href="/menu"
        style={{
          color: 'var(--color-brand-primaryDark)',
          fontSize: 14,
          fontWeight: 500,
          textDecoration: 'none',
        }}
      >
        ← Seguir agregando
      </Link>
      <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: 'var(--color-brand-primaryDark)' }}>
        Tu carrito
      </h1>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {lines.map((line) => (
          <li
            key={line.key}
            style={{
              background: 'var(--color-neutral-0)',
              border: '1px solid var(--color-neutral-200)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
              <Link
                href={`/menu/${line.productSlug}`}
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  color: 'var(--color-neutral-900)',
                  textDecoration: 'none',
                }}
              >
                {line.productName}
              </Link>
              <span style={{ fontWeight: 700, color: 'var(--color-brand-primaryDark)' }}>
                {formatMxn(line.unitPriceCents * line.qty)}
              </span>
            </div>

            {line.optionsSummary ? (
              <p style={{ margin: 0, fontSize: 14, color: 'var(--color-neutral-500)' }}>
                {line.optionsSummary}
              </p>
            ) : null}

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Stepper value={line.qty} onChange={(n) => setQty(line.key, n)} />
              <button
                type="button"
                onClick={() => remove(line.key)}
                style={{
                  marginLeft: 'auto',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-semantic-danger)',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div
        style={{
          padding: 'var(--space-4)',
          background: 'var(--color-neutral-50)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
        }}
      >
        <Row label={t.cart.subtotal} value={formatMxn(subtotalCents)} />
        <Row
          label={t.cart.deliveryFee}
          value={<span style={{ color: 'var(--color-neutral-500)' }}>Calculado en el siguiente paso</span>}
        />
      </div>

      {/* Sticky checkout CTA */}
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
            maxWidth: 'var(--size-containerMd)',
            margin: '0 auto',
            display: 'flex',
            gap: 'var(--space-3)',
            alignItems: 'center',
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 18 }}>{formatMxn(subtotalCents)}</span>
          <Link href="/checkout" style={{ marginLeft: 'auto', flex: 1 }}>
            <Button variant="primary" size="lg" fullWidth>
              Continuar al pago
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14 }}>
      <span style={{ color: 'var(--color-neutral-700)' }}>{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function Stepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const btn: React.CSSProperties = {
    width: 32,
    height: 32,
    borderRadius: 'var(--radius-pill)',
    border: '1px solid var(--color-neutral-300)',
    background: 'var(--color-neutral-0)',
    cursor: 'pointer',
    fontSize: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <button type="button" aria-label="Disminuir" style={btn} onClick={() => onChange(value - 1)}>
        −
      </button>
      <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 600 }}>{value}</span>
      <button type="button" aria-label="Aumentar" style={btn} onClick={() => onChange(value + 1)}>
        +
      </button>
    </div>
  );
}
