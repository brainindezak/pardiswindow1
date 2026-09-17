"use client";

import { ContactShadows, Environment, Float, Html, Lightformer } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { roundedRectHole, roundedRectShape } from "./geometry";

export type ObservatoryLayer = "outer-pane" | "spacer" | "butyl" | "argon" | "polysulfide" | "inner-pane";

type Props = {
  separationRef: MutableRefObject<number>; // 0 sealed → 1 exploded
  activeLayer: ObservatoryLayer;
  onPick: (layer: ObservatoryLayer) => void;
  reducedMotion: boolean;
  active: boolean;
};

const W = 1.5;
const H = 1.05;
const PANE_T = 0.012;
const GAP = 0.05;
const EXPLODE = 0.34;

const LAYER_Z: Record<ObservatoryLayer, number> = {
  "outer-pane": -1,
  spacer: -0.5,
  butyl: -0.36,
  argon: 0,
  polysulfide: 0.36,
  "inner-pane": 1,
};

export default function GlassObservatoryScene({ separationRef, activeLayer, onPick, reducedMotion, active }: Props) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [1.9, 0.55, 2.7], fov: 30, near: 0.05, far: 40 }}
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 4, 3]} intensity={1.4} color="#fff2df" />
      <directionalLight position={[-3, 1, -2]} intensity={0.6} color="#8f9dff" />
      <Suspense fallback={null}>
        <Environment resolution={256}>
          <Lightformer intensity={2.6} position={[0, 4, -5]} scale={[9, 3, 1]} color="#fff6ea" />
          <Lightformer intensity={1.2} position={[-6, 1, 1]} rotation-y={Math.PI / 2} scale={[5, 3, 1]} color="#dfe4ff" />
          <Lightformer intensity={1.6} position={[6, 0, 2]} rotation-y={-Math.PI / 2} scale={[5, 3, 1]} color="#8f9dff" />
        </Environment>
        <Float speed={reducedMotion ? 0 : 0.7} rotationIntensity={reducedMotion ? 0 : 0.18} floatIntensity={reducedMotion ? 0 : 0.3}>
          <Unit separationRef={separationRef} activeLayer={activeLayer} onPick={onPick} />
        </Float>
        <ContactShadows position={[0, -H / 2 - 0.22, 0]} opacity={0.5} scale={5} blur={2.6} far={1.4} color="#000" />
      </Suspense>
    </Canvas>
  );
}

function useRing(w: number, h: number, face: number, depth: number) {
  return useMemo(() => {
    const shape = roundedRectShape(w, h, 0.004);
    shape.holes.push(roundedRectHole(w - face * 2, h - face * 2, 0.002));
    const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 3 });
    geo.translate(0, 0, -depth / 2);
    return geo;
  }, [w, h, face, depth]);
}

function Unit({ separationRef, activeLayer, onPick }: Omit<Props, "reducedMotion" | "active">) {
  const group = useRef<THREE.Group>(null);
  const layers = useRef<Record<ObservatoryLayer, THREE.Group | null>>({
    "outer-pane": null,
    spacer: null,
    butyl: null,
    argon: null,
    polysulfide: null,
    "inner-pane": null,
  });
  const argonMat = useRef<THREE.MeshBasicMaterial>(null);
  const beadRefs = useRef<THREE.InstancedMesh>(null);
  const smooth = useRef(0);

  const spacer = useRing(W - 0.02, H - 0.02, 0.016, GAP - 0.006);
  const butyl = useRing(W - 0.02, H - 0.02, 0.006, 0.006);
  const poly = useRing(W + 0.004, H + 0.004, 0.009, GAP + PANE_T * 2 + 0.006);

  const beadCount = 90;
  const beadMatrix = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, dt) => {
    const target = separationRef.current;
    smooth.current += (target - smooth.current) * Math.min(1, dt * 4);
    const s = smooth.current;
    const spread = GAP + s * EXPLODE;

    (Object.keys(LAYER_Z) as ObservatoryLayer[]).forEach((id) => {
      const node = layers.current[id];
      if (!node) return;
      const base = LAYER_Z[id] * (PANE_T + GAP / 2);
      const exploded = LAYER_Z[id] * spread * 1.15;
      node.position.z = THREE.MathUtils.lerp(base, exploded, s);
      const isActive = id === activeLayer;
      const targetScale = isActive ? 1.02 : 1;
      node.scale.x += (targetScale - node.scale.x) * Math.min(1, dt * 6);
      node.scale.y = node.scale.x;
    });

    if (argonMat.current) {
      const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 1.6) * 0.5;
      argonMat.current.opacity = 0.06 + s * 0.22 + pulse * 0.05;
    }

    if (beadRefs.current) {
      const t = state.clock.elapsedTime;
      for (let i = 0; i < beadCount; i++) {
        const u = i / beadCount;
        const perimeter = u * 2 * (W + H);
        let x = 0;
        let y = 0;
        if (perimeter < W) {
          x = -W / 2 + perimeter;
          y = H / 2 - 0.012;
        } else if (perimeter < W + H) {
          x = W / 2 - 0.012;
          y = H / 2 - (perimeter - W);
        } else if (perimeter < 2 * W + H) {
          x = W / 2 - (perimeter - W - H);
          y = -H / 2 + 0.012;
        } else {
          x = -W / 2 + 0.012;
          y = -H / 2 + (perimeter - 2 * W - H);
        }
        beadMatrix.position.set(x * 0.985, y * 0.985, Math.sin(t * 2 + i) * 0.003);
        beadMatrix.scale.setScalar(1);
        beadMatrix.updateMatrix();
        beadRefs.current.setMatrixAt(i, beadMatrix.matrix);
      }
      beadRefs.current.instanceMatrix.needsUpdate = true;
    }

    if (group.current) group.current.rotation.y = -0.35 + Math.sin(state.clock.elapsedTime * 0.25) * 0.06;
  });

  const bind = (id: ObservatoryLayer) => ({
    onClick: (event: { stopPropagation: () => void }) => {
      event.stopPropagation();
      onPick(id);
    },
    onPointerOver: () => {
      document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      document.body.style.cursor = "";
    },
  });

  return (
    <group ref={group} rotation={[0.08, -0.35, 0]}>
      {/* outer pane */}
      <group ref={(el) => (layers.current["outer-pane"] = el)} {...bind("outer-pane")}>
        <mesh>
          <boxGeometry args={[W, H, PANE_T]} />
          <GlassMaterial tint="#e7f1ef" />
        </mesh>
        <Edge w={W} h={H} />
      </group>

      {/* spacer + silica beads */}
      <group ref={(el) => (layers.current.spacer = el)} {...bind("spacer")}>
        <mesh geometry={spacer}>
          <meshStandardMaterial color="#b4bbc2" metalness={0.85} roughness={0.32} />
        </mesh>
        <instancedMesh ref={beadRefs} args={[undefined, undefined, beadCount]}>
          <sphereGeometry args={[0.0042, 6, 6]} />
          <meshStandardMaterial color="#efe6d2" roughness={0.75} />
        </instancedMesh>
      </group>

      {/* butyl primary seal */}
      <group ref={(el) => (layers.current.butyl = el)} {...bind("butyl")}>
        <mesh geometry={butyl}>
          <meshStandardMaterial color="#141414" roughness={0.92} />
        </mesh>
      </group>

      {/* argon volume */}
      <group ref={(el) => (layers.current.argon = el)} {...bind("argon")}>
        <mesh>
          <boxGeometry args={[W - 0.05, H - 0.05, GAP - 0.012]} />
          <meshBasicMaterial ref={argonMat} color="#6f80ff" transparent opacity={0.08} depthWrite={false} />
        </mesh>
        <ArgonParticles />
      </group>

      {/* polysulfide secondary seal */}
      <group ref={(el) => (layers.current.polysulfide = el)} {...bind("polysulfide")}>
        <mesh geometry={poly}>
          <meshStandardMaterial color="#1a1a1c" roughness={0.85} />
        </mesh>
      </group>

      {/* inner pane */}
      <group ref={(el) => (layers.current["inner-pane"] = el)} {...bind("inner-pane")}>
        <mesh>
          <boxGeometry args={[W, H, PANE_T]} />
          <GlassMaterial tint="#e3eeee" />
        </mesh>
        <Edge w={W} h={H} />
      </group>

      <Callouts activeLayer={activeLayer} separationRef={separationRef} />
    </group>
  );
}

