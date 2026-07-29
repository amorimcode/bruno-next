import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

import { REVEAL_START, gsap, reducedMotion } from '../lib/gsap';

/**
 * Número da faixa de estatísticas contando até o valor final quando entra na
 * tela. O sufixo (“+”, por exemplo) fica fora da contagem para não piscar junto
 * com os dígitos.
 */
export default function Counter({
  value,
  className
}: {
  value: string;
  className?: string;
}) {
  const host = useRef<HTMLSpanElement>(null);
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : value;

  useGSAP(
    () => {
      const el = host.current;
      if (!el || !match || reducedMotion()) return;

      // Contar num objeto qualquer e escrever o inteiro no DOM sai mais barato
      // que animar o texto direto, e o `snap` garante que nunca aparece 3.7.
      const state = { n: 0 };
      el.textContent = '0';

      gsap.to(state, {
        n: target,
        duration: 1.6,
        ease: 'power2.out',
        snap: { n: 1 },
        onUpdate: () => {
          el.textContent = String(Math.round(state.n));
        },
        scrollTrigger: { trigger: el, start: REVEAL_START, once: true }
      });
    },
    { scope: host }
  );

  return (
    <span className={className}>
      {/* `tabular-nums` trava a largura dos dígitos: sem isso a linha inteira
          treme enquanto o número corre. */}
      <span ref={host} className="tabular-nums">
        {match ? match[1] : value}
      </span>
      {match ? suffix : null}
    </span>
  );
}
