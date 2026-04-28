import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';

const SUB_NAV = [
  { href: '/cuenta', label: 'Inicio' },
  { href: '/cuenta/ordenes', label: 'Mis pedidos' },
  { href: '/cuenta/direcciones', label: 'Direcciones' },
  { href: '/cuenta/perfil', label: 'Perfil' },
];

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/iniciar-sesion?next=/cuenta');
  }

  return (
    <div
      style={{
        background: 'var(--color-brand-cream)',
        minHeight: 'calc(100vh - var(--size-appBar))',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--size-containerMd)',
          margin: '0 auto',
          padding: 'var(--space-5)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-5)',
        }}
      >
        <nav
          className="no-scrollbar"
          style={{
            display: 'flex',
            gap: 6,
            borderBottom: '2px solid var(--color-brand-ink)',
            overflowX: 'auto',
            paddingBottom: 0,
          }}
        >
          {SUB_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: '10px 16px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 400,
                fontSize: 13,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--color-brand-ink)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                background: 'transparent',
                borderRadius: '8px 8px 0 0',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </div>
  );
}
