import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description:
    'Reglas de uso del sitio y servicio de Estación 33 — pedidos, pagos, entregas y cancelaciones.',
  alternates: { canonical: '/terminos-y-condiciones' },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = '29 de abril de 2026';
const RAZON_SOCIAL = 'Aldo Website LLC';
const NOMBRE_COMERCIAL = 'Estación 33';
const DOMICILIO = 'Plan de Iguala s/n, Col. Burócrata, Iguala de la Independencia, Guerrero, México';
const CONTACTO_EMAIL = 'aldoph@pm.me';
const HORARIO = 'jueves, viernes y sábado de 18:30 a 22:30 horas (tiempo del centro de México)';

export default function TerminosPage() {
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
          Términos y Condiciones
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--color-neutral-500)' }}>
          Última actualización: {LAST_UPDATED}
        </p>
      </header>

      <Disclaimer />

      <Section title="1. Aceptación">
        <p>
          Al usar el sitio <strong>estacion33.com</strong> y los servicios
          relacionados (en conjunto, el &ldquo;Servicio&rdquo;) aceptas estos
          Términos y Condiciones. Si no estás de acuerdo, abstente de usar el
          Servicio.
        </p>
        <p>
          El Servicio es operado por <strong>{RAZON_SOCIAL}</strong> bajo el
          nombre comercial <strong>{NOMBRE_COMERCIAL}</strong>, con domicilio
          en {DOMICILIO}. Para contacto:{' '}
          <a href={`mailto:${CONTACTO_EMAIL}`} style={linkStyle}>
            {CONTACTO_EMAIL}
          </a>
          .
        </p>
      </Section>

      <Section title="2. Servicios ofrecidos">
        <p>A través del sitio puedes:</p>
        <ul>
          <li>Consultar el menú y precios vigentes.</li>
          <li>
            Hacer pedidos de comida para recoger en sucursal o entrega a
            domicilio dentro de la zona de cobertura.
          </li>
          <li>
            Reservar mesa para consumo en sucursal cuando esté disponible.
          </li>
          <li>Crear una cuenta para guardar direcciones e historial de pedidos.</li>
        </ul>
        <p>
          El servicio opera{' '}
          <strong>{HORARIO}</strong>. Fuera de ese horario el sitio puede
          mostrar información pero no aceptar pedidos.
        </p>
      </Section>

      <Section title="3. Cuenta de usuario">
        <p>
          Para guardar pedidos, direcciones o recibir notificaciones puedes
          crear una cuenta proporcionando un correo válido y una contraseña.
          Eres responsable de mantener la confidencialidad de tu contraseña y
          de la actividad realizada bajo tu cuenta. Notifícanos de inmediato
          si sospechas un acceso no autorizado.
        </p>
        <p>
          También puedes hacer pedidos como invitado sin crear cuenta; en ese
          caso, el folio del pedido (un identificador único en la URL) es la
          única manera de consultar su estado.
        </p>
      </Section>

      <Section title="4. Pedidos y precios">
        <p>
          Los precios mostrados en el menú están en pesos mexicanos (MXN) e
          incluyen IVA. Pueden cambiar sin previo aviso, pero el precio
          aplicable a tu pedido es el que se muestra al confirmarlo.
        </p>
        <p>
          Al confirmar un pedido, aceptas pagar el monto total mostrado
          (subtotal + cargo por envío en su caso). Estación 33 se reserva el
          derecho de cancelar pedidos en los siguientes casos:
        </p>
        <ul>
          <li>Error evidente en el precio o disponibilidad de un producto.</li>
          <li>Sospecha razonable de fraude o uso indebido.</li>
          <li>Imposibilidad de entregar dentro del horario solicitado.</li>
          <li>Domicilio fuera de la zona de cobertura.</li>
        </ul>
      </Section>

      <Section title="5. Pago">
        <p>Aceptamos los siguientes medios de pago:</p>
        <ul>
          <li>
            <strong>Pago en sucursal o al repartidor (efectivo).</strong> El
            pedido se confirma al momento de recibirlo.
          </li>
          <li>
            <strong>MercadoPago</strong> (tarjeta de crédito/débito,
            transferencia, OXXO y otros). El cobro lo procesa MercadoPago
            bajo sus propios términos. Estación 33 no almacena datos de
            tarjeta.
          </li>
        </ul>
        <p>
          Si tu pago en línea no se confirma dentro de los 30 minutos
          posteriores al pedido, éste se cancela automáticamente.
        </p>
      </Section>

      <Section title="6. Entrega y recolección">
        <p>
          La entrega a domicilio se realiza únicamente dentro de la zona de
          cobertura mostrada al hacer el pedido. Las direcciones fuera de
          cobertura no podrán confirmarse aunque el sistema permita
          escribirlas.
        </p>
        <p>
          Los tiempos de entrega son estimados y dependen del volumen de
          pedidos, condiciones del tráfico y clima. Estación 33 hará un
          esfuerzo razonable por cumplirlos pero no garantiza un tiempo
          exacto. La hora compromiso aplica al momento en que el repartidor
          parte de la sucursal con el pedido.
        </p>
        <p>
          Es responsabilidad del cliente proporcionar una dirección completa,
          un número de contacto vigente y asegurar que alguien pueda recibir
          el pedido. Si el repartidor no puede entregar tras tres intentos
          razonables de contacto, el pedido podrá considerarse entregado y no
          procederá reembolso.
        </p>
      </Section>

      <Section title="7. Cancelaciones y reembolsos">
        <p>
          Puedes solicitar cancelar tu pedido <em>antes</em> de que pase al
          estado &ldquo;En preparación&rdquo;. Una vez en cocina, no es
          posible cancelar.
        </p>
        <p>
          Si recibes un pedido con un error atribuible a Estación 33 (producto
          equivocado, faltante, frío por demora propia), contáctanos dentro de
          las 24 horas siguientes con foto del problema. Resolveremos
          enviando el producto faltante, reemplazándolo o aplicando reembolso
          parcial o total a través del mismo medio de pago, según
          corresponda.
        </p>
        <p>
          Los reembolsos vía MercadoPago pueden tardar de 1 a 10 días hábiles
          en reflejarse, dependiendo del banco emisor.
        </p>
      </Section>

      <Section title="8. Reservas">
        <p>
          Las reservas de mesa están sujetas a disponibilidad y al horario de
          servicio. Estación 33 puede reasignar la mesa si el cliente no se
          presenta dentro de los 15 minutos posteriores al horario reservado.
        </p>
      </Section>

      <Section title="9. Conducta del usuario">
        <p>Al usar el Servicio te comprometes a:</p>
        <ul>
          <li>Proporcionar información verídica y actualizada.</li>
          <li>
            No hacer pedidos fraudulentos, automatizados, ni con fines
            distintos al consumo personal.
          </li>
          <li>
            No intentar vulnerar la seguridad del sitio, sus servidores o
            cuentas de otros usuarios.
          </li>
          <li>
            No usar el sitio para actividades ilegales, ofensivas, o que
            violen derechos de terceros.
          </li>
        </ul>
        <p>
          Estación 33 puede suspender o cancelar tu cuenta si incumples
          cualquiera de estos puntos.
        </p>
      </Section>

      <Section title="10. Propiedad intelectual">
        <p>
          Todo el contenido del sitio (logotipos, textos, imágenes, código,
          diseño y nombres comerciales) es propiedad de {RAZON_SOCIAL} o de
          sus licenciantes y está protegido por las leyes de propiedad
          intelectual mexicanas e internacionales. Queda prohibida su
          reproducción total o parcial sin autorización por escrito.
        </p>
      </Section>

      <Section title="11. Limitación de responsabilidad">
        <p>
          En la medida máxima permitida por la ley, Estación 33 no será
          responsable por daños indirectos, incidentales o consecuentes
          derivados del uso del Servicio, fallas del proveedor de pago o de
          terceros, ni interrupciones del sitio fuera de nuestro control
          razonable.
        </p>
        <p>
          Nuestra responsabilidad total relacionada con un pedido se limita
          al monto efectivamente pagado por dicho pedido.
        </p>
      </Section>

      <Section title="12. Privacidad">
        <p>
          El tratamiento de tus datos personales está descrito en nuestro{' '}
          <Link href="/aviso-de-privacidad" style={linkStyle}>
            Aviso de Privacidad
          </Link>
          , parte integrante de estos Términos.
        </p>
      </Section>

      <Section title="13. Modificaciones">
        <p>
          Podemos actualizar estos Términos en cualquier momento. La versión
          vigente siempre estará publicada en esta página con la fecha de la
          última actualización. Si los cambios son sustanciales te lo
          notificaremos por correo electrónico cuando tengamos tu cuenta
          registrada. El uso continuado del Servicio después de un cambio
          constituye aceptación.
        </p>
      </Section>

      <Section title="14. Ley aplicable y jurisdicción">
        <p>
          Estos Términos se rigen por las leyes de los Estados Unidos
          Mexicanos. Cualquier controversia será sometida a la competencia
          de los tribunales de Iguala, Guerrero, México, renunciando las
          partes a cualquier otro fuero que pudiera corresponderles.
        </p>
        <p>
          Como consumidor conservas el derecho de acudir a la{' '}
          <strong>Procuraduría Federal del Consumidor (PROFECO)</strong> en
          términos de la Ley Federal de Protección al Consumidor.
        </p>
      </Section>

      <p style={{ fontSize: 12, color: 'var(--color-neutral-500)', textAlign: 'center' }}>
        <Link href="/aviso-de-privacidad" style={linkStyle}>
          Ver Aviso de Privacidad
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
      fe para cubrir los puntos típicos de un servicio de pedidos en línea de
      restaurante. Antes de su publicación definitiva debe ser revisado por un
      abogado mexicano que conozca tu operación específica.
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
