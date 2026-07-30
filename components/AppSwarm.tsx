import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

import { gsap, reducedMotion } from '../lib/gsap';

export type SwarmApp = {
  icon: string;
  title: string;
  /** Página do produto: o case aqui do site, ou a loja quando não há case. */
  href: string;
  /** Placa atrás do ícone, para logotipo de fundo transparente. */
  plate?: string;
};

/**
 * A prateleira onde os ícones param: distância entre eles, altura mínima acima
 * da palavra e quanto o meio da fileira sobe em relação às pontas.
 */
const SHELF = {
  narrow: { gap: 48, lift: 46, curve: 22, icon: 44 },
  wide: { gap: 68, lift: 64, curve: 32, icon: 56 }
};
/** Inclinação das pontas da fileira, em graus. */
const TILT = 9;
/** Altura do cabeçalho fixo, mais uma folga: a fileira não sobe por baixo dele. */
const HEADER_GUARD = 74;
/** Margem que a fileira mantém das bordas da coluna. */
const SIDE_GUARD = 8;
/** Folga da ponte de hover em volta da fileira. */
const BRIDGE_PAD = 8;

/** O que mantém o leque aberto enquanto o ponteiro estiver por cima. */
const HOT = '[data-apps-anchor], [data-swarm-icon], [data-swarm-bridge]';

type Spot = { x: number; y: number; rotation: number };

/**
 * A palavra “apps” do título carrega os apps de verdade.
 *
 * Passe o ponteiro por cima dela e os ícones que estão nas lojas saltam da
 * própria palavra, em leque, como se saíssem do bolso de que a frase fala.
 *
 * O componente envolve o título em vez de morar dentro dele por causa do
 * SplitText: as linhas do título viram máscaras com `overflow: clip`, e
 * qualquer coisa que saísse da palavra seria cortada na altura da linha. Aqui os
 * ícones ficam numa camada irmã, só ancorada na posição da palavra.
 *
 * Pelo mesmo motivo a palavra é procurada no DOM a cada medição, e os eventos
 * ficam delegados no container: a cada nova quebra de linha o SplitText refaz a
 * divisão, e um `ref` guardado apontaria para um nó que já saiu de cena.
 */
