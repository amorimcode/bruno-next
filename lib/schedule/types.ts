/**
 * Contrato entre as rotas de API e a UI. Fica separado do resto de
 * `lib/schedule` porque é o único pedaço que o browser também importa, e aqui
 * não há nada de credencial nem de `process.env`.
 */

export type AvailabilityDay = {
  /** `YYYY-MM-DD` no fuso da agenda. */
  date: string;
  /** Instantes ISO em UTC. A UI converte para o fuso do visitante. */
  slots: string[];
};

export type AvailabilityResponse = {
  timeZone: string;
  days: AvailabilityDay[];
};

export type BookResponse = {
  ok: true;
  start: string;
  end: string;
  meetUrl: string | null;
  htmlLink: string;
};
