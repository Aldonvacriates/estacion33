import type { Metadata } from 'next';
import { InstallBanner } from './InstallBanner';

export const metadata: Metadata = {
  title: 'Instalar la app — Estación 33',
  description:
    'Agrega Estación 33 a tu pantalla de inicio para pedir más rápido y recibir avisos de tu pedido.',
};

export default function InstalarPage() {
  return (
    <main
      style={{
        maxWidth: 'var(--size-containerMd)',
        margin: '0 auto',
        padding: 'var(--space-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      }}
    >
      <header
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(36px, 6vw, 52px)',
            color: 'var(--color-brand-chili)',
            lineHeight: 1,
          }}
        >
          Pónla en tu teléfono
        </span>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(20px, 3vw, 26px)',
            fontWeight: 400,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--color-brand-ink)',
          }}
        >
          Instalar Estación 33
        </h1>
        <p style={{ margin: 0, color: 'var(--color-neutral-700)', fontSize: 15 }}>
          Agrega el sitio a tu pantalla de inicio. Se ve y se siente como una
          app: sin barra del navegador, abre rápido y te llegan avisos cuando
          tu pedido cambia de estado.
        </p>
      </header>

      <InstallBanner />

      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <h2 style={sectionH2}>¿Para qué la instalo?</h2>
        <ul style={benefitsList}>
          <Benefit emoji="⚡" title="Abre más rápido">
            Sin esperar a que cargue el navegador.
          </Benefit>
          <Benefit emoji="🔔" title="Avisos de tu pedido">
            Te llega una notificación cuando está en preparación, en camino y
            entregado.
          </Benefit>
          <Benefit emoji="🍔" title="Acceso directo al menú">
            Un toque desde tu pantalla de inicio.
          </Benefit>
          <Benefit emoji="💾" title="Sin ocupar mucho espacio">
            Mucho más liviana que una app de la tienda.
          </Benefit>
        </ul>
      </section>

      <section style={cardSection}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span aria-hidden style={{ fontSize: 28 }}>🤖</span>
          <h2 style={{ ...sectionH2, margin: 0 }}>En Android (Chrome)</h2>
        </div>
        <ol style={stepsList}>
          <Step
            n={1}
            title="Abre el sitio en Chrome"
            illustration={<AndroidStep1 />}
          >
            Visita <strong>estacion33.com</strong> con Google Chrome.
          </Step>
          <Step
            n={2}
            title="Toca el menú ⋮"
            illustration={<AndroidStep2 />}
          >
            Arriba a la derecha, toca los tres puntos verticales.
          </Step>
          <Step
            n={3}
            title="Elige “Instalar app” o “Agregar a la pantalla de inicio”"
            illustration={<AndroidStep3 />}
          >
            Confirma tocando <strong>Instalar</strong>. Listo: aparece el ícono
            de Estación 33 en tu pantalla de inicio.
          </Step>
        </ol>
      </section>

      <section style={cardSection}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span aria-hidden style={{ fontSize: 28 }}>🍎</span>
          <h2 style={{ ...sectionH2, margin: 0 }}>En iPhone (Safari)</h2>
        </div>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--color-neutral-700)' }}>
          Importante: en iPhone tiene que ser con <strong>Safari</strong> (no
          Chrome). Es lo que pide Apple.
        </p>
        <ol style={stepsList}>
          <Step
            n={1}
            title="Abre el sitio en Safari"
            illustration={<IosStep1 />}
          >
            Visita <strong>estacion33.com</strong> con Safari.
          </Step>
          <Step
            n={2}
            title="Toca el botón Compartir"
            illustration={<IosStep2 />}
          >
            Es el cuadrito con la flecha hacia arriba, en la barra de abajo.
          </Step>
          <Step
            n={3}
            title="Elige “Agregar a Inicio”"
            illustration={<IosStep3 />}
          >
            Desliza hacia abajo si no la ves, y toca <strong>Agregar</strong>{' '}
            arriba a la derecha.
          </Step>
        </ol>
      </section>

      <section style={cardSection}>
        <h2 style={sectionH2}>Preguntas comunes</h2>
        <Faq q="¿Cuesta algo?">
          No. Es gratis y siempre lo será.
        </Faq>
        <Faq q="¿Necesito permisos especiales?">
          Solo te pedimos permiso para mandarte avisos cuando tu pedido cambia
          de estado, y solo si tú aceptas.
        </Faq>
        <Faq q="¿Puedo desinstalarla?">
          Claro. Mantén el ícono presionado en tu pantalla de inicio y elige{' '}
          <strong>Eliminar</strong>. Igual que cualquier app.
        </Faq>
        <Faq q="¿Funciona sin internet?">
          El menú y la página de tu pedido se cargan rápido aunque tengas mala
          señal, pero para hacer un pedido nuevo sí necesitas conexión.
        </Faq>
        <Faq q="¿En qué se diferencia de una app de la Play Store?">
          Para usarla, en nada que te importe. Por dentro es una versión
          ligera; por fuera tiene su ícono, abre en pantalla completa, y manda
          notificaciones. Cuando crezcamos, sacaremos versiones nativas.
        </Faq>
      </section>
    </main>
  );
}

