// Local cart state. Lives in the browser only — persisted to localStorage so
// it survives reloads and tab closes. Converted to a server-side `orders` row
// at checkout (slice 4.4).
//
// Each line is uniquely identified by (productId, signature-of-selectedOptions),
// so adding the same product with the same options increments qty instead of
// duplicating, while picking different options creates a new line.

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CartLineSelection = {
  optionId: string;
  valueIds: string[];
};

export type CartLine = {
  /** Stable hash key for de-duping identical configurations of the same product. */
  key: string;
  productId: string;
  productName: string;
  productSlug: string;
  qty: number;
  unitPriceCents: number;
  selectedOptions: CartLineSelection[];
  /** Human-readable summary like "Tipo de queso: Manchego · Extras: Tocino, Mezcalada" */
  optionsSummary: string;
};

export type AddItemInput = Omit<CartLine, 'key' | 'qty'> & { qty: number };

type CartStore = {
  lines: CartLine[];
  addItem: (input: AddItemInput) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

function makeLineKey(productId: string, selectedOptions: CartLineSelection[]): string {
  const normalized = [...selectedOptions]
    .map((o) => ({ optionId: o.optionId, valueIds: [...o.valueIds].sort() }))
    .sort((a, b) => a.optionId.localeCompare(b.optionId));
  return `${productId}::${JSON.stringify(normalized)}`;
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      lines: [],
      addItem: (input) =>
        set((state) => {
          const key = makeLineKey(input.productId, input.selectedOptions);
          const existingIdx = state.lines.findIndex((l) => l.key === key);
          if (existingIdx >= 0) {
            const next = [...state.lines];
            const existing = next[existingIdx]!;
            next[existingIdx] = {
              ...existing,
              qty: Math.min(20, existing.qty + input.qty),
              // Refresh price in case it changed since last add.
              unitPriceCents: input.unitPriceCents,
            };
            return { lines: next };
          }
          return {
            lines: [...state.lines, { ...input, key }],
          };
        }),
      setQty: (key, qty) =>
        set((state) => ({
          lines: state.lines
            .map((l) => (l.key === key ? { ...l, qty: Math.max(0, Math.min(20, qty)) } : l))
            .filter((l) => l.qty > 0),
        })),
      remove: (key) =>
        set((state) => ({ lines: state.lines.filter((l) => l.key !== key) })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: 'estacion33-cart-v1',
      storage: createJSONStorage(() => localStorage),
      // Only persist the lines array, not the methods (they're recreated on rehydration).
      partialize: (state) => ({ lines: state.lines }),
      version: 1,
    },
  ),
);

/** Selector helpers — call these from components instead of computing inline. */
export const selectCartCount = (state: CartStore): number =>
  state.lines.reduce((sum, l) => sum + l.qty, 0);

export const selectCartSubtotalCents = (state: CartStore): number =>
  state.lines.reduce((sum, l) => sum + l.unitPriceCents * l.qty, 0);
