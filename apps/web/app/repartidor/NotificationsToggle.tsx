'use client';

import { useEffect, useState, useTransition } from 'react';
import {
  subscribePushAction,
  unsubscribePushAction,
} from './actions';

// Driver-facing button that wires up Web Push end-to-end:
// 1) Asks for Notification permission
// 2) Calls pushManager.subscribe() with our VAPID public key
// 3) POSTs the resulting endpoint + keys to subscribePushAction
//
// Renders three states:
// - "no soportado" if the browser can't do Push (older Safari, Firefox iOS)
// - "Activar avisos" when permission is default/granted-but-no-sub
// - "Avisos activos · Desactivar" when subscribed
//
// The browser-native opt-in dialog only fires on a real user gesture, so
// the click handler must NOT be wrapped in setTimeout/await before
// requestPermission(). We do the await *after* permission is granted.

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

type Status =
  | { kind: 'loading' }
  | { kind: 'unsupported' }
  | { kind: 'denied' }
  | { kind: 'inactive' }
  | { kind: 'active'; endpoint: string };

export function NotificationsToggle() {
  const [status, setStatus] = useState<Status>({ kind: 'loading' });
  const [error, setError] = useState<string | null>(null);
  const [isPending, start] = useTransition();

  // Detect support + current subscription state on mount.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus({ kind: 'unsupported' });
      return;
    }
    if (Notification.permission === 'denied') {
      setStatus({ kind: 'denied' });
      return;
    }
    void navigator.serviceWorker.ready.then(async (reg) => {
      const existing = await reg.pushManager.getSubscription();
      if (existing) {
        setStatus({ kind: 'active', endpoint: existing.endpoint });
      } else {
        setStatus({ kind: 'inactive' });
      }
    });
  }, []);

  const subscribe = async () => {
    if (!VAPID_PUBLIC_KEY) {
      setError('VAPID no está configurado.');
      return;
    }
    setError(null);

    // Ask permission directly inside the click handler — moving it after
    // an await would invalidate the user-gesture in some browsers.
    const perm = await Notification.requestPermission();
    if (perm === 'denied') {
      setStatus({ kind: 'denied' });
      return;
    }
    if (perm !== 'granted') return;

    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    const json = sub.toJSON() as {
      endpoint: string;
      keys?: { p256dh?: string; auth?: string };
    };
    if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
      setError('La suscripción no devolvió las llaves esperadas.');
      return;
    }

    start(async () => {
      const result = await subscribePushAction({
        endpoint: json.endpoint,
        p256dh: json.keys!.p256dh!,
        auth: json.keys!.auth!,
        userAgent: navigator.userAgent,
      });
      if (!result.ok) {
        setError(result.error);
        // Roll back the local subscription so we don't have a SW sub the
        // server doesn't know about.
        await sub.unsubscribe().catch(() => {});
        return;
      }
      setStatus({ kind: 'active', endpoint: json.endpoint });
    });
  };

  const unsubscribe = () => {
    if (status.kind !== 'active') return;
    setError(null);
    const endpoint = status.endpoint;
    start(async () => {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) await sub.unsubscribe().catch(() => {});
      const result = await unsubscribePushAction({ endpoint });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setStatus({ kind: 'inactive' });
    });
  };

  if (status.kind === 'loading') return null;
  if (status.kind === 'unsupported') {
    return (
      <Card tone="muted">
        Las notificaciones no funcionan en este navegador. Usa Chrome o
        Safari (iOS 16.4+) para recibir avisos de pedido.
      </Card>
    );
  }
  if (status.kind === 'denied') {
    return (
      <Card tone="warn">
        Las notificaciones están bloqueadas. Actívalas desde los ajustes
        del navegador y vuelve a abrir esta página.
      </Card>
    );
  }

  const active = status.kind === 'active';

  return (
    <div
      style={{
        background: active ? 'var(--color-brand-primary)' : 'var(--color-brand-ink)',
        color: active ? 'var(--color-brand-ink)' : 'var(--color-neutral-0)',
        border: `2px solid ${
          active ? 'var(--color-brand-ink)' : 'var(--color-brand-primary)'
        }`,
        borderRadius: 12,
        padding: 'var(--space-4)',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
      }}
    >
      <span aria-hidden style={{ fontSize: 24, lineHeight: 1 }}>
        {active ? '🔔' : '🔕'}
      </span>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 14,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {active ? 'Avisos activados' : 'Activar avisos de pedido'}
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: active
              ? 'var(--color-brand-ink)'
              : 'var(--color-neutral-200, #E4E4E7)',
            opacity: active ? 0.85 : 1,
          }}
        >
          {active
            ? 'Te avisaremos en este dispositivo cuando llegue un pedido nuevo, aunque tengas la app cerrada.'
            : 'Recibe un aviso de pedido nuevo aunque tengas la app cerrada o el celular en tu bolsillo.'}
        </p>
        {error ? (
          <div
            style={{
              padding: '6px 10px',
              borderRadius: 8,
              background: 'rgba(214, 40, 40, 0.15)',
              border: '1px solid var(--color-brand-chili)',
              color: 'var(--color-brand-chili)',
              fontSize: 12,
            }}
          >
            {error}
          </div>
        ) : null}
        <div>
          <button
            type="button"
            onClick={active ? unsubscribe : subscribe}
            disabled={isPending}
            style={{
              background: active
                ? 'var(--color-brand-ink)'
                : 'var(--color-brand-primary)',
              color: active
                ? 'var(--color-brand-primary)'
                : 'var(--color-brand-ink)',
              border: 'none',
              padding: '10px 18px',
              borderRadius: 999,
              fontFamily: 'var(--font-heading)',
              fontSize: 13,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontWeight: 400,
              cursor: isPending ? 'wait' : 'pointer',
            }}
          >
            {isPending ? 'Procesando…' : active ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({
  tone,
  children,
}: {
  tone: 'muted' | 'warn';
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background:
          tone === 'warn' ? 'var(--color-brand-cream)' : 'var(--color-neutral-50)',
        border: `1px solid ${
          tone === 'warn'
            ? 'var(--color-brand-chili)'
            : 'var(--color-neutral-300)'
        }`,
        color: 'var(--color-brand-ink)',
        padding: 'var(--space-3) var(--space-4)',
        borderRadius: 12,
        fontSize: 13,
      }}
    >
      {children}
    </div>
  );
}

// VAPID public key arrives as URL-safe base64. PushManager.subscribe wants
// it as a BufferSource backed by a regular ArrayBuffer (not Shared) —
// allocate the buffer explicitly so TypeScript's stricter typing in
// recent lib.dom is happy.
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const buffer = new ArrayBuffer(raw.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}
