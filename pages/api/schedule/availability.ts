import type { NextApiRequest, NextApiResponse } from 'next';

import { TIMEZONE } from '../../../lib/schedule/config';
import { getBusyIntervals } from '../../../lib/schedule/google';
import {
  earliestBookableTime,
  overlaps,
  slotsForDay,
  upcomingDayKeys
} from '../../../lib/schedule/time';
import type { AvailabilityResponse } from '../../../lib/schedule/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AvailabilityResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  // Disponibilidade velha é pior que nenhuma: o visitante escolheria um
  // horário que já foi tomado.
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');

  try {
    const now = new Date();
    const grid = upcomingDayKeys(now).map((date) => ({
      date,
      slots: slotsForDay(date)
    }));

    const everySlot = grid.flatMap((day) => day.slots);
    if (everySlot.length === 0) {
      return res.status(200).json({ timeZone: TIMEZONE, days: [] });
    }

    // Uma única chamada cobre o horizonte inteiro.
    const busy = await getBusyIntervals(
      everySlot[0].start,
      everySlot[everySlot.length - 1].end
    );

    const busyRanges = busy.map((interval) => ({
      start: new Date(interval.start).getTime(),
      end: new Date(interval.end).getTime()
    }));

    const floor = earliestBookableTime(now).getTime();

    const days = grid
      .map(({ date, slots }) => ({
        date,
        slots: slots
          .filter((slot) => {
            const start = new Date(slot.start).getTime();
            const end = new Date(slot.end).getTime();
            if (start < floor) return false;
            return !busyRanges.some((range) =>
              overlaps(start, end, range.start, range.end)
            );
          })
          .map((slot) => slot.start)
      }))
      .filter((day) => day.slots.length > 0);

    return res.status(200).json({ timeZone: TIMEZONE, days });
  } catch (error) {
    // O detalhe fica no log do Vercel, a resposta não vaza configuração.
    console.error('[schedule/availability]', error);
    return res.status(503).json({ error: 'calendar_unavailable' });
  }
}
