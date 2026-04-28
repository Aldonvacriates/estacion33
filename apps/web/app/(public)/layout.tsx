import Link from 'next/link';
import { i18n } from '@estacion33/core';
import { CartLink } from './CartLink';
import { getServerSupabase } from '@/lib/supabase/server';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const t = i18n.es;
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          height: 'var(--size-appBar)',
          paddingInline: 'var(--space-5)',
          background: 'var(--color-brand-ink)',
          color: 'var(--color-neutral-0)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-5)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 26,
            fontWeight: 400,
            color: 'inherit',
            letterSpacing: '0.04em',
          }}
        >
          ESTACIÓN 33
        </Link>
        <nav
          style={{
            display: 'flex',
            gap: 'var(--space-5)',
            marginLeft: 'auto',
            alignItems: 'center',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <Link href="/menu" style={{ color: 'inherit' }}>Menú</Link>
          <Link href="/reservar" style={{ color: 'inherit' }}>Reservar</Link>
          <CartLink />
          <Link href={user ? '/cuenta' : '/iniciar-sesion'} style={{ color: 'inherit' }}>
            {user ? 'Cuenta' : 'Entrar'}
          </Link>
          <Link
            href="/menu"
            style={{
              background: 'var(--color-brand-primary)',
              color: 'var(--color-brand-ink)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
              fontFamily: 'var(--font-heading)',
              fontSize: 14,
              letterSpacing: '0.06em',
              fontWeight: 400,
              textTransform: 'uppercase',
            }}
          >
            Pedir ahora
          </Link>
        </nav>
      </header>
      <div style={{ flex: 1 }}>{children}</div>
      <footer
        style={{
          padding: 'var(--space-5)',
          background: 'var(--color-brand-ink)',
          color: 'var(--color-brand-primary)',
          borderTop: '4px solid var(--color-brand-primary)',
          fontSize: 13,
          textAlign: 'center',
          letterSpacing: '0.02em',
        }}
      >
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, letterSpacing: '0.06em' }}>
          ESTACIÓN 33
        </div>
        <div style={{ marginTop: 6, color: 'var(--color-neutral-0)' }}>
          Plan de Iguala s/n, Col. Burócrata · Jue/Vie/Sáb 18:30–22:30 · {t.service.open}
        </div>
        <div style={{ marginTop: 6, color: 'var(--color-neutral-400)', fontSize: 11 }}>
          © {new Date().getFullYear()} Aldo Website LLC
        </div>
      </footer>
    </div>
  );
}
