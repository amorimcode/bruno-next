import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';

import { fontVariables } from '../lib/fonts';
import { ScrollTrigger } from '../lib/gsap';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  /**
   * Cada página monta seus próprios gatilhos, mas a troca de rota acontece sem
   * recarregar: as medidas da página anterior continuam valendo até alguém
   * mandar remedir. Um quadro depois da troca, tudo já está no lugar novo.
   */
  useEffect(() => {
    const refresh = () => requestAnimationFrame(() => ScrollTrigger.refresh());
    router.events.on('routeChangeComplete', refresh);
    return () => router.events.off('routeChangeComplete', refresh);
  }, [router.events]);

  return (
    <ThemeProvider attribute="class">
      {/* As variáveis já vêm do <html> pelo _document; aqui fica só o que é
          aparência desta árvore. */}
      <div className={`${fontVariables} font-sans grain`}>
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  );
}
