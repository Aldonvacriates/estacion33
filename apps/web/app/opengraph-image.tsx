import { ImageResponse } from 'next/og';

// Dynamic Open Graph image generated at request time. Next.js automatically
// uses this for `og:image` and `twitter:image` meta tags. WhatsApp, Facebook,
// Twitter, iMessage, etc. fetch this and render the link preview.
//
// 1200×630 is the social-platform standard. Keep all dimensions explicit so
// the layout doesn't depend on font metrics.

export const runtime = 'edge';
export const alt = 'Estación 33 — ¡A puro sabor!';
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
          flexDirection: 'column',
          background:
            'radial-gradient(ellipse at 30% 40%, #3A1F0A 0%, #0A0A0A 70%), #0A0A0A',
          color: '#FFFFFF',
          fontFamily: 'system-ui, sans-serif',
          padding: 64,
          position: 'relative',
        }}
      >
        {/* Yellow brand mark + city */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 36,
              letterSpacing: '0.12em',
              color: '#F4C320',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            ESTACIÓN 33
          </div>
          <div
            style={{
              fontSize: 18,
              letterSpacing: '0.16em',
              color: '#F4C320',
              opacity: 0.7,
            }}
          >
            · IGUALA, GRO.
          </div>
        </div>

        {/* Big tagline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 'auto',
            gap: 18,
          }}
        >
          <div
            style={{
              alignSelf: 'flex-start',
              background: '#F4C320',
              color: '#0A0A0A',
              padding: '18px 36px',
              fontSize: 80,
              fontWeight: 800,
              lineHeight: 1,
              fontStyle: 'italic',
              letterSpacing: '-0.02em',
            }}
          >
            ¡A puro sabor!
          </div>
          <div
            style={{
              fontSize: 32,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              fontWeight: 600,
            }}
          >
            Hamburguesas · Hot dogs · Pasta italiana
          </div>
          <div
            style={{
              fontSize: 22,
              color: '#A1A1AA',
              marginTop: 4,
            }}
          >
            Servicio jueves · viernes · sábado · 18:30 — 22:30
          </div>
        </div>

        {/* Yellow accent stripe top-right */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 8,
            height: '100%',
            background: '#F4C320',
          }}
        />
        {/* Chili red dot accent */}
        <div
          style={{
            position: 'absolute',
            top: 80,
            right: 80,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#D62828',
          }}
        />
      </div>
    ),
    size,
  );
}
