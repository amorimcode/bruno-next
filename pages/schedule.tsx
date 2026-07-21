import { useRouter } from 'next/router';

import Container from '../components/Container';
import Scheduler from '../components/Scheduler';
import ui from '../lib/i18n';
import { pickLocale } from '../lib/types';

export default function Schedule() {
  const locale = pickLocale(useRouter().locale);
  const schedule = ui.schedule;

  return (
    <Container
      title={schedule.metaTitle[locale]}
      description={schedule.lede[locale]}
    >
      <section className="mx-auto w-full max-w-wrap px-6 pb-16 pt-16 sm:pt-24">
        <p
          className="rise font-mono text-[11px] uppercase tracking-[0.26em] text-accent"
          style={{ animationDelay: '0ms' }}
        >
          {schedule.eyebrow[locale]}
        </p>
        <h1
          className="rise mt-6 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl"
          style={{ animationDelay: '90ms' }}
        >
          {schedule.titleA[locale]}{' '}
          <em className="text-accent">{schedule.titleEm[locale]}</em>
          {schedule.titleB[locale]}
        </h1>
        <p
          className="rise mt-8 max-w-2xl text-base leading-8 text-muted sm:text-lg sm:leading-9"
          style={{ animationDelay: '180ms' }}
        >
          {schedule.lede[locale]}
        </p>
        <p
          className="rise mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted"
          style={{ animationDelay: '240ms' }}
        >
          {schedule.window[locale]}
        </p>
      </section>

      <Scheduler />
    </Container>
  );
}
