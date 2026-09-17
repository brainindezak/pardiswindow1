"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { roundedRectHole, roundedRectShape } from "./geometry";
import { familyFinish, mm, openingFor, type Finish, type StudioConfig } from "@/lib/configurator";
import { faDigits } from "@/lib/utils";

export type ViewState = { open: boolean; explode: boolean; cutaway: boolean; yaw: number };
export type Quality = "high" | "lite";

type Vec3 = [number, number, number];

const GASKET = { color: "#141414", roughness: 0.92, metalness: 0 } as const;
const SPACER = { color: "#b3b9bf", metalness: 0.85, roughness: 0.3 } as const;
const HARDWARE = { color: "#c9ccd0", metalness: 0.9, roughness: 0.22 } as const;
const STEEL = { color: "#6d7278", metalness: 0.7, roughness: 0.4 } as const;
const GALVANIZED = { color: "#a3a9ae", metalness: 0.8, roughness: 0.32 } as const;
const ELECTROSTATIC = { color: "#2b2e33", metalness: 0.45, roughness: 0.5 } as const;

/* ------------------------------------------------------------------ */
/* Shared primitives                                                    */
/* ------------------------------------------------------------------ */

/** A rectangular "picture frame" ring extruded along Z and centred on the origin. */
function useRing(w: number, h: number, face: number, depth: number, radius = 0.003) {
  const geometry = useMemo(() => {
    const outerW = Math.max(0.02, w);
    const outerH = Math.max(0.02, h);
    const innerW = Math.max(0.005, outerW - face * 2);
    const innerH = Math.max(0.005, outerH - face * 2);
    const shape = roundedRectShape(outerW, outerH, radius);
    shape.holes.push(roundedRectHole(innerW, innerH, Math.max(0.0005, radius * 0.6)));
    const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 4 });
    geo.translate(0, 0, -depth / 2);
    return geo;
  }, [w, h, face, depth, radius]);

  useEffect(() => () => geometry.dispose(), [geometry]);
  return geometry;
}

function Ring({
  w,
  h,
  face,
  depth,
  radius,
  position,
  children,
}: {
  w: number;
  h: number;
  face: number;
  depth: number;
  radius?: number;
  position?: Vec3;
  children: ReactNode;
}) {
  const geometry = useRing(w, h, face, depth, radius);
  return (
    <mesh geometry={geometry} position={position} castShadow receiveShadow>
      {children}
    </mesh>
  );
}

export function FinishMaterial({ finish }: { finish: Finish }) {
  return (
    <meshStandardMaterial
      color={finish.hex}
      metalness={finish.metalness}
      roughness={finish.roughness}
      envMapIntensity={finish.metalness > 0.5 ? 1.25 : 0.7}
    />
  );
}

function GlassMaterial({ quality }: { quality: Quality }) {
  if (quality === "high") {
    return (
      <meshPhysicalMaterial
        color="#e6f0ee"
        transmission={1}
        roughness={0.05}
        thickness={0.25}
        ior={1.5}
        envMapIntensity={1.3}
        attenuationColor="#d6ebe6"
        attenuationDistance={2}
      />
    );
  }
  return (
    <meshPhysicalMaterial
      color="#cfe0e0"
      transparent
      opacity={0.36}
      roughness={0.08}
      metalness={0}
      clearcoat={1}
      envMapIntensity={1.3}
      depthWrite={false}
    />
  );
}

