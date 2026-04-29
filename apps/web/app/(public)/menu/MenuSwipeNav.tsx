'use client';

import { useEffect } from 'react';

// Listens for horizontal swipes anywhere on the menu page and scrolls to
// the next / previous category section. Vertical scrolling and the
// already-scrollable chips bar keep working — we only intervene when the
// gesture is clearly horizontal AND not started on a horizontally
// scrollable element (the chips bar).
//
// Renders nothing — it's just a side-effect mount.

const SWIPE_MIN_DELTA = 60; // px the finger must travel horizontally
const SWIPE_AXIS_RATIO = 1.5; // |dx| must be at least 1.5× |dy| to count

export function MenuSwipeNav({ slugs }: { slugs: string[] }) {
  useEffect(() => {
    if (slugs.length < 2) return;

    let startX = 0;
    let startY = 0;
    let active = false;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      // If the gesture started on something the user might be horizontally
      // scrolling (the chip bar, an embedded carousel later, etc.), let the
      // browser handle it. We detect this by walking up looking for an
      // ancestor with overflow-x: auto/scroll.
      const target = e.target as HTMLElement | null;
      if (target && hasHorizontalScrollAncestor(target)) {
        active = false;
        return;
      }
      startX = e.touches[0]!.clientX;
      startY = e.touches[0]!.clientY;
      active = true;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!active) return;
      active = false;
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) < SWIPE_MIN_DELTA) return;
      if (Math.abs(dx) < Math.abs(dy) * SWIPE_AXIS_RATIO) return;

      const idx = currentVisibleIndex(slugs);
      if (idx < 0) return;
      // Swiping left = next category (content moves right→left).
      const next = dx < 0 ? Math.min(slugs.length - 1, idx + 1) : Math.max(0, idx - 1);
      if (next === idx) return;
      const target = document.getElementById(slugs[next]!);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchend', onTouchEnd);
    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [slugs]);

  return null;
}

function hasHorizontalScrollAncestor(el: HTMLElement): boolean {
  let node: HTMLElement | null = el;
  while (node && node !== document.body) {
    const style = window.getComputedStyle(node);
    const overflowX = style.overflowX;
    if (
      (overflowX === 'auto' || overflowX === 'scroll') &&
      node.scrollWidth > node.clientWidth
    ) {
      return true;
    }
    node = node.parentElement;
  }
  return false;
}

function currentVisibleIndex(slugs: string[]): number {
  // Find the section whose top is closest to (and not past) the viewport's
  // upper-third — that's the "category I'm reading right now".
  const anchor = window.innerHeight * 0.33;
  let bestIdx = 0;
  let bestDistance = Infinity;
  for (let i = 0; i < slugs.length; i++) {
    const el = document.getElementById(slugs[i]!);
    if (!el) continue;
    const top = el.getBoundingClientRect().top;
    const distance = Math.abs(top - anchor);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIdx = i;
    }
  }
  return bestIdx;
}
