import { ImageResponse } from 'next/og';

// Dynamic Open Graph image generated at request time. Next.js automatically
// uses this for `og:image` and `twitter:image` meta tags. WhatsApp,
// Facebook, Instagram, iMessage, Discord, Slack — they all fetch this and
// render the link preview.
//
// 1200×630 is the social-platform standard. Two-column composition: brand
// + tagline on the left, the burger mark on the right. Designed to read
// cleanly even when WhatsApp crops it to a 4:3 thumbnail in a chat list.

export const runtime = 'edge';
export const alt = 'Estación 33 — ¡A puro sabor! Hamburguesas, hot dogs y pasta italiana en Iguala.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background:
            'radial-gradient(ellipse at 75% 50%, #5A2E0F 0%, #1A0A04 55%, #0A0A0A 100%)',
          color: '#FFFFFF',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Yellow vertical accent on left edge */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 12,
            height: '100%',
            background: '#F4C320',
          }}
        />

        {/* Left column: brand + tagline + meta */}
        <div
          style={{
            flex: '1 1 60%',
            display: 'flex',
            flexDirection: 'column',
            padding: '64px 0 64px 88px',
            justifyContent: 'space-between',
          }}
        >
          {/* Top: brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div
              style={{
                fontSize: 40,
                letterSpacing: '0.14em',
                color: '#F4C320',
                textTransform: 'uppercase',
                fontWeight: 800,
              }}
            >
              ESTACIÓN 33
            </div>
            <div
              style={{
                fontSize: 18,
                letterSpacing: '0.18em',
                color: '#F4C320',
                opacity: 0.65,
                textTransform: 'uppercase',
              }}
            >
              Iguala, Gro. · Desde 2024
            </div>
          </div>

          {/* Big yellow tagline pill */}
          <div
            style={{
              alignSelf: 'flex-start',
              background: '#F4C320',
              color: '#0A0A0A',
              padding: '20px 40px',
              fontSize: 92,
              fontWeight: 900,
              lineHeight: 0.95,
              fontStyle: 'italic',
              letterSpacing: '-0.025em',
              boxShadow: '8px 8px 0 #D62828',
            }}
          >
            ¡A puro sabor!
          </div>

          {/* Bottom: meta */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div
              style={{
                fontSize: 30,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                fontWeight: 700,
              }}
            >
              Hamburguesas · Hot dogs · Pasta
            </div>
            <div
              style={{
                fontSize: 22,
                color: '#E5A85A',
                fontWeight: 500,
              }}
            >
              Jueves · Viernes · Sábado · 18:30 — 22:30
            </div>
          </div>
        </div>

        {/* Right column: big burger illustration */}
        <div
          style={{
            flex: '1 1 40%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 40,
          }}
        >
          <svg width="380" height="380" viewBox="0 0 32 32">
            {/* top bun */}
            <path
              d="M5 11 Q16 3, 27 11 L27 13 L5 13 Z"
              fill="#E5A85A"
              stroke="#0A0A0A"
              strokeWidth="1.2"
            />
            {/* sesame seeds */}
            <ellipse cx="11" cy="8.5" rx="0.9" ry="0.5" fill="#FFF8E7" />
            <ellipse cx="16" cy="7" rx="0.9" ry="0.5" fill="#FFF8E7" />
            <ellipse cx="21" cy="8.5" rx="0.9" ry="0.5" fill="#FFF8E7" />
            {/* lettuce */}
            <path
              d="M4 14 Q7 12.5 10 14 T16 14 T22 14 T28 14 L28 16 L4 16 Z"
              fill="#7DA640"
              stroke="#0A0A0A"
              strokeWidth="1"
            />
            {/* patty */}
            <rect
              x="5"
              y="16"
              width="22"
              height="3.5"
              fill="#5A2E0F"
              stroke="#0A0A0A"
              strokeWidth="1"
            />
            {/* cheese */}
            <path
              d="M5 19 L27 19 L27 20.5 Q23 22 19 20.5 T11 21 T5 20.5 Z"
              fill="#F4C320"
              stroke="#0A0A0A"
              strokeWidth="1"
            />
            {/* bottom bun */}
            <path
              d="M5 21 L27 21 Q27 27 16 28 Q5 27 5 21 Z"
              fill="#D4924A"
              stroke="#0A0A0A"
              strokeWidth="1.2"
            />
          </svg>
        </div>

        {/* Chili dot accent */}
        <div
          style={{
            position: 'absolute',
            top: 60,
            right: 60,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: '#D62828',
          }}
        />
      </div>
    ),
    size,
  );
}
