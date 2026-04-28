import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';

const SUB_NAV = [
  { href: '/cuenta', label: 'Perfil' },
  { href: '/cuenta/ordenes', label: 'Mis pedidos' },
  { href: '/cuenta/direcciones', label: 'Direcciones' },
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
        maxWidth: 'var(--size-containerMd)',
        margin: '0 auto',
        padding: 'var(--space-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
      }}
    >
      <nav
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          borderBottom: '1px solid var(--color-neutral-200)',
          overflowX: 'auto',
        }}
      >
        {SUB_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              padding: '12px 16px',
              fontWeight: 500,
              fontSize: 14,
              color: 'var(--color-neutral-700)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
