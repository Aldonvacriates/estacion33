'use client';

import { useEffect, useState } from 'react';
import { getAudioAlertPref, setAudioAlertPref } from './QueueLive';

// Lets the driver opt into a chime when a new ready+delivery order lands
// in the queue. Pref is stored in localStorage (per-device), not on the
// profile, because audio is intrinsically a per-device thing — driver
// might want sound on their phone but not on a tablet they leave in the
// kitchen.
export function AudioAlertToggle() {
  const [enabled, setEnabled] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setEnabled(getAudioAlertPref());
    setHydrated(true);
  }, []);

  const flip = () => {
    const next = !enabled;
    setEnabled(next);
    setAudioAlertPref(next);
  };

  if (!hydrated) return null;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label="Sonido al llegar pedido nuevo"
      title={
        enabled
          ? 'Sonará un chime cuando llegue un pedido nuevo a la cola'
          : 'Activar sonido al llegar pedido nuevo'
      }
      onClick={flip}
      style={{
        background: 'transparent',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <span aria-hidden style={{ fontSize: 14 }}>
        {enabled ? '🔔' : '🔕'}
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
