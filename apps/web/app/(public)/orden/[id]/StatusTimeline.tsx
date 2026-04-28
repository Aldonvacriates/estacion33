'use client';

import type { Database } from '@estacion33/core';

type OrderStatus = Database['estacion33']['Enums']['order_status'];
type Fulfillment = Database['estacion33']['Enums']['fulfillment_type'];

type Step = {
  status: OrderStatus;
  label: string;
};

const STEPS_DELIVERY: Step[] = [
  { status: 'pending', label: 'Recibido' },
  { status: 'paid', label: 'Confirmado' },
  { status: 'preparing', label: 'En preparación' },
  { status: 'ready', label: 'Listo' },
  { status: 'out_for_delivery', label: 'En camino' },
  { status: 'delivered', label: 'Entregado' },
];

const STEPS_PICKUP: Step[] = [
  { status: 'pending', label: 'Recibido' },
  { status: 'paid', label: 'Confirmado' },
  { status: 'preparing', label: 'En preparación' },
  { status: 'ready', label: 'Listo para recoger' },
  { status: 'delivered', label: 'Entregado' },
];

const STATUS_ORDER: OrderStatus[] = [
  'pending',
  'paid',
  'preparing',
  'ready',
  'out_for_delivery',
  'delivered',
];

export function StatusTimeline({
  status,
  fulfillment,
}: {
  status: OrderStatus;
  fulfillment: Fulfillment;
}) {
  if (status === 'cancelled') {
    return (
      <div
        style={{
          background: 'var(--color-semantic-dangerBg)',
          color: 'var(--color-semantic-dangerFg)',
          padding: 'var(--space-4)',
          borderRadius: 'var(--radius-lg)',
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        Pedido cancelado
      </div>
    );
  }

  const steps = fulfillment === 'delivery' ? STEPS_DELIVERY : STEPS_PICKUP;
  const currentIndex = STATUS_ORDER.indexOf(status);

  return (
    <ol
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 'var(--space-4)',
        background: 'var(--color-neutral-50)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      {steps.map((step, idx) => {
        const stepIndex = STATUS_ORDER.indexOf(step.status);
        const reached = stepIndex <= currentIndex;
        const isCurrent = step.status === status;
        const isLast = idx === steps.length - 1;

        return (
          <li
            key={step.status}
            style={{
              display: 'grid',
              gridTemplateColumns: '32px 1fr',
              gap: 'var(--space-3)',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: 48,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: reached
                    ? 'var(--color-brand-primary)'
                    : 'var(--color-neutral-200)',
                  color: 'var(--color-neutral-0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 700,
                  border: isCurrent ? '3px solid var(--color-brand-primary50)' : 'none',
                  boxShadow: isCurrent ? '0 0 0 4px var(--color-brand-primary)' : 'none',
                  transition: 'all 200ms ease',
                  flexShrink: 0,
                }}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {reached ? '✓' : ''}
              </div>
              {!isLast ? (
                <div
                  style={{
                    width: 2,
                    flex: 1,
                    background: stepIndex < currentIndex
                      ? 'var(--color-brand-primary)'
                      : 'var(--color-neutral-200)',
                    minHeight: 16,
                    marginTop: 2,
                  }}
                />
              ) : null}
            </div>
            <div
              style={{
                paddingBottom: isLast ? 0 : 'var(--space-3)',
                paddingTop: 2,
              }}
            >
              <div
                style={{
                  fontWeight: isCurrent ? 700 : reached ? 600 : 500,
                  color: reached
                    ? 'var(--color-brand-primaryDark)'
                    : 'var(--color-neutral-500)',
                  fontSize: 16,
                }}
              >
                {step.label}
              </div>
              {isCurrent ? (
                <div
                  style={{
                    fontSize: 13,
                    color: 'var(--color-neutral-500)',
                    marginTop: 2,
                  }}
                >
                  Estado actual
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
