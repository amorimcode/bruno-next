import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

import { gsap, reducedMotion } from '../lib/gsap';

/**
 * Camada que se desloca contra a rolagem. Quem chama é dono da moldura com
 * `overflow: hidden`; aqui dentro só existe o conteúdo que se move.
 *
 * O `scale` compensa o deslocamento: sem ele, a camada mostraria a moldura
 * vazia nas pontas do percurso.
 */
export default function Parallax({
  children,
  className,
  amount = 7,
  scale = 1.16
}: {
  children: React.ReactNode;
  className?: string;
  /** Deslocamento total, em porcentagem da própria altura. */
  amount?: number;
  scale?: number;
}) {
  const layer = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = layer.current;
      if (!el || reducedMotion()) return;

      gsap.fromTo(
        el,
        { yPercent: -amount, scale },
        {
          yPercent: amount,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    },
    { scope: layer }
  );

  return (
    <div ref={layer} className={className}>
      {children}
    </div>
  );
}
