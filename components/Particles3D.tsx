import { useGSAP } from '@gsap/react';
import { Canvas, invalidate, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { ScrollTrigger, gsap, reducedMotion } from '../lib/gsap';
import { cssVar, useDarkMode } from '../lib/theme';

/**
 * O ciclo do trabalho — desenhar, construir, publicar, repetir — escrito em
 * poeira. Cada palavra é rasterizada num canvas 2D em tempo de execução, os
 * pixels com tinta viram partículas, e o GSAP leva cada partícula de uma
 * palavra à seguinte.
 *
 * Nada aqui é arquivo: sem modelo, sem sprite, sem fonte extra. As letras saem
 * da mesma Fraunces que o resto da página usa, lida do CSS na hora de desenhar.
 *
 * A travessia inteira acontece no vertex shader. A CPU só move um número de 0 a
 * 1 — é o que permite dezenas de milhares de partículas sem tocar no ticker do
 * React a cada quadro.
 */

/**
 * Largura da palavra no mundo 3D; a altura sai da proporção do canvas. É o
 * número que decide o tamanho da peça na faixa: em 5.2 a palavra ocupava um
 * quinto da altura e boiava no vazio, com cara de legenda perdida. Aqui ela
 * chega perto da largura da coluna e passa a ler como título — o `Fit` encolhe
 * o conjunto quando a janela é estreita demais para isso.
 */
const WORLD_W = 8.6;
/** Resolução do canvas onde a palavra é rasterizada antes de virar pontos. */
const TEX_W = 1024;
const TEX_H = 320;
const WORLD_H = (WORLD_W * TEX_H) / TEX_W;

const VERTEX = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uScale;
  uniform vec2  uPointer;
  uniform float uPush;
  uniform float uBurst;
  uniform float uScatter;
  uniform float uIntro;
  uniform vec3  uInk;
  uniform vec3  uAccent;

  attribute vec3 aTo;
  attribute vec3 aDrift;
  attribute float aSeed;

  varying vec3 vColor;
  varying float vFlight;
  varying float vFade;

  void main() {
    // Cada partícula parte num instante um pouco diferente: assim a palavra se
    // desmancha em onda, e não como um bloco só.
    float t = clamp((uProgress - aSeed * 0.32) / 0.68, 0.0, 1.0);
    float eased = t * t * (3.0 - 2.0 * t);
    vec3 pos = mix(position, aTo, eased);

    // Meia volta de seno: vale 0 nas duas pontas e 1 no meio do caminho. É o
    // que abre a nuvem no meio da travessia em vez de arrastar as letras em
    // linha reta de uma palavra para a outra.
    float flight = sin(eased * 3.14159265);
    pos += aDrift * flight * uScatter;

    // Respiração de repouso — sem isto a palavra formada parece uma imagem.
    pos.x += sin(uTime * 0.6 + aSeed * 21.0) * 0.023;
    pos.y += cos(uTime * 0.5 + aSeed * 17.0) * 0.023;

    // Entrada: a primeira palavra se junta a partir da mesma nuvem que ela usa
    // para viajar.
    vec3 chaos = pos + aDrift * 2.6 + vec3(0.0, 0.0, aSeed * 1.3);
    pos = mix(chaos, pos, uIntro);

    // O ponteiro afasta a poeira; o clique dá um empurrão curto e maior.
    vec2 away = pos.xy - uPointer;
    float dist = length(away);
    float influence = exp(-dist * dist * 0.62);
    pos.xy += normalize(away + vec2(0.0001)) * influence * (uPush + uBurst);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    // uSize é diâmetro em unidades de mundo; uScale converte para pixels na
    // altura do canvas atual, então o ponto não muda de tamanho junto com a
    // janela.
    gl_PointSize = uSize * uScale * (1.0 + flight * 0.7) / max(-mv.z, 0.001);

    vFlight = max(flight, influence * 0.85);
    vFade = uIntro;
    // Uma minoria fixa nasce na cor de acento; o resto acende só enquanto voa.
    vColor = mix(uInk, uAccent, clamp(step(aSeed, 0.2) + vFlight, 0.0, 1.0));
  }
`;

const FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  varying float vFlight;
  varying float vFade;

  void main() {
    // Ponto redondo com borda macia: o quadrado padrão do gl_PointCoord
    // apareceria como grão quadriculado nos tamanhos maiores.
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.12, d);
    if (alpha < 0.02) discard;
    gl_FragColor = vec4(vColor, alpha * (0.72 + vFlight * 0.28) * vFade);
  }
`;

/** Fonte de exibição do site, para a palavra sair no mesmo tipo dos títulos. */
function displayFont(size: number) {
  const family = cssVar('--font-display', 'Georgia, serif');
  return `700 ${size}px ${family}, Georgia, serif`;
}

/**
 * Rasteriza a palavra e devolve `count` posições sorteadas entre os pixels que
 * receberam tinta. O sorteio é um Fisher-Yates parcial: pegar índices ao acaso
 * com repetição deixa buracos e grumos visíveis no traço da letra.
 */
function sampleWord(word: string, count: number) {
  const canvas = document.createElement('canvas');
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

  const text = word.toUpperCase();
  ctx.font = displayFont(100);
  const at100 = ctx.measureText(text).width || 1;
  // Cabe pela largura ou pela altura da caixa, o que apertar primeiro.
  const size = Math.min((TEX_W * 0.88 * 100) / at100, TEX_H * 0.82);

  ctx.font = displayFont(size);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.fillText(text, TEX_W / 2, TEX_H / 2);

  const pixels = ctx.getImageData(0, 0, TEX_W, TEX_H).data;
  const spots: number[] = [];
  // Passo 2 em cada eixo: um quarto dos pixels ainda deixa candidatos de sobra
  // e corta o custo da varredura.
  for (let y = 0; y < TEX_H; y += 2) {
    for (let x = 0; x < TEX_W; x += 2) {
      if (pixels[(y * TEX_W + x) * 4 + 3] > 128) spots.push(x, y);
    }
  }

  const total = spots.length / 2;
  const positions = new Float32Array(count * 3);
  // Palavra vazia (ou fonte que não carregou) não tem pixel para sortear.
  if (total === 0) return positions;

  const order = new Uint32Array(total);
  for (let i = 0; i < total; i += 1) order[i] = i;

  for (let i = 0; i < count; i += 1) {
    // Embaralha só o necessário: uma troca por partícula.
    const pick = i % total;
    const swap = pick + Math.floor(Math.random() * (total - pick));
    const tmp = order[pick];
    order[pick] = order[swap];
    order[swap] = tmp;

    const index = order[pick];
    const x = spots[index * 2] + (Math.random() - 0.5) * 2.2;
    const y = spots[index * 2 + 1] + (Math.random() - 0.5) * 2.2;

    positions[i * 3] = (x / TEX_W - 0.5) * WORLD_W;
    positions[i * 3 + 1] = -(y / TEX_H - 0.5) * WORLD_H;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.26;
  }

  return positions;
}

function Field({
  words,
  count,
  accent,
  ink,
  active,
  scroll,
  onStep
}: {
  words: readonly string[];
  count: number;
  accent: string;
  ink: string;
  active: boolean;
  scroll: React.MutableRefObject<number>;
  /** Avisa qual palavra acabou de se formar. Precisa ter identidade estável. */
  onStep: (index: number) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const { size, camera, viewport } = useThree();
  const [clouds, setClouds] = useState<THREE.BufferAttribute[] | null>(null);
  const hovering = useRef(false);
  const pointer = useRef(new THREE.Vector2(99, 99));
  const introDone = useRef(false);

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: 0.05 },
      uScale: { value: 600 },
      uPointer: { value: new THREE.Vector2(99, 99) },
      uPush: { value: 0 },
      uBurst: { value: 0 },
      uScatter: { value: 1.02 },
      uIntro: { value: 0 },
      uInk: { value: new THREE.Color() },
      uAccent: { value: new THREE.Color() }
    }),
    []
  );

  /** Semente e direção de fuga são da partícula, não da palavra: é o que dá a
      cada grão a mesma personalidade de uma palavra para a outra. */
  const identity = useMemo(() => {
    const seed = new Float32Array(count);
    const drift = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      seed[i] = Math.random();
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.66 + Math.random() * 1.32;
      drift[i * 3] = Math.cos(angle) * radius;
      drift[i * 3 + 1] = Math.sin(angle) * radius * 0.55;
      drift[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    }
    return {
      seed: new THREE.BufferAttribute(seed, 1),
      drift: new THREE.BufferAttribute(drift, 3)
    };
  }, [count]);

  // A rasterização precisa da Fraunces já carregada: com a fonte de fallback as
  // letras saem com outra forma e a nuvem muda de silhueta no meio da visita.
  useEffect(() => {
    let cancelled = false;
    const build = () => {
      if (cancelled) return;
      setClouds(
        words.map(
          (word) => new THREE.BufferAttribute(sampleWord(word, count), 3)
        )
      );
    };

    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(build);
    } else {
      build();
    }

    return () => {
      cancelled = true;
    };
  }, [words, count]);

  const geometry = useMemo(() => {
    if (!clouds || clouds.length === 0) return null;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', clouds[0]);
    geo.setAttribute('aTo', clouds[1 % clouds.length]);
    geo.setAttribute('aSeed', identity.seed);
    geo.setAttribute('aDrift', identity.drift);
    return geo;
  }, [clouds, identity]);

  useEffect(() => () => geometry?.dispose(), [geometry]);

  useEffect(() => {
    uniforms.uInk.value.set(ink);
    uniforms.uAccent.value.set(accent);
    invalidate();
  }, [ink, accent, uniforms]);

  // gl_PointSize é em pixels de verdade, então a conversão precisa da altura em
  // pixels físicos e da abertura da câmera.
  useEffect(() => {
    const fov = (camera as THREE.PerspectiveCamera).fov ?? 35;
    uniforms.uScale.value =
      (size.height * viewport.dpr) / (2 * Math.tan((fov * Math.PI) / 360));
  }, [size, camera, viewport.dpr, uniforms]);

  /**
   * O ciclo das palavras. Trocar de palavra é trocar de atributo — os pontos
   * de cada palavra ficam prontos desde o início e nenhuma cópia acontece no
   * meio da animação.
   */
  useGSAP(
    () => {
      if (!geometry || !clouds || clouds.length < 2 || !active) return;

      if (reducedMotion()) {
        uniforms.uIntro.value = 1;
        return;
      }

      const timeline = gsap.timeline();

      if (introDone.current) {
        uniforms.uIntro.value = 1;
      } else {
        introDone.current = true;
        timeline.fromTo(
          uniforms.uIntro,
          { value: 0 },
          { value: 1, duration: 2.1, ease: 'power2.out' },
          0
        );
        timeline.to({}, { duration: 1.1 }, 0);
      }

      const loop = gsap.timeline({ repeat: -1 });
      clouds.forEach((_, index) => {
        loop
          .fromTo(
            uniforms.uProgress,
            { value: 0 },
            {
              value: 1,
              duration: 1.6,
              ease: 'power2.inOut',
              // Sem isto o GSAP zeraria o progresso já na montagem da linha do
              // tempo, e não no instante em que este trecho começa.
              immediateRender: false,
              onStart: () => {
                geometry.setAttribute('position', clouds[index]);
                geometry.setAttribute('aTo', clouds[(index + 1) % clouds.length]);
              },
              // A legenda vira quando a palavra termina de se formar, não
              // quando a nuvem parte: no meio do voo não há o que ler.
              onComplete: () => onStep((index + 1) % clouds.length)
            }
          )
          // Respiro com a palavra formada, antes da próxima travessia.
          .to({}, { duration: 1.9 });
      });

      timeline.add(loop);
    },
    { dependencies: [geometry, clouds, active] }
  );

  const { contextSafe } = useGSAP();

  const burst = contextSafe(() => {
    if (reducedMotion()) return;
    gsap
      .timeline()
      .to(uniforms.uBurst, { value: 1.4, duration: 0.16, ease: 'power2.out' })
      .to(uniforms.uBurst, { value: 0, duration: 1.4, ease: 'elastic.out(1, 0.45)' });
  });

  // Em telas estreitas a palavra encostaria nas bordas; o grupo encolhe junto.
  const fit = Math.min(1, viewport.width / 10.3);

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime;

    // O ponteiro do R3F vem em coordenadas normalizadas da tela; aqui ele
    // precisa virar unidade de mundo dentro do grupo já escalado. A câmera é
    // fixa, então o tamanho da janela em unidades de mundo já vem pronto do
    // `viewport` e não precisa ser remedido a cada quadro.
    if (hovering.current) {
      pointer.current.set(
        ((state.pointer.x * viewport.width) / 2) / fit,
        ((state.pointer.y * viewport.height) / 2) / fit
      );
    }
    uniforms.uPointer.value.lerp(pointer.current, 1 - Math.exp(-9 * delta));
    uniforms.uPush.value = THREE.MathUtils.damp(
      uniforms.uPush.value,
      hovering.current ? 0.69 : 0,
      6,
      delta
    );

    if (!group.current) return;
    // A rolagem gira o plano de leitura de leve: a nuvem ganha profundidade ao
    // atravessar a seção, sem tirar a palavra do lugar.
    const p = scroll.current - 0.5;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, p * 0.5, 4, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, p * -0.16, 4, delta);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, p * -0.55, 4, delta);
  });

  return (
    <group ref={group} scale={fit}>
      {geometry && (
        <points geometry={geometry} frustumCulled={false}>
          <shaderMaterial
            uniforms={uniforms}
            vertexShader={VERTEX}
            fragmentShader={FRAGMENT}
            transparent
            depthWrite={false}
          />
        </points>
      )}

      {/* Superfície invisível só para capturar ponteiro: o raycast não acerta
          pontos soltos, então a interação precisa de algo com área. */}
      <mesh
        position={[0, 0, 0]}
        onPointerOver={() => (hovering.current = true)}
        onPointerOut={() => (hovering.current = false)}
        onPointerDown={burst}
      >
        <planeGeometry args={[WORLD_W * 2.4, WORLD_H * 3.6]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function Particles3D({
  words,
  onStep
}: {
  words: readonly string[];
  /** Qual etapa está formada agora — a página usa isto na legenda do ciclo. */
  onStep: (index: number) => void;
}) {
  const dark = useDarkMode();
  const host = useRef<HTMLDivElement>(null);
  const scroll = useRef(0.5);
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(9000);

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
    // Celular tem menos preenchimento de tela sobrando; menos poeira mantém a
    // silhueta legível e o quadro barato.
    setCount(window.innerWidth < 640 ? 5200 : 9000);
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
  const ink = dark ? '#f2ede4' : '#211d17';

  return (
    <div ref={host} className="h-full w-full">
      <Canvas
        dpr={[1, 2]}
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: [0, 0, 6], fov: 35 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        style={{ touchAction: 'pan-y' }}
      >
        <Field
          words={words}
          count={count}
          accent={accent}
          ink={ink}
          active={visible}
          scroll={scroll}
          onStep={onStep}
        />
      </Canvas>
    </div>
  );
}
