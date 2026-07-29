import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef } from 'react';

import { gsap, reducedMotion } from '../lib/gsap';
import ui from '../lib/i18n';
import { pickLocale } from '../lib/types';
import Magnetic from './Magnetic';
import Reveal from './Reveal';

const EMAIL = 'me@brunoamorim.dev';

const links = [
  { label: 'GitHub', href: 'https://github.com/amorimcode' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/amorim-bruno/' }
];

/**
 * O endereço se remonta letra a letra quando o ponteiro chega. O texto final é
 * exatamente o mesmo de antes — o embaralhamento é um estado de passagem, então
 * quem copia o e-mail copia o endereço certo.
 */
function EmailLink() {
  const link = useRef<HTMLAnchorElement>(null);
  const { contextSafe } = useGSAP({ scope: link });

  const scramble = contextSafe(() => {
    if (reducedMotion()) return;
    gsap.to(link.current, {
      duration: 0.65,
      ease: 'none',
      scrambleText: {
        text: EMAIL,
        chars: 'abcdefghijklmnopqrstuvwxyz@._-',
        speed: 0.7,
        revealDelay: 0.1
      }
    });
  });

  return (
    <a
      ref={link}
      href={`mailto:${EMAIL}`}
      onPointerEnter={scramble}
      onFocus={scramble}
      className="und mt-5 inline-block break-all font-display text-2xl tracking-tight text-ink hover:italic sm:text-4xl lg:text-5xl"
    >
      {EMAIL}
    </a>
  );
}

export default function Footer() {
  const locale = pickLocale(useRouter().locale);

  return (
    <footer className="border-t border-line">
      <div className="mx-auto w-full max-w-wrap px-6 py-20 sm:py-28">
        <Reveal y={20}>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
            {ui.footer.cta[locale]}
          </p>
          <EmailLink />
        </Reveal>

        <Reveal className="mt-8" y={18} delay={0.1}>
          <Magnetic>
            <Link
              href="/schedule"
              className="flex w-fit items-center gap-2 rounded-full border border-line px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:border-accent hover:text-accent"
            >
              {ui.footer.book[locale]} <span aria-hidden="true">→</span>
            </Link>
          </Magnetic>
        </Reveal>

        <Reveal
          stagger={0.06}
          y={14}
          className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.18em]"
        >
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="und text-muted hover:text-ink"
            >
              {link.label} ↗
            </a>
          ))}
          <a
            href="https://docs.google.com/document/d/1ytfk3mYalVlSdQmBxfuDNgCVc_b7sFVFLLJVDNZWI74/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="und text-muted hover:text-ink"
          >
            {ui.footer.resume[locale]} ↗
          </a>
        </Reveal>

        <div className="mt-16 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Bruno Amorim · Campinas, SP</span>
          <span>{ui.footer.note[locale]}</span>
        </div>
      </div>
    </footer>
  );
}
