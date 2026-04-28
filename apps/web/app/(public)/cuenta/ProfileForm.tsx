'use client';

import { useState, useTransition } from 'react';
import { Button } from '@estacion33/ui/web';
import { signOutAction, updateProfileAction } from './actions';

export function ProfileForm({
  email,
  initialFullName,
  initialPhone,
}: {
  email: string;
  initialFullName: string;
  initialPhone: string;
}) {
  const [fullName, setFullName] = useState(initialFullName);
  const [phone, setPhone] = useState(initialPhone);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSave] = useTransition();
  const [isSigningOut, startSignOut] = useTransition();

  const dirty =
    fullName.trim() !== initialFullName.trim() ||
    phone.trim() !== initialPhone.trim();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dirty) return;
    setError(null);
    startSave(async () => {
      const result = await updateProfileAction({
        fullName: fullName.trim(),
        phone: phone.trim(),
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSavedAt(Date.now());
    });
  };

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'var(--color-brand-primaryDark)' }}>
        Tu perfil
      </h1>

      <form
        onSubmit={handleSave}
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
      >
        <Field label="Correo">
          <input type="email" value={email} readOnly style={{ ...inputStyle, color: 'var(--color-neutral-500)' }} />
        </Field>
        <Field label="Nombre completo">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            minLength={2}
            maxLength={80}
            autoComplete="name"
            style={inputStyle}
          />
        </Field>
        <Field label="Teléfono / WhatsApp">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={20}
            autoComplete="tel"
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
        {savedAt && !dirty ? (
          <div
            style={{
              background: 'var(--color-semantic-successBg)',
              color: 'var(--color-semantic-successFg)',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              fontSize: 14,
            }}
          >
            ✓ Guardado
          </div>
        ) : null}

        <Button type="submit" variant="primary" size="md" disabled={!dirty || isSaving}>
          {isSaving ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </form>

      <hr style={{ border: 'none', borderTop: '1px solid var(--color-neutral-200)' }} />

      <Button
        type="button"
        variant="ghost"
        size="md"
        onClick={() => startSignOut(async () => signOutAction())}
        disabled={isSigningOut}
      >
        {isSigningOut ? 'Cerrando sesión…' : 'Cerrar sesión'}
      </Button>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 14, color: 'var(--color-neutral-700)' }}>{label}</span>
      {children}
    </label>
  );
}
