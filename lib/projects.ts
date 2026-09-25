import { LabProject, Project, ShippedApp } from './types';

const projects: Project[] = [
  {
    slug: 'floattube',
    kind: 'personal',
    title: 'FloatTube',
    tagline: {
      en: 'A YouTube mini player for the Mac that stays put while your desktops slide.',
      pt: 'Um mini player do YouTube para Mac que fica parado enquanto os desktops deslizam.'
    },
    company: 'FloatTube · own product',
    role: {
      en: 'Designer & engineer — macOS app, Chrome extension, icon & landing page',
      pt: 'Designer & engenheiro — app macOS, extensão do Chrome, ícone & landing page'
    },
    period: { en: '2026', pt: '2026' },
    platforms: ['macOS', 'Chrome'],
    summary: {
      en: "Chrome's picture-in-picture window jumps every time you switch desktops on a Mac. FloatTube replaces it: a menu-bar app in Swift and AppKit that plays the video in a floating player living in its own WindowServer Space — so it doesn't move a pixel during the Space animation — plus a Chrome extension that hands the video over when you leave the tab and back when you return.",
      pt: 'O picture-in-picture do Chrome pula toda vez que você troca de desktop no Mac. O FloatTube resolve isso: um app de barra de menus em Swift e AppKit que toca o vídeo num player flutuante morando num Space próprio do WindowServer — por isso não se mexe nem um pixel durante a animação — e uma extensão do Chrome que entrega o vídeo quando você sai da aba e devolve quando você volta.'
    },
    context: {
      en: "The fix looked like a window flag. It isn't: even a window marked to appear on all desktops still belongs to the user's Spaces, so the WindowServer slides it along with every transition and snaps it back at the end — the glitch you see in Chrome. The only way to keep a window truly still is to take it out of the user's Spaces altogether, which an extension can't do and a regular app window doesn't do by default.",
      pt: 'A solução parecia uma flag de janela. Não é: mesmo uma janela marcada para aparecer em todos os desktops continua pertencendo aos Spaces do usuário, então o WindowServer a desliza junto em cada transição e a devolve ao lugar no fim — o tranco que se vê no Chrome. O único jeito de manter a janela realmente parada é tirá-la dos Spaces do usuário, algo que uma extensão não consegue e uma janela comum não faz.'
    },
    decisions: [
      {
        title: {
          en: 'A private Space above the desktops',
          pt: 'Um Space privado acima dos desktops'
        },
        body: {
          en: "The player window lives in a Space created through SkyLight's private API, at an absolute level above the user's desktops and below the lock screen. Checking the window's Space membership in the WindowServer itself showed that the all-desktops flag re-added it to every incoming Space — the ghost that slid in with the new desktop — so the app drops that flag while the player is pinned. If the symbols ever disappear, it detects that and falls back to a regular floating window.",
          pt: 'A janela do player mora num Space criado pela API privada do SkyLight, num nível absoluto acima dos desktops do usuário e abaixo da tela de bloqueio. Conferir os Spaces da janela no próprio WindowServer mostrou que a flag de todos os desktops a recolocava em cada Space que entrava — o fantasma que chegava deslizando com o desktop novo — então o app remove essa flag enquanto o player está fixado. Se os símbolos sumirem, ele detecta e volta a uma janela flutuante comum.'
        }
      },
      {
        title: {
          en: 'Native Liquid Glass controls over the YouTube embed',
          pt: 'Controles nativos em Liquid Glass sobre o player do YouTube'
        },
        body: {
          en: "YouTube's redesigned embed spreads its controls across the whole video, which fought with dragging the window around. I hid them — player API with controls off, plus CSS injected into the cross-origin iframe through a WKUserScript — and drew native NSGlassEffectView controls instead, driving playback through the IFrame API. The window drags from anywhere, resizes from wide edge zones or a pinch, and eases between two sizes; during ads, clicks pass straight through so Skip still works.",
          pt: 'O player incorporado do YouTube, redesenhado, espalha controles pelo vídeo inteiro, o que brigava com arrastar a janela. Escondi esses controles — API do player sem controles, mais CSS injetado no iframe de outra origem por um WKUserScript — e desenhei controles nativos com NSGlassEffectView, comandando o vídeo pela IFrame API. A janela arrasta de qualquer ponto, redimensiona por bordas largas ou pinça e anima entre dois tamanhos; durante anúncios, os cliques passam direto para o Pular continuar funcionando.'
        }
      },
      {
        title: {
          en: 'Tab handoff over a local WebSocket',
          pt: 'Troca de aba por um WebSocket local'
        },
        body: {
          en: "A Manifest V3 extension pauses the tab when you leave it and sends the video id, second, speed and volume to the app over 127.0.0.1; coming back returns the exact second to the tab. The app rejects any connection whose Origin isn't a browser extension, and the service worker keeps the socket alive only while a video is floating.",
          pt: 'Uma extensão Manifest V3 pausa a aba quando você sai dela e manda para o app, por 127.0.0.1, o id do vídeo, o segundo, a velocidade e o volume; ao voltar, o segundo exato retorna à aba. O app recusa qualquer conexão cujo Origin não seja uma extensão do navegador, e o service worker só mantém o socket vivo enquanto há vídeo no player.'
        }
      }
    ],
    outcome: {
      en: "Open source on GitHub with a universal Apple Silicon + Intel build, the Chrome extension, a Liquid Glass icon built in Icon Composer's format and a landing page on Vercel with a live side-by-side demo of the Space switch.",
      pt: 'Código aberto no GitHub com build universal para Apple Silicon e Intel, a extensão do Chrome, ícone Liquid Glass no formato do Icon Composer e uma landing page na Vercel com a demonstração lado a lado da troca de Space.'
    },
    icon: '/projects/shots/floattube-icon.png',
    screens: [
      {
        src: '/projects/shots/floattube-1.png',
        alt: {
          en: 'FloatTube — the floating player over Chrome, with the tab showing the video moved out',
          pt: 'FloatTube — o player flutuante sobre o Chrome, com a aba mostrando que o vídeo saiu dela'
        },
        kind: 'banner',
        aspect: '1600/1000'
      },
      {
        src: '/projects/shots/floattube-2.png',
        alt: {
          en: 'FloatTube — native Liquid Glass playback controls',
          pt: 'FloatTube — controles nativos em Liquid Glass'
        },
        kind: 'banner',
        aspect: '1280/720'
      },
      {
        src: '/projects/shots/floattube-3.png',
        alt: {
          en: 'Mid Space switch: Chrome picture-in-picture slides along, FloatTube stays put',
          pt: 'No meio da troca de Space: o picture-in-picture do Chrome desliza junto, o FloatTube fica parado'
        },
        kind: 'banner',
        aspect: '1600/640'
      }
    ],
    theme: {
      bg: 'linear-gradient(140deg, #231c5e 0%, #873d86 55%, #ff7652 100%)',
      fg: '#fff4e8',
      glow: '#ffc37b'
    },
    tags: ['Swift', 'AppKit', 'WebKit', 'SkyLight', 'Chrome Extension', 'JavaScript'],
    links: [
      { label: 'Website', href: 'https://floattube.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/amorimcode/floattube' }
    ],
    featured: true
  },
  {
    slug: 'dont-idle',
    kind: 'personal',
    title: "Don't Idle",
    tagline: {
      en: 'A native macOS app that keeps your Mac — and your status — awake.',
      pt: 'Um app nativo de macOS que mantém o Mac — e o seu status — sempre ativo.'
    },
    company: "Don't Idle · own product",
    role: {
      en: 'Designer & engineer — app, landing page, signing & notarization',
      pt: 'Designer & engenheiro — app, landing page, assinatura & notarização'
    },
    period: { en: '2026', pt: '2026' },
    platforms: ['macOS'],
    summary: {
      en: "A menu-bar utility that nudges the pointer when you step away, so your Mac stays awake and your chat status stays active — on a schedule, and easy on the battery. Built in SwiftUI and shipped as a notarized Developer ID app with a self-update flow and three languages.",
      pt: 'Um utilitário na barra de menus que move levemente o cursor quando você se afasta, mantendo o Mac acordado e o status do chat ativo — com horário definido e sem gastar bateria. Feito em SwiftUI e distribuído como app Developer ID notarizado, com auto-update e três idiomas.'
    },
    context: {
      en: "Step away for a few minutes and your Mac dims while your Slack or Teams dot turns yellow. Don't Idle reads real input-idle time and, past a threshold you choose, posts a tiny mouse movement that returns in place — enough to read as active everywhere. It runs only during the hours and weekdays you set, and uses an adaptive single-timer engine instead of busy polling, so it barely touches the battery.",
      pt: 'Você se afasta alguns minutos e o Mac escurece enquanto a bolinha do Slack ou Teams fica amarela. O Don’t Idle lê o tempo real de inatividade e, passado um limite que você escolhe, faz um pequeno movimento do cursor que volta ao lugar — o bastante para aparecer como ativo em todo lugar. Só funciona nos horários e dias que você define e usa um motor adaptativo de um único timer em vez de ficar verificando à toa, então quase não consome bateria.'
    },
    decisions: [
      {
        title: {
          en: 'Real input events, not a fake cursor warp',
          pt: 'Eventos de input reais, não um cursor falso'
        },
        body: {
          en: "The nudge posts a genuine CGEvent mouse move to the HID tap, which resets macOS idle time and keeps chat presence active. That requires Accessibility, so onboarding refuses to finish until the permission is actually granted.",
          pt: 'O movimento posta um CGEvent real de mouse no HID tap, o que reseta o tempo ocioso do macOS e mantém a presença no chat ativa. Isso exige Acessibilidade, então o onboarding só conclui depois que a permissão é de fato concedida.'
        }
      },
      {
        title: {
          en: 'Battery-first: adaptive timer, no polling',
          pt: 'Bateria em primeiro lugar: timer adaptativo, sem polling'
        },
        body: {
          en: 'Instead of checking every second, the engine schedules a single wake-up at the next decision point and sleeps completely when paused or outside the active window — with timer leeway so the CPU can coalesce wake-ups.',
          pt: 'Em vez de verificar a cada segundo, o motor agenda um único wake-up no próximo ponto de decisão e dorme por completo quando pausado ou fora da janela ativa — com folga no timer para o CPU agrupar os despertares.'
        }
      },
      {
        title: {
          en: 'Shipped like a real product',
          pt: 'Distribuído como um produto de verdade'
        },
        body: {
          en: 'Developer ID signing plus Apple notarization (stapled, hardened runtime, universal binary) so it opens with no Gatekeeper warning — and a custom self-update flow that downloads, swaps the app bundle and relaunches, validated end to end.',
          pt: 'Assinatura Developer ID com notarização da Apple (stapled, hardened runtime, binário universal) para abrir sem aviso do Gatekeeper — e um auto-update próprio que baixa, troca o bundle e reabre o app, validado de ponta a ponta.'
        }
      }
    ],
    outcome: {
      en: 'Live with a notarized, auto-updating download and a marketing landing page on Vercel. SwiftUI app with animated onboarding, full settings, and English / Português / Español localization.',
      pt: 'No ar com download notarizado e auto-atualizável e uma landing page na Vercel. App em SwiftUI com onboarding animado, ajustes completos e localização em inglês / português / espanhol.'
    },
    icon: '/projects/shots/dont-idle-icon.png',
    screens: [
      {
        src: '/projects/shots/dont-idle-1.png',
        alt: {
          en: "Don't Idle — animated first-launch onboarding",
          pt: 'Don’t Idle — onboarding animado de primeira execução'
        },
        kind: 'banner',
        aspect: '1360/1032'
      },
      {
        src: '/projects/shots/dont-idle-2.png',
        alt: {
          en: "Don't Idle — menu-bar popover with live status",
          pt: 'Don’t Idle — popover da barra de menus com status ao vivo'
        },
        kind: 'banner',
        aspect: '728/940'
      },
      {
        src: '/projects/shots/dont-idle-3.png',
        alt: {
          en: "Don't Idle — settings window",
          pt: 'Don’t Idle — janela de ajustes'
        },
        kind: 'banner',
        aspect: '1040/1076'
      }
    ],
    theme: {
      bg: 'linear-gradient(140deg, #1f1f23 0%, #0a0a0c 100%)',
      fg: '#f4f4f5',
      glow: '#9ca3af'
    },
    tags: ['Swift', 'SwiftUI', 'AppKit', 'macOS', 'Developer ID', 'Next.js'],
    links: [{ label: 'Website', href: 'https://dont-idle.vercel.app' }],
    featured: true
  },
  {
    slug: 'maismei',
    kind: 'company',
    title: 'MaisMei',
    tagline: {
      en: 'Brazilian small-business bureaucracy, solved in one app.',
      pt: 'A burocracia do MEI resolvida num app.'
    },
    company: 'MaisMei',
    role: {
      en: 'Front-end Developer — iOS & React Native',
      pt: 'Desenvolvedor Front-end Pleno — iOS & React Native'
    },
    period: { en: 'Apr 2024 – Jan 2025', pt: 'Abr 2024 – Jan 2025' },
    platforms: ['iOS', 'Android'],
    summary: {
      en: 'Financial services for Brazilian micro-entrepreneurs (MEI): company registration, tax slips (DAS/DASN) and business account management. I worked across native iOS (Swift/SwiftUI) and React Native.',
      pt: 'App de serviços financeiros para microempreendedores: abertura de MEI, guias DAS/DASN e gestão da conta PJ. Atuei unindo desenvolvimento nativo iOS (Swift/SwiftUI) e React Native.'
    },
    context: {
      en: 'Millions of Brazilian micro-entrepreneurs face the same routine: issue a tax slip, declare revenue, keep the company compliant. MaisMei condenses all of it into a single app. I joined the team to evolve the product on both platforms, moving between native iOS code and the React Native base as each feature demanded.',
      pt: 'Milhões de MEIs brasileiros enfrentam a mesma rotina: emitir guia, declarar faturamento, manter o CNPJ regular. O MaisMei condensa isso num app só. Entrei no time para evoluir o produto nas duas plataformas, transitando entre o código nativo iOS e a base React Native conforme a feature pedia.'
    },
    decisions: [
      {
        title: {
          en: 'SwiftUI where the iOS experience deserved to be native',
          pt: 'SwiftUI onde a experiência iOS pedia ser nativa'
        },
        body: {
          en: 'Not everything should cross the bridge. System-feeling flows — settings screens, Apple ecosystem interactions — got dedicated SwiftUI implementations, while the rest of the product stayed in RN.',
          pt: 'Nem tudo precisa passar pela bridge. Fluxos com cara de sistema — telas de ajuste, interações com o ecossistema Apple — ganharam implementações SwiftUI dedicadas, mantendo o resto do produto em RN.'
        }
      },
      {
        title: {
          en: 'State discipline with MobX in tax-critical flows',
          pt: 'Disciplina de estado com MobX em fluxo fiscal'
        },
        body: {
          en: 'An issued slip, a submitted declaration, a paid installment: tax states tolerate no ambiguity. I worked the state layer so every document had an explicit lifecycle, from draft to confirmation.',
          pt: 'Guia emitida, declaração enviada, parcela paga: estados fiscais não toleram ambiguidade. Trabalhei a camada de estado para que cada documento tivesse ciclo de vida explícito, do rascunho à confirmação.'
        }
      }
    ],
    outcome: {
      en: 'New features delivered to production for a nationwide base of micro-entrepreneurs, with the app active on both stores.',
      pt: 'Funcionalidades novas entregues em produção para uma base nacional de microempreendedores, com o app ativo nas duas lojas.'
    },
    icon: '/projects/shots/maismei-icon.png',
    screens: [],
    theme: {
      bg: 'linear-gradient(135deg, #3f63de 0%, #2746a8 100%)',
      fg: '#e2f58b',
      glow: '#e2f58b'
    },
    tags: ['Swift', 'SwiftUI', 'React Native', 'MobX', 'Go'],
    links: [
      {
        label: 'App Store',
        href: 'https://apps.apple.com/br/app/mais-mei-abrir-mei-dasn-das/id1437671032'
      }
    ],
    featured: false
  },
  {
    slug: 'pagol',
    kind: 'company',
    title: 'PaGol',
    tagline: {
      en: 'The digital account that turns balance into miles — and miles into travel.',
      pt: 'A conta digital que transforma saldo em milhas — e milhas em viagem.'
    },
    company: 'Gol Linhas Aéreas · via MB Labs',
    role: {
      en: 'Software Engineer — iOS & React Native',
      pt: 'Software Engineer — iOS & React Native'
    },
    period: { en: 'Mar 2022 – Apr 2024', pt: 'Mar 2022 – Abr 2024' },
    platforms: ['iOS', 'Android'],
    summary: {
      en: 'Gol Airlines’ digital account, where your balance earns miles every business day. I worked on the border between native and React Native: critical modules in Swift/UIKit wired into a shared RN codebase.',
      pt: 'Conta digital da Gol em que o saldo gera milhas todos os dias úteis. Trabalhei na fronteira entre o nativo e o React Native: módulos críticos em Swift/UIKit conectados a uma base RN compartilhada.'
    },
    context: {
      en: 'Gol wanted to put its loyalty program inside people’s everyday finances: a free digital account where idle money becomes miles, and miles become flights, products or cash back. The app was built on top of the Bankeiro white-label platform, which meant evolving a full banking product — Pix, cards, transfers — with Gol’s brand and business rules.',
      pt: 'A Gol queria colocar o programa de milhas dentro do dia a dia financeiro das pessoas: uma conta digital gratuita em que o dinheiro parado vira milha, e a milha vira passagem, produto ou dinheiro de volta. O app nasceu sobre a plataforma white-label Bankeiro, o que significava evoluir um produto de banco completo — Pix, cartão, transferências — com a cara e as regras da Gol.'
    },
    decisions: [
      {
        title: {
          en: 'Native where it hurts, React Native where it scales',
          pt: 'Nativo onde dói, React Native onde escala'
        },
        body: {
          en: 'I argued for keeping sensitive flows — camera, security, payment integrations — in Swift/UIKit, exposed to React Native through small, typed bridges. The product team could iterate fast in RN without touching code that must never break.',
          pt: 'Defendi manter os fluxos sensíveis — câmera, segurança, integrações de pagamento — em Swift/UIKit, expostos ao React Native por bridges pequenas e tipadas. O time de produto iterava rápido em RN sem tocar no código que não podia quebrar.'
        }
      },
      {
        title: {
          en: 'Performance treated as a feature, not a chore',
          pt: 'Performance tratada como feature, não como chore'
        },
        body: {
          en: 'Banking screens are heavy lists: statements, miles, transactions. I hunted re-renders with the profiler, applied deliberate memoization and proper list virtualization until navigation felt instant on entry-level Android devices — where most users actually are.',
          pt: 'Tela de banco é lista pesada: extrato, milhas, transações. Persegui re-renders com profiler, memoização criteriosa e virtualização correta das listas até a navegação ficar imperceptível em aparelhos Android de entrada — onde a maioria dos usuários realmente está.'
        }
      },
      {
        title: {
          en: 'Bridge patterns documented for the whole team',
          pt: 'Padrões de bridge documentados para o time inteiro'
        },
        body: {
          en: 'Instead of every dev inventing their own native bridge, I standardized the anatomy of a module — errors, events, types — so anyone on the team could build or review a native module with confidence.',
          pt: 'Em vez de cada dev inventar sua própria ponte nativa, padronizei a anatomia dos módulos (erros, eventos, tipos) para que qualquer pessoa do time conseguisse criar ou revisar um módulo nativo sem medo.'
        }
      }
    ],
    outcome: {
      en: 'Shipped and maintained on both stores, with continuous releases over two years, serving account holders who earn miles simply by keeping their salary in the account.',
      pt: 'App publicado e mantido nas duas lojas, com release contínuo durante dois anos servindo correntistas que acumulam milhas pelo simples ato de deixar o salário na conta.'
    },
    icon: '/projects/shots/pagol-icon.png',
    screens: [
      {
        src: '/projects/shots/pagol-1.png',
        alt: {
          en: 'PaGol — digital account home with wallet and miles',
          pt: 'PaGol — home da conta digital com carteira e milhas'
        },
        kind: 'banner'
      },
      {
        src: '/projects/shots/pagol-3.png',
        alt: {
          en: 'PaGol — balance earning miles and transaction history',
          pt: 'PaGol — saldo gerando milhas e histórico de transações'
        },
        kind: 'banner'
      },
      {
        src: '/projects/shots/pagol-2.png',
        alt: { en: 'PaGol — app screens on the App Store', pt: 'PaGol — telas do app na App Store' },
        kind: 'banner'
      },
      {
        src: '/projects/shots/pagol-4.png',
        alt: { en: 'PaGol — card and benefits', pt: 'PaGol — cartão e benefícios' },
        kind: 'banner'
      },
      {
        src: '/projects/shots/pagol-5.png',
        alt: {
          en: 'PaGol — trading miles for flights and products',
          pt: 'PaGol — troca de milhas por passagens e produtos'
        },
        kind: 'banner'
      }
    ],
    theme: {
      bg: 'linear-gradient(135deg, #0d1f43 0%, #14306b 100%)',
      fg: '#ffffff',
      glow: '#ff6a2b'
    },
    tags: ['Swift', 'UIKit', 'React Native', 'TypeScript'],
    links: [
      { label: 'App Store', href: 'https://apps.apple.com/br/app/pagol/id1643147483' },
      { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.br.pagol' },
      { label: 'Website', href: 'https://www.pagol.com.br/' }
    ],
    featured: true
  },
  {
    slug: 'bankeiro',
    kind: 'company',
    coverStyle: 'grid',
    title: 'Bankeiro',
    tagline: {
      en: 'One codebase. Forty-plus banks.',
      pt: 'Um codebase. Mais de quarenta bancos.'
    },
    company: 'MB Labs',
    role: {
      en: 'Tech lead for front-end & mobile',
      pt: 'Responsável técnico — Front-end & Mobile'
    },
    period: { en: 'Mar 2022 – Mar 2024', pt: 'Mar 2022 – Mar 2024' },
    platforms: ['iOS', 'Android', 'Web'],
    summary: {
      en: 'The white-label banking platform behind 40+ brands — PaGol, Localiza, Syngenta and others. I owned the front-end side: architecture, standards, code review and the pipeline that shipped dozens of apps to the stores.',
      pt: 'Plataforma bancária white-label por trás de mais de 40 marcas — PaGol, Localiza, Syngenta e outras. Fui o responsável técnico do front: arquitetura, padrões, code review e a esteira que publicava dezenas de apps nas lojas.'
    },
    context: {
      en: 'Every MB Labs client wanted to launch their own digital bank under their own brand — without waiting a year of development. The answer was Bankeiro: a single banking product (accounts, Pix, cards, internet banking) able to become dozens of different apps. The engineering challenge was not building a bank; it was building forty without drowning.',
      pt: 'Cada cliente da MB Labs queria lançar o próprio banco digital com a própria marca — sem esperar um ano de desenvolvimento. A resposta foi o Bankeiro: um único produto bancário (contas, Pix, cartões, internet banking) capaz de virar dezenas de apps diferentes. O desafio de engenharia não era construir um banco; era construir quarenta sem se afogar.'
    },
    decisions: [
      {
        title: {
          en: 'Theming by configuration, never by fork',
          pt: 'Tema por configuração, nunca por fork'
        },
        body: {
          en: 'The rule I defended from day one: no client ever gets a fork. Colors, typography, feature flags and per-brand flows lived in configuration layers over the same codebase. Fixing a bug once fixed all forty apps at once.',
          pt: 'A regra que defendi desde o início: nenhum cliente ganha um fork. Cores, tipografia, feature flags e fluxos por marca viviam em camadas de configuração sobre o mesmo codebase. Corrigir um bug uma vez consertava os quarenta apps de uma vez.'
        }
      },
      {
        title: {
          en: 'The release pipeline as an internal product',
          pt: 'Esteira de publicação como produto interno'
        },
        body: {
          en: 'Publishing 40 apps by hand is where teams break. I built and maintained the CI/CD flow (Bitbucket Pipelines + AWS + Fastlane) and managed the store accounts — from signing certificates to answering Apple review.',
          pt: 'Publicar 40 apps à mão é onde times quebram. Montei e mantive o fluxo de CI/CD (Bitbucket Pipelines + AWS + Fastlane) e gerenciei as contas das lojas — do certificado de assinatura à resposta de review da Apple.'
        }
      },
      {
        title: {
          en: 'Code review as an architecture tool',
          pt: 'Code review como ferramenta de arquitetura'
        },
        body: {
          en: 'As the person reviewing front-end and mobile pull requests, I used review to spread the standard: state conventions, module boundaries, and what counted as “core” versus brand customization. Review was where the architecture stayed alive.',
          pt: 'Como responsável por avaliar os pull requests de front-end e mobile, usei a revisão para espalhar padrão: convenções de estado, limites de módulo e o que era “core” versus o que era customização de marca. O review era onde a arquitetura se mantinha viva.'
        }
      }
    ],
    outcome: {
      en: 'The platform sustained brands like PaGol, Localiza and Syngenta in simultaneous production, with coordinated releases and a team able to onboard a new bank in weeks, not months.',
      pt: 'A plataforma sustentou marcas como PaGol, Localiza e Syngenta em produção simultânea, com release coordenado e um time que conseguia embarcar um banco novo em semanas, não meses.'
    },
    screens: [],
    theme: {
      bg: 'linear-gradient(140deg, #191613 0%, #2b241c 100%)',
      fg: '#f2ede4',
      glow: '#ff7a33'
    },
    tags: ['Next.js', 'React Native', 'TypeScript', 'Node.js', 'AWS', 'Fastlane'],
    links: [],
    featured: true
  },
  {
    slug: 'buni',
    kind: 'company',
    title: 'b.Uni',
    tagline: {
      en: 'The digital bank that fits a student’s life.',
      pt: 'O banco digital que cabe na vida do universitário.'
    },
    company: 'B.uni',
    role: {
      en: 'Senior Software Engineer — Mobile & Web',
      pt: 'Senior Software Engineer — Mobile & Web'
    },
    period: { en: 'Jan 2025 – Present', pt: 'Jan 2025 – Atual' },
    platforms: ['iOS', 'Android', 'Web'],
    summary: {
      en: 'A digital bank focused on university students. I am the engineer responsible for both ends of the product: the React Native app and the React internet banking.',
      pt: 'Banco digital focado em estudantes. Sou o engenheiro responsável pelas duas pontas do produto: o app em React Native e o internet banking em React.'
    },
    context: {
      en: 'University students have a financial life of their own: allowance, internship pay, first account, first card. b.Uni serves them with a digital account, Pix, transfers and cashback. I own both platforms — which means the same person who decides how a flow behaves in the app decides how it translates to the web.',
      pt: 'Estudante universitário tem vida financeira própria: mesada, estágio, primeira conta, primeiro cartão. O b.Uni atende esse público com conta digital, Pix, transferências e cashback. Atuo como responsável pelas plataformas — o que significa que a mesma pessoa que decide o comportamento de um fluxo no app decide como ele se traduz na web.'
    },
    decisions: [
      {
        title: {
          en: 'App and web as a single product',
          pt: 'App e web como um produto só'
        },
        body: {
          en: 'I keep deliberate parity between the RN app and the React internet banking: same API contracts, same state modeling, same UI language. Moving from phone to desktop never means relearning the bank.',
          pt: 'Mantenho paridade deliberada entre o app RN e o internet banking React: mesmos contratos de API, mesma modelagem de estado, mesma linguagem de UI. Quem migra do celular para o desktop não precisa reaprender o banco.'
        }
      },
      {
        title: {
          en: 'Predictable financial state above all',
          pt: 'Estado financeiro previsível acima de tudo'
        },
        body: {
          en: 'Balance, statement and receipts can never flicker or diverge. I structured the data flow with Redux so every financial mutation has a single, traceable origin — which simplifies both debugging and auditing.',
          pt: 'Saldo, extrato e comprovante não podem “piscar” nem divergir. Estruturei o fluxo de dados com Redux para que toda mutação financeira tenha uma origem única e rastreável — o que simplifica tanto o debug quanto a auditoria.'
        }
      },
      {
        title: {
          en: 'The details that make it feel like a real bank',
          pt: 'Os detalhes que fazem parecer banco de verdade'
        },
        body: {
          en: 'Shareable receipts, well-crafted empty states, instant feedback on every transaction. No requirement ever asks for these explicitly — and they are exactly what separates a trustworthy financial app from a prototype.',
          pt: 'Comprovantes compartilháveis, estados vazios cuidados, feedback imediato em cada transação. É o tipo de detalhe que nenhum requisito pede explicitamente — e que separa um app financeiro confiável de um protótipo.'
        }
      }
    ],
    outcome: {
      en: 'App and internet banking in production on the stores and on the web, evolving through continuous releases for the student base.',
      pt: 'App e internet banking em produção nas lojas e na web, evoluindo com releases contínuos para a base de estudantes.'
    },
    icon: '/projects/shots/buni-icon.png',
    screens: [
      {
        src: '/projects/shots/buni-1.jpg',
        alt: {
          en: 'b.Uni — home with account balance, Pix and day-to-day shortcuts',
          pt: 'b.Uni — home com saldo em conta, Pix e atalhos do dia a dia'
        },
        kind: 'banner',
        aspect: '1080/2337'
      },
      {
        src: '/projects/shots/buni-2.jpg',
        alt: {
          en: 'b.Uni — Pix hub: transfer, pay, charge and copy-and-paste keys',
          pt: 'b.Uni — central do Pix: transferir, pagar, cobrar e copia e cola'
        },
        kind: 'banner',
        aspect: '1080/2337'
      },
      {
        src: '/projects/shots/buni-3.jpg',
        alt: {
          en: 'b.Uni — shareable transfer receipt with the transaction trail',
          pt: 'b.Uni — comprovante de transferência compartilhável, com a trilha da transação'
        },
        kind: 'banner',
        aspect: '1080/2337'
      },
      {
        src: '/projects/shots/buni-4.jpg',
        alt: {
          en: 'b.Uni — launch campaign art: “the first digital account for Education”',
          pt: 'b.Uni — arte de lançamento: “a primeira conta digital da Educação”'
        },
        kind: 'banner',
        // Vem recortada no aspecto da grade do case, e não na altura de loja: no
        // recorte central a primeira linha do título ficava de fora.
        aspect: '780/1385'
      }
    ],
    theme: {
      bg: 'linear-gradient(135deg, #1c3fa0 0%, #c81e3c 100%)',
      fg: '#ffffff',
      glow: '#ffffff'
    },
    tags: ['React Native', 'React', 'TypeScript', 'Redux'],
    // A listagem antiga (id1598683067) saiu do ar; o app vive agora como
    // “b.Uni Digital”, e é de lá que vêm o ícone e as telas desta página.
    links: [
      { label: 'App Store', href: 'https://apps.apple.com/br/app/b-uni-digital/id6739265106' }
    ],
    featured: true
  },
  {
    slug: 'ieq-mva',
    kind: 'personal',
    title: 'IEQ MVA',
    tagline: {
      en: 'A whole church in one app — the flagship of igreja.studio, my white-label for churches.',
      pt: 'Uma igreja inteira num app — o carro-chefe do igreja.studio, meu white-label para igrejas.'
    },
    company: 'igreja.studio · own product',
    role: {
      en: 'Everything — requirements, design, app, API, cloud and stores',
      pt: 'Tudo — requisitos, design, app, API, cloud e lojas'
    },
    period: { en: 'Jun 2023 – Present', pt: 'Jun 2023 – Atual' },
    platforms: ['iOS', 'Android'],
    summary: {
      en: 'IEQ MVA is the first church running on igreja.studio, the white-label platform I built for churches. No decision here belonged to anyone else: requirements with the church, every screen in Figma, Expo app, NestJS API, Azure infrastructure and both stores.',
      pt: 'O IEQ MVA é a primeira igreja rodando no igreja.studio, o white-label que construí para igrejas. Nenhuma decisão aqui foi de outra pessoa: requisitos com a igreja, cada tela no Figma, app em Expo, API em NestJS, infra na Azure e as duas lojas.'
    },
    context: {
      en: 'The Foursquare Church of Jardim Vista Alegre needed two things that rarely come together: a digital presence for the community (services, announcements, Bible, music) and an internal management tool (members, visitors, contributions, work schedules, Sunday school). Instead of an off-the-shelf app, I built it as the flagship of igreja.studio — my own white-label platform, designed so the same product can serve other churches under their own brand.',
      pt: 'A IEQ do Jardim Vista Alegre precisava de duas coisas que raramente vêm juntas: presença digital para a comunidade (cultos, avisos, Bíblia, músicas) e ferramenta interna de gestão (membros, visitantes, contribuições, escalas, escola dominical). Em vez de um app de prateleira, construí o produto como carro-chefe do igreja.studio — meu próprio white-label, desenhado para que o mesmo produto atenda outras igrejas com suas próprias marcas.'
    },
    decisions: [
      {
        title: {
          en: 'Figma before a single line of code',
          pt: 'Figma antes de qualquer linha de código'
        },
        body: {
          en: 'I designed the whole product first — a dark, sober identity, module-based navigation, clear hierarchy between the public side (Bible, services, music) and the administrative side. Validating a flow with the pastor on a Figma screen costs minutes; in a shipped app, it costs weeks.',
          pt: 'Desenhei o produto inteiro primeiro — identidade escura e sóbria, navegação por módulos, hierarquia clara entre o público (Bíblia, cultos, músicas) e o administrativo. Validar fluxo com o pastor numa tela do Figma custa minutos; no app publicado, custa semanas.'
        }
      },
      {
        title: {
          en: 'Expo, to iterate at the speed of a community',
          pt: 'Expo para iterar na velocidade de uma comunidade'
        },
        body: {
          en: 'A church changes its schedule every week. I chose Expo + React Native for over-the-air updates and a short release cycle — a request from Sunday service can be live before the next Sunday.',
          pt: 'Igreja muda agenda toda semana. Escolhi Expo + React Native para ter atualizações over-the-air e um ciclo de release curto — uma demanda do culto de domingo pode estar no ar antes do próximo domingo.'
        }
      },
      {
        title: {
          en: 'A white-label, not a one-off',
          pt: 'Um white-label, não um app único'
        },
        body: {
          en: 'I applied the lesson from years on a banking white-label to my own product: IEQ MVA runs on igreja.studio, where members, schedules, contributions and notifications are isolated NestJS modules on Azure, and each church is a tenant with its own brand. The next church onboards by configuration, not by rewrite.',
          pt: 'Apliquei ao meu produto a lição de anos num white-label bancário: o IEQ MVA roda no igreja.studio, onde membros, escalas, contribuições e notificações são módulos NestJS isolados na Azure, e cada igreja é um tenant com a própria marca. A próxima igreja entra por configuração, não por rewrite.'
        }
      },
      {
        title: {
          en: 'From requirements to answering Apple review',
          pt: 'Do requisito à resposta da review da Apple'
        },
        body: {
          en: 'I ran the full publishing cycle: developer accounts, store assets, privacy policy, review. It is the kind of ownership you only learn by doing — and doing alone.',
          pt: 'Conduzi o ciclo completo de publicação: contas de desenvolvedor, assets de loja, política de privacidade, review. É o tipo de ownership que só se aprende fazendo — e fazendo sozinho.'
        }
      }
    ],
    outcome: {
      en: 'Live on the App Store and Google Play, in continuous use by the community — multi-version Bible, work schedules, Sunday school, contributions via Pix — and a platform ready to onboard more churches under their own brands.',
      pt: 'Publicado na App Store e no Google Play, em uso contínuo pela comunidade — Bíblia em múltiplas versões, escalas, escola dominical, contribuições via Pix — e uma plataforma pronta para receber outras igrejas com suas próprias marcas.'
    },
    icon: '/projects/shots/ieq-mva-icon.png',
    screens: [
      {
        src: '/projects/shots/ieq-mva-1.png',
        alt: {
          en: 'IEQ MVA — your church in the palm of your hand: app home with all modules',
          pt: 'IEQ MVA — sua igreja na palma da mão: home do app com todos os módulos'
        },
        kind: 'banner',
        aspect: '1080/2337'
      },
      {
        src: '/projects/shots/ieq-mva-2.png',
        alt: {
          en: 'IEQ MVA — the Bible always with you, in multiple versions',
          pt: 'IEQ MVA — a Bíblia sempre com você, em múltiplas versões'
        },
        kind: 'banner',
        aspect: '1080/2337'
      },
      {
        src: '/projects/shots/ieq-mva-3.png',
        alt: {
          en: 'IEQ MVA — work schedules: know when and where you serve',
          pt: 'IEQ MVA — escalas de trabalho: saiba quando e onde você vai servir'
        },
        kind: 'banner',
        aspect: '1080/2337'
      },
      {
        src: '/projects/shots/ieq-mva-4.png',
        alt: {
          en: 'IEQ MVA — your space, your ministries: profile and roles',
          pt: 'IEQ MVA — seu espaço, seus ministérios: perfil e funções'
        },
        kind: 'banner',
        aspect: '1080/2337'
      },
      {
        src: '/projects/shots/ieq-mva-5.png',
        alt: {
          en: 'IEQ MVA — contribute with tithes and offerings via Pix',
          pt: 'IEQ MVA — contribua com dízimos e ofertas via Pix'
        },
        kind: 'banner',
        aspect: '1080/2337'
      },
      {
        src: '/projects/shots/ieq-mva-6.png',
        alt: {
          en: 'IEQ MVA — Sunday Bible School: classes, attendance and materials',
          pt: 'IEQ MVA — Escola Bíblica Dominical: turmas, chamadas e materiais'
        },
        kind: 'banner',
        aspect: '1080/2337'
      }
    ],
    theme: {
      bg: 'linear-gradient(140deg, #161618 0%, #2c2c30 100%)',
      fg: '#ffffff',
      glow: '#9aa0ad'
    },
    tags: ['React Native', 'Expo', 'NestJS', 'Azure', 'Figma'],
    links: [
      { label: 'App Store', href: 'https://apps.apple.com/br/app/ieq-mva/id6477225037' },
      { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.ieqmva' }
    ],
    featured: true
  },
  {
    slug: 'qwip',
    kind: 'personal',
    title: 'QWIP',
    tagline: {
      en: 'A whole gas station operation, readable from a phone.',
      pt: 'A operação inteira de um posto de combustíveis, legível no celular.'
    },
    company: 'QWIP · own product',
    role: {
      en: 'Founder & engineer — web, mobile, backend and stores',
      pt: 'Fundador & engenheiro — web, mobile, backend e lojas'
    },
    period: { en: '2025 – Present', pt: '2025 – Atual' },
    platforms: ['iOS', 'Web'],
    summary: {
      en: 'My own SaaS: a multi-tenant financial management platform for gas stations. Reports, indicators and asset tracking — one NestJS backend, a Next.js web app and an Expo app, all built and shipped by me.',
      pt: 'Meu próprio SaaS: plataforma multi-tenant de gestão financeira para postos de combustíveis. Relatórios, indicadores e patrimônio — um backend NestJS, um web app Next.js e um app Expo, tudo construído e publicado por mim.'
    },
    context: {
      en: 'Gas station owners live between spreadsheets and paper reports: daily fuel sales, financial inventory, asset evolution, cost versus price. QWIP condenses that into clear indicators on a phone. Each client (station group) is a tenant with its own isolated database — the same product serves them all, securely separated.',
      pt: 'Dono de posto vive entre planilhas e relatórios de papel: venda diária por combustível, inventário financeiro, evolução de patrimônio, custo versus venda. O QWIP condensa isso em indicadores claros no celular. Cada cliente (grupo de postos) é um tenant com banco de dados isolado — o mesmo produto atende todos, separados com segurança.'
    },
    decisions: [
      {
        title: {
          en: 'Multi-tenant by subdomain, isolated by database',
          pt: 'Multi-tenant por subdomínio, isolado por banco'
        },
        body: {
          en: 'Each client gets a subdomain, and the backend resolves it to a dedicated PostgreSQL connection. Financial data from different station groups never shares a database — an architecture decision that makes audits and onboarding trivially explainable.',
          pt: 'Cada cliente ganha um subdomínio, e o backend resolve isso para uma conexão PostgreSQL dedicada. Dados financeiros de grupos diferentes nunca dividem banco — uma decisão de arquitetura que torna auditoria e onboarding triviais de explicar.'
        }
      },
      {
        title: {
          en: 'One TypeScript vocabulary across three apps',
          pt: 'Um vocabulário TypeScript em três apps'
        },
        body: {
          en: 'Next.js on the web, Expo on mobile, NestJS + TypeORM on the backend. Being the only engineer, I optimized for moving fast without breaking contracts: the same types describe a report from the database to the screen.',
          pt: 'Next.js na web, Expo no mobile, NestJS + TypeORM no backend. Sendo o único engenheiro, otimizei para andar rápido sem quebrar contratos: os mesmos tipos descrevem um relatório do banco até a tela.'
        }
      },
      {
        title: {
          en: 'Native SwiftUI where the iOS app earns it',
          pt: 'SwiftUI nativo onde o app iOS pede'
        },
        body: {
          en: 'The iOS app is Expo, but part of it is written natively in SwiftUI — the screens where a native feel and platform-perfect rendering matter more than cross-platform reuse. I reach for the native layer deliberately, not by default, and bridge it back into the Expo app.',
          pt: 'O app iOS é Expo, mas parte dele é escrita nativamente em SwiftUI — as telas em que o toque nativo e a renderização certinha da plataforma importam mais que reaproveitar entre plataformas. Vou para a camada nativa de propósito, não por padrão, e faço a ponte de volta para o app Expo.'
        }
      },
      {
        title: {
          en: 'Designed for numbers to be read, not decoded',
          pt: 'Desenhado para números serem lidos, não decifrados'
        },
        body: {
          en: 'The product is mostly tables and indicators — so the design work went into hierarchy: liters, tickets and averages aligned and scannable, reports exportable as PDFs the owner can file or forward. Sober UI, zero noise.',
          pt: 'O produto é majoritariamente tabela e indicador — então o design foi para a hierarquia: litros, tickets e médias alinhados e escaneáveis, relatórios exportáveis em PDF que o dono arquiva ou encaminha. UI sóbria, zero ruído.'
        }
      },
      {
        title: {
          en: 'Shipped like a product, not a side project',
          pt: 'Publicado como produto, não como projeto de gaveta'
        },
        body: {
          en: 'App Store listing under my own developer account, store screenshots designed by me, real clients in production. Owning the whole loop — code, design, infra, publishing — is the point of this project.',
          pt: 'Ficha na App Store na minha própria conta de desenvolvedor, screenshots de loja desenhados por mim, clientes reais em produção. Ser dono do ciclo inteiro — código, design, infra, publicação — é o ponto deste projeto.'
        }
      }
    ],
    outcome: {
      en: 'Live on the App Store and on the web, serving real gas station groups in production with daily financial reports and indicators.',
      pt: 'No ar na App Store e na web, atendendo grupos de postos reais em produção com relatórios e indicadores financeiros diários.'
    },
    icon: '/projects/shots/qwip-icon.png',
    // O arquivo é o logotipo em fundo transparente, com o texto em tinta
    // escura: sem a placa branca ele some no tema escuro.
    iconPlate: '#ffffff',
    screens: [
      {
        src: '/projects/shots/qwip-1.png',
        alt: {
          en: 'QWIP — the whole gas station in your pocket: reports home',
          pt: 'QWIP — todo o posto no seu bolso: home de relatórios'
        },
        kind: 'banner',
        aspect: '1080/2337'
      },
      {
        src: '/projects/shots/qwip-2.png',
        alt: {
          en: 'QWIP — all the finances in one report: financial inventory by fuel',
          pt: 'QWIP — todo o financeiro num relatório: inventário por combustível'
        },
        kind: 'banner',
        aspect: '1080/2337'
      },
      {
        src: '/projects/shots/qwip-3.png',
        alt: {
          en: 'QWIP — multiple stations, one account: admin with station switching',
          pt: 'QWIP — vários postos, uma só conta: admin com troca de posto'
        },
        kind: 'banner',
        aspect: '1080/2337'
      },
      {
        src: '/projects/shots/qwip-4.png',
        alt: {
          en: 'QWIP — smart management for your gas station: sign in',
          pt: 'QWIP — gestão inteligente para o seu posto: login'
        },
        kind: 'banner',
        aspect: '1080/2337'
      }
    ],
    theme: {
      bg: 'linear-gradient(135deg, #0e2a5c 0%, #2563eb 100%)',
      fg: '#ffffff',
      glow: '#93c5fd'
    },
    tags: ['Expo', 'React Native', 'SwiftUI', 'Next.js', 'NestJS', 'PostgreSQL', 'TypeScript'],
    links: [{ label: 'App Store', href: 'https://apps.apple.com/br/app/qwip/id6769966667' }],
    featured: true
  },
  {
    slug: 'nitrospray',
    kind: 'personal',
    title: 'NitroSpray',
    tagline: {
      en: 'A factory-floor ERP — from process mapping to deploy.',
      pt: 'ERP de chão de fábrica — do levantamento de processo ao deploy.'
    },
    company: 'Capstone · PUC-Campinas',
    role: {
      en: 'Author — Software Engineering capstone project',
      pt: 'Autor — TCC de Engenharia de Software'
    },
    period: { en: '2024', pt: '2024' },
    platforms: ['Web'],
    summary: {
      en: 'My Software Engineering capstone: an ERP to manage production processes in a medical equipment factory, built with React and Node.',
      pt: 'Trabalho de conclusão do curso de Engenharia de Software: um ERP para gerenciar os processos de produção de uma fábrica de equipamentos médicos, construído em React e Node.'
    },
    context: {
      en: 'Medical equipment factories live under traceability: every batch, step and inspection needs a record. NitroSpray models that production flow end to end — orders, stages, quality control — in a web system that replaces scattered spreadsheets.',
      pt: 'Fábricas de equipamentos médicos vivem sob rastreabilidade: cada lote, etapa e inspeção precisa de registro. O NitroSpray modela esse fluxo de produção de ponta a ponta — ordens, etapas, controle de qualidade — num sistema web que substitui planilhas espalhadas.'
    },
    decisions: [
      {
        title: {
          en: 'Model the process before the database',
          pt: 'Modelar o processo antes do banco'
        },
        body: {
          en: 'I spent the start of the project mapping the factory’s real flow with the people involved. With the domain well understood, the rest of the system — entities, screens, permissions — practically designed itself.',
          pt: 'Passei o início do projeto mapeando o fluxo real da fábrica com os envolvidos. O domínio bem entendido fez o resto do sistema — entidades, telas, permissões — praticamente se desenhar sozinho.'
        }
      },
      {
        title: {
          en: 'A deliberately lean stack',
          pt: 'Stack enxuta de propósito'
        },
        body: {
          en: 'React, Node and TypeScript end to end: one vocabulary of types from form to database. For a system maintained by few hands, less technology means more maintenance.',
          pt: 'React, Node e TypeScript de ponta a ponta: um único vocabulário de tipos do formulário ao banco. Para um sistema mantido por poucas mãos, menos tecnologia é mais manutenção.'
        }
      }
    ],
    outcome: {
      en: 'Capstone approved — graduated with a 9/10 GPA — and a working system as proof of owning the full engineering cycle.',
      pt: 'TCC aprovado — graduação concluída com coeficiente de rendimento 9 — e o sistema funcional como prova de domínio do ciclo completo de engenharia.'
    },
    screens: [],
    theme: {
      bg: 'linear-gradient(135deg, #14333d 0%, #1f5260 100%)',
      fg: '#d9f2ef',
      glow: '#5fd3c4'
    },
    tags: ['React', 'Node.js', 'TypeScript'],
    links: [],
    featured: false
  }
];

export const lab: LabProject[] = [
  {
    name: 'crypto-tracker',
    description: {
      en: 'Crypto tracker in SwiftUI — Combine, MVVM and the CoinGecko API.',
      pt: 'Tracker de criptomoedas em SwiftUI — Combine, MVVM e API da CoinGecko.'
    },
    href: 'https://github.com/amorimcode/crypto-tracker',
    tags: ['Swift', 'SwiftUI']
  },
  {
    name: 'MapApp-swiftui',
    description: {
      en: 'Maps and places app in SwiftUI, exploring MapKit and animations.',
      pt: 'App de mapas e lugares em SwiftUI, explorando MapKit e animações.'
    },
    href: 'https://github.com/amorimcode/MapApp-swiftui',
    tags: ['Swift', 'MapKit']
  },
  {
    name: 'calculator-swiftui',
    description: {
      en: 'An iOS calculator built from scratch to study SwiftUI layout.',
      pt: 'Calculadora iOS construída do zero para estudar layout em SwiftUI.'
    },
    href: 'https://github.com/amorimcode/calculator-swiftui',
    tags: ['Swift', 'SwiftUI']
  },
  {
    name: 'CarAPI',
    description: {
      en: 'Car registration API with a built-in authentication system, in Node.',
      pt: 'API de cadastro de carros com autenticação própria, em Node.'
    },
    href: 'https://github.com/amorimcode/CarAPI',
    tags: ['Node.js', 'API']
  },
  {
    name: 'wordle',
    description: {
      en: 'A Wordle clone to play with game logic and state.',
      pt: 'Clone do Wordle para brincar com lógica de jogo e estado.'
    },
    href: 'https://github.com/amorimcode/wordle',
    tags: ['TypeScript']
  },
  {
    name: 'bot-whatsapp',
    description: {
      en: 'A WhatsApp bot in Python — automation before it was mainstream.',
      pt: 'Bot de WhatsApp em Python — automação antes de ser mainstream.'
    },
    href: 'https://github.com/amorimcode/bot-whatsapp',
    tags: ['Python']
  }
];

/**
 * Apps que foram para a loja mas não têm case escrito aqui — trabalho feito
 * dentro de time de produto, onde o que dá para mostrar é o ícone.
 */
const shippedElsewhere: ShippedApp[] = [
  {
    icon: '/projects/shots/nomad-icon.png',
    title: 'Nomad',
    href: 'https://apps.apple.com/br/app/nomad-conta-digital-em-d%C3%B3lar/id1485257309'
  },
  // O app da Localiza no Bankeiro — o próprio ícone traz o “powered by bs2”.
  {
    icon: '/projects/shots/localiza-icon.png',
    title: 'Eqip Localiza',
    href: 'https://apps.apple.com/br/app/eqip-localiza/id6743860676'
  }
];

/**
 * O que alimenta o leque de ícones do título na home: primeiro os produtos com
 * case próprio, na ordem em que aparecem na página, depois os demais. Sai daqui
 * e não de `projects` para que um app sem case também caiba.
 *
 * Cada ícone leva à página do produto: o case daqui quando ele existe — é onde
 * o produto está contado por inteiro — e a loja quando o app só existe lá.
 */
export const shippedApps: ShippedApp[] = [
  ...projects
    .filter((project) => Boolean(project.icon))
    .map((project) => ({
      icon: project.icon as string,
      title: project.title,
      href: `/projects/${project.slug}`,
      ...(project.iconPlate ? { plate: project.iconPlate } : {})
    })),
  ...shippedElsewhere
];

export default projects;
