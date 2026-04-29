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
    // SVG first for modern browsers; the 192/512 PNGs (rendered by
    // app/icon-192/route.tsx and app/icon-512/route.tsx) cover Safari +
    // older browsers. Apple touch icon is auto-generated from
    // app/apple-icon.tsx — don't override here or iOS will use the wrong art.
    icon: [
      { url: '/burger-favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512', type: 'image/png', sizes: '512x512' },
    ],
    // iOS launch screens. Each iPhone needs an exact-size splash PNG, and
    // iOS picks the right one via the `media` query. Without these the
    // PWA opens to a blank white screen for several seconds. The dynamic
    // /apple-splash route renders the burger + ESTACIÓN 33 mark at any
    // requested size on a brand-black background so they all stay on
    // brand without us shipping a dozen static PNGs.
    other: [
      // iPhone 15 Pro Max / 14 Pro Max / 15 Plus
      {
        rel: 'apple-touch-startup-image',
        url: '/apple-splash?w=1290&h=2796',
        media:
          '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      // iPhone 14 Pro / 15 / 15 Pro
      {
        rel: 'apple-touch-startup-image',
        url: '/apple-splash?w=1179&h=2556',
        media:
          '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      // iPhone 14 Plus / 13 Pro Max / 12 Pro Max
      {
        rel: 'apple-touch-startup-image',
        url: '/apple-splash?w=1284&h=2778',
        media:
          '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      // iPhone 13/14, 13 Pro, 12, 12 Pro
      {
        rel: 'apple-touch-startup-image',
        url: '/apple-splash?w=1170&h=2532',
        media:
          '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      // iPhone 11 Pro Max / XS Max
      {
        rel: 'apple-touch-startup-image',
        url: '/apple-splash?w=1242&h=2688',
        media:
          '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      // iPhone 11 / XR
      {
        rel: 'apple-touch-startup-image',
        url: '/apple-splash?w=828&h=1792',
        media:
          '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      // iPhone X / XS / 11 Pro / 12 mini / 13 mini
      {
        rel: 'apple-touch-startup-image',
        url: '/apple-splash?w=1125&h=2436',
        media:
          '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      // iPhone 8 / 7 / SE 2nd & 3rd gen
      {
        rel: 'apple-touch-startup-image',
        url: '/apple-splash?w=750&h=1334',
        media:
          '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      // Generic fallback (no media query) — iOS uses this if nothing else
      // matched, e.g. on devices we didn't enumerate explicitly.
      {
        rel: 'apple-touch-startup-image',
        url: '/apple-splash?w=1170&h=2532',
      },
    ],
  },
  // Tells iOS the PWA wants a full-screen, dark-translucent status bar on
  // launch (instead of the default white bar) so the splash blends with
  // our brand-black background.
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `🍔 ${SITE_NAME} — ¡A puro sabor!`,
    description: `Hamburguesas, hot dogs y pasta italiana en Iguala, Gro. 🌮 Pide en línea o reserva mesa · Jue/Vie/Sáb 18:30–22:30.`,
    // Explicit images entry so platforms that don't follow Next.js's
    // dynamic opengraph-image.tsx convention (some WhatsApp regions, older
    // iMessage previews, link unfurlers in Slack/Discord) still get a
    // proper preview image with declared dimensions.
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Estación 33 — ¡A puro sabor! Hamburguesas, hot dogs y pasta italiana en Iguala.',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `🍔 ${SITE_NAME} — ¡A puro sabor!`,
    description: `Hamburguesas, hot dogs y pasta italiana en Iguala, Gro. 🌮 Pide en línea o reserva mesa · Jue/Vie/Sáb 18:30–22:30.`,
    images: [`${SITE_URL}/opengraph-image`],
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
