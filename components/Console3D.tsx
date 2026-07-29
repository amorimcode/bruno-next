import { useGSAP } from '@gsap/react';
import { Environment, Lightformer, RoundedBox } from '@react-three/drei';
import { Canvas, invalidate, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer, N8AO, SMAA } from '@react-three/postprocessing';
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { ScrollTrigger } from '../lib/gsap';
import { brushedFill, drawTracked, heightToNormal, makeCanvas } from '../lib/machining';
import { cssVar, useDarkMode } from '../lib/theme';

/**
 * Uma unidade de estúdio construída inteiramente por primitivas: nenhum arquivo
 * .gltf, nenhuma textura baixada, nenhum HDR de CDN. Todo o grafismo do painel
 * é desenhado num canvas 2D em tempo de execução e dali sai também o mapa de
 * normais — por isso os rótulos são gravados no metal em vez de impressos.
 *
 * Os botões giram de verdade: arraste na vertical em cima de um deles.
 */

const PLATE = 3; // lado do painel em unidades de mundo
const CASE = PLATE + 0.36; // a carcaça sobra como uma moldura em volta do painel
const PLATE_Z = 0.3; // face frontal da carcaça
const PLATE_T = 0.09; // espessura da chapa do painel
const FACE = PLATE_Z + PLATE_T / 2; // onde a chapa encosta nos botões
const TEX = 1024; // resolução das texturas do painel

type KnobSpec = {
  id: string;
  label: string;
  /** posição no painel, em unidades de mundo */
  x: number;
  y: number;
  /** linha de base do rótulo — fixa por fileira, senão os nomes desalinham */
  labelY: number;
  radius: number;
  depth: number;
  kind: 'rubber' | 'ivory' | 'master';
  /** ângulo inicial, em radianos */
  start: number;
};

const ROW_TOP = 0.72;
const ROW_BOTTOM = -0.52;
const LABEL_TOP = 0.17;
const LABEL_BOTTOM = -1.06;
/** Rodapé do painel: assinatura, medidor e código de série dividem esta linha. */
const FOOTER_Y = -1.3;

const KNOBS: KnobSpec[] = [
  { id: 'mobile', label: 'MOBILE', x: -0.72, y: ROW_TOP, labelY: LABEL_TOP, radius: 0.38, depth: 0.4, kind: 'rubber', start: -0.9 },
  { id: 'web', label: 'WEB', x: 0.72, y: ROW_TOP, labelY: LABEL_TOP, radius: 0.38, depth: 0.4, kind: 'rubber', start: 0.4 },
  { id: 'design', label: 'DESIGN', x: -0.72, y: ROW_BOTTOM, labelY: LABEL_BOTTOM, radius: 0.36, depth: 0.34, kind: 'ivory', start: 1.6 },
  { id: 'ship', label: 'SHIP', x: 0.72, y: ROW_BOTTOM, labelY: LABEL_BOTTOM, radius: 0.42, depth: 0.32, kind: 'master', start: 0.9 }
];

/** Limite de giro, batendo com os traços de MIN e MAX gravados no painel. */
const MIN_ANGLE = -2.3;
const MAX_ANGLE = 2.3;

/** Segmentos do medidor gravado no rodapé do painel. */
const METER_SEGMENTS = 14;
const METER_WIDTH = 1.2;

/**
 * Inclinação de repouso. De frente a peça vira um desenho chapado: é o ângulo
 * que revela a lateral dos botões e dá volume ao conjunto.
 */
const BASE_PITCH = 0.12;
const BASE_YAW = -0.28;

/** Mundo -> pixel na textura do painel. */
function toPx(value: number) {
  return (value / PLATE) * TEX;
}

function pxX(x: number) {
  return TEX / 2 + toPx(x);
}

function pxY(y: number) {
  return TEX / 2 - toPx(y);
}

/**
 * Mistura dois hex byte a byte. De propósito não usa THREE.Color: lá a
 * interpolação acontece em espaço linear e clarearia demais o fundo escuro.
 */
