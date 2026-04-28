import type { MetadataRoute } from 'next';

// Allow all crawlers across the whole public surface, but explicitly
// disallow the authenticated areas. Even though these routes redirect
// unauthenticated users, listing them in robots saves a crawl + makes
// the boundary obvious in Search Console.

const SITE_URL = 'https://www.estacion33.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/repartidor',
          '/repartidor/*',
          '/cuenta',
          '/cuenta/*',
          '/auth/*',
          '/api/*',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
