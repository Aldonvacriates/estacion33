'use client';

import { useState, useTransition } from 'react';
import { sendMagicLinkAction } from './actions';

export function SignInForm() {
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
        background: 'var(--color-brand-cream)',
        minHeight: 'calc(100vh - var(--size-appBar))',
        padding: 'var(--space-6) var(--space-5)',
      }}
    >
      <div
        style={{
          maxWidth: 460,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-5)',
        }}
      >
        <header
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(36px, 6vw, 52px)',
              color: 'var(--color-brand-chili)',
              lineHeight: 1,
            }}
          >
            Hola de nuevo
          </span>
          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(22px, 3vw, 30px)',
              fontWeight: 400,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--color-brand-ink)',
            }}
          >
            Iniciar sesión
          </h1>
          <p
            style={{
              margin: '8px 0 0',
              color: 'var(--color-neutral-700)',
              fontSize: 14,
            }}
          >
            Te mandamos un enlace mágico al correo. Sin contraseñas.
          </p>
        </header>

        {sent ? (
          <div
            style={{
              background: 'var(--color-brand-primary)',
              color: 'var(--color-brand-ink)',
              padding: 'var(--space-5)',
              borderRadius: 12,
              textAlign: 'center',
              fontSize: 15,
              border: '2px solid var(--color-brand-ink)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 18,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}
            >
              ✓ Enlace enviado
            </div>
            <div>
              Revisa <strong>{email}</strong> y haz clic en el enlace para entrar.
              <div style={{ marginTop: 8, fontSize: 13, opacity: 0.8 }}>
                Si no llega en 1–2 minutos, revisa tu carpeta de spam.
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
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
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 13,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-brand-ink)',
                }}
              >
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
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = 'var(--color-brand-ink)')
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = 'var(--color-neutral-300)')
                }
              />
            </label>

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

            <button
              type="submit"
              disabled={!canSubmit}
              style={{
                background: canSubmit
                  ? 'var(--color-brand-primary)'
                  : 'var(--color-neutral-300)',
                color: 'var(--color-brand-ink)',
                border: 'none',
                padding: '14px 20px',
                borderRadius: 999,
                fontFamily: 'var(--font-heading)',
                fontSize: 15,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontWeight: 400,
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                marginTop: 4,
              }}
            >
              {isPending ? 'Enviando…' : 'Enviar enlace mágico'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
