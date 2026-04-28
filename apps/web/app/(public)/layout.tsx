import Link from 'next/link';
import { i18n } from '@estacion33/core';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const t = i18n.es;

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          height: 'var(--size-appBar)',
          paddingInline: 'var(--space-5)',
          background: 'var(--color-brand-primaryDark)',
          color: 'var(--color-neutral-0)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-5)',
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'inherit',
            letterSpacing: '-0.02em',
          }}
        >
          Estación 33
        </Link>
        <nav
          style={{
            display: 'flex',
            gap: 'var(--space-4)',
            marginLeft: 'auto',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <Link href="/menu" style={{ color: 'inherit' }}>Menú</Link>
          <Link href="/reservar" style={{ color: 'inherit' }}>Reservar</Link>
          <Link href="/cuenta" style={{ color: 'inherit' }}>Cuenta</Link>
        </nav>
      </header>
      <div style={{ flex: 1 }}>{children}</div>
      <footer
        style={{
          padding: 'var(--space-5)',
          background: 'var(--color-neutral-50)',
          borderTop: '1px solid var(--color-neutral-200)',
          color: 'var(--color-neutral-500)',
          fontSize: 12,
          textAlign: 'center',
        }}
      >
        © {new Date().getFullYear()} Aldo Website LLC · Estación 33 · Plan de Iguala s/n,
        Col. Burócrata · Jue/Vie/Sáb 18:30–22:30 · {t.service.open}
      </footer>
    </div>
  );
}
