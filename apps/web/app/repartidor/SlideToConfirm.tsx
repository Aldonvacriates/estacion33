'use client';

import { useEffect, useRef, useState } from 'react';

// "Desliza para confirmar" slider — same pattern Rappi/Uber Eats use for
// terminal driver actions. Two reasons to prefer this over a plain
// <button>:
//   1. Avoids accidental taps on an action that's hard to undo
//      (an order can't really be "un-delivered"). Swipe is intentional.
//   2. Drivers often hold the phone one-handed in awkward positions —
//      a wide drag target is easier than a precise tap.
//
// Implementation: pointer events (covers touch + mouse + pen). The thumb
// is dragged inside the track; if it crosses ~88% of the track width on
// release we fire onConfirm, otherwise it springs back. While `pending`
// the slider locks in the "completed" position with a busy label.

type Props = {
  /** Idle-state label, e.g. "Desliza para entregar". */
  label: string;
  /** Label shown while the parent's onConfirm promise is in flight. */
  pendingLabel?: string;
  /** Called when the user swipes to the end. Should perform the action. */
  onConfirm: () => void;
  /** Disable the slider entirely (greyed out, can't drag). */
  disabled?: boolean;
  /** Show the busy state without firing onConfirm again. */
  pending?: boolean;
  /** Background color of the track when idle. Defaults to brand ink. */
  trackBg?: string;
  /** Color of the thumb. Defaults to brand primary. */
  thumbBg?: string;
  /** Color of the label text. Defaults to brand primary. */
  labelColor?: string;
};

export function SlideToConfirm({
  label,
  pendingLabel = 'Procesando…',
  onConfirm,
  disabled = false,
  pending = false,
  trackBg = 'var(--color-brand-ink)',
  thumbBg = 'var(--color-brand-primary)',
  labelColor = 'var(--color-brand-primary)',
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [thumbX, setThumbX] = useState(0); // 0 → trackWidth - thumbWidth
  const [maxX, setMaxX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startXRef = useRef(0);
  const baseXRef = useRef(0);
  const firedRef = useRef(false);

  const THUMB_SIZE = 56;
  const TRACK_HEIGHT = 64;

  // Measure the track once mounted + on resize so we know how far the
  // thumb can travel.
  useEffect(() => {
    const update = () => {
      const w = trackRef.current?.clientWidth ?? 0;
      setMaxX(Math.max(0, w - THUMB_SIZE - 8)); // 4px padding each side
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Snap thumb to the right edge while pending so the slider visually
  // matches the "in-flight" mental model.
  useEffect(() => {
    if (pending) {
      setThumbX(maxX);
    } else if (!dragging && !firedRef.current) {
      setThumbX(0);
    }
    if (!pending) firedRef.current = false;
  }, [pending, maxX, dragging]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || pending) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    startXRef.current = e.clientX;
    baseXRef.current = thumbX;
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const delta = e.clientX - startXRef.current;
    const next = clamp(baseXRef.current + delta, 0, maxX);
    setThumbX(next);
  };

  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    // Crossed the confirm threshold? Lock to the right edge and fire.
    if (thumbX >= maxX * 0.88) {
      firedRef.current = true;
      setThumbX(maxX);
      onConfirm();
    } else {
      setThumbX(0);
    }
  };

  const labelOpacity = 1 - Math.min(1, thumbX / Math.max(1, maxX * 0.7));

  return (
    <div
      ref={trackRef}
      style={{
        position: 'relative',
        width: '100%',
        height: TRACK_HEIGHT,
        background: disabled
          ? 'var(--color-neutral-300)'
          : trackBg,
        borderRadius: 999,
        overflow: 'hidden',
        userSelect: 'none',
        touchAction: 'pan-y', // allow vertical page scroll, capture horizontal
        opacity: disabled ? 0.6 : 1,
      }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Filled portion behind the thumb so it reads as "progress" too. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          width: thumbX + THUMB_SIZE / 2,
          background: thumbBg,
          opacity: 0.18,
          transition: dragging ? 'none' : 'width 180ms ease-out',
        }}
      />
      {/* Idle/pending label, fades as you drag. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: labelColor,
          fontFamily: 'var(--font-heading)',
          fontSize: 15,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 400,
          opacity: pending ? 1 : labelOpacity,
          pointerEvents: 'none',
          paddingLeft: THUMB_SIZE,
          paddingRight: 16,
        }}
      >
        {pending ? pendingLabel : `${label} →`}
      </div>
      {/* Draggable thumb. */}
      <div
        role="button"
        aria-label={label}
        aria-disabled={disabled || pending}
        onPointerDown={onPointerDown}
        style={{
          position: 'absolute',
          top: 4,
          left: 4,
          width: THUMB_SIZE,
          height: THUMB_SIZE - 8,
          background: thumbBg,
          borderRadius: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-brand-ink)',
          fontSize: 22,
          fontWeight: 800,
          cursor: disabled || pending ? 'not-allowed' : 'grab',
          transform: `translateX(${thumbX}px)`,
          transition: dragging ? 'none' : 'transform 180ms cubic-bezier(.2,.8,.2,1)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        }}
      >
        ›
      </div>
    </div>
  );
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}
