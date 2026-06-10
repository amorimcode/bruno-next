/** Texto localizado — inglês é o padrão do site, português a segunda língua */
export type L = {
  en: string;
  pt: string;
};

export type Locale = 'en' | 'pt';

export type Decision = {
  title: L;
  body: L;
};

export type Screen = {
  src: string;
  alt: L;
  /** 'raw' = print cru de tela (vai dentro de um frame de iPhone); 'banner' = arte de loja já diagramada */
  kind: 'raw' | 'banner';
  /** Proporção da imagem, ex. '1080/2337'. Default: '392/696'. */
  aspect?: string;
};

export type ProjectLink = {
  label: 'App Store' | 'Google Play' | 'Website' | 'GitHub';
  href: string;
};

export type Project = {
  slug: string;
  title: string;
  /** 'personal' = produto próprio; 'company' = trabalho em empresa */
  kind: 'personal' | 'company';
  /** 'grid' = cover tipográfico sobre grade de tiles coloridos (white-label) */
  coverStyle?: 'grid';
  tagline: L;
  company: string;
  role: L;
  period: L;
  platforms: string[];
  summary: L;
  context: L;
  decisions: Decision[];
  outcome: L;
  icon?: string;
  screens: Screen[];
  /** Paleta da identidade do projeto, usada nos covers e fundos das composições */
  theme: {
    bg: string;
    fg: string;
    glow: string;
  };
  tags: string[];
  links: ProjectLink[];
  featured: boolean;
};

export type LabProject = {
  name: string;
  description: L;
  href: string;
  tags: string[];
};

/** Versão com os textos já resolvidos para uma língua, segura para passar via getStaticProps */
export type LocalizedProject = Omit<
  Project,
  'tagline' | 'role' | 'period' | 'summary' | 'context' | 'decisions' | 'outcome' | 'screens'
> & {
  tagline: string;
  role: string;
  period: string;
  summary: string;
  context: string;
  decisions: { title: string; body: string }[];
  outcome: string;
  screens: { src: string; alt: string; kind: 'raw' | 'banner'; aspect?: string }[];
};

export function pickLocale(value: string | undefined): Locale {
  return value === 'pt' ? 'pt' : 'en';
}

export function localizeProject(project: Project, locale: Locale): LocalizedProject {
  return {
    ...project,
    tagline: project.tagline[locale],
    role: project.role[locale],
    period: project.period[locale],
    summary: project.summary[locale],
    context: project.context[locale],
    decisions: project.decisions.map((d) => ({
      title: d.title[locale],
      body: d.body[locale]
    })),
    outcome: project.outcome[locale],
    screens: project.screens.map((s) => ({ ...s, alt: s.alt[locale] }))
  };
}
