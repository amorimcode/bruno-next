import Image from 'next/image';
import { useRouter } from 'next/router';

import Container from '../components/Container';
import Headline from '../components/Headline';
import Reveal from '../components/Reveal';
import ui from '../lib/i18n';
import { pickLocale } from '../lib/types';

const EMAIL = 'me@brunoamorim.dev';

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
            <Headline
              as="h1"
              className="font-display text-4xl tracking-tight sm:text-6xl"
            >
              {about.title[locale]}
            </Headline>
            <Reveal
              as="p"
              delay={0.24}
              y={16}
              className="mt-5 font-display text-xl italic text-muted sm:text-2xl"
            >
              {about.lede[locale]}
            </Reveal>
            <Reveal
              stagger={0.08}
              delay={0.32}
              className="mt-10 space-y-6 text-base leading-8 text-ink sm:leading-9"
            >
              {about.story.map((paragraph, i) => (
                <p key={i}>{paragraph[locale]}</p>
              ))}
            </Reveal>

            {/* Experience */}
            <Reveal
              as="h2"
              y={14}
              className="mt-20 font-mono text-[11px] uppercase tracking-[0.22em] text-accent"
            >
              {ui.sections.experience[locale]}
            </Reveal>
            <Reveal as="ol" stagger={0.08} className="mt-6">
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
            </Reveal>

            {/* Education */}
            <Reveal
              as="h2"
              y={14}
              className="mt-20 font-mono text-[11px] uppercase tracking-[0.22em] text-accent"
            >
              {about.education[locale]}
            </Reveal>
            <Reveal as="ul" stagger={0.08} className="mt-6 space-y-6">
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
            </Reveal>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="space-y-10 lg:sticky lg:top-24">
              <Reveal
                delay={0.2}
                className="overflow-hidden rounded-3xl border border-line"
              >
                <Image
                  src="/bruno.jpg"
                  alt="Bruno Amorim"
                  width={920}
                  height={920}
                  priority
                  className="w-full"
                />
                <p className="border-t border-line bg-surface px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  {ui.hero.location[locale]}
                </p>
              </Reveal>

              <div>
                <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                  {about.toolbox[locale]}
                </h2>
                <Reveal as="dl" stagger={0.07} className="mt-4 space-y-4">
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
                </Reveal>
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
