import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Container from '../../components/Container';
import { BannerShot, PhoneFrame, Showcase } from '../../components/Shots';
import ui from '../../lib/i18n';
import projects from '../../lib/projects';
import { LocalizedProject, localizeProject, pickLocale } from '../../lib/types';

type Props = {
  project: LocalizedProject;
  next: { slug: string; title: string; tagline: string };
};

function StoreBadge({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:border-accent hover:text-accent"
    >
      {label === 'App Store' && (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
      )}
      {label === 'Google Play' && (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
          <path d="M3 20.5V3.5c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.25-.84-.76-.84-1.35m13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27m3.35-4.31c.34.27.59.69.59 1.19s-.22.9-.57 1.18l-2.29 1.32-2.5-2.5 2.5-2.5 2.27 1.31M6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z" />
        </svg>
      )}
      {label === 'Website' && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.9 5.7 3.9 9S14.5 18.4 12 21c-2.5-2.6-3.9-5.7-3.9-9S9.5 5.6 12 3z" />
        </svg>
      )}
      {label}
    </a>
  );
}

export default function ProjectPage({ project, next }: Props) {
  const locale = pickLocale(useRouter().locale);
  const labels = ui.project;
  const banners = project.screens.filter((s) => s.kind === 'banner');
  const raws = project.screens.filter((s) => s.kind === 'raw');

  return (
    <Container
      title={`${project.title} — Bruno Amorim`}
      description={project.summary}
    >
      {/* Hero */}
      <section className="mx-auto w-full max-w-wrap px-6 pt-16 sm:pt-24">
        <Link
          href="/projects"
          className="rise und font-mono text-[11px] uppercase tracking-[0.22em] text-muted hover:text-ink"
        >
          ← {labels.backToWork[locale]}
        </Link>
        <div className="mt-8 flex items-start gap-5">
          {project.icon && (
            <Image
              src={project.icon}
              alt=""
              width={64}
              height={64}
              priority
              className="rise mt-2 hidden rounded-2xl ring-1 ring-line sm:block"
            />
          )}
          <div>
            <h1
              className="rise font-display text-5xl tracking-tight sm:text-7xl"
              style={{ animationDelay: '60ms' }}
            >
              {project.title}
            </h1>
            <p
              className="rise mt-4 max-w-3xl font-display text-xl italic leading-relaxed text-muted sm:text-2xl"
              style={{ animationDelay: '140ms' }}
            >
              {project.tagline}
            </p>
          </div>
        </div>

        {/* Meta grid */}
        <dl
          className="rise mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4"
          style={{ animationDelay: '220ms' }}
        >
          {(
            [
              [labels.role[locale], project.role],
              [labels.company[locale], project.company],
              [labels.period[locale], project.period],
              [labels.platforms[locale], project.platforms.join(' · ')]
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="bg-surface px-5 py-4">
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                {label}
              </dt>
              <dd className="mt-1.5 text-sm leading-6 text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Showcase hero visual */}
      <section
        className="rise mx-auto mt-14 w-full max-w-wrap px-6"
        style={{ animationDelay: '300ms' }}
      >
        <div className="group overflow-hidden rounded-3xl border border-line">
          <Showcase project={project} priority />
        </div>
      </section>

      {/* Narrative */}
      <section className="mx-auto w-full max-w-wrap px-6 pt-20 sm:pt-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              {labels.context[locale]}
            </h2>
            <p className="mt-5 text-base leading-8 text-ink sm:text-lg sm:leading-9">
              {project.context}
            </p>

            <h2 className="mt-16 font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              {labels.decisions[locale]}
            </h2>
            <ol className="mt-6 space-y-8">
              {project.decisions.map((decision, i) => (
                <li
                  key={i}
                  className="rounded-2xl border border-line bg-surface p-7 sm:p-8"
                >
                  <h3 className="font-display text-xl italic tracking-tight sm:text-2xl">
                    <span className="mr-3 font-mono text-sm not-italic text-accent">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {decision.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{decision.body}</p>
                </li>
              ))}
            </ol>

            <h2 className="mt-16 font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              {labels.outcome[locale]}
            </h2>
            <p className="mt-5 text-base leading-8 text-ink sm:text-lg sm:leading-9">
              {project.outcome}
            </p>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="sticky top-24 space-y-10">
              <div>
                <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                  {labels.stack[locale]}
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[11px] tracking-[0.08em] text-muted"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                  {labels.visit[locale]}
                </h2>
                {project.links.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {project.links.map((link) => (
                      <StoreBadge key={link.label} label={link.label} href={link.href} />
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-muted">
                    {labels.whiteLabelNote[locale]}
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Screens gallery */}
      {project.screens.length > 1 && (
        <section className="mx-auto w-full max-w-wrap px-6 pt-20 sm:pt-28">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            {labels.screens[locale]}
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {banners.map((screen) => (
              <BannerShot key={screen.src} src={screen.src} alt={screen.alt} sizes="(min-width: 1024px) 17rem, 45vw" />
            ))}
            {raws.map((screen) => (
              <PhoneFrame key={screen.src} src={screen.src} alt={screen.alt} sizes="(min-width: 1024px) 17rem, 45vw" />
            ))}
          </div>
        </section>
      )}

      {/* Next case */}
      <section className="mx-auto w-full max-w-wrap px-6 py-24 sm:py-32">
        <Link href={`/projects/${next.slug}`} className="group block rounded-3xl border border-line bg-surface p-10 transition-colors hover:border-accent sm:p-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            {labels.nextProject[locale]}
          </p>
          <p className="mt-4 font-display text-4xl tracking-tight transition-colors group-hover:text-accent sm:text-6xl">
            {next.title}
            <span className="ml-4 inline-block transition-transform group-hover:translate-x-2">→</span>
          </p>
          <p className="mt-3 font-display text-lg italic text-muted">{next.tagline}</p>
        </Link>
      </section>
    </Container>
  );
}

export const getStaticPaths: GetStaticPaths = async ({ locales = ['en', 'pt'] }) => {
  return {
    paths: locales.flatMap((locale) =>
      projects.map((project) => ({ params: { slug: project.slug }, locale }))
    ),
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params, locale }) => {
  const resolved = pickLocale(locale);
  const index = projects.findIndex((p) => p.slug === params?.slug);
  const project = projects[index];
  const nextProject = projects[(index + 1) % projects.length];

  return {
    props: {
      project: localizeProject(project, resolved),
      next: {
        slug: nextProject.slug,
        title: nextProject.title,
        tagline: nextProject.tagline[resolved]
      }
    }
  };
};
