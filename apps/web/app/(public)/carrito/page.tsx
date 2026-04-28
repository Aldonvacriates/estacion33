'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@estacion33/ui/web';
import { formatMxn, i18n } from '@estacion33/core';
import { selectCartSubtotalCents, useCart } from '@/lib/cart';

export default function CartPage() {
  const t = i18n.es;
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const subtotalCents = useCart(selectCartSubtotalCents);
  const searchParams = useSearchParams();
  const skipped = searchParams.get('skipped');

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
        <span
          style={{
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(32px, 6vw, 48px)',
            color: 'var(--color-brand-chili)',
            lineHeight: 1,
          }}
        >
          Tu carrito
        </span>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(20px, 3vw, 26px)',
            fontWeight: 400,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--color-brand-ink)',
          }}
        >
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
      {skipped ? (
        <div
          style={{
            background: 'var(--color-semantic-warningBg)',
            color: 'var(--color-semantic-warningFg)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            fontSize: 13,
          }}
        >
          Algunos productos del pedido anterior ya no están disponibles y no se
          agregaron: {skipped}
        </div>
      ) : null}
      <Link
        href="/menu"
        style={{
          color: 'var(--color-brand-ink)',
          fontFamily: 'var(--font-heading)',
          fontSize: 13,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          textDecoration: 'none',
        }}
      >
        ← Seguir agregando
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
          Tu carrito
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
          {lines.length} {lines.length === 1 ? 'artículo' : 'artículos'}
        </h1>
      </div>

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

      {/* Sticky checkout CTA — black bar with yellow pill */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          padding: 'var(--space-3) var(--space-5)',
          background: 'var(--color-brand-ink)',
          borderTop: '2px solid var(--color-brand-primary)',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.3)',
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
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: 11,
                color: 'var(--color-neutral-400)',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Subtotal
            </span>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 400,
                fontSize: 22,
                letterSpacing: '0.02em',
                color: 'var(--color-brand-primary)',
                lineHeight: 1.1,
              }}
            >
              {formatMxn(subtotalCents)}
            </span>
          </div>
          <Link
            href="/checkout"
            style={{
              marginLeft: 'auto',
              background: 'var(--color-brand-primary)',
              color: 'var(--color-brand-ink)',
              padding: '14px 24px',
              borderRadius: 'var(--radius-pill)',
              fontFamily: 'var(--font-heading)',
              fontSize: 15,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontWeight: 400,
            }}
          >
            Continuar al pago
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
