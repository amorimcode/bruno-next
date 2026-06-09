import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

import ui from '../lib/i18n';
import { pickLocale } from '../lib/types';
import Footer from './Footer';

function NavItem({
  href,
  text,
  className = ''
}: {
  href: string;
  text: string;
  className?: string;
}) {
  const router = useRouter();
  const isActive =
    href === '/' ? router.pathname === '/' : router.pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`und transition-colors ${
        isActive ? 'text-ink' : 'text-muted hover:text-ink'
      } ${className}`}
    >
      {text}
    </Link>
  );
}

function LangSwitch() {
  const router = useRouter();
  const locale = pickLocale(router.locale);

  return (
    <span className="flex items-center gap-1.5 border-l border-line pl-4 sm:pl-6">
      <Link
        href={router.asPath}
        locale="en"
        className={locale === 'en' ? 'text-accent' : 'text-muted hover:text-ink'}
        aria-current={locale === 'en' ? 'true' : undefined}
      >
        EN
      </Link>
      <span className="text-line">/</span>
      <Link
        href={router.asPath}
        locale="pt"
        className={locale === 'pt' ? 'text-accent' : 'text-muted hover:text-ink'}
        aria-current={locale === 'pt' ? 'true' : undefined}
      >
        PT
      </Link>
    </span>
  );
}

function ThemeToggle({ label }: { label: string }) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  return (
    <button
      aria-label={label}
      type="button"
      className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {mounted && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-4 w-4"
        >
          {resolvedTheme === 'dark' ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          )}
        </svg>
      )}
    </button>
  );
}

type ContainerProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
};

export default function Container({ children, ...customMeta }: ContainerProps) {
  const router = useRouter();
  const locale = pickLocale(router.locale);

  const meta = {
    title: ui.meta.title[locale],
    description: ui.meta.description[locale],
    ...customMeta
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink">
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta content={meta.description} name="description" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Bruno Amorim" />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content="https://github.com/amorimcode.png" />
        <meta property="og:locale" content={locale === 'pt' ? 'pt_BR' : 'en_US'} />
      </Head>

      <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-wrap items-center justify-between px-6">
          <a href="#skip" className="skip-nav">
            {ui.nav.skip[locale]}
          </a>
          <Link
            href="/"
            aria-label="Bruno Amorim"
            className="font-display text-2xl italic leading-none tracking-tight"
          >
            ba<span className="text-accent">.</span>
          </Link>
          <nav className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.18em] sm:gap-6">
            <NavItem href="/" text={ui.nav.home[locale]} className="hidden sm:inline" />
            <NavItem href="/projects" text={ui.nav.projects[locale]} />
            <NavItem href="/about" text={ui.nav.about[locale]} />
            <LangSwitch />
            <ThemeToggle label={ui.nav.toggleTheme[locale]} />
          </nav>
        </div>
      </header>

      <main id="skip" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
