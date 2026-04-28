import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatMxn } from '@estacion33/core';
import { getServerSupabase } from '@/lib/supabase/server';
import { ProductOrderForm } from './ProductOrderForm';

export const revalidate = 60;

// Per-product metadata so each /menu/<slug> URL gets its own title +
// description in Google. Fetches the product server-side; returns a
// neutral fallback for slugs that don't exist (notFound() handles the
// 404 in the page itself).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await getServerSupabase();
  const { data } = await supabase
    .from('products')
    .select('name, description, image_url')
    .eq('slug', slug)
    .single<{ name: string; description: string | null; image_url: string | null }>();

  if (!data) {
    return { title: 'Producto', alternates: { canonical: `/menu/${slug}` } };
  }

  const description =
    data.description ?? `Pide ${data.name} en Estación 33, Iguala, Gro.`;
  return {
    title: data.name,
    description,
    alternates: { canonical: `/menu/${slug}` },
    openGraph: {
      title: `${data.name} · Estación 33`,
      description,
      url: `/menu/${slug}`,
      images: data.image_url ? [{ url: data.image_url }] : undefined,
    },
  };
}

type ProductDetail = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  base_price_cents: number;
  image_url: string | null;
  available: boolean;
  category: { name: string; slug: string } | null;
  product_options: ProductOptionShape[];
};

export type ProductOptionShape = {
  id: string;
  name: string;
  required: boolean;
  multi: boolean;
  sort_order: number;
  option_values: {
    id: string;
    name: string;
    price_delta_cents: number;
    sort_order: number;
  }[];
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await getServerSupabase();

  const { data, error } = await supabase
    .from('products')
    .select(
      `
        id, slug, name, description, base_price_cents, image_url, available,
        category:categories(name, slug),
        product_options(
          id, name, required, multi, sort_order,
          option_values(id, name, price_delta_cents, sort_order)
        )
      `,
    )
    .eq('slug', slug)
    .single<ProductDetail>();

  if (error || !data) notFound();

  // Sort options + values for stable rendering.
  const sortedOptions = [...data.product_options]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((opt) => ({
      ...opt,
      option_values: [...opt.option_values].sort((a, b) => a.sort_order - b.sort_order),
    }));

  return (
    <main
      style={{
        maxWidth: 'var(--size-containerMd)',
        margin: '0 auto',
        paddingBottom: 96,
        background: 'var(--color-brand-cream)',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          aspectRatio: '4 / 3',
          background: data.image_url
            ? `center/cover url(${data.image_url})`
            : 'var(--color-brand-ink)',
          position: 'relative',
        }}
      >
        <Link
          href={data.category ? `/menu#${data.category.slug}` : '/menu'}
          style={{
            position: 'absolute',
            top: 'var(--space-4)',
            left: 'var(--space-4)',
            background: 'var(--color-brand-primary)',
            color: 'var(--color-brand-ink)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-pill)',
            fontFamily: 'var(--font-heading)',
            fontSize: 13,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontWeight: 400,
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          }}
        >
          ← {data.category?.name ?? 'Menú'}
        </Link>
      </div>

      <div
        style={{
          padding: 'var(--space-5)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        <header style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {data.category ? (
            <span
              style={{
                fontFamily: 'var(--font-script)',
                fontSize: 24,
                color: 'var(--color-brand-chili)',
                lineHeight: 1,
              }}
            >
              {data.category.name}
            </span>
          ) : null}
          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: 400,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'var(--color-brand-ink)',
              lineHeight: 1.05,
            }}
          >
            {data.name}
          </h1>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 28,
              fontWeight: 400,
              letterSpacing: '0.02em',
              color: 'var(--color-brand-ink)',
              background: 'var(--color-brand-primary)',
              alignSelf: 'flex-start',
              padding: '4px 14px',
            }}
          >
            {formatMxn(data.base_price_cents)}
          </span>
          {data.description ? (
            <p
              style={{
                margin: 0,
                color: 'var(--color-neutral-700)',
                fontSize: 16,
                lineHeight: 1.5,
              }}
            >
              {data.description}
            </p>
          ) : null}
        </header>

        {!data.available ? (
          <div
            style={{
              background: 'var(--color-semantic-warningBg)',
              color: 'var(--color-semantic-warningFg)',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              fontSize: 14,
            }}
          >
            Este producto no está disponible por el momento.
          </div>
        ) : null}

        <ProductOrderForm
          productId={data.id}
          productName={data.name}
          productSlug={data.slug}
          basePriceCents={data.base_price_cents}
          options={sortedOptions}
          available={data.available}
        />
      </div>
    </main>
  );
}
