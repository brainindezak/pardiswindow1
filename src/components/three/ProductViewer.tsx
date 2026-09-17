"use client";

import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { GlassUnitModel, SecurityDoorModel, WindowModel, type Quality, type ViewState } from "./ProductModels";
import { mm, type StudioConfig } from "@/lib/configurator";

type Props = {
  config: StudioConfig;
  view: ViewState;
  quality: Quality;
  interactive: boolean;
  active: boolean;
  autoRotate: boolean;
};

export default function ProductViewer({ config, view, quality, interactive, active, autoRotate }: Props) {
  const size = Math.max(mm(config.width), mm(config.height));
  const floorY = -mm(config.height) / 2 - 0.03;

  return (
    <Canvas
      dpr={quality === "high" ? [1, 1.75] : [1, 1.25]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [1.4, 0.5, 3.6], fov: 32, near: 0.05, far: 60 }}
    >
      <color attach="background" args={["#0e1013"]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} color="#fff3e2" />
      <directionalLight position={[-4, 2, -3]} intensity={0.55} color="#5b6ef5" />

      <Suspense fallback={null}>
        <Environment resolution={256}>
          <Lightformer intensity={2.2} position={[0, 4, -6]} scale={[10, 4, 1]} color="#fff4e6" />
          <Lightformer intensity={1.4} position={[-6, 2, 2]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} color="#e3e8ff" />
          <Lightformer intensity={1} position={[6, 1, 2]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} color="#8f9dff" />
          <Lightformer form="ring" intensity={0.6} position={[0, -3, 4]} rotation-x={Math.PI / 2} scale={[8, 8, 1]} color="#ffffff" />
        </Environment>

        <Stage config={config} view={view} quality={quality} />

        <ContactShadows position={[0, floorY, 0]} opacity={0.55} scale={size * 2.6 + 1} blur={2.2} far={1.6} resolution={512} color="#000000" />
      </Suspense>

      <CameraRig size={size} />
      <OrbitControls
        makeDefault
        enabled={interactive}
        enablePan={false}
        enableZoom={interactive}
        minDistance={0.8}
        maxDistance={9}
        autoRotate={autoRotate}
        autoRotateSpeed={0.7}
        minPolarAngle={Math.PI * 0.22}
        maxPolarAngle={Math.PI * 0.62}
      />
    </Canvas>
  );
}

function Stage({ config, view, quality }: { config: StudioConfig; view: ViewState; quality: Quality }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.rotation.y += (view.yaw - group.current.rotation.y) * Math.min(1, dt * 4);
  });

  return (
    <group ref={group}>
      {config.family === "glass" ? (
        <GlassUnitModel config={config} view={view} quality={quality} />
      ) : config.family === "security-doors" ? (
        <SecurityDoorModel config={config} view={view} quality={quality} />
      ) : (
        <WindowModel config={config} view={view} quality={quality} />
      )}
    </group>
  );
}

/** Re-frames the camera whenever the product's overall size changes. */
function CameraRig({ size }: { size: number }) {
  const { camera, controls } = useThree();
  const target = useMemo(() => new THREE.Vector3(size * 0.75, size * 0.18, size * 1.85 + 0.9), [size]);
  const animating = useRef(true);

  useEffect(() => {
    animating.current = true;
  }, [size]);

  useFrame(() => {
    if (!animating.current) return;
    camera.position.lerp(target, 0.07);
    (controls as unknown as { update?: () => void } | null)?.update?.();
    if (camera.position.distanceTo(target) < 0.01) animating.current = false;
  });

  return null;
}
