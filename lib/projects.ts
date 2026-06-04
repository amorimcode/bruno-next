import { Project } from './types';

const projects: Project[] = [
  {
    slug: 'pagol',
    title: 'PaGol',
    company: 'Gol Linhas Aéreas · MB Labs',
    description:
      'Conta digital da Gol Linhas Aéreas. Participei do desenvolvimento do app, integrando módulos nativos em Swift/UIKit a uma base React Native, com foco em performance e experiência do usuário.',
    period: 'Mar 2022 – Abr 2024',
    image: '/projects/pagol.svg',
    href: 'https://www.pagol.com.br/',
    tags: ['Swift', 'UIKit', 'React Native', 'TypeScript'],
    featured: true
  },
  {
    slug: 'buni',
    title: 'B.uni',
    company: 'B.uni',
    description:
      'App e Internet Banking do banco digital B.uni, focado em estudantes. Atuo como Senior Software Engineer responsável pelas plataformas mobile e web.',
    period: 'Jan 2025 – Atual',
    image: '/projects/buni.svg',
    tags: ['React Native', 'React', 'TypeScript', 'Redux'],
    featured: true
  },
  {
    slug: 'bankeiro',
    title: 'Bankeiro',
    company: 'MB Labs',
    description:
      'Plataforma white label bancária com +40 clientes (PaGol, Localiza, Syngenta e outros). Responsável técnico por arquitetura, padrões do projeto, code review e publicação dos apps nas lojas, com deploy via CI/CD na AWS.',
    period: 'Mar 2022 – Mar 2024',
    image: '/projects/bankeiro.svg',
    tags: ['Next.js', 'React Native', 'TypeScript', 'Node.js', 'AWS'],
    featured: true
  },
  {
    slug: 'ieq-mva',
    title: 'IEQ MVA',
    company: 'Igreja do Evangelho Quadrangular',
    description:
      'Aplicativo desenvolvido do zero como extensão da mídia da igreja e apoio à gestão de demandas internas. Conduzi todo o ciclo: requisitos com o cliente, design no Figma, ambiente cloud na Azure e publicação nas lojas.',
    period: 'Jun 2023 – Atual',
    image: '/projects/ieq-mva.svg',
    tags: ['React Native', 'Expo', 'NestJS', 'Azure', 'Figma'],
    featured: true
  },
  {
    slug: 'maismei',
    title: 'MaisMei',
    company: 'MaisMei',
    description:
      'Manutenção e desenvolvimento de novas funcionalidades no app MaisMei, com serviços financeiros para contas PJ, unindo desenvolvimento nativo iOS e React Native.',
    period: 'Abr 2024 – Jan 2025',
    image: '/projects/maismei.svg',
    tags: ['Swift', 'SwiftUI', 'React Native', 'Go'],
    featured: false
  },
  {
    slug: 'nitrospray',
    title: 'NitroSpray',
    company: 'TCC · PUC-Campinas',
    description:
      'ERP para gerenciamento dos processos de produção em fábricas de equipamentos médicos. Trabalho de Conclusão de Curso de Engenharia de Software.',
    period: '2024',
    image: '/projects/nitrospray.svg',
    tags: ['React', 'Node.js', 'TypeScript'],
    featured: false
  }
];

export default projects;
