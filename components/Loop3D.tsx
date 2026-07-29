import { useGSAP } from '@gsap/react';
import { Environment, Lightformer } from '@react-three/drei';
import { Canvas, invalidate, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { ScrollTrigger, reducedMotion } from '../lib/gsap';
import {
  brushedFill,
  drawTracked,
  heightToNormal,
  makeCanvas,
  trackedWidth
} from '../lib/machining';
import { cssVar, useDarkMode } from '../lib/theme';

/**
 * O ciclo do trabalho como peça física: uma fita de alumínio fechada com meia
 * volta — uma faixa de Möbius — com desenhar, construir, publicar e repetir
 * gravados no metal.
 *
 * A escolha da forma é o argumento: a faixa tem uma só face e uma só borda, e
 * quem acompanha as palavras volta ao começo sem nunca ter trocado de lado. É
 * a mesma ideia que a fileira numerada abaixo da cena diz em texto.
 *
 * Como no console da seção seguinte, nada aqui é arquivo: a fita é gerada
 * vértice a vértice e o escovado com a gravação sai de um canvas 2D em tempo
 * de execução, do qual também sai o mapa de normais — as palavras são
 * cavadas no metal, não impressas por cima.
 */

/** Raio da fita e seção transversal, em unidades de mundo. */
const RADIUS = 1.9;
const BAND_W = 0.62;
const BAND_T = 0.045;
/** Segmentos ao longo da volta. Abaixo de ~300 a curva mostra facetas. */
const SEGMENTS = 380;

/** Tira onde a gravação é desenhada; 8:1 para o texto não esticar na fita. */
const STRIP_W = 2048;
const STRIP_H = 256;
/** Quantas vezes a frase dá a volta. */
const REPEATS = 2;

const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

/**
 * Fita de Möbius com espessura: um retângulo varrido ao longo da volta,
 * girando meia volta no próprio eixo no caminho.
 *
 * A seção fechada (quatro faces) não é capricho — é o que dá a linha de luz na
 * borda. Uma faixa de espessura zero fica com o corte transparente e denuncia
 * que é um plano dobrado.
 */
function buildRibbon() {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const halfW = BAND_W / 2;
  const halfT = BAND_T / 2;

  // Faces largas primeiro, bordas depois: cada uma ganha a sua faixa de UV,
  // e só as largas caem em cima da gravação.
  const faces = [
    { a: [1, 1], b: [-1, 1], v0: 0.1, v1: 0.9 }, // face de cima
    { a: [-1, -1], b: [1, -1], v0: 0.1, v1: 0.9 }, // face de baixo
    { a: [1, -1], b: [1, 1], v0: 0.02, v1: 0.06 }, // borda externa
    { a: [-1, 1], b: [-1, -1], v0: 0.02, v1: 0.06 } // borda interna
  ];

  const point = (u: number, across: number, through: number) => {
    const angle = u * Math.PI * 2;
    // Meia volta da seção enquanto a fita dá a volta inteira: é o que fecha a
    // faixa com uma face só.
    const twist = angle / 2;
    const cosT = Math.cos(twist);
    const sinT = Math.sin(twist);

    // Base local: `rad` aponta para fora do anel, `axis` para cima.
    const offR = across * halfW * cosT + through * halfT * -sinT;
    const offZ = across * halfW * sinT + through * halfT * cosT;
    const r = RADIUS + offR;

    return [r * Math.cos(angle), r * Math.sin(angle), offZ];
  };

  faces.forEach((face) => {
    const base = positions.length / 3;

    for (let i = 0; i <= SEGMENTS; i += 1) {
      const u = i / SEGMENTS;
      const [ax, ay] = face.a;
      const [bx, by] = face.b;

      positions.push(...point(u, ax, ay));
      uvs.push(u * REPEATS, face.v0);

      positions.push(...point(u, bx, by));
      uvs.push(u * REPEATS, face.v1);
    }

    for (let i = 0; i < SEGMENTS; i += 1) {
      const p = base + i * 2;
      indices.push(p, p + 1, p + 2, p + 1, p + 3, p + 2);
    }
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * A gravação da fita: as palavras do ciclo, separadas por losangos, ocupando a
 * tira inteira. O mesmo traçado alimenta cor, relevo, aspereza e metalness —
 * por isso as cores entram por parâmetro em vez de ficarem fixas.
 */
function drawEngraving(
  ctx: CanvasRenderingContext2D,
  words: readonly string[],
  ink: string,
  soft: string,
  lineWidth = 1
) {
  const phrase = words.map((w) => w.toUpperCase());
  const family = cssVar('--font-display', 'Georgia, serif');
  const tracking = 14;

  // Tamanho que faz a frase inteira caber exatamente numa volta da tira.
  ctx.font = `700 100px ${family}, Georgia, serif`;
  const sample = phrase.join('     ');
  const at100 = trackedWidth(ctx, sample, tracking) + phrase.length * 120;
  const size = Math.min((STRIP_W * 0.94 * 100) / at100, STRIP_H * 0.62);

  ctx.font = `700 ${size}px ${family}, Georgia, serif`;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = ink;

  const slot = STRIP_W / phrase.length;
  const mid = STRIP_H / 2;

  phrase.forEach((word, index) => {
    drawTracked(ctx, word, slot * (index + 0.5), mid, tracking * (size / 100));

    // Losango de separação entre as palavras, no lugar de vírgula.
    const x = slot * (index + 1);
    const d = size * 0.07;
    ctx.save();
    ctx.translate(x, mid);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = soft;
    ctx.fillRect(-d / 2, -d / 2, d, d);
    ctx.restore();
    ctx.fillStyle = ink;
  });

  // Filetes rente às bordas, como numa peça torneada de verdade.
  ctx.strokeStyle = soft;
  ctx.lineWidth = 2.5 * lineWidth;
  [STRIP_H * 0.115, STRIP_H * 0.885].forEach((y) => {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(STRIP_W, y);
    ctx.stroke();
  });

  // Assinatura miúda, repetida uma vez por volta.
  ctx.fillStyle = soft;
  ctx.font = `500 ${Math.round(STRIP_H * 0.052)}px ${MONO}`;
  ctx.textAlign = 'center';
  drawTracked(ctx, 'BA · LOOP Nº 01', slot * 0.5, STRIP_H * 0.955, 4);
}

/** Alumínio escovado com a frase cavada, nos quatro mapas que o metal precisa. */
function useRibbonMaps(words: readonly string[]) {
  const maps = useMemo(() => {
    const albedo = makeCanvas(STRIP_W, STRIP_H);
    const albedoCtx = albedo.getContext('2d')!;
    brushedFill(albedoCtx, STRIP_W, STRIP_H, [201, 196, 184], 20);
    drawEngraving(albedoCtx, words, '#191710', '#615d54');

    const height = makeCanvas(STRIP_W, STRIP_H);
    const heightCtx = height.getContext('2d')!;
    // O relevo do escovado fica quase imperceptível de propósito: exagerar aqui
    // produz faixas largas no mapa de normais.
    brushedFill(heightCtx, STRIP_W, STRIP_H, [128, 128, 128], 12);
    heightCtx.filter = 'blur(1.3px)';
    drawEngraving(heightCtx, words, '#1e1e1e', '#3c3c3c', 1.15);
    heightCtx.filter = 'none';

    const rough = makeCanvas(STRIP_W, STRIP_H);
    const roughCtx = rough.getContext('2d')!;
    // Mais áspera que a chapa do console: a fita é curva e vira para todo lado,
    // e metal polido demais só acende onde há luz apontada — o resto fica preto.
    brushedFill(roughCtx, STRIP_W, STRIP_H, [112, 112, 112], 44);
    drawEngraving(roughCtx, words, '#dcdcdc', '#b4b4b4', 1.1);

    const metal = makeCanvas(STRIP_W, STRIP_H);
    const metalCtx = metal.getContext('2d')!;
    metalCtx.fillStyle = '#ffffff';
    metalCtx.fillRect(0, 0, STRIP_W, STRIP_H);
    // Sulco gravado é tinta fosca, não metal nu: sem isto seria preciso baixar o
    // metalness da fita inteira, e aí o alumínio vira papelão claro.
    drawEngraving(metalCtx, words, '#141414', '#4a4a4a', 1.05);

    const map = new THREE.CanvasTexture(albedo);
    map.colorSpace = THREE.SRGBColorSpace;

    const normalMap = new THREE.CanvasTexture(heightToNormal(height, 3.4));
    const roughnessMap = new THREE.CanvasTexture(rough);
    const metalnessMap = new THREE.CanvasTexture(metal);

    [map, normalMap, roughnessMap, metalnessMap].forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.anisotropy = 16;
    });

    return { map, normalMap, roughnessMap, metalnessMap };
  }, [words]);

  useEffect(
    () => () => {
      maps.map.dispose();
      maps.normalMap.dispose();
      maps.roughnessMap.dispose();
      maps.metalnessMap.dispose();
    },
    [maps]
  );

  return maps;
}

function Ribbon({
  words,
  reduced,
  scroll,
  onGrab
}: {
  words: readonly string[];
  reduced: boolean;
  scroll: React.MutableRefObject<number>;
  onGrab: (grabbing: boolean) => void;
}) {
  const spinner = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const maps = useRibbonMaps(words);
  const geometry = useMemo(() => buildRibbon(), []);

  /** Ângulo da volta e a velocidade com que ele anda, em radianos por segundo. */
  const spin = useRef({ angle: 0, speed: reduced ? 0 : 0.22 });
  const dragging = useRef(false);
  const lastX = useRef(0);
  const intro = useRef(reduced ? 1 : 0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.cursor = hovered ? 'grab' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  useEffect(() => {
    if (!dragging.current) return;
    // Ouvir na janela, e não na malha: o ponteiro sai da fita no meio do gesto
    // e o giro não pode parar por causa disso.
    const move = (event: PointerEvent) => {
      const delta = event.clientX - lastX.current;
      lastX.current = event.clientX;
      spin.current.speed = THREE.MathUtils.clamp(delta * 0.09, -6, 6);
      spin.current.angle += delta * 0.006;
    };
    const stop = () => {
      dragging.current = false;
      onGrab(false);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };
  });

  useFrame((state, delta) => {
    if (!spinner.current || !tilt.current) return;

    // Entrada: a peça chega deitada e se levanta até a pose de repouso.
    intro.current = Math.min(1, intro.current + delta / 1.4);
    const eased = 1 - Math.pow(1 - intro.current, 3);

    if (!dragging.current) {
      // Depois do arrasto a fita volta sozinha ao ritmo de repouso, como um
      // volante pesado perdendo inércia.
      const rest = reduced ? 0 : 0.22;
      spin.current.speed +=
        (rest - spin.current.speed) * (1 - Math.exp(-1.6 * delta));
      spin.current.angle += spin.current.speed * delta;
    }

    spinner.current.rotation.z = spin.current.angle;

    // A rolagem inclina o anel de um lado ao outro da seção, e o ponteiro dá o
    // paralaxe. As duas coisas entram na mesma pose de repouso.
    const p = scroll.current - 0.5;
    const pitch = -0.82 + p * 0.26 - state.pointer.y * 0.12;
    const yaw = 0.16 + state.pointer.x * 0.2;

    tilt.current.rotation.x = THREE.MathUtils.damp(
      tilt.current.rotation.x,
      pitch,
      3,
      delta
    ) + (1 - eased) * -0.55;
    tilt.current.rotation.y = THREE.MathUtils.damp(tilt.current.rotation.y, yaw, 3, delta);
    tilt.current.scale.setScalar(0.9 + eased * 0.1);
  });

  return (
    <group ref={tilt}>
      <group ref={spinner}>
        <mesh
          geometry={geometry}
          castShadow
          receiveShadow
          onPointerOver={(event) => {
            event.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
          onPointerDown={(event) => {
            event.stopPropagation();
            lastX.current = event.clientX;
            dragging.current = true;
            onGrab(true);
          }}
        >
          <meshPhysicalMaterial
            {...maps}
            metalness={0.88}
            roughness={1}
            clearcoat={0.2}
            clearcoatRoughness={0.3}
            envMapIntensity={2.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}

function Scene({
  words,
  dark,
  accent,
  reduced,
  scroll,
  onGrab
}: {
  words: readonly string[];
  dark: boolean;
  accent: string;
  reduced: boolean;
  scroll: React.MutableRefObject<number>;
  onGrab: (grabbing: boolean) => void;
}) {
  const { viewport } = useThree();
  // Cabe pela largura ou pela altura, o que apertar primeiro — a fita inclinada
  // ocupa mais vertical do que parece.
  // A conta é feita na pose de repouso, que é a mais aberta: durante a entrada
  // o anel está mais deitado e ocupa menos altura. Dimensionar pela entrada
  // deixaria a peça invadindo o título assim que ela assenta.
  const fit = Math.min(viewport.width / 5, viewport.height / 4.05, 1.2);

  return (
    <>
      <ambientLight intensity={dark ? 0.08 : 0.3} />
      {/* Luz principal frontal e alta: é ela que acende a quina da fita e faz a
          gravação aparecer como sulco, e não como decalque. */}
      <directionalLight position={[2.4, 3.4, 6]} intensity={dark ? 2.8 : 3.2} />
      {/* Contraluz quente separando a peça do fundo. */}
      <directionalLight position={[-5, 1.5, -4]} intensity={dark ? 0.9 : 0.5} color="#ffc9a6" />

      <group scale={fit}>
        <Ribbon words={words} reduced={reduced} scroll={scroll} onGrab={onGrab} />
      </group>

      {/* Os reflexos são montados na cena: sem HDR de CDN, sem pedido de rede.
          Diferente de uma chapa plana, o anel vira para todos os lados, então
          precisa de algo para refletir em cada direção — senão metade da fita
          fica preta por não ter luz de frente. */}
      <Environment resolution={256}>
        {/* Softbox principal, no alto. */}
        <Lightformer form="rect" intensity={dark ? 4 : 5} position={[-1.2, 4, 4]} scale={[8, 3, 1]} />
        {/* Parede ampla atrás da câmera: é o que a face virada para nós reflete. */}
        <Lightformer form="rect" intensity={dark ? 1.2 : 2} position={[0, 0, 7]} scale={[12, 8, 1]} />
        {/* Faixas verticais compridas desenham o brilho alongado do escovado. */}
        <Lightformer form="rect" intensity={3} position={[-5, 1, 3]} scale={[0.8, 10, 1]} rotation={[0, Math.PI / 7, 0]} />
        <Lightformer form="rect" intensity={2.4} position={[5, 0.5, 3]} scale={[0.6, 10, 1]} rotation={[0, -Math.PI / 7, 0]} />
        {/* Chão claro: sem ele a barriga da fita fecha em preto. */}
        <Lightformer form="rect" intensity={dark ? 0.9 : 1.6} position={[0, -4, 1]} scale={[10, 6, 1]} />
        <Lightformer form="ring" intensity={1} color={accent} position={[3.5, -2.5, 2]} scale={4} />
      </Environment>
    </>
  );
}

export default function Loop3D({ words }: { words: readonly string[] }) {
  const dark = useDarkMode();
  const host = useRef<HTMLDivElement>(null);
  const scroll = useRef(0.5);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [grabbing, setGrabbing] = useState(false);

  // Fora da tela a cena não desenha — a página rola sem disputar GPU com a
  // outra cena 3D desta mesma home.
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '160px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (visible) invalidate();
  }, [visible]);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  // A posição da seção na rolagem é o único elo que o GSAP mantém com a cena:
  // ele escreve num ref e o loop do R3F lê, sem passar por estado do React.
  useGSAP(
    () => {
      const trigger = ScrollTrigger.create({
        trigger: host.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          scroll.current = self.progress;
        }
      });
      return () => trigger.kill();
    },
    { scope: host }
  );

  const accent = dark ? '#ff7a33' : '#c2470a';

  return (
    <div
      ref={host}
      className="h-full w-full"
      style={{ cursor: grabbing ? 'grabbing' : undefined }}
    >
      <Canvas
        dpr={[1, 1.75]}
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: [0, 0, 5.4], fov: 32 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ touchAction: 'pan-y' }}
      >
        <Suspense fallback={null}>
          <Scene
            words={words}
            dark={dark}
            accent={accent}
            reduced={reducedMotion() || reduced}
            scroll={scroll}
            onGrab={setGrabbing}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
