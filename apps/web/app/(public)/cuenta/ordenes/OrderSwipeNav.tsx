'use client';

import { useEffect } from 'react';

// Page-level horizontal swipe handler for the orders history. On a clear
// horizontal gesture (not started inside a horizontally-scrollable
// element) we smooth-scroll to the next/previous order card. Vertical
// scroll keeps working untouched.

const SWIPE_MIN_DELTA = 60;
const SWIPE_AXIS_RATIO = 1.5;

export function OrderSwipeNav({ ids }: { ids: string[] }) {
  useEffect(() => {
    if (ids.length < 2) return;

    let startX = 0;
    let startY = 0;
    let active = false;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
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

      const idx = currentIndex(ids);
      if (idx < 0) return;
      const next = dx < 0 ? Math.min(ids.length - 1, idx + 1) : Math.max(0, idx - 1);
      if (next === idx) return;
      const el = document.getElementById(`order-card-${ids[next]!}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchend', onTouchEnd);
    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [ids]);

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

function currentIndex(ids: string[]): number {
  const anchor = window.innerHeight * 0.5;
  let bestIdx = 0;
  let bestDistance = Infinity;
  for (let i = 0; i < ids.length; i++) {
    const el = document.getElementById(`order-card-${ids[i]!}`);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const distance = Math.abs(center - anchor);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIdx = i;
    }
  }
  return bestIdx;
}
