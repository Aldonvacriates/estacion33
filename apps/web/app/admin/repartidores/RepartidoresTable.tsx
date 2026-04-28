'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { setRepartidorRoleAction } from '../actions';

type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  is_repartidor: boolean;
  is_admin: boolean;
};

export function RepartidoresTable({ profiles }: { profiles: Profile[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const toggle = (profileId: string, enabled: boolean) => {
    setError(null);
    startTransition(async () => {
      const result = await setRepartidorRoleAction({ profileId, enabled });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  const drivers = profiles.filter((p) => p.is_repartidor);
  const others = profiles.filter((p) => !p.is_repartidor);

  return (
    <>
      {error ? (
        <div
          style={{
            background: 'var(--color-semantic-dangerBg)',
            color: 'var(--color-semantic-dangerFg)',
            border: '1px solid var(--color-brand-chili)',
            padding: 'var(--space-3)',
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          {error}
        </div>
      ) : null}

      <Section
        title={`Activos · ${drivers.length}`}
        emptyText="Aún no hay nadie con rol de repartidor."
        profiles={drivers}
        isPending={isPending}
        onToggle={toggle}
      />
      <Section
        title={`Sin rol · ${others.length}`}
        emptyText="Sin perfiles disponibles."
        profiles={others}
        isPending={isPending}
        onToggle={toggle}
      />
    </>
  );
}

function Section({
  title,
  emptyText,
  profiles,
  isPending,
  onToggle,
}: {
  title: string;
  emptyText: string;
  profiles: Profile[];
  isPending: boolean;
  onToggle: (profileId: string, enabled: boolean) => void;
}) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <h2
        style={{
          margin: 0,
          fontFamily: 'var(--font-heading)',
          fontSize: 14,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-brand-ink)',
          borderBottom: '2px solid var(--color-brand-primary)',
          paddingBottom: 4,
        }}
      >
        {title}
      </h2>
      {profiles.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--color-neutral-500)' }}>{emptyText}</p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {profiles.map((p) => (
            <li
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 'var(--space-3)',
                background: 'var(--color-neutral-0)',
                border: '1px solid var(--color-neutral-200)',
                borderRadius: 12,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--color-brand-ink)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {p.full_name ?? p.id.slice(0, 8)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-neutral-500)' }}>
                  {p.phone ?? p.id}
                </div>
              </div>
              {p.is_admin ? (
                <span
                  style={{
                    background: 'var(--color-brand-ink)',
                    color: 'var(--color-brand-primary)',
                    padding: '2px 8px',
                    borderRadius: 999,
                    fontFamily: 'var(--font-heading)',
                    fontSize: 10,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  Admin
                </span>
              ) : null}
              <button
                type="button"
                disabled={isPending}
                onClick={() => onToggle(p.id, !p.is_repartidor)}
                style={{
                  background: p.is_repartidor
                    ? 'var(--color-brand-primary)'
                    : 'transparent',
                  color: 'var(--color-brand-ink)',
                  border: '2px solid var(--color-brand-ink)',
                  padding: '6px 14px',
                  borderRadius: 999,
                  fontFamily: 'var(--font-heading)',
                  fontSize: 11,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fontWeight: 400,
                  cursor: isPending ? 'wait' : 'pointer',
                }}
              >
                {p.is_repartidor ? 'Activo' : 'Activar'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
