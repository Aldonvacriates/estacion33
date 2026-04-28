import Link from 'next/link';
import { formatMxn, i18n } from '@estacion33/core';
import { getServerSupabase } from '@/lib/supabase/server';

export const revalidate = 60; // re-fetch menu every 60s

type MenuCategory = {
  id: string;
  slug: string;
  name: string;
  sort_order: number;
  products: MenuProduct[];
};

type MenuProduct = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  base_price_cents: number;
  image_url: string | null;
};

export default async function MenuPage() {
  const t = i18n.es;
  const supabase = await getServerSupabase();

  const [{ data: categories, error: catErr }, { data: products, error: prodErr }] =
    await Promise.all([
      supabase
        .from('categories')
        .select('id, slug, name, sort_order')
        .order('sort_order', { ascending: true }),
      supabase
        .from('products')
        .select('id, slug, category_id, name, description, base_price_cents, image_url, sort_order')
        .eq('available', true)
        .order('sort_order', { ascending: true }),
    ]);

  if (catErr || prodErr) {
    return (
      <main style={{ padding: 'var(--space-7)', color: 'var(--color-semantic-danger)' }}>
        Error cargando el menú: {catErr?.message ?? prodErr?.message}
      </main>
    );
  }

  const grouped: MenuCategory[] = (categories ?? []).map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    sort_order: c.sort_order,
    products: (products ?? [])
      .filter((p) => p.category_id === c.id)
      .map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description,
        base_price_cents: p.base_price_cents,
        image_url: p.image_url,
      })),
  }));

  const totalAvailable = grouped.reduce((sum, c) => sum + c.products.length, 0);

  return (
    <main
      style={{
        padding: 'var(--space-5)',
        maxWidth: 'var(--size-containerLg)',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-7)',
      }}
    >
      <header>
        <h1
          style={{
            fontSize: 40,
            fontWeight: 700,
            margin: 0,
            color: 'var(--color-brand-primaryDark)',
            letterSpacing: '-0.02em',
          }}
        >
          Menú
        </h1>
        <p style={{ color: 'var(--color-neutral-500)', marginTop: 'var(--space-2)' }}>
          Hamburguesas, snacks, ensaladas y más. Precios en MXN.
        </p>
      </header>

      {totalAvailable === 0 ? (
        <EmptyMenuNotice />
      ) : (
        grouped
          .filter((c) => c.products.length > 0)
          .map((category) => (
            <section key={category.id} id={category.slug}>
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  marginBottom: 'var(--space-4)',
                  color: 'var(--color-brand-primaryDark)',
                }}
              >
                {category.name}
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: 'var(--space-4)',
                }}
              >
                {category.products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          ))
      )}

      <p style={{ color: 'var(--color-neutral-400)', fontSize: 12 }}>
        Estado del servicio: {t.service.closed} · Jue/Vie/Sáb 18:30–22:30
      </p>
    </main>
  );
}

function ProductCard({ product }: { product: MenuProduct }) {
  return (
    <Link
      href={`/menu/${product.slug}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-neutral-0)',
        border: '1px solid var(--color-neutral-200)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div
        style={{
          aspectRatio: '4 / 3',
          background: product.image_url
            ? `center/cover url(${product.image_url})`
            : 'var(--color-neutral-100)',
        }}
      />
      <div
        style={{
          padding: 'var(--space-4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
          flex: 1,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{product.name}</h3>
        {product.description ? (
          <p
            style={{
              margin: 0,
              color: 'var(--color-neutral-500)',
              fontSize: 14,
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.description}
          </p>
        ) : null}
        <span
          style={{
            marginTop: 'auto',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--color-brand-primaryDark)',
            letterSpacing: '-0.01em',
          }}
        >
          {formatMxn(product.base_price_cents)}
        </span>
      </div>
    </Link>
  );
}

function EmptyMenuNotice() {
  return (
    <div
      style={{
        background: 'var(--color-brand-primary50)',
        border: '1px solid var(--color-brand-primary200)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        color: 'var(--color-brand-primary900)',
      }}
    >
      <strong style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
        Aún no hay productos disponibles.
      </strong>
      <p style={{ margin: 0, fontSize: 14 }}>
        El menú está cargado en la base de datos pero todos los items están marcados como
        no disponibles. Para mostrarlos, marca <code>available = true</code> en cada producto
        desde Supabase Studio.
      </p>
    </div>
  );
}
