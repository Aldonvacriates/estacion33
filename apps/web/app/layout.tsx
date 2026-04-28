import type { Metadata, Viewport } from 'next';
import { Inter, Bebas_Neue, Yellowtail } from 'next/font/google';
import { cssVariablesString } from '@estacion33/tokens/css';
import './globals.css';

export const viewport: Viewport = {
  // Next.js auto-injects width=device-width by default; we override the theme
  // color so iOS Safari paints the URL bar in our brand black.
  themeColor: '#0A0A0A',
};

const SITE_URL = 'https://www.estacion33.com';
const SITE_NAME = 'Estación 33';
const DESCRIPTION =
  'Hamburguesas, hot dogs y pasta italiana en Iguala, Gro. Servicio jueves, viernes y sábado · Plan de Iguala s/n, Col. Burócrata.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · Hamburguesas y más en Iguala, Gro.`,
    template: `%s · ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'hamburguesas Iguala',
    'hot dogs Iguala',
    'restaurante Iguala Guerrero',
    'comida a domicilio Iguala',
    'pasta italiana Iguala',
    'Estación 33',
    'burgers Iguala',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'food',
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    // SVG first for modern browsers, PNG fallback for Safari + iOS bookmarks.
    icon: [
      { url: '/burger-favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ¡A puro sabor!`,
    description: DESCRIPTION,
    // Static fallback. The dynamic 1200×630 image rendered by
    // app/opengraph-image.tsx automatically takes precedence at runtime.
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — ¡A puro sabor!`,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const heading = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-heading',
  display: 'swap',
});

const script = Yellowtail({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-script',
  display: 'swap',
});

const tokenVarsCss = cssVariablesString(':root');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${body.variable} ${heading.variable} ${script.variable}`}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: tokenVarsCss }} />
      </head>
      <body suppressHydrationWarning style={{ fontFamily: 'var(--font-body)' }}>
        {children}
      </body>
    </html>
  );
}
