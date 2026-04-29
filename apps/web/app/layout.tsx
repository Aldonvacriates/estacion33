import type { Metadata, Viewport } from 'next';
import { Inter, Bebas_Neue, Yellowtail } from 'next/font/google';
import { cssVariablesString } from '@estacion33/tokens/css';
import { CloudflareAnalytics } from './CloudflareAnalytics';
import { ClarityScript } from './ClarityScript';
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
    // iOS launch-screen <link> tags are rendered manually in the layout's
    // <head> below — Next's metadata.icons.other strips the `media`
    // attribute, and without it iOS can't pick the right splash.
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

// iOS PWA launch screens. Each iPhone needs an exact-pixel splash sized
// for its screen, picked via the `media` attribute. Next.js's
// metadata.icons.other API drops `media`, so we render these as raw
// <link> tags inside <head>. The /apple-splash route generates each PNG
// on demand from the burger SVG so we don't ship dozens of static files.
const APPLE_SPLASHES: { w: number; h: number; media: string; note: string }[] = [
  { w: 1290, h: 2796, media: '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)', note: 'iPhone 15 Pro Max / 14 Pro Max / 15 Plus' },
  { w: 1179, h: 2556, media: '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)', note: 'iPhone 15 Pro / 15 / 14 Pro' },
  { w: 1284, h: 2778, media: '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)', note: 'iPhone 14 Plus / 13 Pro Max / 12 Pro Max' },
  { w: 1170, h: 2532, media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)', note: 'iPhone 13 / 14 / 13 Pro / 12 / 12 Pro' },
  { w: 1242, h: 2688, media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)', note: 'iPhone 11 Pro Max / XS Max' },
  { w: 828, h: 1792, media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)', note: 'iPhone 11 / XR' },
  { w: 1125, h: 2436, media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)', note: 'iPhone X / XS / 11 Pro / 12 mini / 13 mini' },
  { w: 750, h: 1334, media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)', note: 'iPhone 8 / 7 / SE 2nd & 3rd gen' },
];

function AppleSplashLinks() {
  return (
    <>
      {APPLE_SPLASHES.map((s) => (
        <link
          key={`${s.w}x${s.h}`}
          rel="apple-touch-startup-image"
          href={`/apple-splash?w=${s.w}&h=${s.h}`}
          media={s.media}
        />
      ))}
      {/* Fallback with no media — iOS uses this if no other entry matched. */}
      <link rel="apple-touch-startup-image" href="/apple-splash?w=1179&h=2556" />
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${body.variable} ${heading.variable} ${script.variable}`}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: tokenVarsCss }} />
        <AppleSplashLinks />
      </head>
      <body suppressHydrationWarning style={{ fontFamily: 'var(--font-body)' }}>
        {children}
        {/* Cloudflare Web Analytics: cookieless pageviews + Core Web Vitals.
            Free, no event cap. Only renders if the beacon token env var is
            set, so dev builds and unconfigured environments are silent. */}
        <CloudflareAnalytics />
        {/* Microsoft Clarity: heatmaps + session recordings. Also free with
            no usage cap. Only renders if the project ID env var is set. */}
        <ClarityScript />
      </body>
    </html>
  );
}