function GlassMaterial({ tint }: { tint: string }) {
  return (
    <meshPhysicalMaterial
      color={tint}
      transmission={1}
      roughness={0.04}
      thickness={0.35}
      ior={1.52}
      envMapIntensity={1.4}
      attenuationColor="#cfe6e0"
      attenuationDistance={1.6}
      clearcoat={0.6}
      clearcoatRoughness={0.1}
    />
  );
}

function Edge({ w, h }: { w: number; h: number }) {
  const geo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, PANE_T)), [w, h]);
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.35} />
    </lineSegments>
  );
}

/* A tiny deterministic PRNG (mulberry32). Rendering must be pure, and a
   fixed seed also means the gas cloud looks identical on every load and
   between server and client. */
function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ArgonParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 140;
  const positions = useMemo(() => {
    const rand = seededRandom(0x9e3779b9);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rand() - 0.5) * (W - 0.1);
      arr[i * 3 + 1] = (rand() - 0.5) * (H - 0.1);
      arr[i * 3 + 2] = (rand() - 0.5) * (GAP - 0.02);
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t * 0.8 + i) * 0.00025;
      arr[i * 3] += Math.cos(t * 0.6 + i * 0.5) * 0.0002;
      if (arr[i * 3 + 1] > H / 2 - 0.05) arr[i * 3 + 1] = -H / 2 + 0.05;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#9fabff" size={0.008} sizeAttenuation transparent opacity={0.85} depthWrite={false} />
    </points>
  );
}

const LABELS: Record<ObservatoryLayer, string> = {
  "outer-pane": "شیشه بیرونی",
  spacer: "اسپیسر + سیلیکاژل",
  butyl: "چسب بوتیل",
  argon: "محفظه آرگون",
  polysulfide: "پلی‌سولفاید",
  "inner-pane": "شیشه داخلی",
};

function Callouts({ activeLayer, separationRef }: { activeLayer: ObservatoryLayer; separationRef: MutableRefObject<number> }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    const s = separationRef.current;
    ref.current.visible = s > 0.35;
  });
  return (
    <group ref={ref}>
      {(Object.keys(LAYER_Z) as ObservatoryLayer[]).map((id) => {
        const z = LAYER_Z[id] * (GAP + EXPLODE) * 1.15;
        const isActive = id === activeLayer;
        return (
          <Html key={id} position={[-W / 2 - 0.08, H / 2 - 0.1 - Math.abs(LAYER_Z[id]) * 0.02, z]} zIndexRange={[4, 0]} className="pointer-events-none select-none">
            <span
              className={`whitespace-nowrap rounded-full border px-2.5 py-1 font-technical text-[10px] backdrop-blur-sm transition-all ${
                isActive ? "border-argon-glow bg-argon text-cloud shadow-[0_0_24px_rgba(91,110,245,.6)]" : "border-cloud/20 bg-graphite/80 text-cloud/70"
              }`}
            >
              {LABELS[id]}
            </span>
          </Html>
        );
      })}
    </group>
  );
}
