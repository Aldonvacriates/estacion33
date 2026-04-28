'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@estacion33/ui/web';
import { addAddressAction, deleteAddressAction } from '../actions';

type AddressRow = {
  id: string;
  label: string | null;
  line1: string;
  line2: string | null;
  notes: string | null;
  is_default: boolean;
};

export function AddressManager({ initial }: { initial: AddressRow[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await addAddressAction({ label, line1, line2, notes });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setLabel('');
      setLine1('');
      setLine2('');
      setNotes('');
      setAdding(false);
      router.refresh();
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('¿Eliminar esta dirección?')) return;
    startTransition(async () => {
      const result = await deleteAddressAction({ id });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)' }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'var(--color-brand-primaryDark)' }}>
          Direcciones
        </h1>
        {!adding ? (
          <Button type="button" variant="primary" size="sm" onClick={() => setAdding(true)}>
            Agregar
          </Button>
        ) : null}
      </div>

      {adding ? (
        <form
          onSubmit={handleAdd}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
            padding: 'var(--space-4)',
            border: '1px solid var(--color-neutral-200)',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-neutral-0)',
          }}
        >
          <Field label="Etiqueta (opcional)">
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              maxLength={50}
              placeholder="Casa / Oficina"
              style={inputStyle}
            />
          </Field>
          <Field label="Calle y número" required>
            <input
              type="text"
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              required
              minLength={3}
              maxLength={200}
              autoComplete="street-address"
              style={inputStyle}
            />
          </Field>
          <Field label="Colonia / Interior (opcional)">
            <input
              type="text"
              value={line2}
              onChange={(e) => setLine2(e.target.value)}
              maxLength={200}
              style={inputStyle}
            />
          </Field>
          <Field label="Referencias (opcional)">
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              placeholder="Casa azul, portón negro"
              style={inputStyle}
            />
          </Field>

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

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button type="submit" variant="primary" size="md" disabled={isPending}>
              {isPending ? 'Guardando…' : 'Guardar dirección'}
            </Button>
            <Button type="button" variant="ghost" size="md" onClick={() => { setAdding(false); setError(null); }}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : null}

      {initial.length === 0 && !adding ? (
        <p style={{ color: 'var(--color-neutral-500)', margin: 0 }}>
          No tienes direcciones guardadas todavía.
        </p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {initial.map((a) => (
            <li
              key={a.id}
              style={{
                padding: 'var(--space-4)',
                background: 'var(--color-neutral-0)',
                border: '1px solid var(--color-neutral-200)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'space-between',
                gap: 'var(--space-3)',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                {a.label ? (
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{a.label}</div>
                ) : null}
                <div style={{ fontSize: 14 }}>{a.line1}</div>
                {a.line2 ? <div style={{ fontSize: 13, color: 'var(--color-neutral-500)' }}>{a.line2}</div> : null}
                {a.notes ? <div style={{ fontSize: 13, color: 'var(--color-neutral-500)', marginTop: 4 }}>Ref: {a.notes}</div> : null}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(a.id)}
                disabled={isPending}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-semantic-danger)',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500,
                  padding: 0,
                }}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 44,
  padding: '0 12px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-neutral-300)',
  fontSize: 16,
  fontFamily: 'inherit',
  background: 'var(--color-neutral-0)',
  color: 'var(--color-neutral-900)',
  boxSizing: 'border-box',
};

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 14, color: 'var(--color-neutral-700)' }}>
        {label}
        {required ? <span style={{ color: 'var(--color-semantic-danger)' }}> *</span> : null}
      </span>
      {children}
    </label>
  );
}
