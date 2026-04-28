'use client';

import { useEffect } from 'react';

// Tries to keep the phone screen awake using the Screen Wake Lock API.
// Supported on Chrome/Edge/Safari mobile (iOS 16.4+); silently no-ops on
// older Firefox + iOS. The lock auto-releases if the user backgrounds
// the tab; we re-acquire it on visibilitychange.
//
// Pass `false` to release the lock without unmounting (e.g. when the
// driver finishes a delivery but stays on the page).
export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    if (typeof navigator === 'undefined') return;
    // Feature-detect; types may not include WakeLock in older TS libs.
    const navAny = navigator as Navigator & {
      wakeLock?: {
        request(type: 'screen'): Promise<WakeLockSentinelLike>;
      };
    };
    if (!navAny.wakeLock) return;

    let sentinel: WakeLockSentinelLike | null = null;
    let cancelled = false;

    const acquire = async () => {
      try {
        const next = await navAny.wakeLock!.request('screen');
        if (cancelled) {
          void next.release().catch(() => {});
          return;
        }
        sentinel = next;
      } catch {
        // Permissions / hardware limitation — silently give up.
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') void acquire();
    };

    void acquire();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibility);
      if (sentinel) {
        void sentinel.release().catch(() => {});
        sentinel = null;
      }
    };
  }, [active]);
}

type WakeLockSentinelLike = {
  release(): Promise<void>;
};
