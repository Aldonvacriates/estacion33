'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setAdminRoleAction, setRepartidorRoleAction } from '../actions';
import type { AdminUserRow } from './page';

type Filter = 'todos' | 'admin' | 'repartidor' | 'cliente';

/**
 * One row per registered profile. Two role chips per row (Admin /
 * Repartidor). Clicking a chip flips the flag and refreshes the page.
 * "Cliente" is the implicit role — when both flags are off, the user is
 * just a customer (we display it as a muted chip, not interactive).
 */
export function UsuariosTable({ users }: { users: AdminUserRow[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [pendingKey, setPendingKey] = useState<'admin' | 'repartidor' | null>(null);
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('todos');
  // When the admin is about to flip another user's is_admin flag we show a
  // confirmation modal first. Repartidor flips don't need the same gate
  // because the role is much less powerful.
  const [confirmAdmin, setConfirmAdmin] = useState<{
    user: AdminUserRow;
    nextValue: boolean;
  } | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (filter === 'admin' && !u.is_admin) return false;
      if (filter === 'repartidor' && !u.is_repartidor) return false;
      if (filter === 'cliente' && (u.is_admin || u.is_repartidor)) return false;
      if (!q) return true;
      return (
        (u.full_name ?? '').toLowerCase().includes(q) ||
        (u.email ?? '').toLowerCase().includes(q) ||
        (u.phone ?? '').toLowerCase().includes(q)
      );
    });
  }, [users, query, filter]);

  const flip = (
    profileId: string,
    role: 'admin' | 'repartidor',
    enabled: boolean,
  ) => {
    setError(null);
    setPendingId(profileId);
    setPendingKey(role);
    startTransition(async () => {
      const action =
        role === 'admin' ? setAdminRoleAction : setRepartidorRoleAction;
      const result = await action({ profileId, enabled });
      if (!result.ok) setError(result.error);
      setPendingId(null);
      setPendingKey(null);
      router.refresh();
    });
  };

  if (users.length === 0) {
    return (
      <p style={{ color: 'var(--color-neutral-700)', fontSize: 14 }}>
        Aún no hay perfiles registrados.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {/* Filters + search */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
          background: 'var(--color-brand-cream)',
          padding: 'var(--space-3)',
          borderRadius: 12,
          border: '2px solid var(--color-brand-ink)',
        }}
      >
        <input
          type="search"
          placeholder="Buscar por nombre, correo o teléfono…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            height: 40,
            padding: '0 12px',
            border: '2px solid var(--color-neutral-300)',
            borderRadius: 8,
            fontSize: 14,
            fontFamily: 'inherit',
            background: 'var(--color-neutral-0)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = 'var(--color-brand-ink)')
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = 'var(--color-neutral-300)')
          }
        />
        <div
          className="no-scrollbar"
          style={{
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {(
            [
              { id: 'todos', label: `Todos (${users.length})` },
              {
                id: 'admin',
                label: `Admin (${users.filter((u) => u.is_admin).length})`,
              },
              {
                id: 'repartidor',
                label: `Repartidor (${users.filter((u) => u.is_repartidor).length})`,
              },
              {
                id: 'cliente',
                label: `Cliente (${
                  users.filter((u) => !u.is_admin && !u.is_repartidor).length
                })`,
              },
            ] as { id: Filter; label: string }[]
          ).map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                style={{
                  flex: '0 0 auto',
                  padding: '6px 12px',
                  borderRadius: 999,
                  border: `2px solid ${
                    active ? 'var(--color-brand-ink)' : 'var(--color-neutral-300)'
                  }`,
                  background: active
                    ? 'var(--color-brand-primary)'
                    : 'var(--color-neutral-0)',
                  color: 'var(--color-brand-ink)',
                  fontFamily: 'var(--font-heading)',
                  fontSize: 11,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

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

      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {filtered.length === 0 ? (
          <li style={{ color: 'var(--color-neutral-500)', fontSize: 13 }}>
            Ningún resultado.
          </li>
        ) : (
          filtered.map((u) => (
            <li
              key={u.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--color-neutral-0)',
                border: `2px solid ${
                  u.is_admin
                    ? 'var(--color-brand-ink)'
                    : u.is_repartidor
                      ? 'var(--color-brand-primary)'
                      : 'var(--color-neutral-200)'
                }`,
                borderRadius: 12,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: 1, minWidth: 200 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: 'var(--color-brand-ink)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {u.full_name ?? '(sin nombre)'}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--color-neutral-700)',
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap',
                  }}
                >
                  {u.email ? <span>{u.email}</span> : null}
                  {u.phone ? <span>· {u.phone}</span> : null}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <RolePill
                  label="Admin"
                  active={u.is_admin}
                  busy={pendingId === u.id && pendingKey === 'admin'}
                  onClick={() =>
                    setConfirmAdmin({ user: u, nextValue: !u.is_admin })
                  }
                  variant="ink"
                />
                <RolePill
                  label="Repartidor"
                  active={u.is_repartidor}
                  busy={pendingId === u.id && pendingKey === 'repartidor'}
                  onClick={() => flip(u.id, 'repartidor', !u.is_repartidor)}
                  variant="primary"
                />
                {!u.is_admin && !u.is_repartidor ? (
                  <span
                    style={{
                      padding: '6px 12px',
                      borderRadius: 999,
                      background: 'var(--color-neutral-100)',
                      color: 'var(--color-neutral-500)',
                      fontFamily: 'var(--font-heading)',
                      fontSize: 11,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Cliente
                  </span>
                ) : null}
                <Link
                  href={`/admin/usuarios/${u.id}/ordenes`}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 999,
                    background: 'var(--color-neutral-0)',
                    color: 'var(--color-brand-primaryDark)',
                    border: '1px solid var(--color-brand-primary)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 11,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Ver pedidos
                </Link>
              </div>
            </li>
          ))
        )}
      </ul>

      {confirmAdmin ? (
        <ConfirmAdminModal
          user={confirmAdmin.user}
          nextValue={confirmAdmin.nextValue}
          onCancel={() => setConfirmAdmin(null)}
          onConfirm={() => {
            const { user, nextValue } = confirmAdmin;
            setConfirmAdmin(null);
            flip(user.id, 'admin', nextValue);
          }}
        />
      ) : null}
    </div>
  );
}

function ConfirmAdminModal({
  user,
  nextValue,
  onCancel,
  onConfirm,
}: {
  user: AdminUserRow;
  nextValue: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const promoting = nextValue;
  const displayName = user.full_name ?? user.email ?? user.id.slice(0, 8);
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(10,10,10,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-brand-cream)',
          border: '2px solid var(--color-brand-ink)',
          borderRadius: 16,
          maxWidth: 480,
          width: '100%',
          padding: 'var(--space-5)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          boxShadow: '6px 6px 0 var(--color-brand-primary)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: 32,
              color: promoting
                ? 'var(--color-brand-chili)'
                : 'var(--color-brand-ink)',
              lineHeight: 1,
            }}
          >
            {promoting ? 'Un momento' : 'Quitar acceso'}
          </span>
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-heading)',
              fontSize: 20,
              fontWeight: 400,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--color-brand-ink)',
            }}
          >
            {promoting
              ? '¿Hacer admin a esta persona?'
              : '¿Quitar el rol de admin?'}
          </h2>
        </div>
        <p
          style={{
            margin: 0,
            color: 'var(--color-neutral-700)',
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          {promoting ? (
            <>
              <strong>{displayName}</strong> podrá ver y editar el menú,
              pedidos, reservaciones, fotos y el resto del panel
              administrativo. Solo otorga este rol a personas de tu total
              confianza.
            </>
          ) : (
            <>
              <strong>{displayName}</strong> dejará de tener acceso al
              panel administrativo. Sus pedidos y datos se conservan
              intactos.
            </>
          )}
        </p>
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-3)',
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'transparent',
              color: 'var(--color-brand-ink)',
              border: '2px solid var(--color-brand-ink)',
              padding: '10px 20px',
              borderRadius: 999,
              fontFamily: 'var(--font-heading)',
              fontSize: 13,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontWeight: 400,
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            autoFocus
            style={{
              background: promoting
                ? 'var(--color-brand-primary)'
                : 'var(--color-brand-chili)',
              color: promoting
                ? 'var(--color-brand-ink)'
                : 'var(--color-neutral-0)',
              border: 'none',
              padding: '10px 20px',
              borderRadius: 999,
              fontFamily: 'var(--font-heading)',
              fontSize: 13,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontWeight: 400,
              cursor: 'pointer',
            }}
          >
            {promoting ? 'Sí, hacer admin' : 'Sí, quitar admin'}
          </button>
        </div>
      </div>
    </div>
  );
}

function RolePill({
  label,
  active,
  busy,
  onClick,
  variant,
}: {
  label: string;
  active: boolean;
  busy: boolean;
  onClick: () => void;
  variant: 'ink' | 'primary';
}) {
  const onColor =
    variant === 'ink'
      ? { bg: 'var(--color-brand-ink)', fg: 'var(--color-brand-primary)' }
      : { bg: 'var(--color-brand-primary)', fg: 'var(--color-brand-ink)' };
  const offColor = {
    bg: 'var(--color-neutral-0)',
    fg: 'var(--color-brand-ink)',
  };
  const c = active ? onColor : offColor;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-pressed={active}
      style={{
        background: c.bg,
        color: c.fg,
        border: `2px solid ${
          active ? 'transparent' : 'var(--color-neutral-300)'
        }`,
        padding: '6px 12px',
        borderRadius: 999,
        fontFamily: 'var(--font-heading)',
        fontSize: 11,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontWeight: 400,
        cursor: busy ? 'wait' : 'pointer',
        opacity: busy ? 0.6 : 1,
        transition: 'background 120ms ease',
      }}
    >
      {busy ? '…' : label}
    </button>
  );
}
