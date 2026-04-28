import { toE164Digits } from './phone';

// Read the restaurant's WhatsApp number from env. Configured in Vercel as
// `NEXT_PUBLIC_WHATSAPP_NUMBER`, e.g. "5217331074642" (digits only).
export function restaurantWhatsApp(): string {
  return toE164Digits(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '');
}

// Build a `wa.me` deep link. WhatsApp opens with the message pre-filled and
// the user just hits send.
export function buildWaLink(numberDigits: string, message: string): string {
  const num = toE164Digits(numberDigits);
  if (!num) return '';
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

type OrderForMessage = {
  id: string;
  total_cents: number;
  fulfillment: 'delivery' | 'pickup';
  scheduled_for: string;
};

// Pre-fill text the customer sends to the restaurant to confirm their order.
// Keep short — WhatsApp truncates long deep-link messages on some clients.
export function customerToRestaurantOrderMessage(order: OrderForMessage): string {
  const folio = order.id.slice(0, 8);
  const when = new Date(order.scheduled_for).toLocaleString('es-MX', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const tipo = order.fulfillment === 'delivery' ? 'a domicilio' : 'para recoger';
  const total = (order.total_cents / 100).toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
  });
  return `Hola Estación 33, confirmo mi pedido #${folio} ${tipo} para ${when}. Total: ${total}.`;
}

type ReservationForMessage = {
  id: string;
  guest_name: string;
  party_size: number;
  slot_at: string;
};

export function customerToRestaurantReservationMessage(r: ReservationForMessage): string {
  const folio = r.id.slice(0, 8);
  const when = new Date(r.slot_at).toLocaleString('es-MX', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const personas = r.party_size === 1 ? '1 persona' : `${r.party_size} personas`;
  return `Hola Estación 33, confirmo mi reserva #${folio} a nombre de ${r.guest_name} para ${personas} el ${when}.`;
}
