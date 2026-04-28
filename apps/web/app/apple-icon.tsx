import { ImageResponse } from 'next/og';

// Apple touch icon — used by iOS Safari "Add to Home Screen" because iOS
// ignores manifest icons and looks for <link rel="apple-touch-icon"> with
// a 180×180 PNG. Next.js auto-generates that <link> based on this file.
//
// We re-render the burger SVG so the home screen icon matches the favicon
// + mobile nav toggle instead of shipping a separate raster.

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A0A0A',
          borderRadius: 32,
        }}
      >
        <svg
          width="148"
          height="148"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 11 Q16 3, 27 11 L27 13 L5 13 Z"
            fill="#E5A85A"
            stroke="#0A0A0A"
            strokeWidth="1.2"
          />
          <ellipse cx="11" cy="8.5" rx="0.9" ry="0.5" fill="#FFF8E7" />
          <ellipse cx="16" cy="7" rx="0.9" ry="0.5" fill="#FFF8E7" />
          <ellipse cx="21" cy="8.5" rx="0.9" ry="0.5" fill="#FFF8E7" />
          <path
            d="M4 14 Q7 12.5 10 14 T16 14 T22 14 T28 14 L28 16 L4 16 Z"
            fill="#7DA640"
            stroke="#0A0A0A"
            strokeWidth="1"
          />
          <rect
            x="5"
            y="16"
            width="22"
            height="3.5"
            fill="#5A2E0F"
            stroke="#0A0A0A"
            strokeWidth="1"
          />
          <path
            d="M5 19 L27 19 L27 20.5 Q23 22 19 20.5 T11 21 T5 20.5 Z"
            fill="#F4C320"
            stroke="#0A0A0A"
            strokeWidth="1"
          />
          <path
            d="M5 21 L27 21 Q27 27 16 28 Q5 27 5 21 Z"
            fill="#D4924A"
            stroke="#0A0A0A"
            strokeWidth="1.2"
          />
        </svg>
      </div>
    ),
    size,
  );
}
