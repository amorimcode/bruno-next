import Link from 'next/link';
import { LocalizedProject } from '../lib/types';
import { Showcase } from './Shots';

type Props = {
  project: LocalizedProject;
  index: number;
  readCaseLabel: string;
  priority?: boolean;
};

export default function ProjectCard({ project, index, readCaseLabel, priority }: Props) {
  const number = String(index + 1).padStart(2, '0');
  const flip = index % 2 === 1;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group grid items-center gap-6 md:grid-cols-12 md:gap-10"
    >
      <div
        className={`overflow-hidden rounded-3xl border border-line md:col-span-7 ${
          flip ? 'md:order-2' : ''
        }`}
      >
        <Showcase project={project} priority={priority} />
      </div>

      <div className={`md:col-span-5 ${flip ? 'md:order-1 md:text-right' : ''}`}>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          <span className="text-accent">{number}</span> · {project.company}
        </p>
        <h3 className="mt-3 font-display text-3xl tracking-tight transition-colors group-hover:text-accent sm:text-4xl">
          {project.title}
        </h3>
        <p className="mt-2 font-display text-lg italic text-muted">
          {project.tagline}
        </p>
        <p className="mt-4 text-sm leading-7 text-muted">{project.summary}</p>
        <ul
          className={`mt-5 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted ${
            flip ? 'md:justify-end' : ''
          }`}
        >
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <span className="und mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.22em] text-ink">
          {readCaseLabel} →
        </span>
      </div>
    </Link>
  );
}
