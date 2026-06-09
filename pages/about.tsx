import Image from 'next/image';
import { useRouter } from 'next/router';

import Container from '../components/Container';
import ui from '../lib/i18n';
import { pickLocale } from '../lib/types';

const EMAIL = 'bruno.amorim032@gmail.com';

export default function About() {
  const locale = pickLocale(useRouter().locale);
  const about = ui.about;

  return (
    <Container
      title={`${about.title[locale]} — Bruno Amorim`}
      description={about.lede[locale]}
    >
      <section className="mx-auto w-full max-w-wrap px-6 pb-24 pt-16 sm:pt-24">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Story */}
          <div className="lg:col-span-7">
            <h1 className="rise font-display text-4xl tracking-tight sm:text-6xl">
              {about.title[locale]}
            </h1>
            <p
              className="rise mt-5 font-display text-xl italic text-muted sm:text-2xl"
              style={{ animationDelay: '90ms' }}
            >
              {about.lede[locale]}
            </p>
            <div
              className="rise mt-10 space-y-6 text-base leading-8 text-ink sm:leading-9"
              style={{ animationDelay: '180ms' }}
            >
              {about.story.map((paragraph, i) => (
                <p key={i}>{paragraph[locale]}</p>
              ))}
            </div>

            {/* Experience */}
            <h2 className="mt-20 font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              {ui.sections.experience[locale]}
            </h2>
            <ol className="mt-6">
              {ui.experience.map((job) => (
                <li
                  key={job.company}
                  className="grid gap-1.5 border-t border-line py-6 last:border-b sm:grid-cols-12 sm:gap-6"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted sm:col-span-4 sm:pt-1">
                    {job.period[locale]}
                  </span>
                  <div className="sm:col-span-8">
                    <h3 className="font-display text-lg tracking-tight">
                      {job.company}
                      <span className="text-muted"> — {job.role[locale]}</span>
                    </h3>
                    <p className="mt-1.5 text-sm leading-7 text-muted">
                      {job.summary[locale]}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            {/* Education */}
            <h2 className="mt-20 font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              {about.education[locale]}
            </h2>
            <ul className="mt-6 space-y-6">
              {about.educationItems.map((item, i) => (
                <li key={i}>
                  <h3 className="font-display text-lg tracking-tight">
                    {item.title[locale]}
                  </h3>
                  <p className="mt-1.5 text-sm leading-7 text-muted">
                    {item.detail[locale]}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="space-y-10 lg:sticky lg:top-24">
              <div className="rise overflow-hidden rounded-3xl border border-line">
                <Image
                  src="https://github.com/amorimcode.png"
                  alt="Bruno Amorim"
                  width={480}
                  height={480}
                  priority
                  className="w-full"
                />
                <p className="border-t border-line bg-surface px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  {ui.hero.location[locale]}
                </p>
              </div>

              <div>
                <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                  {about.toolbox[locale]}
                </h2>
                <dl className="mt-4 space-y-4">
                  {about.toolboxGroups.map((group, i) => (
                    <div key={i} className="border-t border-line pt-4">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                        {group.label[locale]}
                      </dt>
                      <dd className="mt-1.5 text-sm leading-7 text-muted">
                        {group.items}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div>
                <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                  {about.contact[locale]}
                </h2>
                <ul className="mt-4 space-y-2.5 text-sm leading-6">
                  <li>
                    <a href={`mailto:${EMAIL}`} className="und text-ink">
                      {EMAIL}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/in/amorim-bruno/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="und text-ink"
                    >
                      linkedin.com/in/amorim-bruno ↗
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/amorimcode"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="und text-ink"
                    >
                      github.com/amorimcode ↗
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </Container>
  );
}
