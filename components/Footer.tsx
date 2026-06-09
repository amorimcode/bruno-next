import { useRouter } from 'next/router';

import ui from '../lib/i18n';
import { pickLocale } from '../lib/types';

const EMAIL = 'bruno.amorim032@gmail.com';

const links = [
  { label: 'GitHub', href: 'https://github.com/amorimcode' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/amorim-bruno/' }
];

export default function Footer() {
  const locale = pickLocale(useRouter().locale);

  return (
    <footer className="border-t border-line">
      <div className="mx-auto w-full max-w-wrap px-6 py-20 sm:py-28">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
          {ui.footer.cta[locale]}
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className="und mt-5 inline-block break-all font-display text-2xl tracking-tight text-ink hover:italic sm:text-4xl lg:text-5xl"
        >
          {EMAIL}
        </a>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.18em]">
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
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Bruno Amorim · Campinas, SP</span>
          <span>{ui.footer.note[locale]}</span>
        </div>
      </div>
    </footer>
  );
}
