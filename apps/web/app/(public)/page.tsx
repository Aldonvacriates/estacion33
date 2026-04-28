import { Button } from '@estacion33/ui/web';
import { getServiceWindow, i18n } from '@estacion33/core';

export default function HomePage() {
  const window = getServiceWindow();
  const t = i18n.es;

  const statusLabel: Record<typeof window.status, string> = {
    open: t.service.open,
    closed: t.service.closed,
    pre_open: t.service.preOpen,
    last_call: t.service.lastCall,
  };

  return (
    <main
      style={{
        minHeight: '100dvh',
        padding: 'var(--space-7)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
        maxWidth: 'var(--size-containerMd)',
        margin: '0 auto',
      }}
    >
      <header style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <span
          style={{
            display: 'inline-block',
            alignSelf: 'flex-start',
            background: 'var(--color-brand-yellow)',
            color: 'var(--color-brand-primaryDark)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 600,
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {statusLabel[window.status]}
        </span>
        <h1
          style={{
            fontSize: 56,
            fontWeight: 900,
            lineHeight: 1.1,
            margin: 0,
            letterSpacing: '-0.02em',
            color: 'var(--color-brand-primaryDark)',
          }}
        >
          Estación 33
        </h1>
        <p style={{ margin: 0, color: 'var(--color-neutral-500)', fontSize: 18 }}>
          Hamburguesas, snacks y más — Plan de Iguala s/n, Col. Burócrata.
        </p>
      </header>

      <section style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <Button variant="primary" size="lg">
          Ver menú
        </Button>
        <Button variant="secondary" size="lg">
          Reservar mesa
        </Button>
        <Button variant="ghost" size="lg">
          Iniciar sesión
        </Button>
      </section>

      <footer style={{ marginTop: 'auto', color: 'var(--color-neutral-400)', fontSize: 12 }}>
        © {new Date().getFullYear()} Aldo Website LLC · Estación 33
      </footer>
    </main>
  );
}
