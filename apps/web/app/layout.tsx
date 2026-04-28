import type { Metadata } from 'next';
import { Inter, Bebas_Neue, Yellowtail } from 'next/font/google';
import { cssVariablesString } from '@estacion33/tokens/css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Estación 33',
  description: 'Hamburguesas, snacks y más. Plan de Iguala s/n, Col. Burócrata.',
  icons: {
    // SVG first for modern browsers, PNG fallback for Safari + iOS bookmarks.
    icon: [
      { url: '/burger-favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/favicon.png',
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
