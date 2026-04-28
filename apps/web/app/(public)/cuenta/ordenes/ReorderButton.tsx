'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart, type CartLineSelection } from '@/lib/cart';

export type ReorderItem = {
  productId: string;
  productName: string;
  productSlug: string;
  qty: number;
  unitPriceCents: number;
  selectedOptions: CartLineSelection[];
  available: boolean;
};

export function ReorderButton({
  items,
  variant = 'compact',
}: {
  items: ReorderItem[];
  variant?: 'compact' | 'full';
}) {
  const router = useRouter();
  const addItem = useCart((s) => s.addItem);
  const clear = useCart((s) => s.clear);
  const cartCount = useCart((s) => s.lines.length);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const usable = items.filter((i) => i.available);
  const skipped = items.filter((i) => !i.available);

  const fill = (replace: boolean) => {
    if (replace) clear();
    for (const it of usable) {
      const optionsSummary =
        it.selectedOptions.length > 0
          ? `${it.selectedOptions.length} opción${it.selectedOptions.length === 1 ? '' : 'es'}`
          : '';
      addItem({
        productId: it.productId,
        productName: it.productName,
        productSlug: it.productSlug,
        qty: it.qty,
        unitPriceCents: it.unitPriceCents,
        selectedOptions: it.selectedOptions,
        optionsSummary,
      });
    }
    if (skipped.length > 0) {
      // Surface skipped items via querystring; /carrito can show a banner if it
      // wants. Simpler than wiring a global toast just for this.
      const names = skipped.map((s) => s.productName).join(', ');
      router.push(`/carrito?skipped=${encodeURIComponent(names)}`);
    } else {
      router.push('/carrito');
    }
  };

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (usable.length === 0) return;
    if (cartCount > 0) {
      setConfirmOpen(true);
    } else {
      fill(false);
    }
  };

  if (usable.length === 0) {
    return (
      <span
        style={{
          fontSize: 12,
          color: 'var(--color-neutral-500)',
          fontStyle: 'italic',
        }}
      >
        No disponible
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        style={
          variant === 'full'
            ? fullStyle
            : compactStyle
        }
      >
        Pedir de nuevo
      </button>
      {confirmOpen ? (
        <ConfirmDialog
          onReplace={() => {
            setConfirmOpen(false);
            fill(true);
          }}
          onAdd={() => {
            setConfirmOpen(false);
            fill(false);
          }}
          onCancel={() => setConfirmOpen(false)}
        />
      ) : null}
    </>
  );
}

function ConfirmDialog({
  onReplace,
  onAdd,
  onCancel,
}: {
  onReplace: () => void;
  onAdd: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-neutral-0)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-5)',
          maxWidth: 360,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
        }}
      >
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
          Ya tienes cosas en el carrito
        </h3>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--color-neutral-700)' }}>
          ¿Quieres reemplazar el carrito con este pedido o agregar al actual?
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
          <button
            type="button"
            onClick={onReplace}
            style={primaryBtn}
          >
            Reemplazar
          </button>
          <button
            type="button"
            onClick={onAdd}
            style={secondaryBtn}
          >
            Agregar al carrito
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={ghostBtn}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

const compactStyle: React.CSSProperties = {
  background: 'var(--color-brand-primary)',
  color: 'var(--color-brand-ink)',
  border: 'none',
  padding: '8px 14px',
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const fullStyle: React.CSSProperties = {
  background: 'var(--color-brand-primary)',
  color: 'var(--color-brand-ink)',
  border: 'none',
  padding: '12px 24px',
  borderRadius: 999,
  fontSize: 15,
  fontWeight: 700,
  cursor: 'pointer',
  alignSelf: 'center',
};

const primaryBtn: React.CSSProperties = {
  background: 'var(--color-brand-primary)',
  color: 'var(--color-brand-ink)',
  border: 'none',
  padding: '10px 16px',
  borderRadius: 'var(--radius-md)',
  fontSize: 14,
  fontWeight: 700,
  cursor: 'pointer',
};

const secondaryBtn: React.CSSProperties = {
  background: 'var(--color-neutral-0)',
  color: 'var(--color-brand-primaryDark)',
  border: '1px solid var(--color-brand-primary)',
  padding: '10px 16px',
  borderRadius: 'var(--radius-md)',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
};

const ghostBtn: React.CSSProperties = {
  background: 'transparent',
  color: 'var(--color-neutral-700)',
  border: 'none',
  padding: '6px',
  fontSize: 13,
  cursor: 'pointer',
};