function mixHex(a: string, b: string, amount: number) {
  const parse = (hex: string) => {
    const value = parseInt(hex.replace('#', ''), 16);
    return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
  };
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const channel = (from: number, to: number) =>
    Math.round(from + (to - from) * amount)
      .toString(16)
      .padStart(2, '0');
  return `#${channel(ar, br)}${channel(ag, bg)}${channel(ab, bb)}`;
}

const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

/**
 * Desenha tudo que é gravado no painel: rótulos, arco de curso, traços de MIN e
 * MAX, medidor e assinatura. O mesmo traçado alimenta cor, relevo e aspereza —
 * por isso recebe as cores por parâmetro em vez de fixá-las.
 */
function drawEngraving(
  ctx: CanvasRenderingContext2D,
  ink: string,
  soft: string,
  lineWidth = 1
) {
  KNOBS.forEach((knob) => {
    const kx = pxX(knob.x);
    const ky = pxY(knob.y);
    const ring = toPx(knob.radius) + 22;

    // Arco de curso ligando MIN a MAX, como nos equipamentos de verdade.
    ctx.strokeStyle = soft;
    ctx.lineWidth = 2.5 * lineWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(kx, ky, ring, MIN_ANGLE - Math.PI / 2, MAX_ANGLE - Math.PI / 2);
    ctx.stroke();

    // Traços intermediários do curso.
    for (let i = 0; i <= 10; i += 1) {
      const a = MIN_ANGLE + ((MAX_ANGLE - MIN_ANGLE) * i) / 10 - Math.PI / 2;
      const long = i % 5 === 0;
      const r1 = ring + 5;
      const r2 = ring + (long ? 15 : 10);
      ctx.strokeStyle = long ? ink : soft;
      ctx.lineWidth = (long ? 3.6 : 2.2) * lineWidth;
      ctx.beginPath();
      ctx.moveTo(kx + Math.cos(a) * r1, ky + Math.sin(a) * r1);
      ctx.lineTo(kx + Math.cos(a) * r2, ky + Math.sin(a) * r2);
      ctx.stroke();
    }

    [
      { angle: MIN_ANGLE, text: 'MIN', align: 'left' as const },
      { angle: MAX_ANGLE, text: 'MAX', align: 'right' as const }
    ].forEach((tick) => {
      // O zero do botão aponta para cima; o ângulo cresce no sentido horário.
      const a = tick.angle - Math.PI / 2;
      ctx.fillStyle = soft;
      ctx.font = `600 17px ${MONO}`;
      ctx.textAlign = tick.align;
      ctx.textBaseline = 'middle';
      ctx.fillText(tick.text, kx + Math.cos(a) * (ring + 22), ky + Math.sin(a) * (ring + 22) + 3);
    });

    // Nome do controle, na linha de base da fileira.
    ctx.fillStyle = ink;
    ctx.font = `600 26px ${MONO}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    drawTracked(ctx, knob.label, kx, pxY(knob.labelY), 5);
  });

  // Rodapé: assinatura à esquerda, medidor no centro, série à direita.
  const footer = pxY(FOOTER_Y);
  const meterW = toPx(METER_WIDTH);
  const meterH = 30;

  ctx.strokeStyle = soft;
  ctx.lineWidth = 2.2 * lineWidth;
  ctx.strokeRect(pxX(0) - meterW / 2, footer - meterH / 2, meterW, meterH);

  ctx.fillStyle = soft;
  ctx.font = `600 14px ${MONO}`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  drawTracked(ctx, 'OUTPUT', pxX(-METER_WIDTH / 2) - 22, footer, 4, 'right');

  ctx.fillStyle = ink;
  ctx.font = `italic 700 38px Georgia, serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('ba.', pxX(-1.36), footer);

  ctx.fillStyle = soft;
  ctx.font = `500 17px ${MONO}`;
  ctx.textBaseline = 'middle';
  drawTracked(ctx, 'BA-01 · CAMPINAS', pxX(1.36), footer, 3, 'right');

  // Marcação do led de energia, no alto à esquerda.
  ctx.fillStyle = soft;
  ctx.font = `600 14px ${MONO}`;
  drawTracked(ctx, 'PWR', pxX(-1.06), pxY(1.28), 4, 'left');
}

/** Cor base do painel: alumínio escovado com sujeirinha. */
function drawAlbedo(ctx: CanvasRenderingContext2D) {
  brushedFill(ctx, TEX, TEX, [198, 193, 181], 22);

  for (let i = 0; i < 900; i += 1) {
    ctx.fillStyle = `rgba(90,90,90,${Math.random() * 0.1})`;
    ctx.beginPath();
    ctx.arc(Math.random() * TEX, Math.random() * TEX, Math.random() * 1.6, 0, Math.PI * 2);
    ctx.fill();
  }

  drawEngraving(ctx, '#18160f', '#5f5c54');
}

/**
 * Mapa de altura: cinza é a superfície, escuro é o que foi retirado do metal.
 * O borrão dá a parede inclinada do sulco, senão a gravação vira um degrau duro.
 */
function drawHeight(ctx: CanvasRenderingContext2D) {
  // O relevo do escovado fica quase imperceptível de propósito: exagerar aqui
  // produz faixas largas no mapa de normais.
  brushedFill(ctx, TEX, TEX, [128, 128, 128], 12);

  ctx.filter = 'blur(1.2px)';
  drawEngraving(ctx, '#1e1e1e', '#3c3c3c', 1.15);
  ctx.filter = 'none';
}

/** Sulco gravado espalha mais luz que a chapa polida em volta. */
function drawRoughness(ctx: CanvasRenderingContext2D) {
  // É aqui que o escovado aparece de verdade: o risco muda a aspereza, e é
  // isso que alonga o reflexo na direção da escovação.
  brushedFill(ctx, TEX, TEX, [62, 62, 62], 38);

  drawEngraving(ctx, '#c8c8c8', '#a8a8a8', 1.1);
}

/**
 * Onde há metal nu e onde há tinta. A gravação é preenchida com tinta fosca,
 * que não é metal — sem isto é preciso baixar o metalness da chapa inteira, e
 * aí o alumínio vira papelão claro.
 */
function drawMetalness(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, TEX, TEX);
  drawEngraving(ctx, '#141414', '#4a4a4a', 1.05);
}

function usePanelMaps() {
  const maps = useMemo(() => {
    const albedoCanvas = makeCanvas(TEX);
    drawAlbedo(albedoCanvas.getContext('2d')!);

    const heightCanvas = makeCanvas(TEX);
    drawHeight(heightCanvas.getContext('2d')!);

    const roughCanvas = makeCanvas(TEX);
    drawRoughness(roughCanvas.getContext('2d')!);

    const metalCanvas = makeCanvas(TEX);
    drawMetalness(metalCanvas.getContext('2d')!);

    const map = new THREE.CanvasTexture(albedoCanvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 16;

    const normalMap = new THREE.CanvasTexture(heightToNormal(heightCanvas, 3.2));
    normalMap.anisotropy = 16;

    const roughnessMap = new THREE.CanvasTexture(roughCanvas);
    roughnessMap.anisotropy = 16;

    const metalnessMap = new THREE.CanvasTexture(metalCanvas);
    metalnessMap.anisotropy = 16;

    return { map, normalMap, roughnessMap, metalnessMap };
  }, []);

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

/** Anel de dentes em volta de um botão: serrilha do dial ou nervura da borracha. */
function Grip({
  radius,
  height,
  count,
  tooth,
  color,
  roughness,
  metalness
}: {
  radius: number;
  height: number;
  count: number;
  tooth: number;
  color: string;
  roughness: number;
  metalness: number;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i += 1) {
      const a = (i / count) * Math.PI * 2;
      dummy.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
      dummy.rotation.set(0, 0, a);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [radius, count]);

  return (
    <instancedMesh ref={ref} args={[null!, null!, count]} castShadow>
      <boxGeometry args={[tooth * 1.6, tooth, height]} />
      <meshPhysicalMaterial color={color} roughness={roughness} metalness={metalness} />
    </instancedMesh>
  );
}

function Knob({
  spec,
  values,
  onGrab
}: {
  spec: KnobSpec;
  values: React.MutableRefObject<Record<string, number>>;
  onGrab: (grabbing: boolean) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const target = useRef(spec.start);
  const lastY = useRef(0);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!dragging) return;

    const move = (event: PointerEvent) => {
      // O delta é calculado na mão em vez de usar `event.movementY`, que vem
      // zerado em alguns navegadores fora de pointer lock.
      const delta = event.clientY - lastY.current;
      lastY.current = event.clientY;
      // Arrastar para cima aumenta, como num equipamento de verdade.
      target.current = THREE.MathUtils.clamp(
        target.current + delta * 0.012,
        MIN_ANGLE,
        MAX_ANGLE
      );
    };
    const stop = () => setDragging(false);

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };
  }, [dragging]);

  useEffect(() => {
    onGrab(dragging);
  }, [dragging, onGrab]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.cursor = dragging || hovered ? 'ns-resize' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [dragging, hovered]);

  useFrame((_, delta) => {
    if (!group.current) return;
    // Amortece a chegada no alvo, para o giro ter peso.
    group.current.rotation.z = THREE.MathUtils.damp(
      group.current.rotation.z,
      target.current,
      12,
      delta
    );
    const scale = THREE.MathUtils.damp(
      group.current.scale.x,
      hovered || dragging ? 1.04 : 1,
      14,
      delta
    );
    group.current.scale.setScalar(scale);

    values.current[spec.id] =
      (group.current.rotation.z - MIN_ANGLE) / (MAX_ANGLE - MIN_ANGLE);
  });

  const isMaster = spec.kind === 'master';

  // Borracha macia, plástico marfim e alumínio usinado reagem à luz de formas
  // diferentes: é o contraste entre eles que faz a peça parecer montada.
  const body =
    spec.kind === 'rubber'
      ? { color: '#131211', roughness: 0.78, metalness: 0.04, clearcoat: 0.22, clearcoatRoughness: 0.6 }
      : spec.kind === 'ivory'
      ? { color: '#ddd5c4', roughness: 0.52, metalness: 0.03, clearcoat: 0.45, clearcoatRoughness: 0.34 }
      : { color: '#d5d2ca', roughness: 0.28, metalness: 0.95, clearcoat: 0.2, clearcoatRoughness: 0.25 };

  const cap =
    spec.kind === 'rubber'
      ? { color: '#191817', roughness: 0.68, metalness: 0.06 }
      : spec.kind === 'ivory'
      ? { color: '#e5ded0', roughness: 0.46, metalness: 0.03 }
      : { color: '#e6e3db', roughness: 0.22, metalness: 0.95 };

  const indicator = isMaster ? '#c2470a' : spec.kind === 'ivory' ? '#26251f' : '#f7f5f0';
  const front = spec.depth / 2;

  return (
    <group
      ref={group}
      // A base do botão encosta na chapa; como o cilindro é centrado, o grupo
      // sobe metade da altura dele.
      position={[spec.x, spec.y, FACE + spec.depth / 2]}
      rotation={[0, 0, spec.start]}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onPointerDown={(event) => {
        event.stopPropagation();
        lastY.current = event.clientY;
        setDragging(true);
      }}
    >
      {/* Corpo. A face da frente é um pouco mais estreita que a base, então a
          lateral pega luz e o botão deixa de parecer um disco chapado. */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[spec.radius * 0.93, spec.radius, spec.depth, 64]} />
        <meshPhysicalMaterial {...body} />
      </mesh>

      {/* Pega: nervura rasa na borracha, serrilha fina no dial de alumínio. O
          dente precisa mal sair do corpo — passou disso, vira engrenagem. */}
      <Grip
        radius={spec.radius * 0.985}
        height={spec.depth * (isMaster ? 0.86 : 0.8)}
        count={isMaster ? 130 : 64}
        tooth={isMaster ? 0.011 : 0.014}
        color={isMaster ? '#c6c2ba' : body.color}
        roughness={isMaster ? 0.3 : body.roughness}
        metalness={isMaster ? 0.92 : body.metalness}
      />

      {/* Aro da frente: o filete que segura o brilho especular e faz o topo
          parecer rebaixado, sem precisar de geometria booleana. */}
      <mesh position={[0, 0, front]} castShadow>
        <torusGeometry args={[spec.radius * 0.87, 0.013, 14, 72]} />
        <meshPhysicalMaterial {...cap} clearcoat={0.6} clearcoatRoughness={0.2} />
      </mesh>

      {/* Tampa, levemente afundada dentro do aro. */}
      <mesh position={[0, 0, front - 0.004]}>
        <circleGeometry args={[spec.radius * 0.87, 64]} />
        <meshPhysicalMaterial {...cap} />
      </mesh>

      {/* Marca do curso: tinta fosca numa canaleta rasa. Fica um fio à frente
          da tampa para não brigar no teste de profundidade. */}
      <mesh position={[0, spec.radius * 0.42, front + 0.006]}>
        <boxGeometry args={[isMaster ? 0.05 : 0.04, spec.radius * 0.58, 0.012]} />
        <meshStandardMaterial color={indicator} roughness={0.62} metalness={0.05} />
      </mesh>
    </group>
  );
}

