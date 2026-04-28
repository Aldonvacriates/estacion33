// Money formatting. Inputs are integer MXN cents.

const mxnFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Format integer MXN cents as a localized string, e.g. 13500 → "$135". */
export function formatMxn(cents: number): string {
  return mxnFormatter.format(Math.round(cents / 100));
}

/** Format integer MXN cents with explicit decimals, e.g. 13550 → "$135.50". */
export function formatMxnPrecise(cents: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}
