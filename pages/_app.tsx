import type { AppProps } from 'next/app';
import { Fraunces, Archivo, JetBrains_Mono } from '@next/font/google';
import { ThemeProvider } from 'next-themes';
import '../styles/globals.css';

const display = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap'
});

const sans = Archivo({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap'
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <div
        className={`${display.variable} ${sans.variable} ${mono.variable} font-sans grain`}
      >
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  );
}
