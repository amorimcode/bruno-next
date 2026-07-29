import { useGSAP } from '@gsap/react';
import { createElement, useRef } from 'react';

import { EASE, REVEAL_START, gsap, reducedMotion } from '../lib/gsap';

type Tag =
  | 'div'
  | 'section'
  | 'ul'
  | 'ol'
  | 'dl'
  | 'p'
  | 'figure'
  | 'h1'
  | 'h2'
  | 'h3';

type Props = {
  children: React.ReactNode;
  className?: string;
  /**
   * Anima os filhos diretos em cascata em vez do bloco inteiro. É o intervalo
   * entre eles, em segundos.
   */
  stagger?: number;
  /** Deslocamento de partida, em pixels. */
  y?: number;
  delay?: number;
  start?: string;
  as?: Tag;
  id?: string;
};

/**
 * Entrada por rolagem, o gesto mais repetido do site.
 *
 * O estado inicial (invisível e deslocado) vem do CSS pelos atributos
 * `data-reveal`, e não de um `gsap.set` na montagem: assim o elemento já nasce
 * escondido no HTML do servidor e não existe aquele piscar em que o conteúdo
 * aparece inteiro e só depois some para animar. O `<noscript>` no _document
 * devolve tudo à vista para quem não executa JavaScript.
 */
export default function Reveal({
  children,
  className,
  stagger,
  y = 24,
  delay = 0,
  start = REVEAL_START,
  as = 'div',
  id
}: Props) {
  const host = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = host.current;
      if (!el) return;

      const targets = stagger ? Array.from(el.children) : el;

      if (reducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.95,
        ease: EASE,
        delay,
        stagger: stagger ?? 0,
        // `once` em vez de reverter na saída: reanimar quem já foi lido é ruído.
        scrollTrigger: { trigger: el, start, once: true }
      });
    },
    { scope: host }
  );

  return createElement(
    as,
    {
      ref: host,
      id,
      className,
      // A distância de partida vai por custom property para o CSS montar o
      // estado inicial sem precisar saber quanto cada bloco anda.
      style: { ['--reveal-y' as string]: `${y}px` },
      [stagger ? 'data-reveal-children' : 'data-reveal']: ''
    },
    children
  );
}
