'use client';

import { useEffect, useState } from 'react';

// Customer-side install prompt. Mirrors the repartidor InstallPrompt but
// with friendlier copy and no GPS-flavored messaging. Also registers the
// service worker on mount — same one as repartidor (/sw.js).

type BeforeInstallPromptEvent = Event & {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export function InstallBanner() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
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
    await deferred.userChoice;
    setDeferred(null);
  };

  if (installed) {
    return (
      <div
        style={{
          background: 'var(--color-semantic-successBg)',
          color: 'var(--color-semantic-successFg)',
          padding: 'var(--space-4)',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        ✓ La app ya está instalada en este dispositivo.
      </div>
    );
  }

  if (deferred) {
    return (
      <div
        style={{
          background: 'var(--color-brand-ink)',
          color: 'var(--color-neutral-0)',
          border: '2px solid var(--color-brand-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-5)',
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <span aria-hidden style={{ fontSize: 28 }}>📲</span>
        <div style={{ flex: '1 1 200px', minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 13,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--color-brand-primary)',
            }}
          >
            Instalar con un toque
          </div>
          <p style={{ margin: '4px 0 0', fontSize: 14 }}>
            Tu navegador detectó que se puede instalar. Dale al botón.
          </p>
        </div>
        <button
          type="button"
          onClick={handleInstall}
          style={{
            background: 'var(--color-brand-primary)',
            color: 'var(--color-brand-ink)',
            border: 'none',
            padding: '12px 22px',
            borderRadius: 999,
            fontFamily: 'var(--font-heading)',
            fontSize: 14,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Instalar
        </button>
      </div>
    );
  }

  if (isIos) {
    return (
      <div
        style={{
          background: 'var(--color-brand-primary50, #FFF7D6)',
          border: '1px solid var(--color-brand-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4)',
          textAlign: 'center',
          fontSize: 14,
          color: 'var(--color-brand-ink)',
        }}
      >
        Estás en iPhone — sigue los pasos de abajo para instalar.
      </div>
    );
  }

  return null;
}
