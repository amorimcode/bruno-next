import { useEffect, useState } from 'react';

/** Lê uma custom property do tema (o site troca --bg, --ink e --accent no escuro). */
export function cssVar(name: string, fallback: string) {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

/**
 * O tema do site é uma classe na raiz, trocada pelo next-themes. As cenas WebGL
 * precisam saber disso para recolorir material e fundo, e observar a classe sai
 * mais barato que assinar o contexto do next-themes dentro do canvas.
 */
export function useDarkMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setDark(root.classList.contains('dark'));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return dark;
}
