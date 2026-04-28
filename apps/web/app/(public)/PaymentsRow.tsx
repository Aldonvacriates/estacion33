// Footer trust strip — "Transacciones con Mercado Pago + Visa + Mastercard
// + Efectivo". All artwork is inline SVG so we don't need to ship images
// or worry about licensed brand assets at runtime; the marks are
// recognizable approximations sufficient as a payment-method indicator,
// not a claim of ownership.

export function PaymentsRow() {
  return (
    <div
      style={{
        marginTop: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 10,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--color-neutral-400)',
        }}
      >
        Transacciones con
      </span>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <MercadoPagoBadge />
        <VisaBadge />
        <MastercardBadge />
        <EfectivoBadge />
      </div>
    </div>
  );
}

function MercadoPagoBadge() {
  return (
    <span
      role="img"
      aria-label="Mercado Pago"
      title="Mercado Pago"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: '#FFFFFF',
        boxShadow: '0 1px 2px rgba(0,0,0,0.18)',
      }}
    >
      <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden>
        {/* Cyan oval — represents the MP "handshake" pill */}
        <ellipse cx="24" cy="20" rx="18" ry="9" fill="#009EE3" />
        {/* Stylized handshake — two clasped hands as a continuous arc */}
        <path
          d="M9 20 Q14 14 19 18 Q22 21 24 20 Q26 19 29 18 Q34 14 39 20"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="13" cy="20" r="2.6" fill="#FFFFFF" />
        <circle cx="35" cy="20" r="2.6" fill="#FFFFFF" />
        {/* Wordmark below the pill */}
        <text
          x="24"
          y="36"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
          fontSize="7"
          fontWeight="700"
          fill="#1A237E"
          letterSpacing="-0.2"
        >
          mercado
        </text>
        <text
          x="24"
          y="44"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
          fontSize="7"
          fontWeight="700"
          fill="#1A237E"
          letterSpacing="-0.2"
        >
          pago
        </text>
      </svg>
    </span>
  );
}

function VisaBadge() {
  return (
    <span
      role="img"
      aria-label="Visa"
      title="Visa"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 56,
        height: 36,
        background: '#1A1F71',
        borderRadius: 6,
        boxShadow: '0 1px 2px rgba(0,0,0,0.18)',
      }}
    >
      <svg width="44" height="20" viewBox="0 0 44 20" aria-hidden>
        <text
          x="22"
          y="16"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
          fontSize="16"
          fontWeight="900"
          fontStyle="italic"
          fill="#FFFFFF"
          letterSpacing="0.5"
        >
          VISA
        </text>
        <rect x="6" y="17" width="32" height="1.4" fill="#F7B600" />
      </svg>
    </span>
  );
}

function MastercardBadge() {
  return (
    <span
      role="img"
      aria-label="Mastercard"
      title="Mastercard"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 56,
        height: 36,
        background: '#FFFFFF',
        borderRadius: 6,
        boxShadow: '0 1px 2px rgba(0,0,0,0.18)',
      }}
    >
      <svg width="44" height="26" viewBox="0 0 44 26" aria-hidden>
        <circle cx="17" cy="13" r="10" fill="#EB001B" />
        <circle cx="27" cy="13" r="10" fill="#F79E1B" fillOpacity="0.92" />
        {/* Overlap region — the trademark shared crescent */}
        <path
          d="M22 5 a10 10 0 0 1 0 16 a10 10 0 0 1 0 -16 z"
          fill="#FF5F00"
        />
      </svg>
    </span>
  );
}

function EfectivoBadge() {
  return (
    <span
      role="img"
      aria-label="Efectivo"
      title="Pago en efectivo"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: 36,
        padding: '0 12px',
        background: 'var(--color-brand-primary)',
        color: 'var(--color-brand-ink)',
        borderRadius: 6,
        boxShadow: '0 1px 2px rgba(0,0,0,0.18)',
        fontFamily: 'var(--font-heading)',
        fontSize: 12,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
        <rect
          x="2"
          y="6"
          width="20"
          height="12"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
      Efectivo
    </span>
  );
}
