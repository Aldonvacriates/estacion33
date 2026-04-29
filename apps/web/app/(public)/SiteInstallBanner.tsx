'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// Compact, dismissible install nudge that lives in the public layout. Only
// renders when:
//   - The browser actually exposes beforeinstallprompt (Android/Chrome) OR
//     the user is on iOS Safari (where we can't auto-trigger but can still
//     point them at the steps).
//   - The site isn't already running in standalone mode (already installed).
//   - The user hasn't dismissed it in the last 7 days.
//
// Hidden on the install page itself and on the checkout/order routes where
// a sticky bottom CTA already lives — adding a banner there steals
// attention from the actual conversion CTA.

type BeforeInstallPromptEvent = Event & {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const DISMISSED_KEY = 'estacion33.cliente.installDismissedAt';
const COOLDOWN_MS = 7 * 24 * 3600 * 1000;

const HIDE_ON: RegExp[] = [
  /^\/instalar$/,
  /^\/checkout$/,
  /^\/orden\//,
  /^\/repartidor/,
  /^\/admin/,
];

export function SiteInstallBanner() {
  const pathname = usePathname();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [dismissed, setDismissed] = useState(true); // optimistic — hide until hydrated

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const dismissedAt = window.localStorage.getItem(DISMISSED_KEY);
    if (dismissedAt) {
      const age = Date.now() - Number(dismissedAt);
      setDismissed(age < COOLDOWN_MS);
    } else {
      setDismissed(false);
    }

    const isStandalone =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (isStandalone) setInstalled(true);

    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(navigator as Navigator & { MSStream?: unknown }).MSStream;
    if (ios && !isStandalone) setIsIos(true);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === 'dismissed') {
      window.localStorage.setItem(DISMISSED_KEY, String(Date.now()));
      setDismissed(true);
    }
    setDeferred(null);
  };

  const handleDismiss = () => {
    window.localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setDismissed(true);
  };

  if (HIDE_ON.some((re) => re.test(pathname))) return null;
  if (installed || dismissed) return null;
  if (!deferred && !isIos) return null;

  return (
    <div
      role="region"
      aria-label="Instalar Estación 33 como app"
      style={{
        background: 'var(--color-brand-ink)',
        color: 'var(--color-neutral-0)',
        borderBottom: '2px solid var(--color-brand-primary)',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontSize: 13,
      }}
    >
      <span aria-hidden style={{ fontSize: 22, lineHeight: 1 }}>📲</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {deferred ? (
          <>
            <strong style={{ color: 'var(--color-brand-primary)' }}>
              Instala Estación 33
            </strong>{' '}
            en tu pantalla de inicio para pedir más rápido.
          </>
        ) : (
          <>
            <strong style={{ color: 'var(--color-brand-primary)' }}>
              ¿En iPhone?
            </strong>{' '}
            Agrega Estación 33 a tu pantalla de inicio.
          </>
        )}
      </div>
      {deferred ? (
        <button
          type="button"
          onClick={handleInstall}
          style={installBtn}
        >
          Instalar
        </button>
      ) : (
        <Link href="/instalar" style={{ ...installBtn, textDecoration: 'none' }}>
          Cómo
        </Link>
      )}
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Cerrar"
        style={dismissBtn}
      >
        ×
      </button>
    </div>
  );
}

const installBtn: React.CSSProperties = {
  background: 'var(--color-brand-primary)',
  color: 'var(--color-brand-ink)',
  border: 'none',
  padding: '6px 14px',
  borderRadius: 999,
  fontFamily: 'var(--font-heading)',
  fontSize: 12,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  fontWeight: 700,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const dismissBtn: React.CSSProperties = {
  background: 'transparent',
  color: 'var(--color-neutral-400)',
  border: 'none',
  fontSize: 22,
  lineHeight: 1,
  cursor: 'pointer',
  padding: '0 4px',
};
