'use client';

import { useState, useTransition } from 'react';
import { Button } from '@estacion33/ui/web';
import { sendMagicLinkAction } from './actions';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const canSubmit = email.includes('@') && !isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);

    startTransition(async () => {
      const result = await sendMagicLinkAction({ email: email.trim().toLowerCase() });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSent(true);
    });
  };

  return (
    <main
      style={{
        maxWidth: 420,
        margin: '0 auto',
        padding: 'var(--space-7) var(--space-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
      }}
    >
      <header style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', textAlign: 'center' }}>
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--color-brand-primaryDark)',
          }}
        >
          Iniciar sesión
        </h1>
        <p style={{ margin: 0, color: 'var(--color-neutral-500)', fontSize: 14 }}>
          Te mandamos un enlace mágico al correo. Sin contraseñas.
        </p>
      </header>

      {sent ? (
        <div
          style={{
            background: 'var(--color-semantic-successBg)',
            color: 'var(--color-semantic-successFg)',
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            fontSize: 14,
          }}
        >
          ✓ Listo. Revisa <strong>{email}</strong> y haz clic en el enlace para entrar.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 14, color: 'var(--color-neutral-700)' }}>
              Correo electrónico
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="tu@correo.com"
              style={{
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
              }}
            />
          </label>

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

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={!canSubmit}>
            {isPending ? 'Enviando…' : 'Enviar enlace mágico'}
          </Button>
        </form>
      )}
    </main>
  );
}
