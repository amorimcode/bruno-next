import { Environment, Lightformer, RoundedBox } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Uma unidade de estúdio construída inteiramente por primitivas: nenhum arquivo
 * .gltf, nenhuma textura baixada. Todo o grafismo do painel (rótulos, traços,
 * plaquinha) é desenhado num canvas 2D em tempo de execução, o que mantém a
 * peça leve e imune à CSP de fontes externas.
 *
 * Os botões giram de verdade: arraste na vertical em cima de um deles.
 */

const PLATE = 3; // lado do painel em unidades de mundo
const TEX = 1024; // resolução da textura do painel

type KnobSpec = {
  id: string;
  label: string;
  /** posição no painel, em unidades de mundo */
  x: number;
  y: number;
  radius: number;
  depth: number;
  kind: 'rubber' | 'accent' | 'master';
  /** ângulo inicial, em radianos */
  start: number;
};

const KNOBS: KnobSpec[] = [
  { id: 'mobile', label: 'MOBILE', x: -0.7, y: 0.78, radius: 0.44, depth: 0.4, kind: 'rubber', start: -0.9 },
  { id: 'web', label: 'WEB', x: 0.7, y: 0.78, radius: 0.44, depth: 0.4, kind: 'rubber', start: 0.4 },
  { id: 'design', label: 'DESIGN', x: -0.7, y: -0.48, radius: 0.38, depth: 0.34, kind: 'accent', start: 1.6 },
  { id: 'ship', label: 'SHIP', x: 0.72, y: -0.48, radius: 0.46, depth: 0.3, kind: 'master', start: 0.9 }
];

/** Limite de giro, batendo com os traços de MIN e MAX desenhados no painel. */
const MIN_ANGLE = -2.3;
const MAX_ANGLE = 2.3;

/**
 * Inclinação de repouso. De frente a peça vira um desenho chapado: é o ângulo
 * que revela a lateral dos botões e dá volume ao conjunto.
 */
const BASE_PITCH = 0.1;
const BASE_YAW = -0.13;

/** Mundo -> pixel na textura do painel. */
function toPx(value: number) {
  return (value / PLATE) * TEX;
}

/**
 * Texto com espaçamento entre letras. `ctx.letterSpacing` existe no Chrome mas
 * chegou tarde no Safari e não está tipado aqui, então o tracking é aplicado
 * caractere a caractere.
 */