// ---- Subcomponents ---------------------------------------------------------

function Benefit({
  emoji,
  title,
  children,
}: {
  emoji: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li style={benefitItem}>
      <span aria-hidden style={{ fontSize: 24, lineHeight: 1 }}>
        {emoji}
      </span>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--color-neutral-700)' }}>
          {children}
        </div>
      </div>
    </li>
  );
}

function Step({
  n,
  title,
  illustration,
  children,
}: {
  n: number;
  title: string;
  illustration: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li
      style={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr',
        gap: 'var(--space-4)',
        alignItems: 'center',
        background: 'var(--color-neutral-50)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
      }}
    >
      <div
        style={{
          width: 120,
          height: 180,
          background: 'var(--color-neutral-0)',
          borderRadius: 18,
          border: '1px solid var(--color-neutral-200)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {illustration}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-brand-primary)',
          }}
        >
          Paso {n}
        </span>
        <strong style={{ fontSize: 15 }}>{title}</strong>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--color-neutral-700)' }}>
          {children}
        </p>
      </div>
    </li>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details
      style={{
        background: 'var(--color-neutral-0)',
        border: '1px solid var(--color-neutral-200)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-3)',
      }}
    >
      <summary
        style={{
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: 14,
          color: 'var(--color-brand-ink)',
        }}
      >
        {q}
      </summary>
      <div style={{ marginTop: 8, fontSize: 14, color: 'var(--color-neutral-700)' }}>
        {children}
      </div>
    </details>
  );
}

// ---- SVG illustrations ----------------------------------------------------
// Stylized phone mockups so the steps are visual without needing real
// screenshots. Designed at 96×160 inside a 120×180 frame so the device
// "screen" reads clearly at glance size.

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 120 180" width="100%" height="100%" aria-hidden>
      {/* device body */}
      <rect x="14" y="6" width="92" height="168" rx="14" fill="#1A1A1A" />
      {/* screen */}
      <rect x="20" y="14" width="80" height="152" rx="6" fill="#FFFFFF" />
      {/* notch */}
      <rect x="50" y="14" width="20" height="4" rx="2" fill="#1A1A1A" />
      {children}
    </svg>
  );
}

function AndroidStep1() {
  // Browser with URL bar showing the site
  return (
    <PhoneFrame>
      {/* URL bar */}
      <rect x="22" y="22" width="76" height="10" rx="3" fill="#EEE" />
      <text x="26" y="29" fontSize="5.5" fill="#333" fontFamily="system-ui">estacion33.com</text>
      {/* burger logo */}
      <circle cx="60" cy="70" r="18" fill="#FFC72C" />
      <text x="60" y="74" fontSize="14" fill="#0A0A0A" textAnchor="middle">🍔</text>
      <rect x="30" y="100" width="60" height="6" rx="2" fill="#FFC72C" />
      <rect x="30" y="112" width="50" height="4" rx="1" fill="#DDD" />
      <rect x="30" y="120" width="55" height="4" rx="1" fill="#DDD" />
    </PhoneFrame>
  );
}

function AndroidStep2() {
  // Highlight the ⋮ menu button top-right
  return (
    <PhoneFrame>
      <rect x="22" y="22" width="64" height="10" rx="3" fill="#EEE" />
      {/* dots highlighted */}
      <circle cx="93" cy="27" r="9" fill="#FFC72C" />
      <circle cx="93" cy="24" r="1.4" fill="#0A0A0A" />
      <circle cx="93" cy="27" r="1.4" fill="#0A0A0A" />
      <circle cx="93" cy="30" r="1.4" fill="#0A0A0A" />
      {/* arrow pointing */}
      <path d="M82 38 L92 32" stroke="#E63946" strokeWidth="2" strokeLinecap="round" />
      <path d="M88 38 L92 32 L86 32" fill="#E63946" />
      {/* page content faded */}
      <circle cx="60" cy="90" r="14" fill="#FFE9A5" opacity="0.6" />
      <rect x="32" y="118" width="56" height="4" rx="1" fill="#EEE" />
      <rect x="32" y="126" width="48" height="4" rx="1" fill="#EEE" />
    </PhoneFrame>
  );
}

