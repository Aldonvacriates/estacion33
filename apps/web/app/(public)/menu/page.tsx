import type { Metadata } from 'next';
import Link from 'next/link';
import { formatMxn, i18n } from '@estacion33/core';
import { getServerSupabase } from '@/lib/supabase/server';
import { MenuSwipeNav } from './MenuSwipeNav';

export const revalidate = 60; // re-fetch menu every 60s

export const metadata: Metadata = {
  title: 'Menú',
  description:
    'Hamburguesas, hot dogs, pasta italiana, ensaladas y bebidas. Más de 40 platillos hechos al momento en Estación 33, Iguala, Gro.',
  alternates: { canonical: '/menu' },
  openGraph: {
    title: 'Menú · Estación 33',
    description:
      'Hamburguesas, hot dogs y pasta italiana en Iguala, Gro. Servicio jueves, viernes y sábado.',
    url: '/menu',
  },
};

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
        .select(
          'id, slug, category_id, name, description, base_price_cents, image_url, sort_order',
        )
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

  const visible = grouped.filter((c) => c.products.length > 0);
  const totalAvailable = visible.reduce((sum, c) => sum + c.products.length, 0);

  return (
    <main style={{ background: 'var(--color-brand-cream)', minHeight: '100vh' }}>
      {/* Page heading on cream */}
      <header
        style={{
          padding: 'var(--space-6) var(--space-5) var(--space-4)',
          textAlign: 'center',
          maxWidth: 'var(--size-containerMd, 800px)',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(36px, 6vw, 56px)',
            color: 'var(--color-brand-ink)',
            lineHeight: 1,
          }}
        >
          Nuestro menú
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(22px, 3vw, 32px)',
            fontWeight: 400,
            letterSpacing: '0.06em',
            margin: '8px 0 6px',
            color: 'var(--color-brand-ink)',
            textTransform: 'uppercase',
          }}
        >
          Hamburguesas, hot dogs, pasta y más
        </h1>
        <p
          style={{
            margin: 0,
            color: 'var(--color-neutral-700)',
            fontSize: 14,
          }}
        >
          Servicio jueves, viernes y sábado · 18:30 — 22:30 · Precios en MXN
        </p>
      </header>

      {totalAvailable === 0 ? (
        <div
          style={{
            maxWidth: 'var(--size-containerMd, 800px)',
            margin: '0 auto',
            padding: 'var(--space-5)',
          }}
        >
          <EmptyMenuNotice />
        </div>
      ) : (
        <>
          <CategoryChips categories={visible} />
          <MenuSwipeNav slugs={visible.map((c) => c.slug)} />

          <div
            style={{
              maxWidth: 'var(--size-containerMd, 800px)',
              margin: '0 auto',
              padding: '0 var(--space-5) var(--space-7)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-7)',
            }}
          >
            {visible.map((category) => (
              <section key={category.id} id={category.slug} style={{ scrollMarginTop: 96 }}>
                <SectionHeader name={category.name} />
                <ul
                  style={{
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {category.products.map((p) => (
                    <ProductRow key={p.id} product={p} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}

      <p
        style={{
          textAlign: 'center',
          color: 'var(--color-neutral-500)',
          fontSize: 12,
          padding: 'var(--space-5) var(--space-5) var(--space-7)',
        }}
      >
        Estado del servicio: {t.service.closed} · Jue/Vie/Sáb 18:30–22:30
      </p>
    </main>
  );
}

function CategoryChips({ categories }: { categories: MenuCategory[] }) {
  return (
    <nav
      aria-label="Categorías del menú"
      style={{
        position: 'sticky',
        top: 'var(--size-appBar)',
        zIndex: 10,
        background: 'var(--color-brand-ink)',
        borderTop: '2px solid var(--color-brand-primary)',
        borderBottom: '2px solid var(--color-brand-primary)',
      }}
    >
      <div
        className="no-scrollbar"
        style={{
          maxWidth: 'var(--size-containerLg, 1100px)',
          margin: '0 auto',
          padding: '12px var(--space-5)',
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {categories.map((c) => (
          <a
            key={c.id}
            href={`#${c.slug}`}
            style={{
              flex: '0 0 auto',
              padding: '6px 14px',
              borderRadius: 999,
              fontFamily: 'var(--font-heading)',
              fontSize: 13,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--color-brand-primary)',
              border: '1.5px solid var(--color-brand-primary)',
              background: 'transparent',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {c.name}
          </a>
        ))}
      </div>
    </nav>
  );
}

function SectionHeader({ name }: { name: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
      <h2
        style={{
          fontFamily: 'var(--font-script)',
          fontSize: 'clamp(32px, 5vw, 44px)',
          color: 'var(--color-brand-primary)',
          margin: 0,
          lineHeight: 1,
          textShadow: '1px 1px 0 var(--color-brand-ink)',
        }}
      >
        {name}
      </h2>
      <svg
        width="120"
        height="10"
        viewBox="0 0 120 10"
        aria-hidden
        style={{ marginTop: 4 }}
      >
        <path
          d="M2 6 Q30 1, 60 5 T118 5"
          stroke="var(--color-brand-ink)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

function ProductRow({ product }: { product: MenuProduct }) {
  return (
    <li
      style={{
        borderBottom: '1px dashed var(--color-neutral-300)',
        padding: '14px 0',
      }}
    >
      <Link
        href={`/menu/${product.slug}`}
        style={{
          display: 'flex',
          gap: 14,
          color: 'inherit',
          textDecoration: 'none',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            flex: '0 0 auto',
            width: 84,
            height: 84,
            borderRadius: 12,
            background: product.image_url
              ? `center/cover url(${product.image_url})`
              : 'var(--color-brand-ink)',
            border: '2px solid var(--color-brand-ink)',
          }}
          aria-hidden
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 8,
              marginBottom: 4,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 18,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                fontWeight: 400,
                color: 'var(--color-brand-ink)',
                lineHeight: 1.1,
              }}
            >
              {product.name}
            </span>
            <span
              aria-hidden
              style={{
                flex: 1,
                borderBottom: '2px dotted var(--color-neutral-400)',
                transform: 'translateY(-4px)',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 18,
                fontWeight: 400,
                letterSpacing: '0.02em',
                color: 'var(--color-brand-ink)',
                whiteSpace: 'nowrap',
              }}
            >
              {formatMxn(product.base_price_cents)}
            </span>
          </div>
          {product.description ? (
            <p
              style={{
                margin: 0,
                color: 'var(--color-neutral-700)',
                fontSize: 13,
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {product.description}
            </p>
          ) : null}
        </div>
      </Link>
    </li>
  );
}

function EmptyMenuNotice() {
  return (
    <div
      style={{
        background: 'var(--color-brand-primary50)',
        border: '2px solid var(--color-brand-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        color: 'var(--color-brand-ink)',
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
