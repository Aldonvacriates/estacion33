'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatMxn } from '@estacion33/core';
import { useCart } from '@/lib/cart';
import type { ProductOptionShape } from './page';

type Selection = Record<string, string[]>; // optionId -> array of valueIds

type Props = {
  productId: string;
  productName: string;
  productSlug: string;
  basePriceCents: number;
  options: ProductOptionShape[];
  available: boolean;
};

export function ProductOrderForm({
  productId,
  productName,
  productSlug,
  basePriceCents,
  options,
  available,
}: Props) {
  const router = useRouter();
  const addItem = useCart((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [selection, setSelection] = useState<Selection>(() => {
    // For required single-select options, pre-pick the first value so a valid
    // selection is always possible.
    const initial: Selection = {};
    for (const opt of options) {
      if (opt.required && !opt.multi && opt.option_values[0]) {
        initial[opt.id] = [opt.option_values[0].id];
      }
    }
    return initial;
  });

  const unitPriceCents = useMemo(() => {
    let total = basePriceCents;
    for (const opt of options) {
      const picked = selection[opt.id] ?? [];
      for (const valueId of picked) {
        const v = opt.option_values.find((x) => x.id === valueId);
        if (v) total += v.price_delta_cents;
      }
    }
    return total;
  }, [basePriceCents, options, selection]);

  const totalCents = unitPriceCents * qty;

  const missingRequired = options
    .filter((opt) => opt.required && (selection[opt.id]?.length ?? 0) === 0)
    .map((opt) => opt.name);

  const canSubmit = available && missingRequired.length === 0;

  const togglePick = (optId: string, valueId: string, multi: boolean) => {
    setSelection((prev) => {
      const current = prev[optId] ?? [];
      if (multi) {
        return current.includes(valueId)
          ? { ...prev, [optId]: current.filter((v) => v !== valueId) }
          : { ...prev, [optId]: [...current, valueId] };
      }
      return { ...prev, [optId]: [valueId] };
    });
  };

  const handleAddToCart = () => {
    const selectedOptions = Object.entries(selection).map(([optionId, valueIds]) => ({
      optionId,
      valueIds,
    }));

    // Build a human-readable summary like "Tipo de queso: Manchego · Extras: Tocino, Mezcalada"
    const summaryParts: string[] = [];
    for (const opt of options) {
      const picked = selection[opt.id] ?? [];
      if (picked.length === 0) continue;
      const valueNames = picked
        .map((id) => opt.option_values.find((v) => v.id === id)?.name)
        .filter((n): n is string => Boolean(n));
      if (valueNames.length > 0) {
        summaryParts.push(`${opt.name}: ${valueNames.join(', ')}`);
      }
    }

    addItem({
      productId,
      productName,
      productSlug,
      qty,
      unitPriceCents,
      selectedOptions,
      optionsSummary: summaryParts.join(' · '),
    });

    router.push('/carrito');
  };

  return (
    <>
      {options.length > 0 ? (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {options.map((opt) => (
            <fieldset
              key={opt.id}
              style={{
                border: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
              }}
            >
              <legend
                style={{
                  padding: 0,
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 400,
                  fontSize: 16,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--color-brand-ink)',
                  display: 'flex',
                  gap: 'var(--space-2)',
                  alignItems: 'baseline',
                  flexWrap: 'wrap',
                }}
              >
                {opt.name}
                {opt.required ? (
                  <span
                    style={{
                      background: 'var(--color-brand-chili)',
                      color: 'var(--color-neutral-0)',
                      fontSize: 10,
                      fontFamily: 'var(--font-heading)',
                      letterSpacing: '0.08em',
                      padding: '2px 8px',
                      borderRadius: 999,
                    }}
                  >
                    Requerido
                  </span>
                ) : (
                  <span
                    style={{
                      color: 'var(--color-neutral-500)',
                      fontSize: 11,
                      fontFamily: 'var(--font-body, Inter)',
                      letterSpacing: 0,
                      textTransform: 'none',
                    }}
                  >
                    Opcional · {opt.multi ? 'puedes elegir varios' : 'elige uno'}
                  </span>
                )}
              </legend>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {opt.option_values.map((v) => {
                  const picked = (selection[opt.id] ?? []).includes(v.id);
                  return (
                    <label
                      key={v.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        padding: 'var(--space-3) var(--space-4)',
                        border: `2px solid ${
                          picked ? 'var(--color-brand-ink)' : 'var(--color-neutral-300)'
                        }`,
                        borderRadius: 12,
                        background: picked
                          ? 'var(--color-brand-primary)'
                          : 'var(--color-neutral-0)',
                        cursor: 'pointer',
                        fontWeight: picked ? 600 : 400,
                        color: 'var(--color-brand-ink)',
                        transition: 'background 120ms ease, border-color 120ms ease',
                      }}
                    >
                      <input
                        type={opt.multi ? 'checkbox' : 'radio'}
                        name={opt.id}
                        checked={picked}
                        onChange={() => togglePick(opt.id, v.id, opt.multi)}
                        style={{ accentColor: 'var(--color-brand-ink)' }}
                      />
                      <span style={{ flex: 1 }}>{v.name}</span>
                      {v.price_delta_cents > 0 ? (
                        <span
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 14,
                            letterSpacing: '0.04em',
                            color: picked
                              ? 'var(--color-brand-ink)'
                              : 'var(--color-neutral-700)',
                          }}
                        >
                          +{formatMxn(v.price_delta_cents)}
                        </span>
                      ) : null}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </section>
      ) : null}

      {/* Sticky bottom CTA — black bar, yellow pill */}
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
          display: 'flex',
          gap: 'var(--space-3)',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        <QtyStepper qty={qty} onChange={setQty} />
        <button
          type="button"
          disabled={!canSubmit}
          onClick={handleAddToCart}
          title={
            !available
              ? 'Producto no disponible'
              : missingRequired.length > 0
                ? `Falta elegir: ${missingRequired.join(', ')}`
                : undefined
          }
          style={{
            flex: 1,
            background: canSubmit
              ? 'var(--color-brand-primary)'
              : 'var(--color-neutral-700)',
            color: canSubmit
              ? 'var(--color-brand-ink)'
              : 'var(--color-neutral-400)',
            border: 'none',
            padding: '14px 20px',
            borderRadius: 999,
            fontFamily: 'var(--font-heading)',
            fontSize: 15,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontWeight: 400,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            whiteSpace: 'nowrap',
          }}
        >
          Agregar · {formatMxn(totalCents)}
        </button>
      </div>
    </>
  );
}

function QtyStepper({ qty, onChange }: { qty: number; onChange: (n: number) => void }) {
  const btnStyle: React.CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: 999,
    border: '2px solid var(--color-brand-primary)',
    background: 'transparent',
    color: 'var(--color-brand-primary)',
    fontSize: 18,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-heading)',
  };
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
      }}
    >
      <button
        type="button"
        aria-label="Disminuir cantidad"
        style={btnStyle}
        onClick={() => onChange(Math.max(1, qty - 1))}
        disabled={qty <= 1}
      >
        −
      </button>
      <span
        style={{
          minWidth: 24,
          textAlign: 'center',
          fontFamily: 'var(--font-heading)',
          fontWeight: 400,
          fontSize: 18,
          color: 'var(--color-brand-primary)',
          letterSpacing: '0.04em',
        }}
      >
        {qty}
      </span>
      <button
        type="button"
        aria-label="Aumentar cantidad"
        style={btnStyle}
        onClick={() => onChange(Math.min(20, qty + 1))}
        disabled={qty >= 20}
      >
        +
      </button>
    </div>
  );
}
