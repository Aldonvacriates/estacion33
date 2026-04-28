export const es = {
  common: {
    addToCart: 'Agregar al carrito',
    continue: 'Continuar',
    pay: 'Pagar',
    cancel: 'Cancelar',
    back: 'Volver',
    close: 'Cerrar',
  },
  service: {
    closed: 'Cerrado ahora',
    preOpen: 'Abrimos pronto',
    open: 'Abierto',
    lastCall: 'Última llamada',
    nextOpen: 'Próxima apertura',
  },
  cart: {
    empty: 'Tu carrito está vacío',
    subtotal: 'Subtotal',
    deliveryFee: 'Costo de envío',
    total: 'Total',
  },
  checkout: {
    delivery: 'Entrega a domicilio',
    pickup: 'Recoger en sucursal',
    address: 'Dirección',
    timeSlot: 'Horario',
    payWith: 'Pagar con',
  },
  order: {
    received: 'Recibido',
    preparing: 'En preparación',
    ready: 'Listo',
    outForDelivery: 'En camino',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  },
  reservation: {
    title: 'Reservar mesa',
    name: 'Nombre',
    phone: 'Teléfono',
    partySize: 'Personas',
    confirm: 'Confirmar reserva',
  },
} as const;

export type Messages = typeof es;
