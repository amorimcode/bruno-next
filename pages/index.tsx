import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Container from '../components/Container';
import ProjectCard from '../components/ProjectCard';
import ui from '../lib/i18n';
import projects from '../lib/projects';
import { LocalizedProject, localizeProject, pickLocale } from '../lib/types';

type Props = {
  personal: LocalizedProject[];
  company: LocalizedProject[];
};

export default function Home({ personal, company }: Props) {
  const locale = pickLocale(useRouter().locale);

  return (
    <Container>
      {/* Hero */}
      <section className="mx-auto w-full max-w-wrap px-6 pb-20 pt-16 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p
              className="rise font-mono text-[11px] uppercase tracking-[0.26em] text-accent"
              style={{ animationDelay: '0ms' }}
            >
              {ui.hero.eyebrow[locale]}
            </p>
            <h1
              className="rise mt-6 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
              style={{ animationDelay: '90ms' }}
            >
              {ui.hero.titleA[locale]}{' '}
              <em className="text-accent">{ui.hero.titleEm[locale]}</em>
              {ui.hero.titleB[locale]}
            </h1>
            <p
              className="rise mt-8 max-w-2xl text-base leading-8 text-muted sm:text-lg sm:leading-9"
              style={{ animationDelay: '180ms' }}
            >
              {ui.hero.lede[locale]}
            </p>
          </div>

          <figure
            className="rise mx-auto w-60 sm:w-72 lg:col-span-4 lg:w-full"
            style={{ animationDelay: '240ms' }}
          >
            <div className="rotate-2 transition-transform duration-500 ease-out hover:rotate-0">
              <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl">
                <Image
                  src="https://github.com/amorimcode.png"
                  alt="Bruno Amorim"
                  width={460}
                  height={460}
                  priority
                  className="aspect-square w-full object-cover"
                />
              </div>
              <figcaption className="mt-4 flex items-baseline justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                <span className="text-ink">Bruno Amorim</span>
                <span>{ui.hero.location[locale]}</span>
              </figcaption>
            </div>
          </figure>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-line">
        <dl className="mx-auto grid w-full max-w-wrap grid-cols-2 divide-line px-6 sm:grid-cols-4 sm:divide-x">
          {ui.hero.stats.map((stat, i) => (
            <div
              key={stat.value + i}
              className="flex flex-col py-8 sm:px-8 sm:first:pl-0 sm:last:pr-0"
            >
              <dt className="order-2 mt-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-muted">
                {stat.label[locale]}
              </dt>
              <dd className="order-1 font-display text-4xl tracking-tight text-accent sm:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Own products */}
      <section className="mx-auto w-full max-w-wrap px-6 pt-20 sm:pt-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl tracking-tight sm:text-5xl">
            {ui.sections.ownProducts[locale]}
          </h2>
          <p className="max-w-sm text-sm leading-6 text-muted">
            {ui.sections.ownProductsHint[locale]}
          </p>
        </div>

        <div className="mt-14 space-y-20 sm:mt-20 sm:space-y-28">
          {personal.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
              readCaseLabel={ui.sections.readCase[locale]}
              priority={index === 0}
            />
          ))}
        </div>
      </section>

      {/* Company work */}
      <section className="mx-auto w-full max-w-wrap px-6 pt-24 sm:pt-32">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl tracking-tight sm:text-5xl">
            {ui.sections.companyWork[locale]}
          </h2>
          <p className="max-w-sm text-sm leading-6 text-muted">
            {ui.sections.companyWorkHint[locale]}
          </p>
        </div>

        <div className="mt-14 space-y-20 sm:mt-20 sm:space-y-28">
          {company.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
              readCaseLabel={ui.sections.readCase[locale]}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/projects"
            className="und font-mono text-[11px] uppercase tracking-[0.22em] text-ink"
          >
            {ui.sections.allProjects[locale]} →
          </Link>
        </div>
      </section>

      {/* Principles — taste made explicit */}
      <section className="mx-auto w-full max-w-wrap px-6 pt-24 sm:pt-32">
        <h2 className="font-display text-3xl tracking-tight sm:text-5xl">
          {ui.sections.principles[locale]}
        </h2>
        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
          {ui.principles.map((principle, i) => (
            <div key={i} className="bg-surface p-8 sm:p-10">
              <span className="font-mono text-[11px] tracking-[0.22em] text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 font-display text-xl italic tracking-tight sm:text-2xl">
                {principle.title[locale]}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted">
                {principle.body[locale]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="mx-auto w-full max-w-wrap px-6 py-24 sm:py-32">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl tracking-tight sm:text-5xl">
            {ui.sections.experience[locale]}
          </h2>
          <Link
            href="/about"
            className="und font-mono text-[11px] uppercase tracking-[0.22em] text-muted hover:text-ink"
          >
            {ui.sections.fullStory[locale]} →
          </Link>
        </div>
        <ol className="mt-12">
          {ui.experience.map((job, i) => (
            <li
              key={job.company}
              className="grid gap-2 border-t border-line py-7 last:border-b sm:grid-cols-12 sm:gap-6"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted sm:col-span-3 sm:pt-1">
                {job.period[locale]}
              </span>
              <div className="sm:col-span-9">
                <h3 className="font-display text-xl tracking-tight">
                  {job.company}
                  <span className="text-muted"> — {job.role[locale]}</span>
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
                  {job.summary[locale]}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </Container>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => {
  const resolved = pickLocale(locale);
  const featured = projects.filter((p) => p.featured);
  return {
    props: {
      personal: featured
        .filter((p) => p.kind === 'personal')
        .map((p) => localizeProject(p, resolved)),
      company: featured
        .filter((p) => p.kind === 'company')
        .map((p) => localizeProject(p, resolved))
    }
  };
};
