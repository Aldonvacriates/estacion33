'use client';

import { useMemo, useState } from 'react';
import { Button } from '@estacion33/ui/web';
import { formatMxn } from '@estacion33/core';
import type { ProductOptionShape } from './page';

type Selection = Record<string, string[]>; // optionId -> array of valueIds

type Props = {
  productId: string;
  basePriceCents: number;
  options: ProductOptionShape[];
  available: boolean;
};

export function ProductOrderForm({ productId, basePriceCents, options, available }: Props) {
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
    // Cart wiring lands in slice 4.3. For now, log so we can see selections work.
    const payload = {
      productId,
      qty,
      unitPriceCents,
      totalCents,
      selectedOptions: Object.entries(selection).map(([optionId, valueIds]) => ({
        optionId,
        valueIds,
      })),
    };
    console.log('add_to_cart_pending', payload);
    alert(`Agregado al carrito (placeholder):\n${JSON.stringify(payload, null, 2)}`);
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
                  fontWeight: 600,
                  fontSize: 16,
                  color: 'var(--color-neutral-900)',
                  display: 'flex',
                  gap: 'var(--space-2)',
                  alignItems: 'baseline',
                }}
              >
                {opt.name}
                {opt.required ? (
                  <span style={{ color: 'var(--color-semantic-danger)', fontSize: 12 }}>
                    Requerido
                  </span>
                ) : (
                  <span style={{ color: 'var(--color-neutral-400)', fontSize: 12 }}>
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
                        padding: 'var(--space-3)',
                        border: `1px solid ${
                          picked ? 'var(--color-brand-primary)' : 'var(--color-neutral-200)'
                        }`,
                        borderRadius: 'var(--radius-md)',
                        background: picked ? 'var(--color-brand-primary50)' : 'transparent',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type={opt.multi ? 'checkbox' : 'radio'}
                        name={opt.id}
                        checked={picked}
                        onChange={() => togglePick(opt.id, v.id, opt.multi)}
                        style={{ accentColor: 'var(--color-brand-primary)' }}
                      />
                      <span style={{ flex: 1 }}>{v.name}</span>
                      {v.price_delta_cents > 0 ? (
                        <span style={{ color: 'var(--color-neutral-500)', fontSize: 14 }}>
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

      {/* Sticky bottom CTA */}
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
          display: 'flex',
          gap: 'var(--space-3)',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        <QtyStepper qty={qty} onChange={setQty} />
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!canSubmit}
          onClick={handleAddToCart}
          title={
            !available
              ? 'Producto no disponible'
              : missingRequired.length > 0
                ? `Falta elegir: ${missingRequired.join(', ')}`
                : undefined
          }
        >
          Agregar — {formatMxn(totalCents)}
        </Button>
      </div>
    </>
  );
}

function QtyStepper({ qty, onChange }: { qty: number; onChange: (n: number) => void }) {
  const btnStyle: React.CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: 'var(--radius-pill)',
    border: '1px solid var(--color-neutral-300)',
    background: 'var(--color-neutral-0)',
    color: 'var(--color-neutral-900)',
    fontSize: 18,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
          fontWeight: 600,
          fontSize: 16,
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
