'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { selectCartCount, useCart } from '@/lib/cart';

type Props = {
  loggedIn: boolean;
};

/**
 * Mobile-only nav: a literal hamburger-the-food icon that taps open into a
 * full-screen black sheet with the public links. Hides itself on >=768px
 * (the desktop horizontal nav handles those widths).
 */
export function BurgerNav({ loggedIn }: Props) {
  const [open, setOpen] = useState(false);
  const cartCount = useCart(selectCartCount);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  // Close on Escape; lock body scroll while open so the page behind doesn't
  // scroll under the sheet.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="site-nav-burger"
        style={{
          width: 44,
          height: 44,
          padding: 0,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-brand-primary)',
          marginLeft: 'auto',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <BurgerIcon open={open} />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'var(--color-brand-ink)',
            color: 'var(--color-neutral-0)',
            display: 'flex',
            flexDirection: 'column',
            padding: 'var(--space-6) var(--space-5)',
            gap: 'var(--space-5)',
            animation: 'fadeIn 160ms ease',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 22,
                letterSpacing: '0.06em',
                color: 'var(--color-brand-primary)',
              }}
            >
              ESTACIÓN 33
            </span>
            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={() => setOpen(false)}
              style={{
                width: 44,
                height: 44,
                background: 'transparent',
                border: 'none',
                color: 'var(--color-brand-primary)',
                cursor: 'pointer',
                fontSize: 24,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>

          <nav
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
              marginTop: 'var(--space-4)',
            }}
          >
            <NavItem href="/menu" onSelect={() => setOpen(false)}>
              Menú
            </NavItem>
            <NavItem href="/reservar" onSelect={() => setOpen(false)}>
              Reservar
            </NavItem>
            <NavItem href="/carrito" onSelect={() => setOpen(false)}>
              Carrito
              {hydrated && cartCount > 0 ? (
                <span
                  style={{
                    marginLeft: 8,
                    background: 'var(--color-brand-chili)',
                    color: 'var(--color-neutral-0)',
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 999,
                  }}
                >
                  {cartCount}
                </span>
              ) : null}
            </NavItem>
            <NavItem
              href={loggedIn ? '/cuenta' : '/iniciar-sesion'}
              onSelect={() => setOpen(false)}
            >
              {loggedIn ? 'Cuenta' : 'Entrar'}
            </NavItem>
          </nav>

          <div style={{ marginTop: 'auto' }}>
            <Link
              href="/menu"
              onClick={() => setOpen(false)}
              style={{
                display: 'inline-flex',
                background: 'var(--color-brand-primary)',
                color: 'var(--color-brand-ink)',
                padding: '14px 28px',
                borderRadius: 999,
                fontFamily: 'var(--font-heading)',
                fontSize: 16,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontWeight: 400,
              }}
            >
              Pedir ahora
            </Link>
          </div>
        </div>
      ) : null}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

function NavItem({
  href,
  onSelect,
  children,
}: {
  href: string;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onSelect}
      style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 28,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: 'var(--color-neutral-0)',
        padding: '12px 0',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        textDecoration: 'none',
      }}
    >
      {children}
    </Link>
  );
}

/**
 * SVG of an actual burger — top bun (with sesame), tomato, lettuce ruffle,
 * patty, cheese drip, bottom bun. Animates open by sliding the buns apart and
 * rotating the patty.
 */
function BurgerIcon({ open }: { open: boolean }) {
  const t = open ? 'translate(0, -3) rotate(-2)' : 'translate(0, 0) rotate(0)';
  const b = open ? 'translate(0, 3) rotate(1)' : 'translate(0, 0) rotate(0)';
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      aria-hidden
      style={{ transition: 'all 200ms ease' }}
    >
      {/* Top bun */}
      <g style={{ transition: 'transform 200ms ease' }} transform={t}>
        <path
          d="M5 11 Q16 3, 27 11 L27 13 L5 13 Z"
          fill="#E5A85A"
          stroke="#0A0A0A"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Sesame seeds */}
        <ellipse cx="11" cy="8.5" rx="0.9" ry="0.5" fill="#FFF8E7" />
        <ellipse cx="16" cy="7" rx="0.9" ry="0.5" fill="#FFF8E7" />
        <ellipse cx="21" cy="8.5" rx="0.9" ry="0.5" fill="#FFF8E7" />
      </g>

      {/* Lettuce */}
      <path
        d="M4 14 Q7 12.5 10 14 T16 14 T22 14 T28 14 L28 16 L4 16 Z"
        fill="#7DA640"
        stroke="#0A0A0A"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Patty */}
      <rect
        x="5"
        y="16"
        width="22"
        height="3.5"
        fill="#5A2E0F"
        stroke="#0A0A0A"
        strokeWidth="1"
      />

      {/* Cheese with drip */}
      <path
        d="M5 19 L27 19 L27 20.5 Q23 22 19 20.5 T11 21 T5 20.5 Z"
        fill="#F4C320"
        stroke="#0A0A0A"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Bottom bun */}
      <g style={{ transition: 'transform 200ms ease' }} transform={b}>
        <path
          d="M5 21 L27 21 Q27 27 16 28 Q5 27 5 21 Z"
          fill="#D4924A"
          stroke="#0A0A0A"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
