/**
 * Conversão de fuso sem biblioteca de data. O Brasil não tem mais horário de
 * verão, mas cravar `-03:00` na mão é dívida técnica: aqui o offset real é
 * derivado de cada instante com `Intl`, então uma mudança futura de regra não
 * quebra a agenda.
 */
import {
  DAY_START_HOUR,
  dayEndHour,
  HORIZON_DAYS,
  MIN_NOTICE_MINUTES,
  SLOT_MINUTES,
  TIMEZONE,
  WORK_DAYS
} from './config';

export type Slot = {
  /** Instante ISO em UTC. */
  start: string;
  end: string;
};

const zoneFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: TIMEZONE,
  hourCycle: 'h23',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function zonedParts(instant: Date) {
  const parts = zoneFormatter.formatToParts(instant);
  const read = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);

  return {
    year: read('year'),
    month: read('month'),
    day: read('day'),
    hour: read('hour'),
    minute: read('minute'),
    second: read('second')
  };
}

/** Minutos que o fuso alvo está à frente do UTC nesse instante. */
function zoneOffsetMinutes(instant: Date): number {
  const parts = zonedParts(instant);
  const asUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );
  // As partes formatadas não têm milissegundos, então o instante é truncado
  // ao segundo antes de comparar.
  return (asUtc - Math.floor(instant.getTime() / 1000) * 1000) / 60_000;
}

/**
 * Hora de parede no fuso alvo convertida para o instante UTC correspondente.
 * A segunda passada corrige o caso raro em que o chute inicial cai do outro
 * lado de uma virada de offset.
 */
export function wallClockToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): Date {
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  const firstOffset = zoneOffsetMinutes(new Date(guess));
  const candidate = new Date(guess - firstOffset * 60_000);
  const secondOffset = zoneOffsetMinutes(candidate);

  return secondOffset === firstOffset
    ? candidate
    : new Date(guess - secondOffset * 60_000);
}

/** `YYYY-MM-DD` do instante, já no fuso da agenda. */
export function dayKeyInZone(instant: Date): string {
  const parts = zonedParts(instant);
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

function parseDayKey(dayKey: string): [number, number, number] {
  const [year, month, day] = dayKey.split('-').map(Number);
  return [year, month, day];
}

/** Dia da semana de uma data de calendário, sem influência de fuso. */
export function weekdayForDayKey(dayKey: string): number {
  const [year, month, day] = parseDayKey(dayKey);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

/**
 * Dias úteis abertos para agendamento, a partir de hoje no fuso da agenda.
 * A conta é de calendário puro, então nenhuma virada de offset some com um dia.
 */
export function upcomingDayKeys(now: Date = new Date()): string[] {
  const [year, month, day] = parseDayKey(dayKeyInZone(now));
  const keys: string[] = [];

  for (let index = 0; index < HORIZON_DAYS; index += 1) {
    const cursor = new Date(Date.UTC(year, month - 1, day + index));
    if (!WORK_DAYS.includes(cursor.getUTCDay())) continue;
    keys.push(
      `${cursor.getUTCFullYear()}-${pad(cursor.getUTCMonth() + 1)}-${pad(
        cursor.getUTCDate()
      )}`
    );
  }

  return keys;
}

/** Grade completa de um dia, antes de descontar o que já está ocupado. */
export function slotsForDay(dayKey: string): Slot[] {
  const weekday = weekdayForDayKey(dayKey);
  if (!WORK_DAYS.includes(weekday)) return [];

  const [year, month, day] = parseDayKey(dayKey);
  const windowMinutes = (dayEndHour(weekday) - DAY_START_HOUR) * 60;
  const slots: Slot[] = [];

  for (
    let offset = 0;
    offset + SLOT_MINUTES <= windowMinutes;
    offset += SLOT_MINUTES
  ) {
    // `Date.UTC` normaliza minuto acima de 59, então somar o offset direto
    // no minuto inicial já anda pelas horas da janela.
    const start = wallClockToUtc(year, month, day, DAY_START_HOUR, offset);
    const end = new Date(start.getTime() + SLOT_MINUTES * 60_000);
    slots.push({ start: start.toISOString(), end: end.toISOString() });
  }

  return slots;
}

/** Primeiro instante que ainda respeita a antecedência mínima. */
export function earliestBookableTime(now: Date = new Date()): Date {
  return new Date(now.getTime() + MIN_NOTICE_MINUTES * 60_000);
}

/**
 * Confere que o horário pedido é de fato um bloco da grade, dentro do
 * horizonte e da antecedência mínima. É o que impede a rota de agendamento de
 * virar um criador de evento em qualquer data da agenda pessoal.
 */
export function findSlot(startIso: string, now: Date = new Date()): Slot | null {
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return null;
  if (start.getTime() < earliestBookableTime(now).getTime()) return null;

  const dayKey = dayKeyInZone(start);
  if (!upcomingDayKeys(now).includes(dayKey)) return null;

  const normalized = start.toISOString();
  return slotsForDay(dayKey).find((slot) => slot.start === normalized) ?? null;
}

/** Verdadeiro quando os dois intervalos se sobrepõem de verdade. */
export function overlaps(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number
): boolean {
  return aStart < bEnd && aEnd > bStart;
}