export default function AppSwarm({
  apps,
  children
}: {
  apps: SwarmApp[];
  children: React.ReactNode;
}) {
  const host = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const bridge = useRef<HTMLDivElement>(null);
  const spots = useRef<Spot[]>([]);
  const open = useRef(false);

  useGSAP(
    () => {
      const hostEl = host.current;
      const layerEl = layer.current;
      const bridgeEl = bridge.current;
      if (!hostEl || !layerEl || !bridgeEl) return;

      const icons = gsap.utils.toArray<HTMLElement>('[data-swarm-icon]', layerEl);
      const floats = gsap.utils.toArray<HTMLElement>('[data-swarm-float]', layerEl);
      // O que estiver marcado assim recua enquanto os ícones estão no ar: sem
      // isso a fileira aterrissa em cima de outro texto e as duas coisas
      // disputam a leitura.
      const dimmed = gsap.utils.toArray<HTMLElement>('[data-swarm-dim]', hostEl);
      if (icons.length === 0) return;

      const reduced = reducedMotion();
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

      // xPercent/yPercent centram o ícone no ponto de origem e continuam valendo
      // enquanto o x/y do voo é animado por cima.
      gsap.set(icons, { xPercent: -50, yPercent: -50, scale: 0.25, opacity: 0 });

      /**
       * A palavra de verdade entre as cópias que o SplitText deixa para trás:
       * ao dividir as linhas ele clona os elementos aninhados, e sobra uma
       * cópia vazia com o mesmo atributo. A que tem largura é a que está na
       * página.
       */
      const findWord = () => {
        const candidates = Array.from(
          hostEl.querySelectorAll<HTMLElement>('[data-apps-anchor]')
        );
        return candidates.reduce<HTMLElement | null>(
          (best, el) =>
            !best || el.getBoundingClientRect().width > best.getBoundingClientRect().width
              ? el
              : best,
          null
        );
      };

      /** Ancora a camada na palavra e recalcula onde cada ícone vai parar. */
      const place = () => {
        const word = findWord();
        if (!word || word.getBoundingClientRect().width === 0) return false;

        const hostBox = hostEl.getBoundingClientRect();
        const wordBox = word.getBoundingClientRect();
        const cx = wordBox.left - hostBox.left + wordBox.width / 2;
        const cy = wordBox.top - hostBox.top + wordBox.height / 2;

        layerEl.style.left = `${cx}px`;
        layerEl.style.top = `${cy}px`;

        const shelf = window.innerWidth >= 640 ? SHELF.wide : SHELF.narrow;
        const half = (icons.length - 1) / 2;

        // A fileira sobe por cima do que estiver acima do título — o que ela não
        // pode é passar por baixo do cabeçalho fixo e aparecer cortada. A conta
        // é em coordenadas de tela, que é onde o cabeçalho está.
        const headroom = wordBox.top - HEADER_GUARD - shelf.icon / 2;
        const squeeze = Math.min(1, headroom / (shelf.lift + shelf.curve));
        const lift = shelf.lift * squeeze;
        const curve = shelf.curve * squeeze;

        // O espaçamento cede quando entra mais app do que a coluna comporta:
        // ícone sobrepondo ícone ainda se lê como pilha, fileira vazando pela
        // borda não.
        const room = hostBox.width - 2 * SIDE_GUARD - shelf.icon;
        const gap =
          icons.length > 1 ? Math.min(shelf.gap, room / (icons.length - 1)) : 0;

        // Em coluna estreita a fileira encostaria nas bordas; aqui ela desliza
        // de lado até caber, em vez de vazar.
        const reach = half * gap + shelf.icon / 2;
        const slide =
          Math.max(0, SIDE_GUARD + reach - cx) -
          Math.max(0, cx + reach - (hostBox.width - SIDE_GUARD));

        spots.current = icons.map((_, index) => {
          // -1 na ponta esquerda, 0 no meio, 1 na ponta direita.
          const t = half === 0 ? 0 : (index - half) / half;
          return {
            x: (index - half) * gap + slide,
            // Parábola: o meio da fileira sobe mais que as pontas, e o conjunto
            // acompanha a curva do arco sem virar um paredão reto.
            y: -lift - curve * (1 - t * t),
            rotation: t * TILT
          };
        });

        // Entre a palavra e a fileira há dezenas de pixels de nada. Como agora
        // cada ícone é um link, o ponteiro precisa poder subir até lá: esta
        // ponte invisível cobre o vão para que a subida não conte como saída.
        const xs = spots.current.map((spot) => spot.x);
        const top = Math.min(...spots.current.map((spot) => spot.y)) - shelf.icon / 2 - BRIDGE_PAD;
        const left = Math.min(...xs) - shelf.icon / 2 - BRIDGE_PAD;
        const right = Math.max(...xs) + shelf.icon / 2 + BRIDGE_PAD;
        bridgeEl.style.left = `${left}px`;
        bridgeEl.style.top = `${top}px`;
        bridgeEl.style.width = `${right - left}px`;
        bridgeEl.style.height = `${wordBox.height / 2 - top}px`;

        return true;
      };

      const show = () => {
        if (!place()) return;
        open.current = true;
        // Só clicável no ar: parados, os ícones ficam empilhados sobre a própria
        // palavra e roubariam dela o hover que abre o leque.
        gsap.set(icons, { pointerEvents: 'auto' });
        if (fine) gsap.set(bridgeEl, { pointerEvents: 'auto' });
        gsap.to(dimmed, { opacity: 0.3, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
        gsap.to(icons, {
          x: (i: number) => spots.current[i].x,
          y: (i: number) => spots.current[i].y,
          rotation: (i: number) => (reduced ? 0 : spots.current[i].rotation),
          scale: 1,
          opacity: 1,
          duration: reduced ? 0.25 : 0.72,
          // `back` dá o repique de quem foi lançado; sem ele os ícones parecem
          // deslizar num trilho.
          ease: reduced ? 'power1.out' : 'back.out(1.7)',
          stagger: { each: 0.05, from: 'center' },
          overwrite: 'auto'
        });
      };

      const hide = () => {
        open.current = false;
        // Desliga o clique já na saída, e não no fim da animação: quem está
        // voltando para a palavra não pode esbarrar num link em retirada.
        gsap.set([...icons, bridgeEl], { pointerEvents: 'none' });
        gsap.to(dimmed, { opacity: 1, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
        gsap.to(icons, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 0.25,
          opacity: 0,
          duration: reduced ? 0.2 : 0.34,
          ease: 'power2.in',
          stagger: { each: 0.03, from: 'edges' },
          overwrite: 'auto'
        });
      };

      const onWord = (node: EventTarget | null) =>
        node instanceof Element ? node.closest('[data-apps-anchor]') : null;

      /**
       * A palavra é o gatilho, mas o leque inteiro é zona quente: com os ícones
       * clicáveis, sair da palavra em direção a eles não pode fechar nada.
       */
      const onSwarm = (node: EventTarget | null) =>
        node instanceof Element ? node.closest(HOT) : null;

      const enter = (event: PointerEvent) => {
        // Sem o `open`, andar de um ícone para o vizinho rearmaria a animação de
        // lançamento a cada passo do ponteiro.
        if (!open.current && onSwarm(event.target)) show();
      };

      const leave = (event: PointerEvent) => {
        if (onSwarm(event.target) && !onSwarm(event.relatedTarget)) hide();
      };

      const toggle = (event: MouseEvent) => {
        if (!onWord(event.target)) return;
        if (open.current) hide();
        else show();
      };

      if (fine) {
        hostEl.addEventListener('pointerover', enter);
        hostEl.addEventListener('pointerout', leave);
      } else {
        // Sem hover, o toque abre e fecha.
        hostEl.addEventListener('click', toggle);
      }

      // Enquanto estão no ar, cada ícone flutua no próprio ritmo — é o que tira
      // o ar de figura colada.
      if (!reduced) {
        floats.forEach((el, index) => {
          gsap.to(el, {
            y: -5,
            duration: 1.5 + index * 0.13,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: index * 0.08
          });
        });
      }

      // Em telas de toque ninguém descobre um hover: os apps aparecem uma vez,
      // sozinhos, quando a entrada do herói termina.
      if (!fine && !reduced) {
        gsap.delayedCall(1.6, show);
        gsap.delayedCall(4.4, () => {
          if (open.current) hide();
        });
      }

      // Uma quebra de linha diferente muda a palavra de lugar; com o leque
      // aberto, os ícones precisam acompanhar.
      const observer = new ResizeObserver(() => {
        if (open.current) show();
      });
      observer.observe(hostEl);

      return () => {
        hostEl.removeEventListener('pointerover', enter);
        hostEl.removeEventListener('pointerout', leave);
        hostEl.removeEventListener('click', toggle);
        observer.disconnect();
      };
    },
    { scope: host, dependencies: [apps] }
  );

  return (
    <div ref={host} className="relative">
      {children}

      {/* Atalho, não navegação: cada ícone leva à página do produto, mas os
          mesmos produtos estão listados logo abaixo, com nome e case. Daí o
          aria-hidden e o `tabIndex={-1}` — nada aqui é a única porta para lugar
          nenhum, e ninguém tateia oito links invisíveis pelo teclado. */}
      <div
        ref={layer}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 h-0 w-0"
      >
        <div ref={bridge} data-swarm-bridge className="pointer-events-none absolute" />

        {/* O tamanho mora no invólucro, e não na imagem: o `max-width: 100%`
            que o Tailwind põe em toda imagem se resolveria contra um pai sem
            largura e deixaria o ícone com zero pixel. */}
        {apps.map((app) => (
          <div
            key={app.icon}
            data-swarm-icon
            // Invisível já no HTML do servidor: o estado inicial do GSAP só
            // chega depois da hidratação, e sem isto os seis ícones aparecem
            // empilhados na quina do herói até o script rodar.
            className="pointer-events-none absolute h-11 w-11 opacity-0 sm:h-14 sm:w-14"
          >
            <AppLink app={app}>
              <div
                data-swarm-float
                className="h-full w-full overflow-hidden rounded-[22%] shadow-xl ring-1 ring-black/10 dark:ring-white/15"
                style={app.plate ? { background: app.plate } : undefined}
              >
                <Image
                  src={app.icon}
                  alt=""
                  width={128}
                  height={128}
                  className="h-full w-full"
                />
              </div>
            </AppLink>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * A página do produto: o case daqui quando ele existe — é onde o produto está
 * contado por inteiro — e a loja quando o app só existe lá, aí em outra aba,
 * para não tirar ninguém do meio da leitura.
 */
function AppLink({
  app,
  children
}: {
  app: SwarmApp;
  children: React.ReactNode;
}) {
  // O afago do hover mora no link, e não no ícone: o GSAP já é dono do
  // transform de quem voa e de quem flutua.
  const className =
    'block h-full w-full transition-transform duration-200 ease-out hover:scale-110';

  if (/^https?:/.test(app.href)) {
    return (
      <a
        href={app.href}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        title={app.title}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={app.href} tabIndex={-1} title={app.title} className={className}>
      {children}
    </Link>
  );
}
