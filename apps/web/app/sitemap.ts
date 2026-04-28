import type { MetadataRoute } from 'next';
import { getServerSupabase } from '@/lib/supabase/server';

// Dynamic sitemap. Static public routes + every available product slug.
// Next.js serves this at /sitemap.xml.
//
// We ping Supabase for product slugs at build/request time so adding a
// new dish in /admin/menu means it shows up in Google's index without
// us touching this file.

const SITE_URL = 'https://www.estacion33.com';

// 1 hour. Has to be a literal — Next.js's static analysis of route
// segment config doesn't evaluate BinaryExpressions.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/menu`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/reservar`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/iniciar-sesion`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Pull live product slugs so each detail page (/menu/<slug>) is
  // crawlable individually. Best-effort: if Supabase is unreachable
  // during a build, we still emit the static routes.
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = await getServerSupabase();
    const { data: products } = await supabase
      .from('products')
      .select('slug, updated_at')
      .eq('available', true);
    productRoutes = (products ?? []).map((p) => ({
      url: `${SITE_URL}/menu/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch {
    // Swallow — static routes are still useful.
  }

  return [...staticRoutes, ...productRoutes];
}
