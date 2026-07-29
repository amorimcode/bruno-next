import { Html, Head, Main, NextScript } from 'next/document';

import { fontVariables } from '../lib/fonts';

export default function Document() {
  return (
    <Html className={fontVariables}>
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#211d17" />
        {/* Sem JavaScript não há GSAP para revelar os blocos de rolagem, então
            o estado inicial escondido precisa ser desfeito na marra. */}
        <noscript>
          <style>{`[data-reveal],[data-reveal-children] > *{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </Head>
      <body className="bg-bg text-ink">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
