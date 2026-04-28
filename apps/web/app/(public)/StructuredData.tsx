// Server component (no 'use client'). Emits two schema.org JSON-LD blocks
// in <head>:
//
// 1) Restaurant — gives Google rich-result eligibility for the
//    knowledge-panel on the right of search results: address, hours,
//    cuisine, accepted payments. Powers "find a restaurant near me"
//    + Maps cards.
// 2) WebSite — enables the sitelinks search box.
//
// Both reference the same SITE_URL so Google ties them together.
//
// Using <script type="application/ld+json"> with raw text — Next.js
// auto-deduplicates if the same JSON appears multiple times. We render
// it once at the layout level (or page level) per the page that wants
// the schema.

const SITE_URL = 'https://www.estacion33.com';
const PHONE = '+527331074642'; // dad's WhatsApp / phone, E.164

export function RestaurantJsonLd() {
  const restaurant = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${SITE_URL}/#restaurant`,
    name: 'Estación 33',
    description:
      'Hamburguesas, hot dogs y pasta italiana hechas al momento en Iguala, Gro.',
    url: SITE_URL,
    telephone: PHONE,
    image: `${SITE_URL}/icon-512`,
    logo: `${SITE_URL}/icon-512`,
    priceRange: '$$',
    servesCuisine: ['Hamburguesas', 'Hot dogs', 'Pasta italiana', 'Mexicana'],
    paymentAccepted: ['Cash', 'Credit Card', 'MercadoPago'],
    currenciesAccepted: 'MXN',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Plan de Iguala s/n, Col. Burócrata',
      addressLocality: 'Iguala de la Independencia',
      addressRegion: 'Guerrero',
      addressCountry: 'MX',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 18.347,
      longitude: -99.541,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Thursday', 'Friday', 'Saturday'],
        opens: '18:30',
        closes: '22:30',
      },
    ],
    hasMenu: `${SITE_URL}/menu`,
    acceptsReservations: 'True',
    sameAs: [
      // Add Instagram / Facebook URLs here when ready.
    ],
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Estación 33',
    inLanguage: 'es-MX',
    publisher: { '@id': `${SITE_URL}/#restaurant` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Stringify once, dangerouslySetInnerHTML to avoid React escaping
        // the JSON's quote characters into HTML entities.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurant) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
