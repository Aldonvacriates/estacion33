'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { getBrowserSupabase } from '@/lib/supabase/client';
import { etaMinutes, formatEtaEs, haversineMeters } from '@/lib/eta';

// React-Leaflet pieces are SSR-incompatible (they touch `window` on import),
// so we load them client-only via `next/dynamic`. The map itself only
// renders inside a browser.
const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import('react-leaflet').then((m) => m.Marker),
  { ssr: false },
);
const Popup = dynamic(
  () => import('react-leaflet').then((m) => m.Popup),
  { ssr: false },
);

type Ping = {
  lat: number;
  lng: number;
  recorded_at: string;
};

type Props = {
  orderId: string;
  /** Latest ping from the SSR pass, if any. */
  initialPing: Ping | null;
  /** Customer destination, if their address has lat/lng. */
  destination: { lat: number; lng: number; label: string } | null;
};

export function DeliveryMap({ orderId, initialPing, destination }: Props) {
  const [ping, setPing] = useState<Ping | null>(initialPing);
  const [leafletReady, setLeafletReady] = useState(false);
  const [icons, setIcons] = useState<{
    burger: unknown;
    pin: unknown;
  } | null>(null);

  // Load Leaflet's CSS + build inline-SVG icons on the client only.
  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error - CSS import has no type declaration; bundler handles it.
      import('leaflet/dist/leaflet.css'),
      import('leaflet'),
    ]).then(([, L]) => {
      if (cancelled) return;
      const burger = L.divIcon({
        className: '',
        html: `
          <div style="
            width: 44px; height: 44px;
            display: flex; align-items: center; justify-content: center;
            transform: translate(-22px, -44px);
          ">
            <div style="
              position: absolute;
              inset: 0;
              border-radius: 50%;
              background: rgba(244,195,32,0.35);
              animation: gps-marker-pulse 1.6s ease-out infinite;
            "></div>
            <svg width="32" height="32" viewBox="0 0 32 32" style="position: relative; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));">
              <path d="M5 11 Q16 3, 27 11 L27 13 L5 13 Z" fill="#E5A85A" stroke="#0A0A0A" stroke-width="1.2"/>
              <ellipse cx="11" cy="8.5" rx="0.9" ry="0.5" fill="#FFF8E7"/>
              <ellipse cx="16" cy="7" rx="0.9" ry="0.5" fill="#FFF8E7"/>
              <ellipse cx="21" cy="8.5" rx="0.9" ry="0.5" fill="#FFF8E7"/>
              <path d="M4 14 Q7 12.5 10 14 T16 14 T22 14 T28 14 L28 16 L4 16 Z" fill="#7DA640" stroke="#0A0A0A" stroke-width="1"/>
              <rect x="5" y="16" width="22" height="3.5" fill="#5A2E0F" stroke="#0A0A0A" stroke-width="1"/>
              <path d="M5 19 L27 19 L27 20.5 Q23 22 19 20.5 T11 21 T5 20.5 Z" fill="#F4C320" stroke="#0A0A0A" stroke-width="1"/>
              <path d="M5 21 L27 21 Q27 27 16 28 Q5 27 5 21 Z" fill="#D4924A" stroke="#0A0A0A" stroke-width="1.2"/>
            </svg>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 44],
      });

      const pin = L.divIcon({
        className: '',
        html: `
          <div style="
            width: 32px; height: 40px;
            display: flex; align-items: center; justify-content: center;
            transform: translate(-16px, -40px);
          ">
            <svg width="32" height="40" viewBox="0 0 32 40" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));">
              <path d="M16 2 C8 2 3 8 3 16 C3 26 16 38 16 38 C16 38 29 26 29 16 C29 8 24 2 16 2 Z"
                fill="#D62828" stroke="#0A0A0A" stroke-width="1.5"/>
              <circle cx="16" cy="15" r="5" fill="#FFF8E7"/>
            </svg>
          </div>
        `,
        iconSize: [32, 40],
        iconAnchor: [16, 40],
      });

      setIcons({ burger, pin });
      setLeafletReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Subscribe to live pings.
  useEffect(() => {
    const supabase = getBrowserSupabase();
    const channel = supabase
      .channel(`delivery_locations:${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'estacion33',
          table: 'delivery_locations',
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          const row = payload.new as {
            lat: number;
            lng: number;
            recorded_at: string;
          };
          setPing({
            lat: row.lat,
            lng: row.lng,
            recorded_at: row.recorded_at,
          });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [orderId]);

  // Center the map: if we have a ping, use it; else the destination; else
  // a sensible default for Iguala, Gro.
  const center: [number, number] = ping
    ? [ping.lat, ping.lng]
    : destination
      ? [destination.lat, destination.lng]
      : [18.347, -99.541]; // Iguala de la Independencia, GRO (rough)

  // ETA: derived from latest ping + destination. null when we can't compute.
  const eta = useMemo(() => {
    if (!ping || !destination) return null;
    const meters = haversineMeters(
      { lat: ping.lat, lng: ping.lng },
      { lat: destination.lat, lng: destination.lng },
    );
    const mins = etaMinutes(
      { lat: ping.lat, lng: ping.lng },
      { lat: destination.lat, lng: destination.lng },
    );
    return { meters, mins };
  }, [ping, destination]);

  if (!leafletReady || !icons) {
    return (
      <div
        style={{
          width: '100%',
          height: 320,
          borderRadius: 12,
          border: '2px solid var(--color-brand-ink)',
          background: 'var(--color-brand-cream)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-neutral-700)',
          fontSize: 13,
          fontFamily: 'var(--font-heading)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        Cargando mapa…
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        border: '2px solid var(--color-brand-ink)',
        position: 'relative',
      }}
    >
      {eta ? (
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 500,
            background: 'var(--color-brand-primary)',
            color: 'var(--color-brand-ink)',
            border: '2px solid var(--color-brand-ink)',
            padding: '8px 14px',
            borderRadius: 999,
            boxShadow: '3px 3px 0 var(--color-brand-ink)',
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            lineHeight: 1.1,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 14,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {formatEtaEs(eta.mins)}
          </span>
          <span
            style={{
              fontSize: 11,
              color: 'var(--color-neutral-700)',
            }}
          >
            {eta.meters < 1000
              ? `${Math.round(eta.meters)} m`
              : `${(eta.meters / 1000).toFixed(1)} km`}{' '}
            de tu casa
          </span>
        </div>
      ) : null}
      <MapContainer
        center={center}
        zoom={15}
        style={{ width: '100%', height: 320 }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {ping ? (
          <Marker
            position={[ping.lat, ping.lng]}
            icon={icons.burger as any}
          >
            <Popup>
              Tu pedido viene en camino
              <br />
              <small>
                Última actualización:{' '}
                {new Date(ping.recorded_at).toLocaleTimeString('es-MX', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </small>
            </Popup>
          </Marker>
        ) : null}
        {destination ? (
          <Marker
            position={[destination.lat, destination.lng]}
            icon={icons.pin as any}
          >
            <Popup>{destination.label || 'Tu dirección'}</Popup>
          </Marker>
        ) : null}
      </MapContainer>
      <style>{`
        @keyframes gps-marker-pulse {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .leaflet-container { font-family: var(--font-body, Inter), system-ui, sans-serif; }
      `}</style>
    </div>
  );
}
