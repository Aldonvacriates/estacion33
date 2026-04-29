import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Aviso de Privacidad',
  description:
    'Cómo Estación 33 recaba, usa y protege tus datos personales conforme a la LFPDPPP.',
  alternates: { canonical: '/aviso-de-privacidad' },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = '29 de abril de 2026';
const RESPONSABLE = 'Aldo Website LLC, operadora del restaurante Estación 33';
const DOMICILIO = 'Plan de Iguala s/n, Col. Burócrata, Iguala de la Independencia, Guerrero, México';
const CONTACTO_EMAIL = 'hello@aldowebsitellc.xyz';

export default function AvisoPrivacidadPage() {
  return (
    <main
      style={{
        maxWidth: 'var(--size-containerMd)',
        margin: '0 auto',
        padding: 'var(--space-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
        color: 'var(--color-brand-ink)',
      }}
    >
      <header style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(24px, 4vw, 32px)',
            fontWeight: 400,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Aviso de Privacidad
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--color-neutral-500)' }}>
          Última actualización: {LAST_UPDATED}
        </p>
      </header>

      <Disclaimer />

      <Section title="1. Responsable del tratamiento">
        <p>
          El responsable del tratamiento de tus datos personales es{' '}
          <strong>{RESPONSABLE}</strong>, con domicilio en {DOMICILIO}, a quien
          puedes contactar en{' '}
          <a href={`mailto:${CONTACTO_EMAIL}`} style={linkStyle}>
            {CONTACTO_EMAIL}
          </a>{' '}
          (en adelante, &ldquo;Estación 33&rdquo;).
        </p>
      </Section>

      <Section title="2. Datos personales que recabamos">
        <p>
          Recabamos los siguientes datos cuando usas nuestro sitio o servicio:
        </p>
        <ul>
          <li>
            <strong>Datos de identificación y contacto:</strong> nombre completo,
            teléfono y correo electrónico (cuando creas una cuenta o haces un
            pedido como invitado).
          </li>
          <li>
            <strong>Datos de domicilio:</strong> dirección, referencias de
            entrega y, en su caso, coordenadas geográficas, únicamente para
            entregar pedidos a domicilio.
          </li>
          <li>
            <strong>Datos transaccionales:</strong> historial de pedidos,
            productos solicitados, montos, método de pago y estatus.
          </li>
          <li>
            <strong>Datos de pago:</strong> en el caso de pagos con tarjeta,
            transferencia o métodos en efectivo procesados a través de
            MercadoPago, el número de tarjeta y demás información financiera{' '}
            <em>nunca</em> se almacena en nuestros servidores: la captura
            ocurre directamente en MercadoPago bajo su propia política de
            privacidad.
          </li>
          <li>
            <strong>Datos técnicos:</strong> dirección IP aproximada, tipo de
            dispositivo y navegador, identificadores de sesión, suscripción
            para notificaciones push (si la activas) y cookies estrictamente
            necesarias para el funcionamiento del sitio.
          </li>
        </ul>
        <p>
          No recabamos datos personales sensibles (origen racial, opiniones
          políticas, creencias religiosas, datos de salud, biométricos o de
          preferencia sexual).
        </p>
      </Section>

      <Section title="3. Finalidades del tratamiento">
        <p>
          Tratamos tus datos para las siguientes <strong>finalidades primarias</strong>{' '}
          (necesarias para que el servicio funcione):
        </p>
        <ul>
          <li>Crear y administrar tu cuenta.</li>
          <li>
            Procesar, confirmar, preparar y entregar tus pedidos, incluyendo la
            asignación de un repartidor cuando elijas servicio a domicilio.
          </li>
          <li>
            Cobrar el importe del pedido a través de MercadoPago o registrar
            pagos en efectivo.
          </li>
          <li>Enviarte notificaciones sobre el estado de tu pedido.</li>
          <li>
            Atender dudas, quejas, reclamaciones y solicitudes de derechos ARCO.
          </li>
          <li>Cumplir con obligaciones fiscales, contables y legales.</li>
        </ul>
        <p>
          De manera adicional, podríamos tratar tus datos para las siguientes{' '}
          <strong>finalidades secundarias</strong> (no esenciales):
        </p>
        <ul>
          <li>
            Enviar promociones, encuestas de satisfacción o información sobre
            nuevos productos.
          </li>
          <li>
            Análisis estadístico anónimo o agregado del uso del sitio para
            mejorar el servicio.
          </li>
        </ul>
        <p>
          Si no deseas que tus datos sean tratados para las finalidades
          secundarias, puedes manifestarlo escribiendo a{' '}
          <a href={`mailto:${CONTACTO_EMAIL}`} style={linkStyle}>
            {CONTACTO_EMAIL}
          </a>
          . Negarte a las finalidades secundarias no afectará tu posibilidad
          de hacer pedidos.
        </p>
      </Section>

      <Section title="4. Transferencias de datos">
        <p>
          Para operar el servicio compartimos algunos de tus datos con terceros
          que actúan como encargados o que son necesarios para completar la
          transacción:
        </p>
        <ul>
          <li>
            <strong>MercadoPago México</strong> — para procesar pagos en línea.
          </li>
          <li>
            <strong>Supabase</strong> — proveedor de hospedaje y base de datos
            donde residen tus datos.
          </li>
          <li>
            <strong>Vercel</strong> — proveedor de hospedaje del sitio web.
          </li>
          <li>
            <strong>WhatsApp / Meta</strong> — únicamente cuando elijas confirmar
            tu pedido por esta vía.
          </li>
          <li>
            <strong>Autoridades fiscales o judiciales</strong> — cuando exista
            requerimiento legal.
          </li>
        </ul>
        <p>
          No vendemos ni rentamos tus datos personales a terceros para fines de
          mercadotecnia ajenos a Estación 33.
        </p>
      </Section>

      <Section title="5. Derechos ARCO y revocación del consentimiento">
        <p>
          Tienes derecho a <strong>Acceder</strong>, <strong>Rectificar</strong>,{' '}
          <strong>Cancelar</strong> u <strong>Oponerte</strong> al tratamiento
          de tus datos (derechos ARCO), así como a revocar el consentimiento
          que nos hayas otorgado.
        </p>
        <p>
          Para ejercer cualquiera de estos derechos, envíanos un correo a{' '}
          <a href={`mailto:${CONTACTO_EMAIL}`} style={linkStyle}>
            {CONTACTO_EMAIL}
          </a>{' '}
          incluyendo:
        </p>
        <ul>
          <li>Tu nombre completo y un medio para contactarte.</li>
          <li>
            Una identificación oficial vigente (INE, pasaporte, etc.) en
            formato digital.
          </li>
          <li>Descripción clara y precisa de los datos sobre los que solicitas ejercer el derecho.</li>
          <li>Cualquier elemento que facilite la localización de tus datos.</li>
        </ul>
        <p>
          Tendremos un máximo de <strong>20 días hábiles</strong> para
          responder a tu solicitud y, en su caso, otros 15 días hábiles para
          hacerla efectiva, conforme a la Ley Federal de Protección de Datos
          Personales en Posesión de los Particulares (LFPDPPP).
        </p>
      </Section>

      <Section title="6. Conservación de los datos">
        <p>
          Conservamos tus datos personales por el tiempo necesario para cumplir
          las finalidades descritas y, en su caso, durante los plazos que
          establezcan las leyes fiscales y comerciales aplicables (por ejemplo,
          5 años para registros contables). Una vez cumplidos esos plazos los
          eliminamos o anonimizamos.
        </p>
      </Section>

      <Section title="7. Medidas de seguridad">
        <p>
          Aplicamos medidas técnicas, administrativas y físicas razonables para
          proteger tus datos contra daño, pérdida, alteración, destrucción o
          uso no autorizado: cifrado en tránsito (HTTPS), control de acceso por
          roles en la base de datos, almacenamiento de contraseñas con hashing
          irreversible, y registro de auditoría de accesos administrativos.
        </p>
      </Section>

      <Section title="8. Cookies y tecnologías similares">
        <p>
          Usamos cookies de sesión estrictamente necesarias para mantenerte
          autenticado y un almacenamiento local del navegador para guardar tu
          carrito mientras navegas. No usamos cookies publicitarias ni de
          terceros con fines de seguimiento.
        </p>
      </Section>

      <Section title="9. Cambios al Aviso de Privacidad">
        <p>
          Cualquier modificación a este Aviso será publicada en esta misma
          página, indicando la fecha de la última actualización en el
          encabezado. Si los cambios son sustanciales te lo notificaremos por
          el correo electrónico que tengas registrado.
        </p>
      </Section>

      <Section title="10. Contacto">
        <p>
          Si tienes dudas sobre este Aviso de Privacidad o sobre el tratamiento
          de tus datos, puedes escribirnos a{' '}
          <a href={`mailto:${CONTACTO_EMAIL}`} style={linkStyle}>
            {CONTACTO_EMAIL}
          </a>{' '}
          o acudir a nuestro domicilio en {DOMICILIO}.
        </p>
        <p>
          Si consideras que tu derecho a la protección de datos personales ha
          sido vulnerado, también puedes acudir al{' '}
          <strong>Instituto Nacional de Transparencia, Acceso a la Información
          y Protección de Datos Personales (INAI)</strong> — más información en{' '}
          <a
            href="https://home.inai.org.mx/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            home.inai.org.mx
          </a>
          .
        </p>
      </Section>

      <p style={{ fontSize: 12, color: 'var(--color-neutral-500)', textAlign: 'center' }}>
        <Link href="/terminos-y-condiciones" style={linkStyle}>
          Ver Términos y Condiciones
        </Link>
      </p>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <h2
        style={{
          margin: 0,
          fontFamily: 'var(--font-heading)',
          fontSize: 16,
          fontWeight: 400,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--color-brand-primaryDark, #B8860B)',
        }}
      >
        {title}
      </h2>
      <div style={proseStyle}>{children}</div>
    </section>
  );
}

function Disclaimer() {
  return (
    <div
      style={{
        background: 'var(--color-semantic-warningBg)',
        color: 'var(--color-semantic-warningFg)',
        border: '1px solid var(--color-semantic-warning)',
        padding: 'var(--space-3)',
        borderRadius: 'var(--radius-md)',
        fontSize: 13,
      }}
    >
      <strong>Nota:</strong> Este documento es una plantilla redactada de buena
      fe para cumplir con los requisitos generales de la LFPDPPP. Antes de su
      publicación definitiva debe ser revisado por un abogado mexicano que
      conozca tu operación específica.
    </div>
  );
}

const linkStyle: React.CSSProperties = {
  color: 'var(--color-brand-primaryDark, #B8860B)',
  textDecoration: 'underline',
};

const proseStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.65,
  color: 'var(--color-neutral-900)',
};