function AndroidStep3() {
  // Dropdown menu with "Instalar app" highlighted
  return (
    <PhoneFrame>
      {/* menu sheet */}
      <rect x="50" y="30" width="48" height="74" rx="3" fill="#FFFFFF" stroke="#CCC" strokeWidth="0.5" />
      <rect x="54" y="36" width="32" height="4" rx="1" fill="#CCC" />
      <rect x="54" y="46" width="32" height="4" rx="1" fill="#CCC" />
      {/* highlighted "Instalar app" item */}
      <rect x="52" y="54" width="44" height="14" rx="2" fill="#FFF7D6" />
      <text x="56" y="63" fontSize="5" fill="#0A0A0A" fontFamily="system-ui" fontWeight="700">📲 Instalar app</text>
      <rect x="54" y="74" width="32" height="4" rx="1" fill="#CCC" />
      <rect x="54" y="84" width="32" height="4" rx="1" fill="#CCC" />
      <rect x="54" y="94" width="32" height="4" rx="1" fill="#CCC" />
    </PhoneFrame>
  );
}

function IosStep1() {
  return (
    <PhoneFrame>
      <rect x="22" y="22" width="76" height="10" rx="3" fill="#EEE" />
      <text x="26" y="29" fontSize="5.5" fill="#333" fontFamily="system-ui">estacion33.com</text>
      <circle cx="60" cy="70" r="18" fill="#FFC72C" />
      <text x="60" y="74" fontSize="14" fill="#0A0A0A" textAnchor="middle">🍔</text>
      <rect x="30" y="100" width="60" height="6" rx="2" fill="#FFC72C" />
      {/* Safari bottom bar */}
      <rect x="20" y="152" width="80" height="14" fill="#F2F2F7" />
      <rect x="50" y="156" width="6" height="6" rx="1" fill="#007AFF" />
      <path d="M53 156 L53 152 M51 154 L53 152 L55 154" stroke="#007AFF" strokeWidth="0.7" fill="none" />
    </PhoneFrame>
  );
}

function IosStep2() {
  // Highlight the share button
  return (
    <PhoneFrame>
      <rect x="20" y="152" width="80" height="14" fill="#F2F2F7" />
      {/* highlighted share icon */}
      <circle cx="53" cy="159" r="7" fill="#FFC72C" />
      <rect x="51" y="158" width="4" height="4" rx="0.5" fill="none" stroke="#0A0A0A" strokeWidth="0.7" />
      <path d="M53 158 L53 154 M51.5 155.5 L53 154 L54.5 155.5" stroke="#0A0A0A" strokeWidth="0.7" fill="none" />
      {/* arrow */}
      <path d="M40 145 L52 156" stroke="#E63946" strokeWidth="2" strokeLinecap="round" />
      <path d="M46 145 L40 145 L40 151" stroke="#E63946" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* page content faded */}
      <rect x="22" y="22" width="76" height="10" rx="3" fill="#EEE" />
      <circle cx="60" cy="80" r="14" fill="#FFE9A5" opacity="0.6" />
    </PhoneFrame>
  );
}

function IosStep3() {
  // Share sheet with "Add to Home Screen" highlighted
  return (
    <PhoneFrame>
      {/* share sheet bg */}
      <rect x="20" y="60" width="80" height="106" rx="6" fill="#F2F2F7" />
      <rect x="48" y="64" width="24" height="2" rx="1" fill="#CCC" />
      {/* row: Copy */}
      <rect x="24" y="74" width="72" height="14" rx="3" fill="#FFFFFF" />
      <text x="28" y="83" fontSize="4.5" fill="#0A0A0A" fontFamily="system-ui">Copiar</text>
      {/* highlighted: Add to Home Screen */}
      <rect x="24" y="92" width="72" height="14" rx="3" fill="#FFF7D6" stroke="#FFC72C" strokeWidth="0.8" />
      <text x="28" y="101" fontSize="4.5" fill="#0A0A0A" fontFamily="system-ui" fontWeight="700">➕ Agregar a Inicio</text>
      {/* row: Markup */}
      <rect x="24" y="110" width="72" height="14" rx="3" fill="#FFFFFF" />
      <text x="28" y="119" fontSize="4.5" fill="#0A0A0A" fontFamily="system-ui">Marcar</text>
      <rect x="24" y="128" width="72" height="14" rx="3" fill="#FFFFFF" />
      <text x="28" y="137" fontSize="4.5" fill="#0A0A0A" fontFamily="system-ui">Imprimir</text>
    </PhoneFrame>
  );
}

// ---- Styles ---------------------------------------------------------------

const sectionH2: React.CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-heading)',
  fontSize: 18,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'var(--color-brand-ink)',
  fontWeight: 400,
};

const cardSection: React.CSSProperties = {
  background: 'var(--color-neutral-0)',
  border: '1px solid var(--color-neutral-200)',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--space-5)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-3)',
};

const benefitsList: React.CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 'var(--space-3)',
};

const benefitItem: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  alignItems: 'flex-start',
  background: 'var(--color-neutral-50)',
  padding: 'var(--space-3)',
  borderRadius: 'var(--radius-md)',
};

const stepsList: React.CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-3)',
};
