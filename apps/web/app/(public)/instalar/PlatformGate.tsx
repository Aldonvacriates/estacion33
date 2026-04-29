'use client';

import { useEffect, useState } from 'react';

// Hide platform-specific install steps on the wrong platform. On a phone we
// only want the user to see the steps that apply to their actual OS — Android
// users don't care about Safari's share sheet, and iPhone users don't have
// Chrome's "⋮ → Install app" menu. On desktop (or anything we can't classify)
// we show everything so it's still useful to read or share.
//
// SSR-safe: until JS hydrates we render children. That means desktop and
// no-JS users see all sections by default, and the gate only ever HIDES
// content after detection — never adds anything that wasn't already in the
// SSR HTML (good for crawlers and screen readers).

type Platform = 'ios' | 'android' | 'desktop';

export function PlatformGate({
  show,
  children,
}: {
  show: 'ios' | 'android';
  children: React.ReactNode;
}) {
  const [platform, setPlatform] = useState<Platform | null>(null);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    const ua = navigator.userAgent;
    const isIos =
      /iPad|iPhone|iPod/.test(ua) &&
      !(navigator as Navigator & { MSStream?: unknown }).MSStream;
    const isAndroid = /Android/.test(ua);
    setPlatform(isIos ? 'ios' : isAndroid ? 'android' : 'desktop');
  }, []);

  // Pre-hydration: render so SSR markup matches and crawlers see everything.
  if (platform === null) return <>{children}</>;
  // Desktop: show both sections.
  if (platform === 'desktop') return <>{children}</>;
  // Phone: show only the matching one.
  if (platform === show) return <>{children}</>;
  return null;
}
