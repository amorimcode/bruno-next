import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import Container from '../../components/Container';
import ProjectCard from '../../components/ProjectCard';
import ui from '../../lib/i18n';
import projects, { lab } from '../../lib/projects';
import { LocalizedProject, localizeProject, pickLocale } from '../../lib/types';

type Props = {
  personal: LocalizedProject[];
  company: LocalizedProject[];
};

export default function Projects({ personal, company }: Props) {
  const locale = pickLocale(useRouter().locale);

  return (
    <Container
      title={`${ui.projectsPage.title[locale]} — Bruno Amorim`}
      description={ui.projectsPage.lede[locale]}
    >
      <section className="mx-auto w-full max-w-wrap px-6 pb-20 pt-16 sm:pt-24">
        <h1 className="rise font-display text-4xl tracking-tight sm:text-6xl">
          {ui.projectsPage.title[locale]}
        </h1>
        <p
          className="rise mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg sm:leading-9"
          style={{ animationDelay: '90ms' }}
        >
          {ui.projectsPage.lede[locale]}
        </p>
      </section>

      <section className="mx-auto w-full max-w-wrap px-6">
        <h2 className="border-b border-line pb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
          {ui.sections.ownProducts[locale]}
        </h2>
        <p className="mt-5 max-w-md text-sm leading-6 text-muted">
          {ui.sections.ownProductsHint[locale]}
        </p>
        <div className="mt-14 space-y-20 sm:space-y-28">
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

      <section className="mx-auto mt-24 w-full max-w-wrap px-6 sm:mt-32">
        <h2 className="border-b border-line pb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
          {ui.sections.companyWork[locale]}
        </h2>
        <p className="mt-5 max-w-md text-sm leading-6 text-muted">
          {ui.sections.companyWorkHint[locale]}
        </p>
        <div className="mt-14 space-y-20 sm:space-y-28">
          {company.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
              readCaseLabel={ui.sections.readCase[locale]}
            />
          ))}
        </div>
      </section>

      {/* Lab */}
      <section className="mx-auto w-full max-w-wrap px-6 py-24 sm:py-32">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl tracking-tight sm:text-5xl">
            {ui.sections.lab[locale]}
          </h2>
          <p className="max-w-sm text-sm leading-6 text-muted">
            {ui.sections.labHint[locale]}
          </p>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {lab.map((repo) => (
            <a
              key={repo.name}
              href={repo.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-surface p-7 transition-colors hover:bg-surface2"
            >
              <p className="flex items-center justify-between font-mono text-sm text-ink">
                {repo.name}
                <span className="text-muted transition-colors group-hover:text-accent">↗</span>
              </p>
              <p className="mt-3 text-sm leading-6 text-muted">
                {repo.description[locale]}
              </p>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                {repo.tags.join(' · ')}
              </p>
            </a>
          ))}
        </div>
      </section>
    </Container>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => {
  const resolved = pickLocale(locale);
  return {
    props: {
      personal: projects
        .filter((p) => p.kind === 'personal')
        .map((p) => localizeProject(p, resolved)),
      company: projects
        .filter((p) => p.kind === 'company')
        .map((p) => localizeProject(p, resolved))
    }
  };
};
