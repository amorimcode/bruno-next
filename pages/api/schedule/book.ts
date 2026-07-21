import type { NextApiRequest, NextApiResponse } from 'next';

import { createEvent, getBusyIntervals } from '../../../lib/schedule/google';
import { findSlot, overlaps } from '../../../lib/schedule/time';
import type { BookResponse } from '../../../lib/schedule/types';

type ErrorResponse = { error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_MIN = 2;
const NAME_MAX = 80;
const TOPIC_MAX = 500;

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

/**
 * Freio best effort: em serverless cada instância tem o seu contador, então
 * isso é só o primeiro filtro. A defesa que importa é a validação de grade
 * logo abaixo, que impede criar evento em horário arbitrário.
 */
const attempts = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter(
    (at) => now - at < RATE_WINDOW_MS
  );

  if (recent.length >= RATE_LIMIT) {
    attempts.set(ip, recent);
    return true;
  }

  recent.push(now);
  attempts.set(ip, recent);
  return false;
}

function clientIp(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return raw?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BookResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const { start, name, email, topic, company } = (req.body ?? {}) as Record<
    string,
    unknown
  >;

  // Honeypot: campo escondido no formulário. Preenchido significa robô, e a
  // resposta finge sucesso para não ensinar o que deu errado.
  if (typeof company === 'string' && company.trim().length > 0) {
    return res
      .status(200)
      .json({ ok: true, start: '', end: '', meetUrl: null, htmlLink: '' });
  }

  if (isRateLimited(clientIp(req))) {
    return res.status(429).json({ error: 'rate_limited' });
  }

  if (
    typeof name !== 'string' ||
    name.trim().length < NAME_MIN ||
    name.trim().length > NAME_MAX
  ) {
    return res.status(400).json({ error: 'invalid_name' });
  }

  if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim())) {
    return res.status(400).json({ error: 'invalid_email' });
  }

  if (typeof topic === 'string' && topic.length > TOPIC_MAX) {
    return res.status(400).json({ error: 'invalid_topic' });
  }

  if (typeof start !== 'string') {
    return res.status(400).json({ error: 'invalid_slot' });
  }

  // Recalcula a grade no servidor. O que o cliente mandou só vale se bater.
  const slot = findSlot(start);
  if (!slot) {
    return res.status(400).json({ error: 'invalid_slot' });
  }

  try {
    // Recheca bem na hora: entre carregar a página e enviar o formulário o
    // horário pode ter sido ocupado por fora.
    const busy = await getBusyIntervals(slot.start, slot.end);
    const slotStart = new Date(slot.start).getTime();
    const slotEnd = new Date(slot.end).getTime();

    const taken = busy.some((interval) =>
      overlaps(
        slotStart,
        slotEnd,
        new Date(interval.start).getTime(),
        new Date(interval.end).getTime()
      )
    );

    if (taken) {
      return res.status(409).json({ error: 'slot_taken' });
    }

    const event = await createEvent({
      start: slot.start,
      end: slot.end,
      name: name.trim(),
      email: email.trim(),
      topic: typeof topic === 'string' ? topic : undefined
    });

    return res.status(201).json({
      ok: true,
      start: slot.start,
      end: slot.end,
      meetUrl: event.meetUrl,
      htmlLink: event.htmlLink
    });
  } catch (error) {
    console.error('[schedule/book]', error);
    return res.status(503).json({ error: 'calendar_unavailable' });
  }
}
