'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  claimOrderForDeliveryAction,
  completeDeliveryAction,
  uploadDeliveryProofAction,
} from '../../actions';
import { SlideToConfirm } from '../../SlideToConfirm';

type Props =
  | { mode: 'claim'; orderId: string }
  | {
      mode: 'complete';
      orderId: string;
      paymentPending: boolean;
      // Path of any already-uploaded proof, if the driver tapped the camera
      // before this render (server passes it in).
      existingProofPath: string | null;
      existingProofUrl: string | null;
    };

export function DeliveryActions(props: Props) {
  const router = useRouter();
  const [isPending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [cashCollected, setCashCollected] = useState(false);
  // Preview URL — either the just-uploaded blob (instant feedback) or the
  // signed URL the server passed from a previous upload.
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    props.mode === 'complete' ? props.existingProofUrl : null,
  );
  const [hasProof, setHasProof] = useState<boolean>(
    props.mode === 'complete' ? !!props.existingProofPath : false,
  );
  const fileRef = useRef<HTMLInputElement>(null);

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

  const handleFile = (file: File) => {
    // Show the local preview immediately while we upload.
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    const fd = new FormData();
    fd.set('orderId', props.orderId);
    fd.set('file', file);
    start(async () => {
      setError(null);
      const result = await uploadDeliveryProofAction(fd);
      if (!result.ok) {
        setError(result.error);
        setPreviewUrl(null);
        return;
      }
      setHasProof(true);
      // Keep the local blob preview — no need to round-trip to a signed URL
      // since the next router.refresh() will fetch one anyway.
      router.refresh();
    });
  };

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
        <SlideToConfirm
          label="Desliza para tomar"
          pendingLabel="Tomando…"
          onConfirm={claim}
          pending={isPending}
        />
      ) : (
        <>
          {/* Photo capture */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-neutral-700)',
              }}
            >
              Foto de entrega
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              capture="environment"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = '';
              }}
              style={{ display: 'none' }}
            />
            {previewUrl ? (
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4 / 3',
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '2px solid var(--color-brand-ink)',
                  background: `center/cover no-repeat url(${previewUrl}), var(--color-neutral-200)`,
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  aspectRatio: '4 / 3',
                  borderRadius: 12,
                  border: '2px dashed var(--color-neutral-400)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 6,
                  color: 'var(--color-neutral-700)',
                  fontSize: 13,
                  background: 'var(--color-brand-cream)',
                }}
              >
                <span aria-hidden style={{ fontSize: 32 }}>📷</span>
                <span style={{ textAlign: 'center', padding: '0 16px' }}>
                  Toma una foto del pedido en la puerta del cliente
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={isPending}
              style={hasProof ? ctaOutline : ctaSecondary}
            >
              {isPending && previewUrl
                ? 'Subiendo…'
                : hasProof
                  ? 'Cambiar foto'
                  : 'Tomar foto'}
            </button>
          </div>

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

          <SlideToConfirm
            label="Desliza para entregar"
            pendingLabel="Marcando…"
            onConfirm={complete}
            pending={isPending}
            disabled={props.paymentPending && !cashCollected}
          />
          {!hasProof ? (
            <p
              style={{
                margin: 0,
                textAlign: 'center',
                fontSize: 11,
                color: 'var(--color-neutral-500)',
              }}
            >
              Recomendado: toma la foto antes de marcar entregado.
            </p>
          ) : null}
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

const ctaSecondary: React.CSSProperties = {
  background: 'var(--color-brand-ink)',
  color: 'var(--color-brand-primary)',
  border: 'none',
  padding: '14px 20px',
  borderRadius: 999,
  fontFamily: 'var(--font-heading)',
  fontSize: 14,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontWeight: 400,
  cursor: 'pointer',
  width: '100%',
};

const ctaOutline: React.CSSProperties = {
  background: 'transparent',
  color: 'var(--color-brand-ink)',
  border: '2px solid var(--color-brand-ink)',
  padding: '12px 20px',
  borderRadius: 999,
  fontFamily: 'var(--font-heading)',
  fontSize: 13,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  fontWeight: 400,
  cursor: 'pointer',
  width: '100%',
};
