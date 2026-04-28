'use client';

import { useState, useTransition } from 'react';
import { setAlwaysOnGpsAction } from './actions';

// Small switch in the driver header. When ON the driver's preference is
// stored on profile.always_on_gps. v1 only persists the flag — actual
// "ping while idle" behaviour ships in a follow-up that will read this
// preference inside GpsPinger / a global pinger.
export function AlwaysOnToggle({ initial }: { initial: boolean }) {
  const [enabled, setEnabled] = useState(initial);
  const [isPending, start] = useTransition();

  const flip = () => {
    const next = !enabled;
    setEnabled(next); // optimistic
    start(async () => {
      const result = await setAlwaysOnGpsAction({ enabled: next });
      if (!result.ok) setEnabled(!next); // revert
    });
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label="GPS siempre encendido"
      title={
        enabled
          ? 'GPS siempre encendido — pingeará incluso entre entregas (próximamente)'
          : 'Activar GPS continuo (solo durante entregas por ahora)'
      }
      onClick={flip}
      disabled={isPending}
      style={{
        background: 'transparent',
        border: 'none',
        padding: 0,
        cursor: isPending ? 'wait' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 10,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-neutral-300)',
        }}
      >
        GPS
      </span>
      <span
        aria-hidden
        style={{
          width: 36,
          height: 20,
          borderRadius: 999,
          background: enabled
            ? 'var(--color-brand-primary)'
            : 'var(--color-neutral-700)',
          position: 'relative',
          transition: 'background 150ms ease',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: enabled ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: 'var(--color-neutral-0)',
            transition: 'left 150ms ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.4)',
          }}
        />
      </span>
    </button>
  );
}
