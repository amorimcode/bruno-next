import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

/**
 * Ponto único de entrada do GSAP. Todo componente importa daqui em vez de
 * chamar `registerPlugin` por conta própria: registrar duas vezes é inofensivo,
 * mas espalhar o registro é o jeito mais fácil de esquecer um plugin numa
 * página e descobrir isso só em produção.
 *
 * O registro fica dentro do guarda de `window` porque ScrollTrigger toca em
 * `document` na inicialização e as páginas aqui são pré-renderizadas no build.
 */
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

  // No iOS a barra de endereço encolhendo dispara um resize a cada rolagem, e
  // cada resize recalcula todos os gatilhos. Ignorar esse caso mantém a rolagem
  // fluida no celular.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** Curva usada em todas as entradas: sai rápido, chega devagar. */
export const EASE = 'power3.out';

/**
 * Um pouco antes do elemento chegar ao fim da tela. Mais tarde que isto e a
 * animação acontece fora do campo de visão de quem rola rápido.
 */
export const REVEAL_START = 'top 85%';

/**
 * Quem pediu menos movimento recebe o estado final direto, sem transição. É
 * consultado no momento da montagem em vez de via `matchMedia` reativo: trocar
 * a preferência no meio da visita é raro e recarregar resolve.
 */
export function reducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export { gsap, ScrollTrigger, SplitText };
