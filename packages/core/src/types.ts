export type Money = {
  amount: number;
  currency: 'MXN';
};

export type FulfillmentType = 'delivery' | 'pickup';

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'no_show';

export type Category = {
  id: string;
  slug: string;
  name: string;
  sortOrder: number;
};

export type Product = {
  id: string;
  slug: string;
  categoryId: string;
  name: string;
  description: string | null;
  basePrice: Money;
  imageUrl: string | null;
  available: boolean;
};

export type ProductOption = {
  id: string;
  productId: string;
  name: string;
  required: boolean;
  multi: boolean;
  values: ProductOptionValue[];
};

export type ProductOptionValue = {
  id: string;
  optionId: string;
  name: string;
  priceDelta: Money;
};

export type CartItem = {
  productId: string;
  qty: number;
  selectedOptions: { optionId: string; valueIds: string[] }[];
  unitPrice: Money;
};

export type Address = {
  id: string;
  userId: string;
  label: string | null;
  line1: string;
  line2: string | null;
  city: string;
  lat: number | null;
  lng: number | null;
};

export type Order = {
  id: string;
  userId: string | null;
  status: OrderStatus;
  fulfillment: FulfillmentType;
  addressId: string | null;
  scheduledFor: string;
  subtotal: Money;
  deliveryFee: Money;
  total: Money;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  mpPreferenceId: string | null;
  notes: string | null;
  createdAt: string;
};

export type Reservation = {
  id: string;
  userId: string | null;
  guestName: string;
  phone: string;
  partySize: number;
  slotAt: string;
  status: ReservationStatus;
  createdAt: string;
};
