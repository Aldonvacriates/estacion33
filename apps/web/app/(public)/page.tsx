import Link from 'next/link';
import { getServiceWindow, i18n } from '@estacion33/core';

export default function HomePage() {
  const window = getServiceWindow();
  const t = i18n.es;

  const statusLabel: Record<typeof window.status, string> = {
    open: t.service.open,
    closed: t.service.closed,
    pre_open: t.service.preOpen,
    last_call: t.service.lastCall,
  };

  return (
    <main style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Mobile: stack hero (photo on top, content below). Desktop: two columns. */}
      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            min-height: 0 !important;
          }
          .hero-photo {
            min-height: 0 !important;
            aspect-ratio: 4 / 5;
          }
        }
      `}</style>
      {/* Hero — portrait burger photo right, yellow band + tagline left.
          On mobile: photo on top, content below. */}
      <section
        style={{
          background: 'var(--color-brand-ink)',
          color: 'var(--color-neutral-0)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            alignItems: 'stretch',
            maxWidth: 'var(--size-containerLg, 1200px)',
            margin: '0 auto',
            minHeight: 'clamp(420px, 70vh, 720px)',
          }}
          className="hero-grid"
        >
          {/* Left: tagline */}
          <div
            style={{
              padding: 'var(--space-7) var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 'var(--space-4)',
              order: 2,
            }}
            className="hero-text"
          >
            <div
              style={{
                background: 'var(--color-brand-primary)',
                color: 'var(--color-brand-ink)',
                padding: '20px 28px',
                alignSelf: 'flex-start',
                maxWidth: 460,
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-script)',
                  fontSize: 'clamp(36px, 6vw, 56px)',
                  lineHeight: 1.05,
                  marginBottom: 6,
                }}
              >
                ¡A puro sabor!
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(13px, 2vw, 16px)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 400,
                }}
              >
                Hamburguesas, hot dogs y pasta italiana — Iguala, Gro.
              </div>
            </div>
            <p
              style={{
                margin: 0,
                color: 'var(--color-neutral-200, #E4E4E7)',
                fontSize: 'clamp(15px, 1.4vw, 17px)',
                lineHeight: 1.55,
                maxWidth: 460,
              }}
            >
              Hechas al momento, con ingredientes frescos. Servicio jueves, viernes
              y sábado en Plan de Iguala s/n, Col. Burócrata.
            </p>
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-3)',
                flexWrap: 'wrap',
                marginTop: 4,
              }}
            >
              <Link href="/menu" style={primaryCta}>Ver menú</Link>
              <Link href="/reservar" style={secondaryCtaOnDark}>Reservar mesa</Link>
            </div>
          </div>

          {/* Right: looping video (autoplay muted) with burger photo as poster */}
          <div
            style={{
              position: 'relative',
              minHeight: 360,
              order: 1,
              overflow: 'hidden',
            }}
            className="hero-photo"
          >
            <video
              src="/figma-make/estacion33.mp4"
              poster="/figma-make/food-4efbb2f9.png"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Hamburguesa Estación 33 a la parrilla"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          </div>
        </div>
      </section>

      {/* Three info cards on dark, yellow circle icons */}
      <section
        style={{
          background: 'var(--color-brand-ink)',
          padding: 'var(--space-6) var(--space-5)',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--size-containerLg, 1100px)',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-4)',
          }}
        >
          <InfoCard
            iconLabel="Reloj"
            icon={<ClockIcon />}
            title="Servicio"
            line1="Jue · Vie · Sáb"
            line2="18:30 — 22:30"
            badge={statusLabel[window.status]}
          />
          <InfoCard
            iconLabel="Ubicación"
            icon={<PinIcon />}
            title="Domicilio"
            line1="Llega a primera hora"
            line2="$30 envío adicional"
          />
          <InfoCard
            iconLabel="Teléfono"
            icon={<PhoneIcon />}
            title="Reservaciones"
            line1="Llama o escríbenos"
            line2="WhatsApp disponible"
          />
        </div>
      </section>

      {/* CTA strip — primary "Ver menú", secondary "Reservar mesa" */}
      <section
        style={{
          background: 'var(--color-brand-cream)',
          padding: 'var(--space-7) var(--space-5)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(28px, 4vw, 40px)',
              color: 'var(--color-brand-ink)',
              lineHeight: 1,
            }}
          >
            Nuestro menú
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 400,
              letterSpacing: '0.04em',
              margin: '8px 0 16px',
              color: 'var(--color-brand-ink)',
              textTransform: 'uppercase',
            }}
          >
            Burgers, hot dogs, pasta y más
          </h2>
          <p
            style={{
              margin: '0 0 24px',
              color: 'var(--color-neutral-700)',
              fontSize: 16,
              lineHeight: 1.5,
            }}
          >
            Más de 40 platillos preparados al momento. Servicio jueves, viernes y
            sábado en Plan de Iguala s/n, Col. Burócrata, a la vuelta de Casa Mateos.
          </p>
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-3)',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link href="/menu" style={primaryCta}>Ver menú</Link>
            <Link href="/reservar" style={secondaryCta}>Reservar mesa</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  icon,
  iconLabel,
  title,
  line1,
  line2,
  badge,
}: {
  icon: React.ReactNode;
  iconLabel: string;
  title: string;
  line1: string;
  line2: string;
  badge?: string;
}) {
  return (
    <div
      style={{
        background: 'var(--color-brand-charcoal, #1F1F1F)',
        color: 'var(--color-neutral-0)',
        padding: 'var(--space-5)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 'var(--space-2)',
        position: 'relative',
      }}
    >
      <div
        aria-label={iconLabel}
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'var(--color-brand-primary)',
          color: 'var(--color-brand-ink)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 4,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 18,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--color-brand-primary)',
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 14, color: 'var(--color-neutral-200, #E4E4E7)' }}>
        {line1}
      </div>
      <div style={{ fontSize: 14, color: 'var(--color-neutral-400)' }}>
        {line2}
      </div>
      {badge ? (
        <span
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'var(--color-brand-primary)',
            color: 'var(--color-brand-ink)',
            padding: '2px 8px',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.06em',
            borderRadius: 'var(--radius-pill)',
            textTransform: 'uppercase',
          }}
        >
          {badge}
        </span>
      ) : null}
    </div>
  );
}

const primaryCta: React.CSSProperties = {
  background: 'var(--color-brand-primary)',
  color: 'var(--color-brand-ink)',
  padding: '14px 28px',
  borderRadius: 'var(--radius-pill)',
  fontFamily: 'var(--font-heading)',
  fontSize: 16,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  textDecoration: 'none',
  fontWeight: 400,
};

const secondaryCta: React.CSSProperties = {
  background: 'transparent',
  color: 'var(--color-brand-ink)',
  padding: '14px 28px',
  borderRadius: 'var(--radius-pill)',
  fontFamily: 'var(--font-heading)',
  fontSize: 16,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  textDecoration: 'none',
  fontWeight: 400,
  border: '2px solid var(--color-brand-ink)',
};

const secondaryCtaOnDark: React.CSSProperties = {
  background: 'transparent',
  color: 'var(--color-neutral-0)',
  padding: '14px 28px',
  borderRadius: 'var(--radius-pill)',
  fontFamily: 'var(--font-heading)',
  fontSize: 16,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  textDecoration: 'none',
  fontWeight: 400,
  border: '2px solid var(--color-neutral-0)',
};

function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.13 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
