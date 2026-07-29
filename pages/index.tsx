import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Console3D = dynamic(() => import('../components/Console3D'), {
  ssr: false,
  loading: () => null
});

const Loop3D = dynamic(() => import('../components/Loop3D'), {
  ssr: false,
  loading: () => null
});

import AppSwarm, { SwarmApp } from '../components/AppSwarm';
import Container from '../components/Container';
import Counter from '../components/Counter';
import Headline from '../components/Headline';
import Magnetic from '../components/Magnetic';
import ProjectCard from '../components/ProjectCard';
import Reveal from '../components/Reveal';
import ui from '../lib/i18n';
import projects, { shippedApps } from '../lib/projects';
import { LocalizedProject, localizeProject, pickLocale } from '../lib/types';

type Props = {
  personal: LocalizedProject[];
  company: LocalizedProject[];
  apps: SwarmApp[];
};

/**
 * “I build the apps” / “Eu construo os apps” — as duas versões terminam na mesma
 * palavra, e é dela que os ícones saltam. Separar pelo último espaço evita ter
 * que quebrar a frase em três campos no dicionário.
 */
function splitLastWord(sentence: string) {
  const cut = sentence.lastIndexOf(' ');
  if (cut < 0) return { lead: '', word: sentence };
  return { lead: sentence.slice(0, cut), word: sentence.slice(cut + 1) };
}

