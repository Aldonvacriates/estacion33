import type { Metadata } from 'next';
import { cssVariablesString } from '@estacion33/tokens/css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Estación 33',
  description: 'Hamburguesas, snacks y más. Plan de Iguala s/n, Col. Burócrata.',
  icons: { icon: '/favicon.png' },
};

const tokenVarsCss = cssVariablesString(':root');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: tokenVarsCss }} />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
