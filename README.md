# Bruno Amorim — Portfólio

Site pessoal de [Bruno Amorim](https://www.linkedin.com/in/amorim-bruno/), Senior Software Engineer.
Construído com [Next.js](https://nextjs.org/), TypeScript e [Tailwind CSS](https://tailwindcss.com/), com tema claro/escuro.

## Páginas

- **Início** — apresentação, links sociais (LinkedIn, GitHub, e-mail), projetos em destaque e a cena WebGL.
- **Projetos** — projetos mobile e web com imagem, descrição e stack de cada um.
- **Sobre** — experiência profissional, formação e tecnologias.
- **Agendar** — página `/schedule`, onde qualquer pessoa reserva um horário direto na minha agenda do Google.

## Movimento e 3D

O movimento do site é todo GSAP, concentrado em poucos componentes reutilizáveis:
[`Reveal`](components/Reveal.tsx) (entrada por rolagem), [`Headline`](components/Headline.tsx)
(título que sobe linha a linha, com SplitText), [`Counter`](components/Counter.tsx),
[`Parallax`](components/Parallax.tsx), [`Magnetic`](components/Magnetic.tsx) e
[`ScrollProgress`](components/ScrollProgress.tsx). Os plugins são registrados num
lugar só, em [`lib/gsap.ts`](lib/gsap.ts).

O estado inicial dos blocos que entram por rolagem mora no CSS (`[data-reveal]`), e não
num `gsap.set` na montagem: assim o conteúdo já chega escondido no HTML do servidor, sem
piscar. Quem não executa JavaScript recebe tudo à vista pelo `<noscript>` do `_document`.
Quem pede `prefers-reduced-motion` recebe o estado final direto, sem transição.

No herói, a palavra “apps” do título carrega os apps de verdade:
[`AppSwarm`](components/AppSwarm.tsx) ancora uma camada de ícones na palavra e os
lança numa fileira acima dela no hover — em tela de toque eles aparecem sozinhos, uma
vez, e voltam a aparecer no toque. A lista sai de `shippedApps`, em
[`lib/projects.ts`](lib/projects.ts): primeiro os produtos que têm case aqui, depois os
apps publicados dentro de time de produto, que existem só como ícone. Para incluir mais
um, basta o arquivo em `public/projects/shots/` e uma linha em `shippedElsewhere`. A camada é irmã do título, e não filha: as linhas do
SplitText viram máscaras com `overflow: clip` e cortariam qualquer coisa que saísse da
palavra.

Cada ícone no ar é um link para a página do produto: o case daqui quando ele existe, a
loja quando o app só existe lá. Dois detalhes fazem isso parar de pé. O clique só liga
enquanto o leque está aberto — parados, os ícones se empilham sobre a própria palavra e
roubariam dela o hover que abre tudo. E entre a palavra e a fileira existe uma ponte
invisível, dimensionada junto com o arco, porque sem ela o ponteiro “sairia” do leque no
vão que separa um do outro. Os links ficam fora da ordem de tabulação: o mesmo produto
aparece logo abaixo, listado com nome e case.

A cena WebGL da home é o [`Console3D`](components/Console3D.tsx): a unidade de estúdio
com botões que giram de verdade, sem nenhum arquivo de modelo ou textura — o painel
inteiro é desenhado num canvas 2D em tempo de execução, e desse mesmo traçado sai o mapa
de normais, por isso os rótulos são gravados no metal em vez de impressos. As ferramentas
que fabricam esse alumínio (escovado, gravação e o Sobel que vira relevo) ficam em
[`lib/machining.ts`](lib/machining.ts).

O ScrollTrigger só escreve o progresso da seção num ref e o loop do R3F decide o que
fazer com ele: a rolagem não passa pelo estado do React.

## Rodando localmente

```bash
yarn install
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

Sem as variáveis do Google configuradas o site inteiro funciona normalmente; só a página `/schedule` mostra o aviso de agenda indisponível.

## Agendamento (`/schedule`)

A página lê a disponibilidade real da agenda via `freeBusy` e cria o evento com convite e sala do Google Meet. Não há banco de dados: a agenda do Google é a fonte de verdade.

As regras de horário ficam todas em [`lib/schedule/config.ts`](lib/schedule/config.ts): dias úteis, das 13h às 18h no horário de Brasília, blocos de 30 minutos, 30 dias de horizonte e 2 horas de antecedência mínima. Sexta fecha mais cedo, às 16h, pela exceção em `DAY_END_HOUR_BY_WEEKDAY`.

### Configuração

A conta é Gmail pessoal, então não dá para usar service account (isso exige domain-wide delegation, exclusivo do Workspace). O caminho é dar consentimento uma vez e guardar o refresh token.

1. No [Google Cloud Console](https://console.cloud.google.com/), crie um projeto e habilite a **Google Calendar API**.
2. Configure a tela de consentimento OAuth como **External** e clique em **Publish app**.
   Enquanto o app ficar em modo *Testing* o refresh token expira em 7 dias e a página para de funcionar sozinha. Publicado, ele não expira por tempo.
   Os escopos usados são dois, e os dois são necessários: `calendar.events` para criar o evento e `calendar.freebusy` para ler a ocupação. O `freeBusy` não aceita `calendar.events`, então só com ele a página de horários responde 403.
3. Crie uma credencial **OAuth client ID** do tipo *Web application* com a redirect URI `http://localhost:4455/oauth2callback`.
   Ela serve só para o consentimento local: em produção o servidor troca o refresh token por access token direto, sem redirect. O domínio do site não entra aqui.
4. Copie `.env.local.example` para `.env.local` e preencha `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`.
5. Rode o script abaixo e aceite o consentimento. Ele grava o `GOOGLE_REFRESH_TOKEN` no `.env.local` sem imprimir o valor no terminal.

```bash
node scripts/google-oauth.mjs
```

Em produção, as mesmas quatro variáveis precisam existir no projeto da Vercel.

### Proteção contra abuso

O formulário tem honeypot, limite de tamanho nos campos e um freio por IP. A defesa principal, porém, é o servidor recalcular a grade de horários e recusar qualquer `start` que não seja um bloco válido, o que impede a rota de virar um criador de eventos arbitrários. Se aparecer abuso de verdade, o próximo passo é ligar o Vercel Firewall.

## Scripts

| Comando      | Descrição                          |
| ------------ | ---------------------------------- |
| `yarn dev`   | Servidor de desenvolvimento        |
| `yarn build` | Build de produção                  |
| `yarn start` | Servir o build de produção         |
| `yarn lint`  | ESLint                             |

## Stack

Next.js · React · TypeScript · Tailwind CSS · next-themes · GSAP (ScrollTrigger, SplitText) · three.js / react-three-fiber

## Deploy

Otimizado para deploy na [Vercel](https://vercel.com/).
