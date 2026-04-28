'use client';

import { useEffect, useRef } from 'react';

type Props = {
  src: string;
  poster?: string;
  /** Loop start in seconds (inclusive). */
  start?: number;
  /** Loop end in seconds (when currentTime crosses this, jump back to start). */
  end?: number;
  ariaLabel?: string;
};

/**
 * Autoplay-muted hero video that loops a specific time range.
 *
 * The native `loop` attribute only restarts from the start, so for a "3s–10s"
 * loop we listen on `timeupdate` and rewind manually. We also seek to `start`
 * once metadata is ready so the very first paint matches the loop window.
 */
export function HeroVideo({
  src,
  poster,
  start = 0,
  end,
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const handleLoaded = () => {
      // Some browsers ignore `currentTime` set before metadata loads.
      if (start > 0) v.currentTime = start;
      // Browsers may block autoplay until the user interacts; the muted
      // + playsInline combination on the element should cover most cases.
      void v.play().catch(() => {
        /* autoplay blocked — fine, will resume on first interaction */
      });
    };

    const handleTimeUpdate = () => {
      if (end !== undefined && v.currentTime >= end) {
        v.currentTime = start;
        void v.play().catch(() => {});
      }
    };

    v.addEventListener('loadedmetadata', handleLoaded);
    v.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      v.removeEventListener('loadedmetadata', handleLoaded);
      v.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [start, end]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      autoPlay
      muted
      // Don't set the `loop` attribute — we manually loop a sub-range.
      playsInline
      preload="metadata"
      aria-label={ariaLabel}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
      }}
    />
  );
}
