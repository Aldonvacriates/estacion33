'use client';

import { useRef, useState } from 'react';

// Swipe-left-to-delete wrapper, iPhone Mail style. Wraps a list item; on
// horizontal swipe left a red "Eliminar" panel slides in behind it. Past
// the threshold (40% of item width) the item commits to deleting and
// calls onDelete; otherwise it springs back.
//
// Uses pointer events so it works on touch, mouse, and pen. Vertical
// scrolling is preserved because we only intervene when the gesture is
// clearly horizontal (|dx| > |dy| once the user has moved a few pixels).

type Props = {
  onDelete: () => void;
  children: React.ReactNode;
  /** Override the action label. Default "Eliminar". */
  actionLabel?: string;
};

export function SwipeToDelete({ onDelete, children, actionLabel = 'Eliminar' }: Props) {
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const lockedAxisRef = useRef<'h' | 'v' | null>(null);
  const widthRef = useRef(0);
  const itemRef = useRef<HTMLDivElement>(null);

  const COMMIT_RATIO = 0.4;
  const REVEAL_PX = 96; // width of the red action panel revealed when held open

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Skip drag if the user pressed an interactive child (button, link,
    // input). Otherwise the stepper +/− buttons can't be tapped.
    const target = e.target as HTMLElement;
    if (target.closest('button, a, input, [role="button"]')) return;

    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    lockedAxisRef.current = null;
    widthRef.current = itemRef.current?.clientWidth ?? 0;
    setDragging(true);
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const ex = e.clientX - startXRef.current;
    const ey = e.clientY - startYRef.current;

    // Once the user has moved >8px, decide which axis they meant. If
    // vertical, abandon the swipe so the page scrolls normally.
    if (lockedAxisRef.current === null) {
      const total = Math.abs(ex) + Math.abs(ey);
      if (total > 8) {
        lockedAxisRef.current = Math.abs(ex) > Math.abs(ey) ? 'h' : 'v';
        if (lockedAxisRef.current === 'v') {
          setDragging(false);
          return;
        }
      } else {
        return;
      }
    }

    // Only allow leftward drag (negative dx). Rightward we cap at small
    // rubber-band so it feels alive but doesn't fly off.
    const next = ex < 0 ? Math.max(ex, -widthRef.current) : Math.min(ex, 24);
    setDx(next);
  };

  const onPointerUp = () => {
    if (!dragging) {
      // Was reset to false on vertical-axis decision — nothing to do.
      return;
    }
    setDragging(false);
    if (widthRef.current > 0 && dx <= -widthRef.current * COMMIT_RATIO) {
      // Commit: animate fully off-screen then fire delete.
      setDx(-widthRef.current);
      window.setTimeout(() => {
        onDelete();
      }, 180);
    } else {
      setDx(0);
    }
  };

  return (
    <div
      ref={itemRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      {/* Red "Eliminar" panel — revealed only when the foreground slides left. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--color-brand-chili, #D62828)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 var(--space-5)',
          fontFamily: 'var(--font-heading)',
          fontSize: 14,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          // Slight intensity ramp so it reads as committing as you pull more.
          opacity: dx < 0 ? Math.min(1, Math.abs(dx) / REVEAL_PX) : 0,
        }}
      >
        🗑 {actionLabel}
      </div>
      {/* Foreground item — the part the user actually swipes. */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          transform: `translateX(${dx}px)`,
          transition: dragging ? 'none' : 'transform 180ms ease-out',
          touchAction: 'pan-y',
          background: 'var(--color-neutral-0)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
