import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

/**
 * Signature visual: a "voice orb" — a ring of bars that behave like an
 * audio waveform / equalizer, orbiting a glowing core. It's a direct
 * visual metaphor for voice-command recognition, not a decorative shape.
 */
const BAR_COUNT = 48;

function WaveformRing({ radius = 2.4, baseHeight = 0.12 }) {
  const groupRef = useRef();
  const barsRef = useRef([]);

  const bars = useMemo(() => {
    return new Array(BAR_COUNT).fill(0).map((_, i) => {
      const angle = (i / BAR_COUNT) * Math.PI * 2;
      return {
        angle,
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        phase: i * 0.35,
        speed: 0.8 + Math.random() * 0.6,
      };
    });
  }, [radius]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.08;
    }
    barsRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      const b = bars[i];
      const wave = Math.sin(t * b.speed + b.phase) * 0.5 + 0.5; // 0..1
      const h = baseHeight + wave * 0.9;
      mesh.scale.y = h;
      mesh.position.y = h / 2;
    });
  });

  return (
    <group ref={groupRef}>
      {bars.map((b, i) => (
        <mesh
          key={i}
          ref={(el) => (barsRef.current[i] = el)}
          position={[b.x, baseHeight / 2, b.z]}
        >
          <boxGeometry args={[0.06, 1, 0.06]} />
          <meshStandardMaterial
            color="#7c6fff"
            emissive="#7c6fff"
            emissiveIntensity={0.6}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function Core() {
  const meshRef = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.25;
      meshRef.current.rotation.x = t * 0.12;
      const pulse = 1 + Math.sin(t * 1.6) * 0.06;
      meshRef.current.scale.setScalar(pulse);
    }
  });
  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[0.85, 1]} />
      <meshStandardMaterial
        color="#12131f"
        emissive="#ff9f5a"
        emissiveIntensity={0.25}
        roughness={0.25}
        metalness={0.4}
        wireframe
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 4]} intensity={40} color="#7c6fff" />
      <pointLight position={[-4, -2, -4]} intensity={20} color="#ff9f5a" />
      <group rotation={[0.35, 0, 0]}>
        <Core />
        <WaveformRing />
      </group>
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.6, 6.2], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene />
    </Canvas>
  );
}
