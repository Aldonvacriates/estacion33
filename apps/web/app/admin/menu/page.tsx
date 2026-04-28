import { getServerSupabase } from '@/lib/supabase/server';
import { MenuAdminTable } from './MenuAdminTable';

export const dynamic = 'force-dynamic';

export default async function AdminMenuPage() {
  const supabase = await getServerSupabase();

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select(
        'id, slug, name, description, image_url, base_price_cents, available, sort_order, category_id',
      )
      .order('sort_order', { ascending: true }),
    supabase
      .from('categories')
      .select('id, name, sort_order')
      .order('sort_order', { ascending: true }),
  ]);

  const grouped = (categories ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    products: (products ?? []).filter((p) => p.category_id === c.id),
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span
          style={{
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(28px, 5vw, 40px)',
            color: 'var(--color-brand-chili)',
            lineHeight: 1,
          }}
        >
          El menú
        </span>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(24px, 3.5vw, 32px)',
            fontWeight: 400,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--color-brand-ink)',
          }}
        >
          Productos
        </h1>
        <p
          style={{
            color: 'var(--color-neutral-700)',
            fontSize: 14,
            margin: '4px 0 0',
          }}
        >
          Activa o desactiva productos y ajusta precios. Los cambios se guardan al instante.
        </p>
      </header>
      <MenuAdminTable categories={grouped} />
    </div>
  );
}