function drawTracked(
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

function drawPanel(ctx: CanvasRenderingContext2D) {
  const c = TEX / 2;

  ctx.fillStyle = '#d7d7d1';
  ctx.fillRect(0, 0, TEX, TEX);

  // Escovado: riscos horizontais de baixo contraste.
  for (let i = 0; i < 2600; i += 1) {
    const y = Math.random() * TEX;
    ctx.strokeStyle = `rgba(255,255,255,${Math.random() * 0.22})`;
    ctx.lineWidth = Math.random() * 1.4;
    ctx.beginPath();
    ctx.moveTo(Math.random() * TEX, y);
    ctx.lineTo(Math.random() * TEX, y + (Math.random() - 0.5) * 2);
    ctx.stroke();
  }

  // Sujeirinha, para o metal não parecer novo demais.
  for (let i = 0; i < 900; i += 1) {
    ctx.fillStyle = `rgba(90,90,90,${Math.random() * 0.16})`;
    ctx.beginPath();
    ctx.arc(Math.random() * TEX, Math.random() * TEX, Math.random() * 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  const mono = 'ui-monospace, SFMono-Regular, Menlo, monospace';

  KNOBS.forEach((knob) => {
    const kx = c + toPx(knob.x);
    const ky = c - toPx(knob.y);
    const ring = toPx(knob.radius) + 32;

    // Traços de MIN e MAX nas pontas do curso do botão.
    [
      { angle: MIN_ANGLE, text: 'MIN', align: 'left' as const },
      { angle: MAX_ANGLE, text: 'MAX', align: 'right' as const }
    ].forEach((tick) => {
      // O zero do botão aponta para cima; o ângulo cresce no sentido horário.
      const a = tick.angle - Math.PI / 2;
      const dx = Math.cos(a);
      const dy = Math.sin(a);

      ctx.fillStyle = '#3a3a38';
      ctx.beginPath();
      ctx.arc(kx + dx * ring, ky + dy * ring, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#55534e';
      ctx.font = `600 19px ${mono}`;
      ctx.textAlign = tick.align;
      ctx.textBaseline = 'middle';
      ctx.fillText(tick.text, kx + dx * (ring + 16), ky + dy * (ring + 16) + 4);
    });

    // Nome do controle, logo abaixo do botão.
    ctx.fillStyle = '#26251f';
    ctx.font = `600 27px ${mono}`;
    ctx.textBaseline = 'middle';
    drawTracked(ctx, knob.label, kx, ky + ring + 44, 5);
  });

  // Plaquinha de identificação, ecoando a marca do site. Fica colada na aresta
  // de baixo para não disputar espaço com o rótulo do dial.
  ctx.fillStyle = '#26251f';
  ctx.font = `italic 700 40px Georgia, serif`;
  ctx.textAlign = 'left';
  ctx.fillText('ba.', 58, TEX - 34);

  ctx.fillStyle = '#6b6862';
  ctx.font = `500 18px ${mono}`;
  drawTracked(ctx, 'BA-01 · CAMPINAS', TEX - 58, TEX - 40, 3, 'right');
}

function usePanelTexture() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = TEX;
    canvas.height = TEX;
    drawPanel(canvas.getContext('2d')!);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function Knob({ spec, onGrab }: { spec: KnobSpec; onGrab: (grabbing: boolean) => void }) {
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
      hovered || dragging ? 1.05 : 1,
      14,
      delta
    );
    group.current.scale.setScalar(scale);
  });

  const isMaster = spec.kind === 'master';
  const body =
    spec.kind === 'rubber'
      ? { color: '#171717', roughness: 0.62, metalness: 0.12 }
      : spec.kind === 'accent'
      ? { color: '#d8ec7a', roughness: 0.5, metalness: 0.05 }
      : { color: '#f2f0eb', roughness: 0.35, metalness: 0.15 };

  const indicator = isMaster ? '#e0472a' : spec.kind === 'accent' ? '#26251f' : '#f7f5f0';

  return (
    <group
      ref={group}
      // A base do botão encosta no painel (z = 0.31); como o cilindro é
      // centrado, o grupo sobe metade da altura dele.
      position={[spec.x, spec.y, 0.31 + spec.depth / 2]}
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
      {/* Corpo do botão. A face da frente é um pouco mais estreita que a base,
          então a lateral pega luz e o botão deixa de parecer um disco chapado. */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[spec.radius * 0.93, spec.radius, spec.depth, 64]} />
        <meshStandardMaterial {...body} />
      </mesh>

      {/* Chanfro da borda da frente, que segura o brilho especular. */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, spec.depth / 2]}>
        <cylinderGeometry args={[spec.radius * 0.86, spec.radius * 0.93, spec.depth * 0.16, 64]} />
        <meshStandardMaterial {...body} />
      </mesh>

      {/* Coroa serrilhada do dial grande, estreita o bastante para não cobrir
          os traços de MIN e MAX gravados no painel. */}
      {isMaster && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.03]}>
          <cylinderGeometry args={[spec.radius * 1.05, spec.radius * 1.05, spec.depth * 0.75, 64]} />
          <meshStandardMaterial color="#232321" roughness={0.68} metalness={0.35} />
        </mesh>
      )}

      {/* marca do curso, no topo da face */}
      <mesh position={[0, spec.radius * 0.46, spec.depth / 2 + spec.depth * 0.09]}>
        <planeGeometry args={[isMaster ? 0.07 : 0.05, spec.radius * 0.58]} />
        <meshStandardMaterial color={indicator} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Unit() {
  const panel = usePanelTexture();
  const unit = useRef<THREE.Group>(null);
  const [grabbing, setGrabbing] = useState(false);

  useFrame((state, delta) => {
    if (!unit.current) return;
    // Enquanto um botão está sendo girado a unidade fica parada, senão a peça
    // foge do dedo de quem está mexendo.
    const targetY = grabbing ? unit.current.rotation.y : BASE_YAW + state.pointer.x * 0.26;
    const targetX = grabbing ? unit.current.rotation.x : BASE_PITCH - state.pointer.y * 0.18;

    unit.current.rotation.y = THREE.MathUtils.damp(unit.current.rotation.y, targetY, 3, delta);
    unit.current.rotation.x = THREE.MathUtils.damp(unit.current.rotation.x, targetX, 3, delta);
    unit.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.045;
  });

  return (
    <group ref={unit}>
      {/* carcaça */}
      <RoundedBox args={[PLATE + 0.36, PLATE + 0.36, 0.62]} radius={0.16} smoothness={8} castShadow>
        <meshStandardMaterial color="#c9c9c4" metalness={0.72} roughness={0.36} />
      </RoundedBox>

      {/* painel gravado */}
      <mesh position={[0, 0, 0.312]}>
        <planeGeometry args={[PLATE, PLATE]} />
        <meshStandardMaterial map={panel} roughness={0.6} metalness={0.12} />
      </mesh>

      {KNOBS.map((spec) => (
        <Knob key={spec.id} spec={spec} onGrab={setGrabbing} />
      ))}

      {/* led de energia */}
      <mesh position={[0, -1.34, 0.33]}>
        <circleGeometry args={[0.045, 24]} />
        <meshStandardMaterial color="#ff7a33" emissive="#ff7a33" emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Encolhe a peça em telas estreitas para ela nunca encostar nas bordas. */
function Fit({ children }: { children: React.ReactNode }) {
  const { viewport } = useThree();
  const scale = Math.min(1, viewport.width / 5.8);
  return <group scale={scale}>{children}</group>;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.32} />
      <directionalLight position={[4, 6, 6]} intensity={0.95} castShadow />
      <directionalLight position={[-5, 2, 3]} intensity={0.3} color="#ff9a5c" />

      <Fit>
        <Unit />
      </Fit>

      {/* Reflexos montados na própria cena: sem HDR de CDN, sem pedido de rede. */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={1.6} position={[0, 4, 5]} scale={[10, 5, 1]} />
        <Lightformer form="rect" intensity={0.8} position={[-5, 1, 3]} scale={[6, 8, 1]} />
        <Lightformer form="rect" intensity={0.6} color="#ff9a5c" position={[5, -2, 2]} scale={[6, 6, 1]} />
      </Environment>
    </>
  );
}

export default function Console3D() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 8.6], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: 'pan-y' }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
