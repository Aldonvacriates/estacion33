'use client';

import { useEffect, useState } from 'react';

// Captures Chrome/Android's `beforeinstallprompt` event so we can show our
// own "Instalar como app" button instead of relying on the browser's
// built-in (and easily missed) install banner. iOS Safari doesn't fire
// this event — for iOS we render a textual hint with the share-sheet
// instructions.
//
// Side effect: registers the service worker on mount. We register inside
// this component (instead of the layout) so SW registration only happens
// on /repartidor for now — minimizes blast radius while we shake out PWA
// behaviour. Phase 6 can promote it to the root layout.

type BeforeInstallPromptEvent = Event & {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const DISMISSED_KEY = 'estacion33.repartidor.installDismissedAt';

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showIosHint, setShowIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(true); // optimistic — set false after hydration

  // Register service worker once.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;
    void navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .catch(() => {
        // Silently — SW registration failures shouldn't break the page.
      });
  }, []);

  // Read dismissal pref + detect platform after hydration.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const dismissedAt = window.localStorage.getItem(DISMISSED_KEY);
    // Re-show after 7 days even if dismissed.
    if (dismissedAt) {
      const age = Date.now() - Number(dismissedAt);
      setDismissed(age < 7 * 24 * 3600 * 1000);
    } else {
      setDismissed(false);
    }

    // Already installed? matchMedia + standalone heuristics.
    const isStandalone =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      // iOS Safari uses navigator.standalone instead of matchMedia.
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (isStandalone) setInstalled(true);

    // iOS doesn't fire beforeinstallprompt — surface a hint instead.
    const isIos =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(navigator as Navigator & { MSStream?: unknown }).MSStream;
    if (isIos && !isStandalone) setShowIosHint(true);
  }, []);

  // Capture the native prompt on Chrome/Edge/Android.
  useEffect(() => {
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

  if (installed || dismissed) return null;
  if (!deferred && !showIosHint) return null;

  return (
    <div
      role="region"
      aria-label="Instalar como aplicación"
      style={{
        background: 'var(--color-brand-ink)',
        color: 'var(--color-neutral-0)',
        border: '2px solid var(--color-brand-primary)',
        borderRadius: 12,
        padding: 'var(--space-4)',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
      }}
    >
      <span aria-hidden style={{ fontSize: 28, lineHeight: 1 }}>📲</span>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 14,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--color-brand-primary)',
          }}
        >
          Instalar como app
        </div>
        {deferred ? (
          <p style={{ margin: 0, fontSize: 13, color: 'var(--color-neutral-200, #E4E4E7)' }}>
            Agrega Estación 33 a tu pantalla de inicio para que el GPS y los
            avisos de pedido funcionen mejor.
          </p>
        ) : (
          <p style={{ margin: 0, fontSize: 13, color: 'var(--color-neutral-200, #E4E4E7)' }}>
            En tu iPhone: toca el botón de <strong>Compartir</strong> abajo del
            navegador y elige <strong>Agregar a Inicio</strong>.
          </p>
        )}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
          {deferred ? (
            <button
              type="button"
              onClick={handleInstall}
              style={{
                background: 'var(--color-brand-primary)',
                color: 'var(--color-brand-ink)',
                border: 'none',
                padding: '10px 18px',
                borderRadius: 999,
                fontFamily: 'var(--font-heading)',
                fontSize: 13,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontWeight: 400,
                cursor: 'pointer',
              }}
            >
              Instalar
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleDismiss}
            style={{
              background: 'transparent',
              color: 'var(--color-neutral-400)',
              border: '1px solid var(--color-neutral-700)',
              padding: '10px 14px',
              borderRadius: 999,
              fontFamily: 'var(--font-heading)',
              fontSize: 12,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontWeight: 400,
              cursor: 'pointer',
            }}
          >
            Más tarde
          </button>
        </div>
      </div>
    </div>
  );
}
