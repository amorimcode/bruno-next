import { Archivo, Fraunces, JetBrains_Mono } from '@next/font/google';

/**
 * As fontes moram aqui, e não no _app, porque o _document também precisa delas:
 * é ele que pendura as custom properties no <html>. Estando na raiz, qualquer
 * código pode ler `--font-display` do documento — é assim que a cena de
 * partículas descobre em que tipo desenhar as palavras.
 */
export const display = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap'
});

export const sans = Archivo({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

export const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap'
});

export const fontVariables = `${display.variable} ${sans.variable} ${mono.variable}`;
