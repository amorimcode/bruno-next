/**
 * Regras da agenda pública. Tudo que define "quando dá para marcar" mora aqui,
 * para mudar horário ou duração sem caçar número solto pelo código.
 */

/** Fuso em que a janela de atendimento é definida. */
export const TIMEZONE = 'America/Sao_Paulo';

/** Dias da semana atendidos, no padrão de `Date#getUTCDay` (0 = domingo). */
export const WORK_DAYS = [1, 2, 3, 4, 5];

/** Início da janela, em hora cheia no fuso acima. */
export const DAY_START_HOUR = 13;

/** Fim da janela. O último bloco termina exatamente nessa hora. */
export const DAY_END_HOUR = 18;

/**
 * Exceções ao fim da janela, por dia da semana (mesmo padrão de `WORK_DAYS`).
 * Sexta fecha às 16h, então o último bloco do dia começa 15h30.
 */
const DAY_END_HOUR_BY_WEEKDAY: Record<number, number> = { 5: 16 };

/** Fim da janela naquele dia da semana, já com a exceção aplicada. */
export function dayEndHour(weekday: number): number {
  return DAY_END_HOUR_BY_WEEKDAY[weekday] ?? DAY_END_HOUR;
}

/** Duração de cada bloco, em minutos. */
export const SLOT_MINUTES = 30;

/** Quantos dias para frente a agenda fica aberta. */
export const HORIZON_DAYS = 30;

/** Antecedência mínima entre o pedido e o começo da conversa. */
export const MIN_NOTICE_MINUTES = 120;

/** Agenda usada para ler ocupação e criar os eventos. */
export const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'primary';
