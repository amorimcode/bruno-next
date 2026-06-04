import Image from 'next/image';
import Link from 'next/link';
import Container from '../components/Container';
import ProjectCard from '../components/ProjectCard';
import projects from '../lib/projects';

const socials = [
  {
    href: 'https://www.linkedin.com/in/amorim-bruno/',
    label: 'LinkedIn',
    icon: (
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.2 8h4.6v14H.2V8zm7.5 0h4.4v1.9h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.47 3.04 5.47 6.99V22h-4.6v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.49V22h-4.6V8z" />
    )
  },
  {
    href: 'https://github.com/amorimcode',
    label: 'GitHub',
    icon: (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.36 9.36 0 0112 6.84c.85 0 1.71.12 2.51.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.35 4.79-4.58 5.05.36.32.68.94.68 1.91 0 1.38-.01 2.49-.01 2.83 0 .27.18.6.69.49A10.02 10.02 0 0022 12.25C22 6.58 17.52 2 12 2z"
      />
    )
  },
  {
    href: 'mailto:bruno.amorim032@gmail.com',
    label: 'Email',
    icon: (
      <path d="M2 4h20v16H2V4zm10 7L3.5 6h17L12 11zm0 2.2L3.6 7.7V18h16.8V7.7L12 13.2z" />
    )
  }
];

export default function Home() {
  const featured = projects.filter((p) => p.featured);

  return (
    <Container>
      <div className="flex flex-col justify-center items-start max-w-2xl border-gray-200 dark:border-gray-700 mx-auto pb-16">
        <div className="flex flex-col-reverse sm:flex-row items-start">
          <div className="flex flex-col pr-8">
            <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-1 text-black dark:text-white">
              Bruno Amorim
            </h1>
            <h2 className="text-gray-700 dark:text-gray-200 mb-4">
              Senior Software Engineer
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Desenvolvedor apaixonado por tecnologia, focado em front-end e
              experiência do usuário, design de interfaces responsivas e
              escaláveis, com arquitetura robusta. Experiência em
              desenvolvimento web e mobile (React, React Native), desenvolvimento
              iOS, trabalho em equipe e conversa com cliente.
            </p>
            <div className="flex items-center gap-3 mb-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="flex items-center justify-center w-10 h-10 text-gray-600 transition-all bg-gray-200 rounded-lg hover:text-white hover:bg-gray-800 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>
          <div className="w-[80px] sm:w-[176px] relative mb-8 sm:mb-0 mr-auto">
            <Image
              alt="Bruno Amorim"
              height={176}
              width={176}
              src="https://github.com/amorimcode.png"
              sizes="30vw"
              priority
              className="rounded-full filter grayscale"
            />
          </div>
        </div>

        <div className="flex items-center justify-between w-full mt-8 mb-6">
          <h3 className="font-bold text-2xl md:text-4xl tracking-tight text-black dark:text-white">
            Projetos em destaque
          </h3>
        </div>
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        <Link
          href="/projects"
          className="flex items-center mt-8 text-gray-600 dark:text-gray-400 leading-7 rounded-lg hover:text-gray-800 dark:hover:text-gray-200 transition-all h-6"
        >
          Ver todos os projetos
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="h-6 w-6 ml-1"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.5 12h-15m11.667-4l3.333 4-3.333-4zm3.333 4l-3.333 4 3.333-4z"
            />
          </svg>
        </Link>
      </div>
    </Container>
  );
}
