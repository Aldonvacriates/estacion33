// Curated Spanish food / family / hospitality refranes used on the /cuenta
// dashboard. The home picks one deterministically from the day-of-year so
// every visit on the same day shows the same quote — feels like a daily
// thought, not a random spam.
//
// Adding new quotes: append to the array. Order doesn't matter (the picker
// hashes by day-of-year, so the lineup just gets bigger and the same date
// might land on a different quote next year).

export type Quote = {
  text: string;
  author?: string;
};

export const QUOTES: Quote[] = [
  { text: 'La comida sabe mejor en buena compañía.', author: 'Refrán mexicano' },
  { text: 'Barriga llena, corazón contento.', author: 'Refrán popular' },
  { text: 'A buen hambre, no hay pan duro.', author: 'Refrán español' },
  { text: 'La mejor salsa del mundo es el hambre.', author: 'Miguel de Cervantes' },
  { text: 'Cocinar es un acto de amor.', author: 'Anónimo' },
  { text: 'Donde comen dos, comen tres.', author: 'Refrán mexicano' },
  { text: 'El que tiene hambre, en pan piensa.', author: 'Refrán popular' },
  { text: 'La cocina es el corazón del hogar.', author: 'Anónimo' },
  { text: 'Sin comida no hay fiesta.', author: 'Refrán mexicano' },
  { text: 'A todo le llega su sazón.', author: 'Refrán popular' },
  {
    text: 'Que tu comida sea tu medicina y que tu medicina sea tu comida.',
    author: 'Hipócrates',
  },
  { text: 'Una buena hamburguesa es un acto de fe.', author: 'Anónimo' },
  { text: 'No hay amor más sincero que el que se siente por la comida.', author: 'George Bernard Shaw' },
  { text: 'La vida es muy corta para comer mal.', author: 'Anónimo' },
  { text: 'Compartir el pan es compartir la vida.', author: 'Refrán popular' },
  { text: 'La buena mesa une a la familia.', author: 'Refrán mexicano' },
  { text: 'A pan duro, diente agudo.', author: 'Refrán español' },
  { text: 'El sabor de la casa no se olvida.', author: 'Anónimo' },
  { text: 'Comer bien es un derecho, comer rico es un placer.', author: 'Anónimo' },
  { text: 'En la cocina se cocinan recuerdos.', author: 'Anónimo' },
  { text: 'La parrilla es el alma de la fiesta.', author: 'Refrán popular' },
  { text: 'Buen viernes, mejor pedido.', author: 'Estación 33' },
  { text: 'El mejor maestro es el sabor.', author: 'Anónimo' },
  { text: 'Para comer rico no se necesita prisa.', author: 'Refrán mexicano' },
  { text: 'Los amigos se hacen alrededor de la mesa.', author: 'Refrán popular' },
  { text: 'Cocina con cariño, sirve con sonrisa.', author: 'Estación 33' },
  { text: 'Donde hay sabor, hay historia.', author: 'Anónimo' },
  { text: 'El hambre es el mejor cocinero.', author: 'Refrán español' },
  { text: 'No hay nada como comer en casa.', author: 'Refrán mexicano' },
  { text: 'Comer es necesario, disfrutar es opcional. Aquí lo hacemos siempre.', author: 'Estación 33' },
];

/**
 * Pick today's quote based on UTC day-of-year. Same input → same output, so
 * SSR and CSR agree.
 */
export function quoteOfTheDay(now: Date = new Date()): Quote {
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  const diff = now.getTime() - start;
  const day = Math.floor(diff / 86_400_000); // 1..366
  return QUOTES[day % QUOTES.length]!;
}

/**
 * Pick a uniformly random quote — useful for the public API endpoint when
 * the caller wants variety on every request.
 */
export function randomQuote(): Quote {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)]!;
}
