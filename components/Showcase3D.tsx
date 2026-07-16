import { Canvas, useThree } from '@react-three/fiber';
import {
  Environment,
  Float,
  PresentationControls,
  RoundedBox,
  Sparkles,
  useTexture
} from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';

/* Um aparelho "agarrável": mola própria, volta ao lugar ao soltar */
function Grabbable({
  children,
  rotation = [0, 0, 0] as [number, number, number]
}: {
  children: React.ReactNode;
  rotation?: [number, number, number];
}) {
  return (
    <PresentationControls
      global={false}
      cursor
      snap
      speed={1.4}
      rotation={rotation}
      polar={[-Math.PI / 3, Math.PI / 3]}
      azimuth={[-Infinity, Infinity]}
      config={{ mass: 1, tension: 170, friction: 22 }}
    >
      {children}
    </PresentationControls>
  );
}

function useScreenTexture(src: string) {
  const texture = useTexture(src);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/* iPhone construído por primitivas — corpo, tela com screenshot real e Dynamic Island */
function Phone({ src }: { src: string }) {
  const texture = useScreenTexture(src);
  const W = 1.04;
  const H = 2.25;
  const D = 0.1;

  return (
    <group>
      <RoundedBox args={[W, H, D]} radius={0.09} smoothness={10} castShadow>
        <meshPhysicalMaterial
          color="#101014"
          metalness={0.75}
          roughness={0.32}
          clearcoat={0.6}
          clearcoatRoughness={0.25}
        />
      </RoundedBox>
      {/* moldura da tela */}
      <mesh position={[0, 0, D / 2 + 0.001]}>
        <planeGeometry args={[W - 0.05, H - 0.05]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* screenshot real do app */}
      <mesh position={[0, 0, D / 2 + 0.002]}>
        <planeGeometry args={[W - 0.1, H - 0.1]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* dynamic island */}
      <RoundedBox
        args={[0.3, 0.09, 0.012]}
        radius={0.044}
        smoothness={6}
        position={[0, H / 2 - 0.14, D / 2 + 0.004]}
      >
        <meshBasicMaterial color="#000000" />
      </RoundedBox>
    </group>
  );
}

/* MacBook por primitivas — base, teclado e tampa com a landing do app */
function Laptop({ src }: { src: string }) {
  const texture = useScreenTexture(src);

  return (
    <group>
      {/* base */}
      <RoundedBox args={[3.1, 0.09, 2.05]} radius={0.035} smoothness={8} castShadow>
        <meshPhysicalMaterial color="#4a4a52" metalness={0.8} roughness={0.35} />
      </RoundedBox>
      {/* teclado */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.047, -0.18]}>
        <planeGeometry args={[2.8, 1.15]} />
        <meshStandardMaterial color="#1c1c21" roughness={0.8} />
      </mesh>
      {/* trackpad */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.047, 0.62]}>
        <planeGeometry args={[1.1, 0.68]} />
        <meshStandardMaterial color="#3d3d44" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* tampa aberta, levemente inclinada para trás */}
      <group position={[0, 0.02, -1.0]} rotation={[0.3, 0, 0]}>
        <RoundedBox
          args={[3.1, 2.28, 0.07]}
          radius={0.035}
          smoothness={8}
          position={[0, 1.12, 0]}
          castShadow
        >
          <meshPhysicalMaterial color="#4a4a52" metalness={0.8} roughness={0.35} />
        </RoundedBox>
        <mesh position={[0, 1.12, 0.037]}>
          <planeGeometry args={[2.96, 2.16]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        <mesh position={[0, 1.1, 0.038]}>
          <planeGeometry args={[2.84, 2.15]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/* Escala a cena para caber em telas menores */
function Fit({ children }: { children: React.ReactNode }) {
  const { viewport } = useThree();
  const scale = Math.min(1, viewport.width / 10.5);
  return <group scale={scale}>{children}</group>;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 7, 6]} intensity={1.1} />
      <directionalLight position={[-6, 3, -4]} intensity={0.35} color="#ff9a5c" />

      <Fit>
        <Sparkles count={70} scale={[12, 5, 5]} size={1.6} speed={0.35} opacity={0.5} color="#ff7a33" />

        {/* MacBook — Don't Idle */}
        <group position={[0, -0.75, -0.8]}>
          <Grabbable rotation={[0.1, -0.15, 0]}>
            <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.5}>
              <Laptop src="/projects/shots/dont-idle-1.png" />
            </Float>
          </Grabbable>
        </group>

        {/* iPhone — IEQ MVA */}
        <group position={[-2.9, 0.15, 0.6]}>
          <Grabbable rotation={[0.05, 0.35, 0.02]}>
            <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.7}>
              <Phone src="/projects/shots/ieq-mva-1.png" />
            </Float>
          </Grabbable>
        </group>

        {/* iPhone — QWIP */}
        <group position={[2.9, 0.05, 0.6]}>
          <Grabbable rotation={[0.05, -0.35, -0.02]}>
            <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.7}>
              <Phone src="/projects/shots/qwip-1.png" />
            </Float>
          </Grabbable>
        </group>

      </Fit>

      <Environment preset="city" />
    </>
  );
}

export default function Showcase3D() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.35, 8.2], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: 'pan-y' }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
