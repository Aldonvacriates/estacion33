'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { selectCartCount, useCart } from '@/lib/cart';

export function CartLink() {
  const count = useCart(selectCartCount);

  // Avoid hydration mismatch — store is empty on server.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <Link
      href="/carrito"
      style={{
        color: 'inherit',
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      Carrito
      {hydrated && count > 0 ? (
        <span
          aria-label={`${count} artículos en el carrito`}
          style={{
            background: 'var(--color-brand-secondary)',
            color: 'var(--color-neutral-0)',
            fontSize: 11,
            fontWeight: 700,
            minWidth: 18,
            height: 18,
            padding: '0 5px',
            borderRadius: 'var(--radius-pill)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}
