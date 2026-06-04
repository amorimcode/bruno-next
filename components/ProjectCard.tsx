import Image from 'next/image';
import { Project } from '../lib/types';

export default function ProjectCard({ project }: { project: Project }) {
  const Wrapper: any = project.href ? 'a' : 'div';
  const wrapperProps = project.href
    ? { href: project.href, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="group flex flex-col overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 dark:bg-gray-800/60 dark:border-gray-700"
    >
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Image
          alt={project.title}
          src={project.image}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {project.title}
          </h3>
          {project.href && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              className="w-5 h-5 text-gray-400 transition-colors group-hover:text-gray-700 dark:group-hover:text-gray-200"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 17L17 7M17 7H8M17 7v9"
              />
            </svg>
          )}
        </div>
        {project.company && (
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {project.company} · {project.period}
          </p>
        )}
        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-4 pt-1">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full dark:bg-gray-700/60 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}
