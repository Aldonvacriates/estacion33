'use client';

import { useEffect, useState, useTransition } from 'react';
import {
  subscribeCustomerPushAction,
  unsubscribeCustomerPushAction,
} from './actions';

// Customer-facing toggle for Web Push. Logged-in customers opt in here so
// they get a system notification when their order moves through statuses
// (paid → preparing → ready → out_for_delivery → delivered).
//
// Mirrors the repartidor NotificationsToggle:
//  - Asks Notification permission directly inside the click handler so the
//    user-gesture isn't lost across awaits.
//  - Subscribes via reg.pushManager.subscribe() with our VAPID public key.
//  - Posts the resulting endpoint+keys to the server action; rolls back the
//    SW subscription if the server insert fails.
//
// Renders five states: loading / unsupported / denied / inactive / active.

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
      const result = await subscribeCustomerPushAction({
        endpoint: json.endpoint,
        p256dh: json.keys!.p256dh!,
        auth: json.keys!.auth!,
        userAgent: navigator.userAgent,
      });
      if (!result.ok) {
        setError(result.error);
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
      const result = await unsubscribeCustomerPushAction({ endpoint });
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
        Las notificaciones no funcionan en este navegador. Instala la app
        desde <strong>Compartir → Agregar a Inicio</strong> (iPhone) o usa
        Chrome para recibirlas.
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
          {active ? 'Avisos activados' : 'Avísame de mi pedido'}
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
            ? 'Te avisamos en este dispositivo cuando tu pedido cambie de estado: confirmado, en preparación, en camino y entregado.'
            : 'Recibe un aviso cuando tu pedido cambie de estado, sin tener que abrir la app.'}
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

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const buffer = new ArrayBuffer(raw.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}
