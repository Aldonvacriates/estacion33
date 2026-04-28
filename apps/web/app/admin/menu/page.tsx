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
      <header style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <h1 style={{ margin: 0, color: 'var(--color-brand-primaryDark)' }}>Menú</h1>
        <p style={{ color: 'var(--color-neutral-500)', fontSize: 14, margin: 0 }}>
          Activa o desactiva productos y ajusta precios. Los cambios se guardan al instante.
        </p>
      </header>
      <MenuAdminTable categories={grouped} />
    </div>
  );
}
