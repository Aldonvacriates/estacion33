'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Database } from '@estacion33/core';
import { setReservationStatusAction } from '../actions';

type ReservationStatus = Database['estacion33']['Enums']['reservation_status'];

const STATUS_OPTIONS: { value: ReservationStatus; label: string }[] = [
  { value: 'pending', label: 'Por confirmar' },
  { value: 'confirmed', label: 'Confirmada' },
  { value: 'cancelled', label: 'Cancelada' },
  { value: 'no_show', label: 'No asistió' },
];

type Row = {
  id: string;
  guest_name: string;
  phone: string;
  party_size: number;
  slot_at: string;
  status: ReservationStatus;
  notes: string | null;
  created_at: string;
};

export function ReservationsAdminTable({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleChange = (id: string, status: ReservationStatus) => {
    setError(null);
    startTransition(async () => {
      const result = await setReservationStatusAction({ reservationId: id, status });
      if (!result.ok) setError(result.error);
      router.refresh();
    });
  };

  if (rows.length === 0) {
    return (
      <p style={{ color: 'var(--color-neutral-500)' }}>Sin reservas todavía.</p>
    );
  }

  return (
    <>
      {error ? (
        <div
          style={{
            background: 'var(--color-semantic-dangerBg)',
            color: 'var(--color-semantic-dangerFg)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            fontSize: 14,
          }}
        >
          {error}
        </div>
      ) : null}
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {rows.map((r) => (
          <li
            key={r.id}
            style={{
              padding: 'var(--space-4)',
              background: 'var(--color-neutral-0)',
              border: '1px solid var(--color-neutral-200)',
              borderRadius: 'var(--radius-md)',
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) auto',
              gap: 'var(--space-3)',
              alignItems: 'flex-start',
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>
                {r.guest_name} · {r.party_size} {r.party_size === 1 ? 'persona' : 'personas'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-neutral-700)', marginTop: 2 }}>
                {new Date(r.slot_at).toLocaleString('es-MX', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
                {' · '}
                <a href={`tel:${r.phone}`} style={{ color: 'var(--color-brand-primary)' }}>
                  {r.phone}
                </a>
              </div>
              {r.notes ? (
                <div style={{ fontSize: 12, color: 'var(--color-neutral-500)', marginTop: 4 }}>
                  {r.notes}
                </div>
              ) : null}
            </div>
            <select
              value={r.status}
              onChange={(e) => handleChange(r.id, e.target.value as ReservationStatus)}
              disabled={isPending}
              style={{
                height: 36,
                padding: '0 8px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-neutral-300)',
                fontSize: 14,
                background: 'var(--color-neutral-0)',
                cursor: isPending ? 'not-allowed' : 'pointer',
              }}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </>
  );
}
