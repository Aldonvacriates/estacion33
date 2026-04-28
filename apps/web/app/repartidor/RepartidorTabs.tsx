'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Item = { href: string; label: string };

export function RepartidorTabs({ items }: { items: Item[] }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Repartidor"
      className="no-scrollbar"
      style={{
        display: 'flex',
        gap: 0,
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        background: 'var(--color-brand-ink)',
        borderTop: '1px solid rgba(244,195,32,0.18)',
      }}
    >
      {items.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== '/repartidor' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            style={{
              flex: '0 0 auto',
              padding: '12px 18px',
              fontFamily: 'var(--font-heading)',
              fontSize: 13,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: active
                ? 'var(--color-brand-primary)'
                : 'var(--color-neutral-300)',
              textDecoration: 'none',
              borderBottom: `3px solid ${
                active ? 'var(--color-brand-primary)' : 'transparent'
              }`,
              whiteSpace: 'nowrap',
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Same burger mark used in admin + favicon. Reused here for brand consistency. */
export function RepartidorBurgerMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden>
      <path
        d="M5 11 Q16 3, 27 11 L27 13 L5 13 Z"
        fill="#E5A85A"
        stroke="#0A0A0A"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <ellipse cx="11" cy="8.5" rx="0.9" ry="0.5" fill="#FFF8E7" />
      <ellipse cx="16" cy="7" rx="0.9" ry="0.5" fill="#FFF8E7" />
      <ellipse cx="21" cy="8.5" rx="0.9" ry="0.5" fill="#FFF8E7" />
      <path
        d="M4 14 Q7 12.5 10 14 T16 14 T22 14 T28 14 L28 16 L4 16 Z"
        fill="#7DA640"
        stroke="#0A0A0A"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <rect x="5" y="16" width="22" height="3.5" fill="#5A2E0F" stroke="#0A0A0A" strokeWidth="1" />
      <path
        d="M5 19 L27 19 L27 20.5 Q23 22 19 20.5 T11 21 T5 20.5 Z"
        fill="#F4C320"
        stroke="#0A0A0A"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d="M5 21 L27 21 Q27 27 16 28 Q5 27 5 21 Z"
        fill="#D4924A"
        stroke="#0A0A0A"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
