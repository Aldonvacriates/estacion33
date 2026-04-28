'use client';

import { useState, useTransition } from 'react';
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
      <header style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span
          style={{
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(28px, 5vw, 40px)',
            color: 'var(--color-brand-chili)',
            lineHeight: 1,
          }}
        >
          Tu perfil
        </span>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(20px, 3vw, 26px)',
            fontWeight: 400,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--color-brand-ink)',
          }}
        >
          {initialFullName || 'Hola'}
        </h1>
      </header>

      <form
        onSubmit={handleSave}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
          background: 'var(--color-neutral-0)',
          border: '2px solid var(--color-brand-ink)',
          borderRadius: 12,
          padding: 'var(--space-5)',
        }}
      >
        <Field label="Correo">
          <input
            type="email"
            value={email}
            readOnly
            style={{ ...inputStyle, color: 'var(--color-neutral-500)', background: 'var(--color-neutral-50)' }}
          />
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
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-brand-ink)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-neutral-300)')}
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
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-brand-ink)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-neutral-300)')}
          />
        </Field>

        {error ? (
          <div
            style={{
              background: 'var(--color-semantic-dangerBg)',
              color: 'var(--color-semantic-dangerFg)',
              padding: 'var(--space-3)',
              borderRadius: 8,
              fontSize: 14,
              border: '1px solid var(--color-brand-chili)',
            }}
          >
            {error}
          </div>
        ) : null}
        {savedAt && !dirty ? (
          <div
            style={{
              background: 'var(--color-brand-primary)',
              color: 'var(--color-brand-ink)',
              padding: 'var(--space-3)',
              borderRadius: 8,
              fontSize: 14,
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            ✓ Guardado
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!dirty || isSaving}
          style={{
            background: dirty && !isSaving
              ? 'var(--color-brand-primary)'
              : 'var(--color-neutral-300)',
            color: 'var(--color-brand-ink)',
            border: 'none',
            padding: '12px 20px',
            borderRadius: 999,
            fontFamily: 'var(--font-heading)',
            fontSize: 14,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontWeight: 400,
            cursor: dirty && !isSaving ? 'pointer' : 'not-allowed',
            alignSelf: 'flex-start',
          }}
        >
          {isSaving ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => startSignOut(async () => signOutAction())}
        disabled={isSigningOut}
        style={{
          background: 'transparent',
          color: 'var(--color-brand-chili)',
          border: '2px solid var(--color-brand-chili)',
          padding: '10px 18px',
          borderRadius: 999,
          fontFamily: 'var(--font-heading)',
          fontSize: 13,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          fontWeight: 400,
          cursor: 'pointer',
          alignSelf: 'flex-start',
        }}
      >
        {isSigningOut ? 'Cerrando sesión…' : 'Cerrar sesión'}
      </button>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 48,
  padding: '0 14px',
  borderRadius: 8,
  border: '2px solid var(--color-neutral-300)',
  fontSize: 16,
  fontFamily: 'inherit',
  background: 'var(--color-neutral-0)',
  color: 'var(--color-brand-ink)',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 120ms ease',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 12,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-brand-ink)',
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}
