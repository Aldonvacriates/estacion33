import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cssVariablesString } from '@estacion33/tokens/css';
import { getServerSupabase } from '@/lib/supabase/server';
import { AdminNav, BurgerMark } from './AdminNav';
import '../globals.css';

const ADMIN_NAV = [
  { href: '/admin', label: 'Resumen' },
  { href: '/admin/ordenes', label: 'Pedidos' },
  { href: '/admin/menu', label: 'Menú' },
  { href: '/admin/reservas', label: 'Reservas' },
  { href: '/admin/repartidores', label: 'Repartidores' },
  { href: '/admin/photos', label: 'Galería' },
];

const tokenVarsCss = cssVariablesString(':root');

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/iniciar-sesion?next=/admin');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, full_name')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
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
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: tokenVarsCss }} />
        <h1 style={{ margin: 0, color: 'var(--color-brand-primaryDark)' }}>Solo personal</h1>
        <p style={{ color: 'var(--color-neutral-500)', maxWidth: 360 }}>
          Esta sección es para empleados de Estación 33. Si necesitas acceso, pide al
          dueño que active tu cuenta.
        </p>
        <Link href="/" style={{ color: 'var(--color-brand-primaryDark)', fontWeight: 600 }}>
          ← Volver al sitio
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
        background: 'var(--color-neutral-50)',
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
        {/* Top bar: burger logo + ADMIN, user name on the right */}
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
            href="/admin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <BurgerMark />
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 22,
                letterSpacing: '0.1em',
                color: 'var(--color-brand-primary)',
              }}
            >
              ADMIN
            </span>
          </Link>
          <Link
            href="/cuenta"
            style={{
              marginLeft: 'auto',
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
            title="Volver a tu cuenta de cliente"
          >
            <span aria-hidden>←</span> Mi cuenta
          </Link>
          <span
            style={{
              fontSize: 11,
              color: 'var(--color-neutral-500)',
              maxWidth: 120,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={profile.full_name ?? user.email ?? undefined}
          >
            {profile.full_name ?? user.email}
          </span>
        </div>

        {/* Scrollable nav strip */}
        <AdminNav items={ADMIN_NAV} />
      </header>
      <main
        style={{
          flex: 1,
          padding: 'var(--space-5)',
          maxWidth: 'var(--size-containerLg)',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {children}
      </main>
    </div>
  );
}
