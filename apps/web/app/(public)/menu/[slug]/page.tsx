import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatMxn } from '@estacion33/core';
import { getServerSupabase } from '@/lib/supabase/server';
import { ProductOrderForm } from './ProductOrderForm';

export const revalidate = 60;

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
      }}
    >
      <div
        style={{
          aspectRatio: '4 / 3',
          background: data.image_url
            ? `center/cover url(${data.image_url})`
            : 'var(--color-neutral-100)',
          position: 'relative',
        }}
      >
        <Link
          href={data.category ? `/menu#${data.category.slug}` : '/menu'}
          style={{
            position: 'absolute',
            top: 'var(--space-4)',
            left: 'var(--space-4)',
            background: 'rgba(15,15,15,0.55)',
            color: 'var(--color-neutral-0)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-pill)',
            fontSize: 14,
            fontWeight: 500,
            textDecoration: 'none',
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
          <h1
            style={{
              margin: 0,
              fontSize: 32,
              fontWeight: 700,
              color: 'var(--color-brand-primaryDark)',
              letterSpacing: '-0.02em',
            }}
          >
            {data.name}
          </h1>
          <span
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: 'var(--color-brand-primary)',
            }}
          >
            {formatMxn(data.base_price_cents)}
          </span>
          {data.description ? (
            <p
              style={{
                margin: 0,
                color: 'var(--color-neutral-500)',
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
          basePriceCents={data.base_price_cents}
          options={sortedOptions}
          available={data.available}
        />
      </div>
    </main>
  );
}
