import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import ui from '../lib/i18n';
import type {
  AvailabilityResponse,
  BookResponse
} from '../lib/schedule/types';
import { Locale, pickLocale } from '../lib/types';

type Status = 'loading' | 'ready' | 'submitting' | 'done' | 'failed';
type ErrorKey = 'taken' | 'invalid' | 'rate' | 'generic';

const FALLBACK_ZONE = 'America/Sao_Paulo';

function intlLocale(locale: Locale): string {
  return locale === 'pt' ? 'pt-BR' : 'en-US';
}

function formatTime(iso: string, locale: Locale, timeZone?: string): string {
  return new Date(iso).toLocaleTimeString(intlLocale(locale), {
    hour: '2-digit',
    minute: '2-digit',
    timeZone
  });
}

function formatFullDate(iso: string, locale: Locale, timeZone?: string): string {
  return new Date(iso).toLocaleDateString(intlLocale(locale), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone
  });
}

/**
 * A chave do dia já vem no fuso da agenda, então é formatada como data de
 * calendário pura. Meio-dia em UTC evita que qualquer fuso vire o dia.
 */
function dayParts(dayKey: string, locale: Locale) {
  const date = new Date(`${dayKey}T12:00:00Z`);
  return {
    weekday: date.toLocaleDateString(intlLocale(locale), {
      weekday: 'short',
      timeZone: 'UTC'
    }),
    day: date.toLocaleDateString(intlLocale(locale), {
      day: '2-digit',
      timeZone: 'UTC'
    }),
    month: date.toLocaleDateString(intlLocale(locale), {
      month: 'short',
      timeZone: 'UTC'
    })
  };
}

