'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Database } from '@estacion33/core';
import { setOrderStatusAction } from '../actions';

type OrderStatus = Database['estacion33']['Enums']['order_status'];

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Recibido' },
  { value: 'paid', label: 'Confirmado' },
  { value: 'preparing', label: 'En preparación' },
  { value: 'ready', label: 'Listo' },
  { value: 'out_for_delivery', label: 'En camino' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
];

const PAYMENT_LABEL: Record<string, string> = {
  pending: 'Por pagar',
  paid: 'Pagado',
  failed: 'Falló',
  refunded: 'Reembolsado',
};

type Row = {
  id: string;
  status: OrderStatus;
  fulfillment: string;
  scheduled_for: string;
  total: string;
  payment_status: string;
  notes: string | null;
  created_at: string;
};

export function OrdersAdminTable({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleChange = (orderId: string, status: OrderStatus) => {
    setError(null);
    startTransition(async () => {
      const result = await setOrderStatusAction({ orderId, status });
      if (!result.ok) setError(result.error);
      router.refresh();
    });
  };

  if (rows.length === 0) {
    return (
      <p style={{ color: 'var(--color-neutral-500)' }}>
        Aún no hay pedidos.
      </p>
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
              <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' }}>
                <Link
                  href={`/orden/${r.id}`}
                  style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-brand-primaryDark)' }}
                >
                  Folio <code>{r.id.slice(0, 8)}</code>
                </Link>
                <span style={{ fontSize: 12, color: 'var(--color-neutral-500)' }}>
                  {new Date(r.created_at).toLocaleString('es-MX', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)',
                    background:
                      r.payment_status === 'paid'
                        ? 'var(--color-semantic-successBg)'
                        : 'var(--color-semantic-warningBg)',
                    color:
                      r.payment_status === 'paid'
                        ? 'var(--color-semantic-successFg)'
                        : 'var(--color-semantic-warningFg)',
                  }}
                >
                  {PAYMENT_LABEL[r.payment_status] ?? r.payment_status}
                </span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-neutral-700)', marginTop: 4 }}>
                {r.fulfillment === 'delivery' ? 'Entrega' : 'Recoger'} ·{' '}
                {new Date(r.scheduled_for).toLocaleString('es-MX', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
                {' · '}
                <strong>{r.total}</strong>
              </div>
              {r.notes ? (
                <div style={{ fontSize: 12, color: 'var(--color-neutral-500)', marginTop: 4 }}>
                  {r.notes}
                </div>
              ) : null}
            </div>
            <select
              value={r.status}
              onChange={(e) => handleChange(r.id, e.target.value as OrderStatus)}
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
