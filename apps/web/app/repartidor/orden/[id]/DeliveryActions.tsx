'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  claimOrderForDeliveryAction,
  completeDeliveryAction,
} from '../../actions';

type Props =
  | { mode: 'claim'; orderId: string }
  | { mode: 'complete'; orderId: string; paymentPending: boolean };

export function DeliveryActions(props: Props) {
  const router = useRouter();
  const [isPending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [cashCollected, setCashCollected] = useState(false);

  const claim = () =>
    start(async () => {
      setError(null);
      const result = await claimOrderForDeliveryAction({
        orderId: props.orderId,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });

  const complete = () => {
    if (props.mode !== 'complete') return;
    start(async () => {
      setError(null);
      const result = await completeDeliveryAction({
        orderId: props.orderId,
        cashCollected: props.paymentPending ? cashCollected : false,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
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
      {error ? (
        <div
          style={{
            background: 'var(--color-semantic-dangerBg)',
            color: 'var(--color-semantic-dangerFg)',
            border: '1px solid var(--color-brand-chili)',
            padding: 'var(--space-3)',
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          {error}
        </div>
      ) : null}

      {props.mode === 'claim' ? (
        <button
          type="button"
          onClick={claim}
          disabled={isPending}
          style={ctaPrimary}
        >
          {isPending ? 'Tomando…' : 'Iniciar entrega'}
        </button>
      ) : (
        <>
          {props.paymentPending ? (
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: 12,
                background: 'var(--color-brand-cream)',
                border: '2px dashed var(--color-brand-chili)',
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={cashCollected}
                onChange={(e) => setCashCollected(e.target.checked)}
                style={{
                  width: 22,
                  height: 22,
                  accentColor: 'var(--color-brand-chili)',
                  marginTop: 2,
                }}
              />
              <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 13,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--color-brand-ink)',
                  }}
                >
                  Cobrado en efectivo
                </span>
                <span style={{ fontSize: 12, color: 'var(--color-neutral-700)' }}>
                  Marca esta casilla cuando recibas el pago. El pedido pasa a
                  &ldquo;pagado&rdquo; automáticamente.
                </span>
              </span>
            </label>
          ) : null}

          <button
            type="button"
            onClick={complete}
            disabled={
              isPending || (props.paymentPending && !cashCollected)
            }
            style={
              isPending || (props.paymentPending && !cashCollected)
                ? { ...ctaPrimary, background: 'var(--color-neutral-300)' }
                : ctaPrimary
            }
          >
            {isPending ? 'Marcando…' : 'Marcar entregado'}
          </button>
          {props.paymentPending && !cashCollected ? (
            <p
              style={{
                margin: 0,
                textAlign: 'center',
                fontSize: 12,
                color: 'var(--color-neutral-700)',
              }}
            >
              Confirma el cobro en efectivo antes de cerrar.
            </p>
          ) : null}
        </>
      )}
    </article>
  );
}

const ctaPrimary: React.CSSProperties = {
  background: 'var(--color-brand-primary)',
  color: 'var(--color-brand-ink)',
  border: 'none',
  padding: '16px 24px',
  borderRadius: 999,
  fontFamily: 'var(--font-heading)',
  fontSize: 16,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontWeight: 400,
  cursor: 'pointer',
  width: '100%',
};