export default function Scheduler() {
  const locale = pickLocale(useRouter().locale);
  const t = ui.schedule;

  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<ErrorKey | null>(null);
  const [data, setData] = useState<AvailabilityResponse | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [result, setResult] = useState<BookResponse | null>(null);
  const [visitorZone, setVisitorZone] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [company, setCompany] = useState('');

  useEffect(() => {
    setVisitorZone(Intl.DateTimeFormat().resolvedOptions().timeZone || null);
  }, []);

  const load = useCallback(async () => {
    setStatus('loading');
    setError(null);

    try {
      const response = await fetch('/api/schedule/availability');
      if (!response.ok) throw new Error('unavailable');

      const payload: AvailabilityResponse = await response.json();
      setData(payload);
      setSelectedDay((current) =>
        current && payload.days.some((day) => day.date === current)
          ? current
          : payload.days[0]?.date ?? null
      );
      setSelectedSlot(null);
      setStatus('ready');
    } catch {
      setStatus('failed');
      setError('generic');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const calendarZone = data?.timeZone ?? FALLBACK_ZONE;
  const showsBothZones = Boolean(visitorZone && visitorZone !== calendarZone);
  const days = data?.days ?? [];
  const activeDay = days.find((day) => day.date === selectedDay) ?? null;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedSlot) return;

    setStatus('submitting');
    setError(null);

    try {
      const response = await fetch('/api/schedule/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start: selectedSlot,
          name,
          email,
          topic,
          company
        })
      });

      if (response.status === 409) {
        // A agenda mudou por fora, então a lista é recarregada. O aviso vem
        // depois porque `load` limpa o erro anterior.
        await load();
        setError('taken');
        return;
      }

      if (response.status === 429) {
        setError('rate');
        setStatus('ready');
        return;
      }

      if (response.status === 400) {
        setError('invalid');
        setStatus('ready');
        return;
      }

      if (!response.ok) throw new Error('failed');

      setResult((await response.json()) as BookResponse);
      setStatus('done');
    } catch {
      setError('generic');
      setStatus('ready');
    }
  }

  if (status === 'done' && result) {
    return (
      <section className="mx-auto w-full max-w-wrap px-6 pb-28">
        <div className="rise max-w-2xl border-t border-line pt-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-accent">
            {t.eyebrow[locale]}
          </p>
          <h2 className="mt-6 font-display text-3xl tracking-tight sm:text-5xl">
            {t.confirmed.title[locale]}
          </h2>

          <p className="mt-8 font-display text-xl italic tracking-tight sm:text-2xl">
            {formatFullDate(result.start, locale, visitorZone ?? undefined)},{' '}
            {formatTime(result.start, locale, visitorZone ?? undefined)}
          </p>
          {showsBothZones && (
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              {formatTime(result.start, locale, calendarZone)}{' '}
              {t.inSaoPaulo[locale]}
            </p>
          )}

          <p className="mt-6 text-sm leading-7 text-muted">
            {t.confirmed.body[locale]}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            {result.meetUrl && (
              <a
                href={result.meetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-bg transition-opacity hover:opacity-90"
              >
                {t.confirmed.meet[locale]} <span aria-hidden="true">↗</span>
              </a>
            )}
            <Link
              href="/"
              className="und font-mono text-[11px] uppercase tracking-[0.18em] text-muted hover:text-ink"
            >
              {t.confirmed.home[locale]} →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-wrap px-6 pb-28">
      <div className="border-t border-line pt-12">
        {status === 'loading' && (
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            {t.loading[locale]}
          </p>
        )}

        {status === 'failed' && (
          <div>
            <p className="text-sm leading-7 text-muted">
              {t.errors.generic[locale]}
            </p>
            <button
              type="button"
              onClick={load}
              className="mt-6 rounded-full border border-line px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors hover:border-accent hover:text-accent"
            >
              {t.errors.retry[locale]}
            </button>
          </div>
        )}

        {status !== 'loading' && status !== 'failed' && days.length === 0 && (
          <p className="max-w-lg text-sm leading-7 text-muted">
            {t.noSlots[locale]}
          </p>
        )}

        {status !== 'loading' && status !== 'failed' && days.length > 0 && (
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
            {/* Passo 1 e 2: dia e horário.
                `min-w-0` é obrigatório: sem ele a track do grid herda
                `min-width: auto`, a faixa de dias rolável estica a coluna e a
                página inteira ganha scroll horizontal. */}
            <div className="min-w-0 lg:col-span-7">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                {t.pickDay[locale]}
              </h2>

              <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
                {days.map((day) => {
                  const parts = dayParts(day.date, locale);
                  const isActive = day.date === selectedDay;

                  return (
                    <button
                      key={day.date}
                      type="button"
                      aria-pressed={isActive}
                      // O rótulo visível é picotado em três spans, o que deixa
                      // o botão sem nome acessível para leitor de tela.
                      aria-label={new Date(
                        `${day.date}T12:00:00Z`
                      ).toLocaleDateString(intlLocale(locale), {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        timeZone: 'UTC'
                      })}
                      onClick={() => {
                        setSelectedDay(day.date);
                        setSelectedSlot(null);
                      }}
                      className={`flex shrink-0 flex-col items-center rounded-2xl border px-4 py-3 transition-colors ${
                        isActive
                          ? 'border-accent bg-accent-soft text-accent'
                          : 'border-line text-muted hover:border-accent hover:text-ink'
                      }`}
                    >
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
                        {parts.weekday}
                      </span>
                      <span className="mt-1 font-display text-2xl leading-none tracking-tight">
                        {parts.day}
                      </span>
                      <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em]">
                        {parts.month}
                      </span>
                    </button>
                  );
                })}
              </div>

              <h2 className="mt-12 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                {t.pickTime[locale]}
              </h2>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                {t.yourTimezone[locale]}
                {visitorZone ? ` · ${visitorZone.replace(/_/g, ' ')}` : ''}
              </p>

              {activeDay && activeDay.slots.length > 0 ? (
                <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {activeDay.slots.map((slot) => {
                    const isActive = slot === selectedSlot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => {
                          setSelectedSlot(slot);
                          setError(null);
                        }}
                        className={`rounded-xl border px-2 py-3 font-mono text-xs tracking-[0.08em] transition-colors ${
                          isActive
                            ? 'border-accent bg-accent-soft text-accent'
                            : 'border-line text-muted hover:border-accent hover:text-ink'
                        }`}
                      >
                        {formatTime(slot, locale, visitorZone ?? undefined)}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-5 text-sm leading-7 text-muted">
                  {t.noSlotsForDay[locale]}
                </p>
              )}
            </div>

            {/* Passo 3: quem está marcando */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-line bg-surface p-8">
                <h2 className="font-display text-2xl tracking-tight">
                  {t.form.title[locale]}
                </h2>

                {selectedSlot ? (
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                    {formatFullDate(
                      selectedSlot,
                      locale,
                      visitorZone ?? undefined
                    )}
                    {' · '}
                    {formatTime(selectedSlot, locale, visitorZone ?? undefined)}
                    {showsBothZones
                      ? ` (${formatTime(selectedSlot, locale, calendarZone)} ${
                          t.inSaoPaulo[locale]
                        })`
                      : ''}
                  </p>
                ) : (
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    {t.pickTime[locale]}
                  </p>
                )}

                <form onSubmit={submit} className="mt-8 space-y-6">
                  <div>
                    <label
                      htmlFor="schedule-name"
                      className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted"
                    >
                      {t.form.name[locale]}
                    </label>
                    <input
                      id="schedule-name"
                      type="text"
                      required
                      minLength={2}
                      maxLength={80}
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="mt-2 w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="schedule-email"
                      className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted"
                    >
                      {t.form.email[locale]}
                    </label>
                    <input
                      id="schedule-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="mt-2 w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
                    />
                    <p className="mt-2 text-xs leading-5 text-muted">
                      {t.form.emailHint[locale]}
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="schedule-topic"
                      className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted"
                    >
                      {t.form.topic[locale]}
                    </label>
                    <textarea
                      id="schedule-topic"
                      rows={3}
                      maxLength={500}
                      value={topic}
                      onChange={(event) => setTopic(event.target.value)}
                      className="mt-2 w-full resize-none rounded-xl border border-line bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
                    />
                    <p className="mt-2 text-xs leading-5 text-muted">
                      {t.form.topicHint[locale]}
                    </p>
                  </div>

                  {/* Honeypot: invisível para gente, irresistível para robô. */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="schedule-company">Company</label>
                    <input
                      id="schedule-company"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={company}
                      onChange={(event) => setCompany(event.target.value)}
                    />
                  </div>

                  {error && (
                    <p
                      role="alert"
                      className="text-sm leading-6 text-accent"
                    >
                      {t.errors[error][locale]}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={!selectedSlot || status === 'submitting'}
                    className="w-full rounded-full bg-accent px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {status === 'submitting'
                      ? t.form.sending[locale]
                      : t.form.submit[locale]}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