/**
 * Medidor gravado no rodapé: acende conforme a média dos quatro controles.
 * É o que faz o giro dos botões ter consequência na cena.
 */
function Meter({ values, accent }: { values: React.MutableRefObject<Record<string, number>>; accent: string }) {
  const refs = useRef<THREE.MeshStandardMaterial[]>([]);
  const gap = METER_WIDTH / METER_SEGMENTS;

  useFrame((_, delta) => {
    const list = Object.values(values.current);
    const average = list.length ? list.reduce((sum, v) => sum + v, 0) / list.length : 0;
    const lit = average * METER_SEGMENTS;

    refs.current.forEach((material, index) => {
      if (!material) return;
      // Meio segmento de rampa: o último aceso acompanha o giro em vez de piscar.
      const amount = THREE.MathUtils.clamp(lit - index, 0, 1);
      material.emissiveIntensity = THREE.MathUtils.damp(
        material.emissiveIntensity,
        0.06 + amount * 1.5,
        10,
        delta
      );
    });
  });

  return (
    <group position={[0, FOOTER_Y, FACE + 0.002]}>
      {Array.from({ length: METER_SEGMENTS }).map((_, index) => (
        <mesh key={index} position={[(index - (METER_SEGMENTS - 1) / 2) * gap, 0, 0]}>
          <planeGeometry args={[gap * 0.46, 0.05]} />
          <meshStandardMaterial
            ref={(material) => {
              if (material) refs.current[index] = material as THREE.MeshStandardMaterial;
            }}
            color={accent}
            emissive={accent}
            emissiveIntensity={0.05}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Parafuso de fixação da chapa. O rasgo de cada um cai num ângulo diferente. */
function Screw({ x, y, angle }: { x: number; y: number; angle: number }) {
  return (
    <group position={[x, y, FACE - 0.012]} rotation={[0, 0, angle]}>
      {/* O cilindro nasce com o eixo em Y; sem este quarto de volta o parafuso
          fica deitado na chapa em vez de encarar a câmera. */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.048, 0.052, 0.03, 28]} />
        <meshPhysicalMaterial color="#7d7a74" metalness={1} roughness={0.38} />
      </mesh>
      {/* Fenda da chave, afundada na cabeça. */}
      <mesh position={[0, 0, 0.012]}>
        <boxGeometry args={[0.066, 0.011, 0.012]} />
        <meshStandardMaterial color="#2a2825" roughness={0.75} metalness={0.4} />
      </mesh>
    </group>
  );
}

function Unit({
  accent,
  reduced,
  scroll
}: {
  accent: string;
  reduced: boolean;
  /** Progresso da seção na rolagem, escrito pelo ScrollTrigger. */
  scroll: React.MutableRefObject<number>;
}) {
  const { map, normalMap, roughnessMap, metalnessMap } = usePanelMaps();
  const unit = useRef<THREE.Group>(null);
  const [grabbing, setGrabbing] = useState(false);
  const values = useRef<Record<string, number>>({});
  const intro = useRef(reduced ? 1 : 0);

  // A chapa é uma caixa de verdade, não um plano: assim existe uma junta entre
  // ela e a carcaça para a oclusão de contato morder.
  const plateMaterials = useMemo(() => {
    const edge = new THREE.MeshPhysicalMaterial({
      color: '#a8a49b',
      metalness: 0.95,
      roughness: 0.3,
      envMapIntensity: 1.5
    });
    const front = new THREE.MeshPhysicalMaterial({
      map,
      normalMap,
      roughnessMap,
      metalnessMap,
      metalness: 0.9,
      roughness: 1,
      clearcoat: 0.22,
      clearcoatRoughness: 0.3,
      envMapIntensity: 1.9
    });
    front.normalScale = new THREE.Vector2(0.85, 0.85);
    // Alumínio escovado espalha a luz na direção do risco.
    (front as THREE.MeshPhysicalMaterial & { anisotropy?: number }).anisotropy = 0.55;
    return [edge, edge, edge, edge, front, edge];
  }, [map, normalMap, roughnessMap, metalnessMap]);

  useEffect(
    () => () => {
      plateMaterials[0].dispose();
      plateMaterials[4].dispose();
    },
    [plateMaterials]
  );

  useFrame((state, delta) => {
    if (!unit.current) return;

    // Entrada: a peça chega girada e assenta. Depois disso o mesmo damp passa a
    // servir só ao paralaxe do ponteiro.
    intro.current = Math.min(1, intro.current + delta / 1.15);
    const eased = 1 - Math.pow(1 - intro.current, 3);

    // Enquanto um botão está sendo girado a unidade fica parada, senão a peça
    // foge do dedo de quem está mexendo.
    const targetY = grabbing ? unit.current.rotation.y : BASE_YAW + state.pointer.x * 0.24;
    const targetX = grabbing ? unit.current.rotation.x : BASE_PITCH - state.pointer.y * 0.16;

    unit.current.rotation.y = THREE.MathUtils.damp(unit.current.rotation.y, targetY, 3, delta) + (1 - eased) * 0.5;
    unit.current.rotation.x = THREE.MathUtils.damp(unit.current.rotation.x, targetX, 3, delta) + (1 - eased) * -0.3;
    unit.current.position.z = (1 - eased) * -2.2;
    unit.current.scale.setScalar(0.94 + eased * 0.06);

    // A rolagem inclina a peça no próprio eixo, de um lado ao outro da seção,
    // como se ela estivesse apoiada em algo que se move junto com a página. O
    // valor vem do ScrollTrigger por um ref: assim a rolagem não passa pelo
    // estado do React nem redesenha nada fora do canvas.
    const roll = (scroll.current - 0.5) * 0.16;
    unit.current.rotation.z = THREE.MathUtils.damp(unit.current.rotation.z, roll, 4, delta);
    unit.current.position.y =
      (reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.9) * 0.04) +
      (scroll.current - 0.5) * -0.32;
  });

  const corner = PLATE / 2 - 0.14;

  return (
    <group ref={unit}>
      {/* Carcaça anodizada escura: é o contraste com a chapa clara que dá a
          leitura de duas peças montadas, e não de um bloco só. */}
      <RoundedBox args={[CASE, CASE, 0.62]} radius={0.14} smoothness={8} castShadow receiveShadow>
        {/* Verniz alto no anodizado: é o que acende a quina de cima e dá a
            linha de luz que separa a carcaça do fundo. */}
        <meshPhysicalMaterial
          color="#26231f"
          metalness={0.8}
          roughness={0.32}
          clearcoat={0.7}
          clearcoatRoughness={0.22}
          envMapIntensity={1.2}
        />
      </RoundedBox>

      {/* Chapa gravada */}
      <mesh position={[0, 0, PLATE_Z]} material={plateMaterials} castShadow receiveShadow>
        <boxGeometry args={[PLATE, PLATE, PLATE_T]} />
      </mesh>

      {[
        [-corner, corner, 0.4],
        [corner, corner, -0.9],
        [-corner, -corner, 1.2],
        [corner, -corner, 0.15]
      ].map(([x, y, angle], index) => (
        <Screw key={index} x={x} y={y} angle={angle} />
      ))}

      {KNOBS.map((spec) => (
        <Knob key={spec.id} spec={spec} values={values} onGrab={setGrabbing} />
      ))}

      <Meter values={values} accent={accent} />

      {/* Led de energia, junto da marcação PWR */}
      <mesh position={[-1.24, 1.28, FACE + 0.002]}>
        <circleGeometry args={[0.03, 24]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={2.2} toneMapped={false} />
      </mesh>
    </group>
  );
}

/**
 * Fundo: um halo que termina exatamente na cor de fundo do site, então a cena
 * não tem borda visível contra a página. Substitui um efeito de vinheta, que
 * escureceria também o recorte do canvas.
 */
function Backdrop({ dark }: { dark: boolean }) {
  const { viewport, camera } = useThree();
  const depth = -7;

  const texture = useMemo(() => {
    const bg = cssVar('--bg', dark ? '#100e0b' : '#fbf8f3');
    const glow = mixHex(bg, '#ffffff', dark ? 0.11 : 0.6);

    const canvas = makeCanvas(512);
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 512);

    // O halo precisa terminar na cor da página antes da borda da textura. Com
    // raio maior que a metade menor, a lateral do canvas ainda chega iluminada
    // e aparece o retângulo do <canvas> contra a seção.
    const gradient = ctx.createRadialGradient(256, 200, 0, 256, 200, 190);
    gradient.addColorStop(0, glow);
    gradient.addColorStop(0.5, mixHex(bg, glow, 0.4));
    gradient.addColorStop(1, bg);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [dark]);

  useEffect(() => () => texture.dispose(), [texture]);

  const size = useMemo(
    () => viewport.getCurrentViewport(camera, new THREE.Vector3(0, 0, depth)),
    [viewport, camera]
  );

  return (
    <mesh position={[0, 0, depth]}>
      <planeGeometry args={[size.width * 1.05, size.height * 1.05]} />
      <meshBasicMaterial map={texture} toneMapped={false} depthWrite={false} />
    </mesh>
  );
}

/** Encolhe a peça em telas estreitas para ela nunca encostar nas bordas. */
function Fit({ children }: { children: React.ReactNode }) {
  const { viewport } = useThree();
  const scale = Math.min(1, viewport.width / 5.6);
  return <group scale={scale}>{children}</group>;
}

function Scene({
  dark,
  accent,
  reduced,
  scroll
}: {
  dark: boolean;
  accent: string;
  reduced: boolean;
  scroll: React.MutableRefObject<number>;
}) {
  return (
    <>
      <Backdrop dark={dark} />

      <ambientLight intensity={dark ? 0.07 : 0.26} />

      {/* Luz principal, a única que projeta sombra: é ela que põe a sombra dos
          botões sobre a chapa e tira o ar de adesivo. A câmera de sombra é
          apertada em volta da peça para render cada texel maior. */}
      <directionalLight
        castShadow
        // Mais frontal que alta: sombra curta, colada na base do botão. Alta
        // demais, o botão projeta um borrão comprido que parece adesivo.
        position={[2.2, 3, 7]}
        intensity={dark ? 3.2 : 3.6}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.012}
        shadow-radius={1}
      >
        <orthographicCamera attach="shadow-camera" args={[-2, 2, 2, -2, 2, 16]} />
      </directionalLight>

      {/* Contraluz por trás do ombro direito: separa a peça do fundo. Quente,
          mas quase branca — no tom cheio do acento ela tinge de cobre a
          serrilha dos botões. */}
      <directionalLight position={[5.5, 2.4, -4]} intensity={dark ? 0.8 : 0.5} color="#ffc9a6" />
      {/* Preenchimento frio do outro lado, para a sombra não fechar em preto. */}
      <directionalLight position={[-4.5, -1.2, 2.5]} intensity={dark ? 0.5 : 0.7} color="#bdd4ff" />

      <Fit>
        <Unit accent={accent} reduced={reduced} scroll={scroll} />
      </Fit>

      {/* Reflexos montados na própria cena: sem HDR de CDN, sem pedido de rede.
          As faixas compridas são o que desenha o brilho alongado do escovado. */}
      <Environment resolution={512}>
        {/* Softbox pequeno e deslocado para a esquerda. Uma parede de luz larga
            ilumina tudo por igual e é o que achatava a chapa; um softbox curto
            cria queda de luz do alto para o rodapé. */}
        <Lightformer form="rect" intensity={dark ? 3.4 : 4.2} position={[-1.4, 4.4, 5.2]} scale={[7, 2.6, 1]} />
        {/* As faixas verticais compridas são o que desenha o brilho alongado do
            escovado; sem elas o alumínio vira cinza chapado. */}
        <Lightformer form="rect" intensity={3.2} position={[-5, 1.5, 5]} scale={[0.8, 12, 1]} rotation={[0, Math.PI / 7, 0]} />
        <Lightformer form="rect" intensity={2.6} position={[5, 0.5, 5]} scale={[0.6, 12, 1]} rotation={[0, -Math.PI / 7, 0]} />
        <Lightformer form="rect" intensity={0.9} color={accent} position={[4, -3.5, 2]} scale={[5, 3, 1]} />
        <Lightformer form="ring" intensity={0.8} position={[-3.5, -3, 3]} scale={4} />
      </Environment>
    </>
  );
}

export default function Console3D() {
  const dark = useDarkMode();
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const scroll = useRef(0.5);

  // Elo entre o GSAP e a cena: o ScrollTrigger só escreve o progresso da seção
  // num ref, e o loop do R3F decide o que fazer com ele.
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

  // Fora da tela a cena não renderiza: o resto da página rola sem disputar GPU.
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '200px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  /**
   * Ao entrar em `frameloop="never"` o R3F cancela o requestAnimationFrame e
   * não o reinicia quando o modo volta para `always` — só `invalidate()` faz
   * isso. Sem este empurrão o canvas congela para sempre na primeira vez que a
   * seção sai da tela.
   */
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

  const accent = dark ? '#ff7a33' : '#c2470a';

  return (
    <div ref={host} className="h-full w-full">
      <Canvas
        shadows="soft"
        dpr={[1, 1.75]}
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: [0, 0.35, 8.6], fov: 28 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        style={{ touchAction: 'pan-y' }}
      >
        <Suspense fallback={null}>
          <Scene dark={dark} accent={accent} reduced={reduced} scroll={scroll} />

          {/* Oclusão de contato faz as juntas e a base dos botões escurecerem;
              o bloom só alcança o led e o medidor, que passam do branco. */}
          <EffectComposer multisampling={0}>
            <N8AO halfRes color="#0a0806" aoRadius={0.5} intensity={2.6} distanceFalloff={0.6} />
            <Bloom mipmapBlur luminanceThreshold={1.05} luminanceSmoothing={0.25} intensity={0.32} radius={0.5} />
            <SMAA />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
