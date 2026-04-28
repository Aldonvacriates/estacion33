export { es, type Messages } from './es';
import { es } from './es';

export const messages = { es } as const;
export type Locale = keyof typeof messages;
export const defaultLocale: Locale = 'es';
