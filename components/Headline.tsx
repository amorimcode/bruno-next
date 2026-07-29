import { useGSAP } from '@gsap/react';
import { createElement, isValidElement, useRef } from 'react';

import { REVEAL_START, SplitText, gsap, reducedMotion } from '../lib/gsap';

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span';

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: Tag;
  /** Espera o título entrar na tela; sem isto, anima assim que a página monta. */
  onScroll?: boolean;
  delay?: number;
  /** Palavra a palavra em vez de linha a linha — para títulos de uma linha só. */
  by?: 'lines' | 'words';
};

/**
 * Texto puro de uma árvore de elementos. Serve de assinatura do conteúdo: é o
 * que diz se o título continua sendo o mesmo depois de um novo render.
 */
function textOf(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (isValidElement(node)) return textOf(node.props.children);
  return '';
}

/**
 * Título que sobe linha a linha de dentro de uma máscara, como letra de chumbo
 * subindo no componedor.
 *
 * Usa o SplitText com `autoSplit`: quando a fonte termina de carregar ou a
 * janela muda de largura, as linhas quebram em outros lugares e o plugin refaz
 * a divisão sozinho — sem isso, o título dividido com a fonte de fallback fica
 * com quebras erradas para sempre.
 *
 * A `key` com o texto do título não é decoração. O SplitText reescreve o
 * interior do elemento, e o React continua achando que é dono daqueles nós:
 * quando o texto muda (a troca de idioma, por exemplo) ele tenta remendar nós
 * que já não estão mais onde deveriam e a árvore quebra. Com a chave, o React
 * troca o elemento inteiro em vez de remendá-lo, e o efeito refaz a divisão no
 * elemento novo.
 */
export default function Headline({
  children,
  className,
  as = 'h2',
  onScroll = false,
  delay = 0,
  by = 'lines'
}: Props) {
  const host = useRef<HTMLHeadingElement>(null);
  const signature = textOf(children);

  useGSAP(
    () => {
      const el = host.current;
      if (!el) return;

      if (reducedMotion()) return;

      const split = SplitText.create(el, {
        type: by,
        mask: by,
        autoSplit: true,
        linesClass: 'sline',
        wordsClass: 'sline',
        // Devolver a animação daqui é o contrato do autoSplit: a cada nova
        // divisão o GSAP mata a anterior e roda esta no lugar.
        onSplit: (self) =>
          gsap.from(by === 'lines' ? self.lines : self.words, {
            yPercent: 115,
            duration: 1.05,
            ease: 'expo.out',
            stagger: by === 'lines' ? 0.11 : 0.045,
            delay,
            scrollTrigger: onScroll
              ? { trigger: el, start: REVEAL_START, once: true }
              : undefined
          })
      });

      return () => {
        split.revert();
      };
    },
    { scope: host, dependencies: [signature] }
  );

  return createElement(as, { key: signature, ref: host, className }, children);
}
