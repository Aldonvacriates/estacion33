import type { Metadata } from 'next';

// /reservar/page.tsx is a client component (form state hooks), so we
// can't export Metadata from it. This server-only layout sits between
// (public)/layout.tsx and the form and contributes the page metadata.

export const metadata: Metadata = {
  title: 'Reservar mesa',
  description:
    'Reserva tu mesa en Estación 33, Iguala, Gro. Servicio jueves, viernes y sábado, 18:30 a 22:30. Confirmamos por WhatsApp.',
  alternates: { canonical: '/reservar' },
  openGraph: {
    title: 'Reservar mesa · Estación 33',
    description:
      'Servicio jueves, viernes y sábado · 18:30 a 22:30 · Plan de Iguala s/n, Col. Burócrata.',
    url: '/reservar',
  },
};

export default function ReservarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
