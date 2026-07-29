/**
 * Ferramentas para fabricar metal usinado em tempo de execução. Todo o
 * grafismo das cenas 3D do site sai daqui: nenhuma textura é baixada, nenhum
 * arquivo é carregado — o alumínio escovado e a gravação são desenhados num
 * canvas 2D quando a página monta.
 */

export function makeCanvas(width: number, height = width) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/**
 * Escovado, pixel a pixel. Traçar milhares de riscos com a API de canvas era
 * lento o bastante para travar a montagem da página, e riscos longos viravam
 * borrão. Aqui cada linha é um passeio aleatório curto em x, herdando parte da
 * linha de cima: dá grão fino e risco que atravessa várias linhas.
 */
export function brushedFill(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  base: [number, number, number],
  contrast: number
) {
  const image = ctx.createImageData(width, height);
  const data = image.data;
  const previous = new Float32Array(width).fill(0.5);
  let walk = 0.5;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      walk += (Math.random() - walk) * 0.35;
      const value = previous[x] * 0.72 + walk * 0.28;
      previous[x] = value;

      const shade = (value - 0.5) * contrast;
      const i = (y * width + x) * 4;
      data[i] = Math.max(0, Math.min(255, base[0] + shade));
      data[i + 1] = Math.max(0, Math.min(255, base[1] + shade));
      data[i + 2] = Math.max(0, Math.min(255, base[2] + shade));
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);
}

/**
 * Sobel no mapa de altura. Sai num canvas (e não num DataTexture) para herdar o
 * mesmo `flipY` do mapa de cor — assim o relevo não fica invertido.
 */
export function heightToNormal(height: HTMLCanvasElement, strength: number) {
  const w = height.width;
  const h = height.height;
  const src = height.getContext('2d')!.getImageData(0, 0, w, h).data;
  const target = makeCanvas(w, h);
  const ctx = target.getContext('2d')!;
  const image = ctx.createImageData(w, h);
  const out = image.data;

  const at = (x: number, y: number) => {
    const cx = x < 0 ? 0 : x > w - 1 ? w - 1 : x;
    const cy = y < 0 ? 0 : y > h - 1 ? h - 1 : y;
    return src[(cy * w + cx) * 4] / 255;
  };

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
      const dy = (at(x, y + 1) - at(x, y - 1)) * strength;
      // A normal aponta contra a inclinação; z fixo em 1 antes de normalizar.
      const len = Math.sqrt(dx * dx + dy * dy + 1);
      const i = (y * w + x) * 4;
      out[i] = ((-dx / len) * 0.5 + 0.5) * 255;
      out[i + 1] = ((-dy / len) * 0.5 + 0.5) * 255;
      out[i + 2] = (1 / len) * 0.5 * 255 + 127.5;
      out[i + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);
  return target;
}

/**
 * Texto com espaçamento entre letras. `ctx.letterSpacing` existe no Chrome mas
 * chegou tarde no Safari e não está tipado aqui, então o tracking é aplicado
 * caractere a caractere.
 */
export function drawTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  tracking: number,
  align: 'center' | 'left' | 'right' = 'center'
) {
  const widths = Array.from(text).map((char) => ctx.measureText(char).width);
  const total = widths.reduce((sum, w) => sum + w, 0) + tracking * (text.length - 1);
  let cursor = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;

  const previousAlign = ctx.textAlign;
  ctx.textAlign = 'left';
  Array.from(text).forEach((char, index) => {
    ctx.fillText(char, cursor, y);
    cursor += widths[index] + tracking;
  });
  ctx.textAlign = previousAlign;
}

/** Largura do texto com o tracking aplicado, para caber a frase na fita. */
export function trackedWidth(
  ctx: CanvasRenderingContext2D,
  text: string,
  tracking: number
) {
  const widths = Array.from(text).map((char) => ctx.measureText(char).width);
  return widths.reduce((sum, w) => sum + w, 0) + tracking * (text.length - 1);
}
