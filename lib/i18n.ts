const ui = {
  nav: {
    home: { en: 'Home', pt: 'Início' },
    projects: { en: 'Work', pt: 'Projetos' },
    about: { en: 'About', pt: 'Sobre' },
    schedule: { en: 'Schedule', pt: 'Agendar' },
    toggleTheme: { en: 'Toggle dark mode', pt: 'Alternar modo escuro' },
    skip: { en: 'Skip to content', pt: 'Pular para o conteúdo' }
  },
  meta: {
    title: { en: 'Bruno Amorim — Senior Software Engineer', pt: 'Bruno Amorim — Senior Software Engineer' },
    description: {
      en: 'Senior software engineer building mobile and web apps end to end — React Native, Swift and React, from Figma to the App Store.',
      pt: 'Engenheiro de software sênior construindo apps mobile e web de ponta a ponta — React Native, Swift e React, do Figma à App Store.'
    }
  },
  hero: {
    eyebrow: { en: 'Senior Software Engineer · Mobile & Front-end', pt: 'Senior Software Engineer · Mobile & Front-end' },
    titleA: { en: 'I build the apps', pt: 'Eu construo os apps' },
    titleEm: { en: 'that live in people’s pockets', pt: 'que moram no bolso das pessoas' },
    titleB: { en: '.', pt: '.' },
    lede: {
      en: 'I’m Bruno Amorim, a software engineer from Campinas, Brazil. Over the last five years I’ve shipped products end to end: an airline’s digital account, a white-label platform behind 40+ banks, a student bank — and, after hours, my own products: igreja.studio, a white-label for churches, and QWIP, a SaaS for gas stations, designed and built entirely by me.',
      pt: 'Sou Bruno Amorim, engenheiro de software em Campinas. Nos últimos cinco anos coloquei produtos no ar de ponta a ponta: a conta digital de uma companhia aérea, um white-label por trás de 40+ bancos, o banco dos universitários — e, fora do expediente, meus próprios produtos: o igreja.studio, white-label para igrejas, e o QWIP, SaaS para postos de combustíveis, desenhados e construídos inteiramente por mim.'
    },
    location: { en: 'Campinas — SP · Brazil', pt: 'Campinas — SP · Brasil' },
    stats: [
      { value: '5+', label: { en: 'years shipping to production', pt: 'anos publicando em produção' } },
      { value: '40+', label: { en: 'brands on one white-label codebase', pt: 'marcas em um codebase white-label' } },
      { value: '2', label: { en: 'products of my own, live in production', pt: 'produtos próprios no ar, em produção' } },
      { value: '3', label: { en: 'platforms: iOS, Android & web', pt: 'plataformas: iOS, Android e web' } }
    ]
  },
  loop: {
    eyebrow: { en: 'The loop · real-time 3D', pt: 'O ciclo · 3D em tempo real' },
    title: { en: 'How the work actually goes.', pt: 'Como o trabalho acontece.' },
    lede: {
      en: 'Design, build, ship, repeat — engraved into one ribbon of aluminium with a half turn in it, which leaves it with a single face, a single edge and no beginning. Nothing here is a downloaded file: the strip is generated vertex by vertex and the words are cut into the metal, not printed on it. Drag to spin it.',
      pt: 'Desenhar, construir, publicar, repetir — gravados numa fita de alumínio com meia volta, o que a deixa com uma face só, uma borda só e nenhum começo. Nada aqui é arquivo baixado: a fita é gerada vértice a vértice e as palavras são cavadas no metal, não impressas sobre ele. Arraste para girar.'
    },
    words: {
      en: ['DESIGN', 'BUILD', 'SHIP', 'REPEAT'],
      pt: ['DESENHAR', 'CONSTRUIR', 'PUBLICAR', 'REPETIR']
    }
  },
  playground: {
    eyebrow: { en: 'Real-time 3D · WebGL', pt: '3D em tempo real · WebGL' },
    title: { en: 'Turn the knobs.', pt: 'Gire os botões.' },
    lede: {
      en: 'How I split my time, as a piece of studio hardware. Nothing here is a downloaded model: the case, the knobs and every marking on the panel are drawn in code. Drag a knob up or down.',
      pt: 'Como eu divido meu tempo, em forma de equipamento de estúdio. Nada aqui é modelo baixado: a carcaça, os botões e cada marcação do painel são desenhados em código. Arraste um botão para cima ou para baixo.'
    },
    hint: { en: 'drag the knobs', pt: 'arraste os botões' }
  },
  sections: {
    ownProducts: { en: 'Own products', pt: 'Produtos próprios' },
    ownProductsHint: {
      en: 'Built after hours, owned end to end — design, code, infra and the store listing. Every decision here is mine.',
      pt: 'Construídos fora do expediente, meus de ponta a ponta — design, código, infra e ficha na loja. Cada decisão aqui é minha.'
    },
    companyWork: { en: 'Company work', pt: 'Em empresas' },
    companyWorkHint: {
      en: 'What I built inside product teams — from a 40-brand white-label to digital banks in production.',
      pt: 'O que construí dentro de times de produto — de um white-label com 40 marcas a bancos digitais em produção.'
    },
    allProjects: { en: 'All projects', pt: 'Todos os projetos' },
    readCase: { en: 'Read the case', pt: 'Ler o case' },
    principles: { en: 'What I stand for', pt: 'O que eu defendo' },
    experience: { en: 'Experience', pt: 'Experiência' },
    fullStory: { en: 'Full story', pt: 'História completa' },
    lab: { en: 'Lab & experiments', pt: 'Lab & experimentos' },
    labHint: {
      en: 'Weekend code — the place where I try things before I trust them.',
      pt: 'Código de fim de semana — onde eu testo as coisas antes de confiar nelas.'
    }
  },
  principles: [
    {
      title: { en: 'Detail is a requirement', pt: 'Detalhe é requisito' },
      body: {
        en: 'Empty states, haptics, the way a receipt slides in. Nobody writes these in a ticket — users feel all of them. I treat polish as part of “done”, not as a luxury for later.',
        pt: 'Estado vazio, haptics, o jeito que o comprovante desliza na tela. Ninguém escreve isso num ticket — mas o usuário sente tudo. Trato o acabamento como parte do “pronto”, não como luxo para depois.'
      }
    },
    {
      title: { en: 'Performance is UX', pt: 'Performance é UX' },
      body: {
        en: 'An app that stutters is an app you don’t trust. I profile before I guess, and I optimize for the entry-level Android in someone’s pocket, not for the simulator on my Mac.',
        pt: 'App que engasga é app em que você não confia. Eu meço antes de chutar, e otimizo para o Android de entrada no bolso de alguém — não para o simulador no meu Mac.'
      }
    },
    {
      title: { en: 'Design is a decision, not decoration', pt: 'Design é decisão, não decoração' },
      body: {
        en: 'I open Figma before the editor. When I built a product alone, every screen was drawn, discussed and validated before a single component existed — because changing pixels is cheap, changing shipped flows is not.',
        pt: 'Eu abro o Figma antes do editor. Quando construí um produto sozinho, cada tela foi desenhada, discutida e validada antes de existir um componente — porque mudar pixel é barato, mudar fluxo publicado não é.'
      }
    },
    {
      title: { en: 'Own it to the store shelf', pt: 'Ownership até a prateleira da loja' },
      body: {
        en: 'My job doesn’t end at the pull request. Signing certificates, store listings, Apple review answers, CI/CD — shipping is part of engineering, and I’ve done it for dozens of apps.',
        pt: 'Meu trabalho não termina no pull request. Certificados, fichas de loja, resposta à review da Apple, CI/CD — publicar faz parte da engenharia, e eu já fiz isso para dezenas de apps.'
      }
    }
  ],
  experience: [
    {
      company: 'B.uni',
      role: { en: 'Senior Software Engineer', pt: 'Senior Software Engineer' },
      period: { en: 'Jan 2025 – Present', pt: 'Jan 2025 – Atual' },
      summary: {
        en: 'Mobile (React Native) and web (React) platforms of a student-focused digital bank.',
        pt: 'Plataformas mobile (React Native) e web (React) de um banco digital focado em estudantes.'
      }
    },
    {
      company: 'MaisMei',
      role: { en: 'Front-end Developer', pt: 'Desenvolvedor Front-end Pleno' },
      period: { en: 'Apr 2024 – Jan 2025', pt: 'Abr 2024 – Jan 2025' },
      summary: {
        en: 'Native iOS (Swift/SwiftUI) and React Native on a financial app for micro-entrepreneurs.',
        pt: 'iOS nativo (Swift/SwiftUI) e React Native no app financeiro para microempreendedores.'
      }
    },
    {
      company: 'MB Labs',
      role: { en: 'Front-end Developer · Tech lead for front & mobile', pt: 'Desenvolvedor Front-end · Responsável técnico front & mobile' },
      period: { en: 'Mar 2022 – Mar 2024', pt: 'Mar 2022 – Mar 2024' },
      summary: {
        en: 'Bankeiro white-label platform and client apps (PaGol, Localiza, Syngenta): architecture, code review, store publishing and CI/CD on AWS.',
        pt: 'Plataforma white-label Bankeiro e apps de clientes (PaGol, Localiza, Syngenta): arquitetura, code review, publicação nas lojas e CI/CD na AWS.'
      }
    },
    {
      company: 'Energia Automação',
      role: { en: 'Software Development Intern', pt: 'Estagiário em Desenvolvimento de Software' },
      period: { en: 'Aug 2021 – Mar 2022', pt: 'Ago 2021 – Mar 2022' },
      summary: {
        en: 'Dataventus, a management system for wind farms — web app maintenance (Python/Django) and the new mobile app (React Native).',
        pt: 'Dataventus, sistema de gestão de complexos eólicos — manutenção da aplicação web (Python/Django) e novo app mobile (React Native).'
      }
    }
  ],
  project: {
    backToWork: { en: 'All work', pt: 'Todos os projetos' },
    role: { en: 'Role', pt: 'Papel' },
    company: { en: 'Company', pt: 'Empresa' },
    period: { en: 'Period', pt: 'Período' },
    platforms: { en: 'Platforms', pt: 'Plataformas' },
    context: { en: 'The context', pt: 'O contexto' },
    decisions: { en: 'Decisions that were mine', pt: 'Decisões que foram minhas' },
    outcome: { en: 'Where it landed', pt: 'Onde isso chegou' },
    stack: { en: 'Stack', pt: 'Stack' },
    visit: { en: 'See it live', pt: 'Veja no ar' },
    whiteLabelNote: {
      en: 'White-label product — it ships to the stores under each client’s brand.',
      pt: 'Produto white-label — quem vai às lojas é a marca de cada cliente.'
    },
    nextProject: { en: 'Next case', pt: 'Próximo case' },
    screens: { en: 'Screens', pt: 'Telas' }
  },
  projectsPage: {
    title: { en: 'Work', pt: 'Projetos' },
    lede: {
      en: 'Every project here shipped — to the App Store, Google Play or production web. Each case tells what the product was, what I owned and which decisions carry my fingerprints.',
      pt: 'Tudo aqui foi publicado — na App Store, no Google Play ou em produção na web. Cada case conta o que era o produto, o que era meu e quais decisões têm a minha digital.'
    }
  },
  about: {
    title: { en: 'About me', pt: 'Sobre mim' },
    lede: {
      en: 'Engineer of the kind that ships — and that cares how it feels when it lands.',
      pt: 'Engenheiro do tipo que publica — e que se importa com a sensação quando chega.'
    },
    story: [
      {
        en: 'I started in 2021 maintaining software that managed wind farms. Since then my path has been a straight line through Brazilian fintech: at MB Labs I became the front-end tech lead of Bankeiro, a white-label platform that powered 40+ banking apps — including PaGol, the digital account of Gol Airlines, where I worked the seam between Swift/UIKit and React Native.',
        pt: 'Comecei em 2021 mantendo o software que gerenciava parques eólicos. De lá pra cá meu caminho foi uma linha reta pela fintech brasileira: na MB Labs me tornei o responsável técnico de front-end do Bankeiro, plataforma white-label por trás de 40+ apps bancários — incluindo o PaGol, conta digital da Gol, onde trabalhei na costura entre Swift/UIKit e React Native.'
      },
      {
        en: 'After that came MaisMei — native iOS and React Native serving micro-entrepreneurs — and today I’m the senior engineer responsible for both the app and the internet banking of b.Uni, a digital bank for university students.',
        pt: 'Depois veio o MaisMei — iOS nativo e React Native servindo microempreendedores — e hoje sou o engenheiro sênior responsável pelo app e pelo internet banking do b.Uni, banco digital para universitários.'
      },
      {
        en: 'In parallel, I run the products that best show how I think: igreja.studio, my white-label platform for churches — whose flagship, IEQ MVA, I took from requirements to both stores — and QWIP, my financial SaaS for gas stations. No handoffs, no one to blame: every choice in them is mine.',
        pt: 'Em paralelo, mantenho os produtos que melhor mostram como eu penso: o igreja.studio, meu white-label para igrejas — cujo carro-chefe, o IEQ MVA, levei do requisito às duas lojas — e o QWIP, meu SaaS financeiro para postos de combustíveis. Sem handoff, sem ninguém pra culpar: cada escolha ali é minha.'
      },
      {
        en: 'I graduated in Software Engineering at PUC-Campinas with a 9/10 GPA, I speak fluent English, and I have a soft spot for the details nobody asks for but everybody feels.',
        pt: 'Me formei em Engenharia de Software na PUC-Campinas com CR 9, falo inglês fluente e tenho uma queda pelos detalhes que ninguém pede mas todo mundo sente.'
      }
    ],
    education: { en: 'Education', pt: 'Formação' },
    educationItems: [
      {
        title: { en: 'B.Sc. in Software Engineering — PUC-Campinas', pt: 'Bacharelado em Engenharia de Software — PUC-Campinas' },
        detail: {
          en: 'Graduated June 2024 · final GPA 9/10 · capstone: NitroSpray, a production ERP for a medical equipment factory.',
          pt: 'Graduado em junho de 2024 · CR final 9 · TCC: NitroSpray, ERP de produção para fábrica de equipamentos médicos.'
        }
      },
      {
        title: { en: 'Advanced English — UpTime', pt: 'Inglês Avançado — UpTime' },
        detail: { en: 'Fluent English, written and spoken.', pt: 'Inglês fluente, escrito e falado.' }
      }
    ],
    toolbox: { en: 'Toolbox', pt: 'Caixa de ferramentas' },
    toolboxGroups: [
      { label: { en: 'Mobile', pt: 'Mobile' }, items: 'Swift · UIKit · SwiftUI · React Native · Expo' },
      { label: { en: 'Front-end', pt: 'Front-end' }, items: 'React · Next.js · TypeScript · Redux · MobX · Tailwind CSS' },
      { label: { en: 'Back-end', pt: 'Back-end' }, items: 'Node.js · NestJS · Go' },
      { label: { en: 'Design', pt: 'Design' }, items: 'Figma — from wireframe to design system' },
      { label: { en: 'Shipping', pt: 'Publicação' }, items: 'Fastlane · CI/CD (Bitbucket, AWS, Azure) · App Store & Play Console' },
      { label: { en: 'Testing', pt: 'Testes' }, items: 'Jest · React Testing Library · XCTest' }
    ],
    contact: { en: 'Contact', pt: 'Contato' }
  },
  schedule: {
    metaTitle: {
      en: 'Book a call · Bruno Amorim',
      pt: 'Agendar uma conversa · Bruno Amorim'
    },
    eyebrow: { en: 'Book a call · 30 minutes', pt: 'Agende uma conversa · 30 minutos' },
    titleA: { en: 'Pick a time', pt: 'Escolha um horário' },
    titleEm: { en: 'that’s already free', pt: 'que já está livre' },
    titleB: { en: '.', pt: '.' },
    lede: {
      en: 'These slots come straight from my calendar, so whatever you see here is genuinely open. Pick one and the invite lands in both inboxes with a Google Meet link, no email ping-pong first.',
      pt: 'Estes horários vêm direto da minha agenda, então o que aparece aqui está mesmo livre. Escolha um e o convite chega nas duas caixas de entrada com link do Google Meet, sem trocar email antes.'
    },
    window: {
      en: 'Weekdays, 1pm to 6pm · Fridays until 4pm (Brasília time)',
      pt: 'Dias úteis, das 13h às 18h · sextas até 16h (horário de Brasília)'
    },
    loading: { en: 'Reading my calendar…', pt: 'Lendo minha agenda…' },
    pickDay: { en: 'Pick a day', pt: 'Escolha o dia' },
    pickTime: { en: 'Pick a time', pt: 'Escolha o horário' },
    noSlots: {
      en: 'Nothing free in the next few weeks. Send me an email and we’ll find a way.',
      pt: 'Nada livre nas próximas semanas. Me manda um email que a gente dá um jeito.'
    },
    noSlotsForDay: { en: 'No times left on this day.', pt: 'Nenhum horário sobrando nesse dia.' },
    yourTimezone: {
      en: 'Times shown in your timezone',
      pt: 'Horários no seu fuso'
    },
    inSaoPaulo: { en: 'in Campinas', pt: 'em Campinas' },
    form: {
      title: { en: 'Who’s coming?', pt: 'Quem vem?' },
      name: { en: 'Your name', pt: 'Seu nome' },
      email: { en: 'Your email', pt: 'Seu email' },
      emailHint: {
        en: 'The calendar invite goes to this address.',
        pt: 'O convite do calendário vai para este endereço.'
      },
      topic: { en: 'What do you want to talk about?', pt: 'Sobre o que você quer conversar?' },
      topicHint: { en: 'Optional, but it helps me prepare.', pt: 'Opcional, mas me ajuda a chegar preparado.' },
      submit: { en: 'Confirm booking', pt: 'Confirmar agendamento' },
      sending: { en: 'Booking…', pt: 'Agendando…' },
      back: { en: 'Change time', pt: 'Trocar horário' }
    },
    confirmed: {
      title: { en: 'You’re on my calendar.', pt: 'Você está na minha agenda.' },
      body: {
        en: 'The invite is already in your inbox. Accept it and the event syncs to your own calendar.',
        pt: 'O convite já está na sua caixa de entrada. Aceite e o evento entra na sua agenda também.'
      },
      meet: { en: 'Join with Google Meet', pt: 'Entrar pelo Google Meet' },
      home: { en: 'Back to the site', pt: 'Voltar para o site' }
    },
    errors: {
      taken: {
        en: 'Someone grabbed that slot while you were typing. Pick another one.',
        pt: 'Alguém pegou esse horário enquanto você digitava. Escolha outro.'
      },
      invalid: {
        en: 'Check your name and email, something didn’t go through.',
        pt: 'Confira nome e email, alguma coisa não passou.'
      },
      rate: {
        en: 'Too many attempts. Wait a bit and try again.',
        pt: 'Tentativas demais. Espere um pouco e tente de novo.'
      },
      generic: {
        en: 'The calendar didn’t answer. Try again in a moment, or just email me.',
        pt: 'A agenda não respondeu. Tente de novo daqui a pouco, ou me mande um email.'
      },
      retry: { en: 'Try again', pt: 'Tentar de novo' }
    }
  },
  footer: {
    cta: { en: 'Have something to build?', pt: 'Tem algo para construir?' },
    book: { en: 'Book a call', pt: 'Agendar conversa' },
    note: {
      en: 'Hand-built with Next.js — no template, every pixel on purpose.',
      pt: 'Feito à mão com Next.js — sem template, cada pixel de propósito.'
    },
    resume: { en: 'Résumé', pt: 'Currículo' }
  }
} as const;

export type Dict = typeof ui;

export default ui;
