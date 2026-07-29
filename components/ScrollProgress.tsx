import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

import { gsap, reducedMotion } from '../lib/gsap';

/**
 * Fio de progresso na base do cabeçalho fixo. Sem gatilho e com `end: 'max'`, o
 * ScrollTrigger mede a página inteira — não é preciso apontar para nenhum
 * elemento.
 */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(bar.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        start: 0,
        end: 'max',
        // Um pouco de atraso deixa o fio com inércia; quem pediu menos
        // movimento recebe o valor cru da rolagem.
        scrub: reducedMotion() ? true : 0.25
      }
    });
  });

  // `-bottom-px` deixa o fio cobrir a borda do cabeçalho enquanto cresce, em
  // vez de desenhar uma segunda linha logo acima dela.
  return (
    <div
      ref={bar}
      aria-hidden
      className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-accent"
    />
  );
}
