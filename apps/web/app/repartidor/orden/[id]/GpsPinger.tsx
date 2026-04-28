'use client';

import { useEffect, useRef, useState } from 'react';
import { pingLocationAction } from '../../actions';
import { useWakeLock } from '../../useWakeLock';

type Props = {
  orderId: string;
  /** Polling cadence in ms. Lower = fresher map, higher = better battery. */
  intervalMs?: number;
};

type PingState =
  | { kind: 'idle' }
  | { kind: 'asking' }
  | { kind: 'ok'; lat: number; lng: number; accuracy: number; sentAt: number }
  | { kind: 'denied' }
  | { kind: 'error'; message: string };

/**
 * Watches the device location while mounted (i.e. while the order is
 * `out_for_delivery` and the driver tab is foregrounded). Posts at most
 * one ping every `intervalMs` (default 20s) so we don't blow up the
 * delivery_locations table or burn battery.
 *
 * Mobile browsers throttle `watchPosition` aggressively when the tab is
 * backgrounded — that's a phase 4 concern (PWA + service worker). For
 * v1 the driver should keep their phone awake.
 */
export function GpsPinger({ orderId, intervalMs = 20_000 }: Props) {
  const [state, setState] = useState<PingState>({ kind: 'idle' });
  // Skip pings until enough time has passed since the last successful one.
  const lastSentRef = useRef<number>(0);

  // Keep the phone screen awake while we're tracking. Released
  // automatically when this component unmounts (= delivery completes).
  useWakeLock(true);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setState({ kind: 'error', message: 'Tu navegador no soporta GPS.' });
      return;
    }

    setState({ kind: 'asking' });

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now();
        if (now - lastSentRef.current < intervalMs) {
          // Still throttled — update local state for the UI but skip POST.
          setState({
            kind: 'ok',
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            sentAt: lastSentRef.current,
          });
          return;
        }
        lastSentRef.current = now;
        void pingLocationAction({
          orderId,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracyMeters: pos.coords.accuracy,
        });
        setState({
          kind: 'ok',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          sentAt: now,
        });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setState({ kind: 'denied' });
        } else {
          setState({ kind: 'error', message: err.message });
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5_000,
        timeout: 30_000,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [orderId, intervalMs]);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 12px',
        background:
          state.kind === 'ok'
            ? 'var(--color-brand-cream)'
            : state.kind === 'denied' || state.kind === 'error'
              ? 'var(--color-semantic-dangerBg)'
              : 'var(--color-neutral-50)',
        border: `1px solid ${
          state.kind === 'ok'
            ? 'var(--color-brand-primary)'
            : state.kind === 'denied' || state.kind === 'error'
              ? 'var(--color-brand-chili)'
              : 'var(--color-neutral-300)'
        }`,
        borderRadius: 999,
        fontSize: 12,
        color: 'var(--color-brand-ink)',
      }}
    >
      <span
        aria-hidden
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background:
            state.kind === 'ok'
              ? '#16A34A'
              : state.kind === 'denied' || state.kind === 'error'
                ? 'var(--color-brand-chili)'
                : 'var(--color-neutral-400)',
          animation: state.kind === 'ok' ? 'gps-pulse 2s ease-in-out infinite' : undefined,
        }}
      />
      <span style={{ flex: 1 }}>
        {state.kind === 'idle' && 'GPS apagado'}
        {state.kind === 'asking' && 'Pidiendo permiso de ubicación…'}
        {state.kind === 'ok' &&
          `GPS activo · ±${Math.round(state.accuracy)} m · ${formatAge(state.sentAt)}`}
        {state.kind === 'denied' &&
          'Permiso denegado. Activa la ubicación en los ajustes del navegador.'}
        {state.kind === 'error' && `Error de GPS: ${state.message}`}
      </span>
      <style>{`
        @keyframes gps-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>
    </div>
  );
}

function formatAge(ts: number): string {
  if (!ts) return 'recién';
  const secs = Math.round((Date.now() - ts) / 1000);
  if (secs < 5) return 'recién';
  if (secs < 60) return `hace ${secs}s`;
  const mins = Math.round(secs / 60);
  return `hace ${mins} min`;
}
