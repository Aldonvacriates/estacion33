import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cssVariablesString } from '@estacion33/tokens/css';
import { getServerSupabase } from '@/lib/supabase/server';
import '../globals.css';

const ADMIN_NAV = [
  { href: '/admin', label: 'Resumen' },
  { href: '/admin/ordenes', label: 'Pedidos' },
  { href: '/admin/menu', label: 'Menú' },
  { href: '/admin/reservas', label: 'Reservas' },
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
          href="/admin"
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: 'inherit',
            letterSpacing: '-0.02em',
            textDecoration: 'none',
          }}
        >
          Estación 33 · Admin
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
          {ADMIN_NAV.map((item) => (
            <Link key={item.href} href={item.href} style={{ color: 'inherit', textDecoration: 'none' }}>
              {item.label}
            </Link>
          ))}
          <span style={{ color: 'var(--color-brand-primary200)', marginLeft: 'var(--space-3)' }}>
            {profile.full_name ?? user.email}
          </span>
        </nav>
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
