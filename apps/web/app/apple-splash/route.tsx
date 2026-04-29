import { ImageResponse } from 'next/og';

// iOS PWA launch screens. Unlike Android (which auto-builds a splash from
// the manifest's icon + background_color), iOS only shows a splash if you
// give it a `<link rel="apple-touch-startup-image">` PNG sized exactly for
// the device's screen. Without those, the user just sees a white blank
// during the cold-start window — which on slower connections can read as
// "the app froze".
//
// We render the splash dynamically via this route so we don't have to
// commit a dozen pre-rendered PNGs. The caller picks the size with
// `?w=1290&h=2796` and we draw the burger mark centered on brand black.

export const runtime = 'edge';
export const contentType = 'image/png';

const MAX_W = 2000;
const MAX_H = 3000;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const width = clamp(Number(url.searchParams.get('w') ?? '1170'), 320, MAX_W);
  const height = clamp(Number(url.searchParams.get('h') ?? '2532'), 320, MAX_H);

  // The burger icon takes ~40% of the shorter dimension so it has plenty of
  // breathing room on tall phones AND looks centered on shorter ones.
  const iconSize = Math.round(Math.min(width, height) * 0.4);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0A0A0A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: Math.round(iconSize * 0.18),
        }}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 32 32"
        >
          <path d="M5 11 Q16 3, 27 11 L27 13 L5 13 Z" fill="#E5A85A" stroke="#0A0A0A" strokeWidth="1.2" />
          <ellipse cx="11" cy="8.5" rx="0.9" ry="0.5" fill="#FFF8E7" />
          <ellipse cx="16" cy="7" rx="0.9" ry="0.5" fill="#FFF8E7" />
          <ellipse cx="21" cy="8.5" rx="0.9" ry="0.5" fill="#FFF8E7" />
          <path d="M4 14 Q7 12.5 10 14 T16 14 T22 14 T28 14 L28 16 L4 16 Z" fill="#7DA640" stroke="#0A0A0A" strokeWidth="1" />
          <rect x="5" y="16" width="22" height="3.5" fill="#5A2E0F" stroke="#0A0A0A" strokeWidth="1" />
          <path d="M5 19 L27 19 L27 20.5 Q23 22 19 20.5 T11 21 T5 20.5 Z" fill="#F4C320" stroke="#0A0A0A" strokeWidth="1" />
          <path d="M5 21 L27 21 Q27 27 16 28 Q5 27 5 21 Z" fill="#D4924A" stroke="#0A0A0A" strokeWidth="1.2" />
        </svg>
        <div
          style={{
            color: '#F4C320',
            fontFamily: 'system-ui, sans-serif',
            fontSize: Math.round(iconSize * 0.13),
            fontWeight: 800,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          ESTACIÓN 33
        </div>
      </div>
    ),
    { width, height },
  );
}

function clamp(n: number, min: number, max: number): number {
  if (Number.isNaN(n)) return min;
  return Math.min(Math.max(n, min), max);
}
