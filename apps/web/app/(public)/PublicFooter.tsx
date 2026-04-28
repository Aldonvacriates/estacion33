'use client';

import { usePathname } from 'next/navigation';

// Routes where a sticky bottom CTA already occupies the bottom edge of the
// viewport — showing the global footer there causes a visual stack of two
// dark bars. We hide the footer on those routes only.
const HIDE_ON: RegExp[] = [
  /^\/menu\/[^/]+$/, // product detail (/menu/<slug>) has the Agregar bar
  /^\/carrito$/, // cart has the Continuar al pago bar
];

type Props = {
  children: React.ReactNode;
};

/**
 * Wraps the footer in a pathname-aware visibility check. Footer JSX is
 * unchanged — see (public)/layout.tsx for the actual markup.
 */
export function PublicFooter({ children }: Props) {
  const pathname = usePathname();
  const hide = HIDE_ON.some((re) => re.test(pathname));
  if (hide) return null;
  return <>{children}</>;
}