/** Insulated glazing: n panes with aluminium spacer rings and argon cavities between them. */
function Glazing({
  w,
  h,
  panes,
  quality,
  gap = 0.016,
  argon = 0.06,
}: {
  w: number;
  h: number;
  panes: number;
  quality: Quality;
  gap?: number;
  argon?: number;
}) {
  const spacer = useRing(w - 0.006, h - 0.006, 0.012, Math.max(0.003, gap - 0.005));
  const total = (panes - 1) * gap;
  return (
    <group>
      {Array.from({ length: panes }, (_, i) => (
        <mesh key={`pane-${i}`} position={[0, 0, -total / 2 + i * gap]}>
          <boxGeometry args={[w, h, 0.004]} />
          <GlassMaterial quality={quality} />
        </mesh>
      ))}
      {Array.from({ length: panes - 1 }, (_, i) => (
        <group key={`cavity-${i}`} position={[0, 0, -total / 2 + i * gap + gap / 2]}>
          <mesh geometry={spacer}>
            <meshStandardMaterial {...SPACER} />
          </mesh>
          <mesh>
            <boxGeometry args={[Math.max(0.01, w - 0.03), Math.max(0.01, h - 0.03), Math.max(0.002, gap - 0.007)]} />
            <meshBasicMaterial color="#5b6ef5" transparent opacity={argon} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** A complete sash: profile ring, thermal strip, gaskets, glazing and handle — centred on origin. */
function SashUnit({
  w,
  h,
  face,
  depth,
  finish,
  panes,
  quality,
  handleSide,
  thermal,
}: {
  w: number;
  h: number;
  face: number;
  depth: number;
  finish: Finish;
  panes: number;
  quality: Quality;
  handleSide: "left" | "right";
  thermal: boolean;
}) {
  const gw = Math.max(0.05, w - face * 2 + 0.014);
  const gh = Math.max(0.05, h - face * 2 + 0.014);
  const hx = handleSide === "left" ? -w / 2 + face / 2 : w / 2 - face / 2;
  return (
    <group>
      <Ring w={w} h={h} face={face} depth={depth}>
        <FinishMaterial finish={finish} />
      </Ring>
      {thermal ? (
        <Ring w={w - face} h={h - face} face={0.005} depth={0.002} position={[0, 0, depth / 2 + 0.001]}>
          <meshStandardMaterial color="#1b1c1f" roughness={0.65} />
        </Ring>
      ) : null}
      <Ring w={gw + 0.014} h={gh + 0.014} face={0.009} depth={0.006} position={[0, 0, depth / 2 - 0.002]}>
        <meshStandardMaterial {...GASKET} />
      </Ring>
      <Ring w={gw + 0.014} h={gh + 0.014} face={0.009} depth={0.006} position={[0, 0, -depth / 2 + 0.002]}>
        <meshStandardMaterial {...GASKET} />
      </Ring>
      <Glazing w={gw} h={gh} panes={panes} quality={quality} />
      <group position={[hx, 0, depth / 2]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.004]}>
          <cylinderGeometry args={[0.017, 0.017, 0.008, 24]} />
          <meshStandardMaterial {...HARDWARE} />
        </mesh>
        <mesh position={[0, -0.052, 0.02]}>
          <boxGeometry args={[0.016, 0.115, 0.014]} />
          <meshStandardMaterial {...HARDWARE} />
        </mesh>
      </group>
    </group>
  );
}

function Hinges({ h, z, count = 2 }: { h: number; z: number; count?: number }) {
  const spots = count === 3 ? [-0.34, 0, 0.34] : [-0.32, 0.32];
  return (
    <group>
      {spots.map((k) => (
        <mesh key={k} position={[0, h * k, z]}>
          <cylinderGeometry args={[0.007, 0.007, 0.075, 16]} />
          <meshStandardMaterial {...HARDWARE} />
        </mesh>
      ))}
    </group>
  );
}

function DimensionLabel({ text }: { text: string }) {
  return (
    <span className="whitespace-nowrap rounded-full border border-argon-glow/40 bg-graphite/85 px-2 py-0.5 font-technical text-[10px] text-argon-glow backdrop-blur-sm">
      {text}
    </span>
  );
}

/** Live architectural dimension lines (width below, height on the right). */
function Dimensions({ W, H, width, height }: { W: number; H: number; width: number; height: number }) {
  const off = 0.13;
  const line = "#8f9dff";
  return (
    <group>
      <mesh position={[0, -H / 2 - off, 0]}>
        <boxGeometry args={[W, 0.003, 0.003]} />
        <meshBasicMaterial color={line} />
      </mesh>
      <mesh position={[-W / 2, -H / 2 - off, 0]}>
        <boxGeometry args={[0.003, 0.05, 0.003]} />
        <meshBasicMaterial color={line} />
      </mesh>
      <mesh position={[W / 2, -H / 2 - off, 0]}>
        <boxGeometry args={[0.003, 0.05, 0.003]} />
        <meshBasicMaterial color={line} />
      </mesh>
      <Html position={[0, -H / 2 - off - 0.07, 0]} center zIndexRange={[5, 0]} className="pointer-events-none select-none">
        <DimensionLabel text={`${faDigits(width)} mm`} />
      </Html>

      <mesh position={[W / 2 + off, 0, 0]}>
        <boxGeometry args={[0.003, H, 0.003]} />
        <meshBasicMaterial color={line} />
      </mesh>
      <mesh position={[W / 2 + off, H / 2, 0]}>
        <boxGeometry args={[0.05, 0.003, 0.003]} />
        <meshBasicMaterial color={line} />
      </mesh>
      <mesh position={[W / 2 + off, -H / 2, 0]}>
        <boxGeometry args={[0.05, 0.003, 0.003]} />
        <meshBasicMaterial color={line} />
      </mesh>
      <Html position={[W / 2 + off + 0.09, 0, 0]} center zIndexRange={[5, 0]} className="pointer-events-none select-none">
        <DimensionLabel text={`${faDigits(height)} mm`} />
      </Html>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Window / door (UPVC & aluminium)                                     */
/* ------------------------------------------------------------------ */

type SashSpec = {
  x: number;
  z: number;
  w: number;
  h: number;
  hinge: "left" | "right" | "bottom" | "slide";
  handle: "left" | "right";
};

function pivotFor(sash: SashSpec): { position: Vec3; offset: Vec3 } {
  switch (sash.hinge) {
    case "left":
      return { position: [sash.x - sash.w / 2, 0, sash.z], offset: [sash.w / 2, 0, 0] };
    case "right":
      return { position: [sash.x + sash.w / 2, 0, sash.z], offset: [-sash.w / 2, 0, 0] };
    case "bottom":
      return { position: [sash.x, -sash.h / 2, sash.z], offset: [0, sash.h / 2, 0] };
    default:
      return { position: [sash.x, 0, sash.z], offset: [0, 0, 0] };
  }
}

export function WindowModel({ config, view, quality }: { config: StudioConfig; view: ViewState; quality: Quality }) {
  const W = mm(config.width);
  const H = mm(config.height);
  const al = config.family === "aluminum";
  const f = al ? 0.056 : 0.07;
  const d = al ? 0.062 : 0.07;
  const s = al ? 0.05 : 0.06;
  const sd = d - 0.008;
  const thermal = al && config.aluminumProfile === "thermal-break";
  const finish = familyFinish(config);
  const panes = config.glazing === "multi" ? 3 : 2;
  const iw = W - 2 * f;
  const ih = H - 2 * f;
  const sashZ = d / 2 - sd / 2 + 0.006;
  const opening = openingFor(config);

  const layout = useMemo(() => {
    const sashes: SashSpec[] = [];
    let mullion = 0;
    let travel = 0;
    if (config.opening === "sliding") {
      const sw = iw / 2 + s / 2;
      const sh = ih - 0.012;
      const x = iw / 2 - sw / 2;
      sashes.push({ x: -x, z: -0.016, w: sw, h: sh, hinge: "slide", handle: "right" });
      sashes.push({ x, z: 0.016, w: sw, h: sh, hinge: "slide", handle: "left" });
      travel = sw * 0.92;
    } else if (config.opening === "tilt") {
      sashes.push({ x: 0, z: sashZ, w: iw - 0.004, h: ih - 0.004, hinge: "bottom", handle: "right" });
    } else if (config.opening === "french-door") {
      const sw = iw / 2 - 0.003;
      sashes.push({ x: -(sw / 2 + 0.0015), z: sashZ, w: sw, h: ih - 0.004, hinge: "left", handle: "right" });
      sashes.push({ x: sw / 2 + 0.0015, z: sashZ, w: sw, h: ih - 0.004, hinge: "right", handle: "left" });
    } else if (config.sashes === 2) {
      mullion = f;
      const sw = (iw - mullion) / 2 - 0.004;
      const x = sw / 2 + mullion / 2 + 0.002;
      sashes.push({ x: -x, z: sashZ, w: sw, h: ih - 0.004, hinge: "left", handle: "right" });
      sashes.push({ x, z: sashZ, w: sw, h: ih - 0.004, hinge: "right", handle: "left" });
    } else {
      sashes.push({ x: 0, z: sashZ, w: iw - 0.004, h: ih - 0.004, hinge: "left", handle: "right" });
    }
    return { sashes, mullion, travel };
  }, [config.opening, config.sashes, iw, ih, s, f, sashZ]);

  const pivots = useRef<Array<THREE.Group | null>>([]);
  const amount = useRef(0);

  useFrame((_, dt) => {
    const target = view.open ? 1 : 0;
    amount.current += (target - amount.current) * Math.min(1, dt * 3);
    const a = amount.current;
    layout.sashes.forEach((sash, i) => {
      const group = pivots.current[i];
      if (!group) return;
      if (sash.hinge === "slide") {
        if (i === 1) group.position.x = sash.x - a * layout.travel;
      } else if (sash.hinge === "bottom") {
        group.rotation.x = a * 0.2;
      } else {
        group.rotation.y = (sash.hinge === "left" ? -1 : 1) * a * 0.95;
      }
    });
  });

  return (
    <group>
      <Ring w={W} h={H} face={f} depth={d}>
        <FinishMaterial finish={finish} />
      </Ring>
      <Ring w={iw + 0.02} h={ih + 0.02} face={0.014} depth={d * 0.3} position={[0, 0, -d / 2 + d * 0.15]}>
        <FinishMaterial finish={finish} />
      </Ring>
      {thermal ? (
        <Ring w={W - f} h={H - f} face={0.005} depth={0.002} position={[0, 0, d / 2 + 0.001]}>
          <meshStandardMaterial color="#1b1c1f" roughness={0.65} />
        </Ring>
      ) : null}
      {layout.mullion > 0 ? (
        <mesh castShadow>
          <boxGeometry args={[layout.mullion, ih, d]} />
          <FinishMaterial finish={finish} />
        </mesh>
      ) : null}
      {config.opening === "sliding"
        ? [-0.016, 0.016].map((z) => (
            <mesh key={z} position={[0, -ih / 2 + 0.005, z]}>
              <boxGeometry args={[iw, 0.01, 0.012]} />
              <meshStandardMaterial {...HARDWARE} />
            </mesh>
          ))
        : null}

      {layout.sashes.map((sash, i) => {
        const pivot = pivotFor(sash);
        return (
          <group
            key={`${opening.id}-${i}`}
            ref={(el) => {
              pivots.current[i] = el;
            }}
            position={pivot.position}
          >
            <group position={pivot.offset}>
              <SashUnit
                w={sash.w}
                h={sash.h}
                face={s}
                depth={sd}
                finish={finish}
                panes={panes}
                quality={quality}
                handleSide={sash.handle}
                thermal={thermal}
              />
            </group>
            {sash.hinge === "left" || sash.hinge === "right" ? <Hinges h={sash.h} z={sd / 2 + 0.004} /> : null}
          </group>
        );
      })}

      <Dimensions W={W} H={H} width={config.width} height={config.height} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Insulated glass unit                                                 */
/* ------------------------------------------------------------------ */

const CLOSED_GAP = 0.016;
const EXPLODED_GAP = 0.24;

export function GlassUnitModel({ config, view, quality }: { config: StudioConfig; view: ViewState; quality: Quality }) {
  const W = mm(config.width);
  const H = mm(config.height);
  const panes = config.glazing === "multi" ? 3 : 2;
  const spacer = useRing(W - 0.008, H - 0.008, 0.013, 0.011);
  const seal = useRing(W + 0.002, H + 0.002, 0.005, (panes - 1) * CLOSED_GAP + 0.006);

  const paneRefs = useRef<Array<THREE.Mesh | null>>([]);
  const cavityRefs = useRef<Array<THREE.Group | null>>([]);
  const argonMats = useRef<Array<THREE.MeshBasicMaterial | null>>([]);
  const sealRef = useRef<THREE.Mesh>(null);
  const gap = useRef(CLOSED_GAP);

  const beads = useMemo(() => Array.from({ length: 18 }, (_, i) => -W / 2 + 0.06 + (i / 17) * (W - 0.12)), [W]);

  useFrame((_, dt) => {
    const target = view.explode ? EXPLODED_GAP : CLOSED_GAP;
    gap.current += (target - gap.current) * Math.min(1, dt * 3);
    const g = gap.current;
    const total = (panes - 1) * g;
    paneRefs.current.forEach((mesh, i) => {
      if (mesh) mesh.position.z = -total / 2 + i * g;
    });
    cavityRefs.current.forEach((cavity, i) => {
      if (cavity) cavity.position.z = -total / 2 + i * g + g / 2;
    });
    const t = (g - CLOSED_GAP) / (EXPLODED_GAP - CLOSED_GAP);
    argonMats.current.forEach((mat) => {
      if (mat) mat.opacity = 0.08 + t * 0.28;
    });
    if (sealRef.current) sealRef.current.visible = t < 0.15;
  });

  const explodedTotal = (panes - 1) * EXPLODED_GAP;

  return (
    <group>
      {Array.from({ length: panes }, (_, i) => (
        <mesh
          key={`pane-${i}`}
          ref={(el) => {
            paneRefs.current[i] = el;
          }}
        >
          <boxGeometry args={[W, H, 0.004]} />
          <GlassMaterial quality={quality} />
        </mesh>
      ))}

      {Array.from({ length: panes - 1 }, (_, i) => (
        <group
          key={`cavity-${i}`}
          ref={(el) => {
            cavityRefs.current[i] = el;
          }}
        >
          <mesh geometry={spacer}>
            <meshStandardMaterial {...SPACER} />
          </mesh>
          {beads.map((x, bi) => (
            <mesh key={bi} position={[x, H / 2 - 0.0105, 0.0065]}>
              <sphereGeometry args={[0.0035, 6, 6]} />
              <meshStandardMaterial color="#e6e0cf" roughness={0.7} />
            </mesh>
          ))}
          <mesh>
            <boxGeometry args={[Math.max(0.01, W - 0.03), Math.max(0.01, H - 0.03), 0.009]} />
            <meshBasicMaterial
              ref={(el) => {
                argonMats.current[i] = el;
              }}
              color="#5b6ef5"
              transparent
              opacity={0.08}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}

      <mesh ref={sealRef} geometry={seal}>
        <meshStandardMaterial color="#1a1a1a" roughness={0.85} />
      </mesh>

      {view.explode ? (
        <group>
          <Html position={[-W / 2 - 0.06, H * 0.3, -explodedTotal / 2]} center zIndexRange={[5, 0]} className="pointer-events-none select-none">
            <DimensionLabel text="شیشه بیرونی" />
          </Html>
          <Html position={[-W / 2 - 0.06, H * 0.42, -explodedTotal / 2 + EXPLODED_GAP / 2]} center zIndexRange={[5, 0]} className="pointer-events-none select-none">
            <DimensionLabel text="اسپیسر آلومینیومی + سیلیکاژل" />
          </Html>
          <Html position={[-W / 2 - 0.06, -H * 0.1, -explodedTotal / 2 + EXPLODED_GAP / 2]} center zIndexRange={[5, 0]} className="pointer-events-none select-none">
            <DimensionLabel text="محفظه گاز آرگون" />
          </Html>
          <Html position={[-W / 2 - 0.06, H * 0.3, explodedTotal / 2]} center zIndexRange={[5, 0]} className="pointer-events-none select-none">
            <DimensionLabel text="شیشه داخلی" />
          </Html>
        </group>
      ) : null}

      <Dimensions W={W} H={H} width={config.width} height={config.height} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Security door                                                        */
/* ------------------------------------------------------------------ */

export function SecurityDoorModel({ config, view, quality }: { config: StudioConfig; view: ViewState; quality: Quality }) {
  void quality;
  const W = mm(config.width);
  const H = mm(config.height);
  const f = 0.085;
  const d = 0.11;
  const veneer = familyFinish(config);
  const iw = W - 2 * f;
  const ih = H - 2 * f;
  const slabW = iw - 0.006;
  const slabH = ih - 0.006;
  const slabT = 0.06;
  const eyeY = Math.min(H / 2 - 0.25, 1.5 - H / 2);

  const pivot = useRef<THREE.Group>(null);
  const slabMat = useRef<THREE.MeshStandardMaterial>(null);
  const partitions = useRef<THREE.Group>(null);
  const openAmt = useRef(0);
  const cut = useRef(0);

  useFrame((_, dt) => {
    openAmt.current += ((view.open ? 1 : 0) - openAmt.current) * Math.min(1, dt * 3);
    cut.current += ((view.cutaway ? 1 : 0) - cut.current) * Math.min(1, dt * 3);
    if (pivot.current) pivot.current.rotation.y = -openAmt.current * 0.9;
    if (slabMat.current) {
      slabMat.current.opacity = 1 - cut.current * 0.84;
      slabMat.current.transparent = cut.current > 0.01;
      slabMat.current.depthWrite = cut.current < 0.5;
    }
    if (partitions.current) partitions.current.visible = cut.current > 0.03;
  });

  return (
    <group>
      <Ring w={W} h={H} face={f} depth={d}>
        <meshStandardMaterial {...ELECTROSTATIC} />
      </Ring>
      <Ring w={iw + 0.03} h={ih + 0.03} face={0.02} depth={d * 0.35} position={[0, 0, -d / 2 + d * 0.175]}>
        <meshStandardMaterial {...ELECTROSTATIC} />
      </Ring>
      <mesh position={[0, -H / 2 + 0.015, 0]}>
        <boxGeometry args={[W, 0.03, d]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>

      <group ref={pivot} position={[-slabW / 2, 0, 0.018]}>
        <group position={[slabW / 2, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[slabW, slabH, slabT]} />
            <meshStandardMaterial
              ref={slabMat}
              color={veneer.hex}
              metalness={veneer.metalness}
              roughness={veneer.roughness}
              envMapIntensity={veneer.metalness > 0.5 ? 1.2 : 0.6}
            />
          </mesh>

          <Ring w={slabW * 0.72} h={slabH * 0.34} face={0.014} depth={0.004} position={[0, slabH * 0.2, slabT / 2 + 0.002]}>
            <meshStandardMaterial color="#0b0b0c" transparent opacity={0.28} />
          </Ring>
          <Ring w={slabW * 0.72} h={slabH * 0.28} face={0.014} depth={0.004} position={[0, -slabH * 0.24, slabT / 2 + 0.002]}>
            <meshStandardMaterial color="#0b0b0c" transparent opacity={0.28} />
          </Ring>

          <group position={[slabW / 2 - 0.09, -0.02, slabT / 2]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.004]}>
              <cylinderGeometry args={[0.03, 0.03, 0.008, 28]} />
              <meshStandardMaterial {...HARDWARE} />
            </mesh>
            <mesh position={[-0.075, 0, 0.03]}>
              <boxGeometry args={[0.15, 0.02, 0.02]} />
              <meshStandardMaterial {...HARDWARE} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.09, 0.006]}>
              <cylinderGeometry args={[0.012, 0.012, 0.012, 20]} />
              <meshStandardMaterial {...HARDWARE} />
            </mesh>
          </group>

          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, eyeY, slabT / 2 + 0.004]}>
            <cylinderGeometry args={[0.011, 0.011, 0.008, 20]} />
            <meshStandardMaterial {...HARDWARE} />
          </mesh>
          <mesh position={[0, eyeY - 0.14, slabT / 2 + 0.02]}>
            <torusGeometry args={[0.045, 0.006, 12, 40]} />
            <meshStandardMaterial {...HARDWARE} />
          </mesh>

          <group ref={partitions} visible={false}>
            <Ring w={slabW} h={slabH} face={0.03} depth={0.05}>
              <meshStandardMaterial {...STEEL} />
            </Ring>
            {[-slabW / 3, 0, slabW / 3].map((x) => (
              <mesh key={`v${x}`} position={[x, 0, 0]}>
                <boxGeometry args={[0.04, slabH - 0.06, 0.04]} />
                <meshStandardMaterial {...GALVANIZED} />
              </mesh>
            ))}
            {[-slabH / 4, slabH / 4].map((y) => (
              <mesh key={`h${y}`} position={[0, y, 0]}>
                <boxGeometry args={[slabW - 0.06, 0.04, 0.04]} />
                <meshStandardMaterial {...GALVANIZED} />
              </mesh>
            ))}
            <mesh position={[slabW / 2 - 0.06, -0.05, 0]}>
              <boxGeometry args={[0.06, 0.24, 0.045]} />
              <meshStandardMaterial color="#2f3236" metalness={0.6} roughness={0.4} />
            </mesh>
            {[-0.13, -0.05, 0.03].map((y) => (
              <mesh key={`b${y}`} rotation={[0, 0, Math.PI / 2]} position={[slabW / 2 + 0.01, y, 0]}>
                <cylinderGeometry args={[0.008, 0.008, 0.06, 12]} />
                <meshStandardMaterial {...HARDWARE} />
              </mesh>
            ))}
          </group>
        </group>
        <Hinges h={slabH} z={slabT / 2 + 0.004} count={3} />
      </group>

      <Dimensions W={W} H={H} width={config.width} height={config.height} />
    </group>
  );
}
