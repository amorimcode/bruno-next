import Container from '../components/Container';
import ProjectCard from '../components/ProjectCard';
import projects from '../lib/projects';

export default function Projects() {
  return (
    <Container
      title="Projetos – Bruno Amorim"
      description="Projetos de aplicativos mobile e web que desenvolvi com React, React Native, Swift, Node.js e Go."
    >
      <div className="flex flex-col items-start justify-center max-w-2xl mx-auto mb-16 w-full">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-black md:text-5xl dark:text-white">
          Projetos
        </h1>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          Seleção de projetos de aplicativos mobile e web que desenvolvi ao
          longo da carreira — do zero à publicação nas lojas, com foco em alta
          performance e experiência do usuário.
        </p>
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </Container>
  );
}
