import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

import { gsap, reducedMotion } from '../lib/gsap';

/**
 * Envolve um botão e faz ele acompanhar o ponteiro de leve, como se estivesse
 * atraído por ele. O deslocamento é curto de propósito: passou de uns poucos
 * pixels, o alvo foge do clique em vez de convidar para ele.
 *
 * Só vale para ponteiro fino — em touch não existe hover, e o `quickTo` seria
 * criado à toa.
 */
export default function Magnetic({
  children,
  className,
  strength = 0.35,
  max = 10
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  max?: number;
}) {
  const host = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = host.current;
      if (!el || reducedMotion()) return;
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

      // `quickTo` reaproveita o mesmo tween a cada movimento do mouse; criar um
      // `gsap.to` por evento entope o ticker num gesto contínuo.
      const moveX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      const moveY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

      const follow = (event: PointerEvent) => {
        const box = el.getBoundingClientRect();
        const dx = event.clientX - (box.left + box.width / 2);
        const dy = event.clientY - (box.top + box.height / 2);
        moveX(gsap.utils.clamp(-max, max, dx * strength));
        moveY(gsap.utils.clamp(-max, max, dy * strength));
      };

      const release = () => {
        moveX(0);
        moveY(0);
      };

      el.addEventListener('pointermove', follow);
      el.addEventListener('pointerleave', release);
      return () => {
        el.removeEventListener('pointermove', follow);
        el.removeEventListener('pointerleave', release);
      };
    },
    { scope: host }
  );

  return (
    <span ref={host} className={`inline-block ${className ?? ''}`}>
      {children}
    </span>
  );
}
