import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cssVariablesString } from '@estacion33/tokens/css';
import { getServerSupabase } from '@/lib/supabase/server';
import { RepartidorTabs, RepartidorBurgerMark } from './RepartidorTabs';
import { AlwaysOnToggle } from './AlwaysOnToggle';
import '../globals.css';

const TABS = [
  { href: '/repartidor', label: 'Cola' },
  { href: '/repartidor/activo', label: 'Activo' },
  { href: '/repartidor/historial', label: 'Historial' },
];

const tokenVarsCss = cssVariablesString(':root');

export default async function RepartidorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/iniciar-sesion?next=/repartidor');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_repartidor, full_name, always_on_gps')
    .eq('id', user.id)
    .single();

  if (!profile?.is_repartidor) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: 24,
          textAlign: 'center',
          background: 'var(--color-brand-cream)',
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: tokenVarsCss }} />
        <h1 style={{ margin: 0, color: 'var(--color-brand-ink)' }}>Solo repartidores</h1>
        <p style={{ color: 'var(--color-neutral-700)', maxWidth: 360 }}>
          Esta sección es para repartidores de Estación 33. Si necesitas acceso, pide al
          dueño que active tu cuenta.
        </p>
        <Link
          href="/cuenta"
          style={{ color: 'var(--color-brand-ink)', fontWeight: 600 }}
        >
          ← Volver a mi cuenta
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-brand-cream)',
      }}
    >
      <header
        style={{
          background: 'var(--color-brand-ink)',
          color: 'var(--color-neutral-0)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            height: 'var(--size-appBar)',
            paddingInline: 'var(--space-5)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
          }}
        >
          <Link
            href="/repartidor"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <RepartidorBurgerMark />
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 20,
                letterSpacing: '0.1em',
                color: 'var(--color-brand-primary)',
              }}
            >
              REPARTIDOR
            </span>
          </Link>
          <div
            style={{
              marginLeft: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <AlwaysOnToggle initial={!!profile.always_on_gps} />
          </div>
          <Link
            href="/cuenta"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'var(--font-heading)',
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-neutral-300)',
              textDecoration: 'none',
              padding: '6px 12px',
              border: '1px solid var(--color-neutral-700)',
              borderRadius: 999,
            }}
          >
            <span aria-hidden>←</span> Mi cuenta
          </Link>
          <span
            style={{
              fontSize: 11,
              color: 'var(--color-neutral-500)',
              maxWidth: 100,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={profile.full_name ?? user.email ?? undefined}
          >
            {profile.full_name ?? user.email}
          </span>
        </div>

        <RepartidorTabs items={TABS} />
      </header>

      <main
        style={{
          flex: 1,
          padding: 'var(--space-5)',
          maxWidth: 'var(--size-containerMd)',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {children}
      </main>
    </div>
  );
}