export default function Home({ personal, company, apps }: Props) {
  const locale = pickLocale(useRouter().locale);
  const { lead, word } = splitLastWord(ui.hero.titleA[locale]);

  return (
    <Container>
      {/* Hero */}
      <section className="mx-auto w-full max-w-wrap px-6 pb-20 pt-16 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {/* O título sobe linha a linha; as demais peças do herói entram
                logo atrás, escalonadas pelo delay. */}
            <AppSwarm apps={apps}>
              <div data-swarm-dim>
                <Reveal
                  as="p"
                  y={14}
                  className="font-mono text-[11px] uppercase tracking-[0.26em] text-accent"
                >
                  {ui.hero.eyebrow[locale]}
                </Reveal>
              </div>
              <Headline
                as="h1"
                delay={0.12}
                className="mt-6 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
              >
                {lead}{' '}
                <span
                  data-apps-anchor
                  className="cursor-default underline decoration-accent/40 decoration-dotted decoration-2 underline-offset-[0.16em] transition-colors hover:text-accent"
                >
                  {word}
                </span>{' '}
                {/* O ponto final entra dentro do <em> de propósito: o SplitText
                    transforma cada palavra num bloco próprio para medir as
                    linhas, e solto ele viraria uma palavra sozinha — em tela
                    estreita, caía numa linha só para ele. */}
                <em className="text-accent">{`${ui.hero.titleEm[locale]}${ui.hero.titleB[locale]}`}</em>
              </Headline>
            </AppSwarm>
            <Reveal
              as="p"
              delay={0.34}
              y={18}
              className="mt-8 max-w-2xl text-base leading-8 text-muted sm:text-lg sm:leading-9"
            >
              {ui.hero.lede[locale]}
            </Reveal>

            <Reveal
              delay={0.46}
              y={18}
              className="mt-10 flex flex-wrap items-center gap-6"
            >
              <Magnetic>
                <Link
                  href="/schedule"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-bg transition-opacity hover:opacity-90"
                >
                  {ui.footer.book[locale]} <span aria-hidden="true">→</span>
                </Link>
              </Magnetic>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                {ui.schedule.window[locale]}
              </span>
            </Reveal>
          </div>

          <Reveal
            as="figure"
            delay={0.28}
            y={26}
            className="mx-auto w-60 sm:w-72 lg:col-span-4 lg:w-full"
          >
            <div className="rotate-2 transition-transform duration-500 ease-out hover:rotate-0">
              <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl">
                <Image
                  src="/bruno.jpg"
                  alt="Bruno Amorim"
                  width={920}
                  height={920}
                  priority
                  className="aspect-square w-full object-cover"
                />
              </div>
              <figcaption className="mt-4 flex items-baseline justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                <span className="text-ink">Bruno Amorim</span>
                <span>{ui.hero.location[locale]}</span>
              </figcaption>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-line">
        <Reveal
          as="dl"
          stagger={0.08}
          className="mx-auto grid w-full max-w-wrap grid-cols-2 divide-line px-6 sm:grid-cols-4 sm:divide-x"
        >
          {ui.hero.stats.map((stat, i) => (
            <div
              key={stat.value + i}
              className="flex flex-col py-8 sm:px-8 sm:first:pl-0 sm:last:pr-0"
            >
              <dt className="order-2 mt-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-muted">
                {stat.label[locale]}
              </dt>
              <dd className="order-1 font-display text-4xl tracking-tight text-accent sm:text-5xl">
                <Counter value={stat.value} />
              </dd>
            </div>
          ))}
        </Reveal>
      </section>

      {/* O ciclo como peça: fita de alumínio com meia volta, palavras gravadas */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="mx-auto w-full max-w-wrap px-6 pt-20 sm:pt-28">
          <Reveal
            as="p"
            y={14}
            className="font-mono text-[11px] uppercase tracking-[0.26em] text-accent"
          >
            {ui.loop.eyebrow[locale]}
          </Reveal>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <Headline
              onScroll
              className="font-display text-3xl tracking-tight sm:text-5xl"
            >
              {ui.loop.title[locale]}
            </Headline>
            <Reveal as="p" y={16} className="max-w-sm text-sm leading-6 text-muted">
              {ui.loop.lede[locale]}
            </Reveal>
          </div>
        </div>

        <div className="relative mx-auto h-[360px] w-full max-w-wrap sm:h-[480px]">
          <Loop3D words={ui.loop.words[locale]} />
        </div>

        {/* O ciclo também escrito por extenso: é como quem usa leitor de tela ou
            chega sem WebGL lê a mesma ideia que está gravada na fita. */}
        <ol className="mx-auto flex w-full max-w-wrap flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 pb-16 font-mono text-[11px] uppercase tracking-[0.22em] text-muted sm:pb-20">
          {ui.loop.words[locale].map((label, index) => (
            <li key={label} className="flex items-baseline gap-2">
              <span className="text-accent">
                {String(index + 1).padStart(2, '0')}
              </span>
              {label}
              {index < ui.loop.words[locale].length - 1 && (
                <span aria-hidden className="ml-6 text-line">
                  →
                </span>
              )}
            </li>
          ))}
          <li aria-hidden className="text-line">
            ↺
          </li>
        </ol>
      </section>

      {/* Playground 3D: unidade de estúdio com botões que giram de verdade */}
      <section id="playground" className="relative overflow-hidden border-b border-line">
        <div className="mx-auto w-full max-w-wrap px-6 pt-20 sm:pt-28">
          <Reveal
            as="p"
            y={14}
            className="font-mono text-[11px] uppercase tracking-[0.26em] text-accent"
          >
            {ui.playground.eyebrow[locale]}
          </Reveal>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <Headline
              onScroll
              className="font-display text-3xl tracking-tight sm:text-5xl"
            >
              {ui.playground.title[locale]}
            </Headline>
            <Reveal as="p" y={16} className="max-w-sm text-sm leading-6 text-muted">
              {ui.playground.lede[locale]}
            </Reveal>
          </div>
        </div>

        <div className="relative mx-auto h-[420px] w-full max-w-wrap sm:h-[560px]">
          <Console3D />
          <span className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-line bg-surface/80 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted backdrop-blur">
            ↕ {ui.playground.hint[locale]}
          </span>
        </div>
      </section>

      {/* Own products */}
      <section className="mx-auto w-full max-w-wrap px-6 pt-20 sm:pt-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Headline
            onScroll
            className="font-display text-3xl tracking-tight sm:text-5xl"
          >
            {ui.sections.ownProducts[locale]}
          </Headline>
          <Reveal as="p" y={16} className="max-w-sm text-sm leading-6 text-muted">
            {ui.sections.ownProductsHint[locale]}
          </Reveal>
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
          <Headline
            onScroll
            className="font-display text-3xl tracking-tight sm:text-5xl"
          >
            {ui.sections.companyWork[locale]}
          </Headline>
          <Reveal as="p" y={16} className="max-w-sm text-sm leading-6 text-muted">
            {ui.sections.companyWorkHint[locale]}
          </Reveal>
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

        <Reveal className="mt-16 text-center" y={16}>
          <Magnetic>
            <Link
              href="/projects"
              className="und font-mono text-[11px] uppercase tracking-[0.22em] text-ink"
            >
              {ui.sections.allProjects[locale]} →
            </Link>
          </Magnetic>
        </Reveal>
      </section>

      {/* Principles — taste made explicit */}
      <section className="mx-auto w-full max-w-wrap px-6 pt-24 sm:pt-32">
        <Headline
          onScroll
          className="font-display text-3xl tracking-tight sm:text-5xl"
        >
          {ui.sections.principles[locale]}
        </Headline>
        <Reveal
          stagger={0.1}
          className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2"
        >
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
        </Reveal>
      </section>

      {/* Experience */}
      <section className="mx-auto w-full max-w-wrap px-6 py-24 sm:py-32">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Headline
            onScroll
            className="font-display text-3xl tracking-tight sm:text-5xl"
          >
            {ui.sections.experience[locale]}
          </Headline>
          <Reveal as="p" y={14}>
            <Link
              href="/about"
              className="und font-mono text-[11px] uppercase tracking-[0.22em] text-muted hover:text-ink"
            >
              {ui.sections.fullStory[locale]} →
            </Link>
          </Reveal>
        </div>
        <Reveal as="ol" stagger={0.09} className="mt-12">
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
        </Reveal>
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
        .map((p) => localizeProject(p, resolved)),
      // Só o ícone e o nome: o resto de `projects` não precisa viajar até o
      // cliente para o leque do título funcionar.
      apps: shippedApps
    }
  };
};
