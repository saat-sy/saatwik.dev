"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";
import { GROUND, INK, Model } from "./models";

// Every role's model sits on one swaying stage (never far enough to show a
// back); the active one rises into place while the previous one sinks away.

const SWAY = 0.5;

function Slot({ slug, active, still }: { slug: string; active: boolean; still: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const level = useRef(active ? 1 : 0);
  useFrame((_, delta) => {
    const g = ref.current;
    if (!g) return;
    const target = active ? 1 : 0;
    level.current = still ? target : level.current + (target - level.current) * Math.min(1, delta * 5);
    g.scale.set(1, Math.max(level.current, 0.001), 1);
    g.visible = level.current > 0.01;
  });
  return (
    <group ref={ref}>
      <Model slug={slug} color={INK} />
    </group>
  );
}

function Turntable({ slugs, active, still }: { slugs: string[]; active: string; still: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current && !still) ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.4) * SWAY;
  });
  return (
    <group ref={ref}>
      {slugs.map((slug) => (
        <Slot key={slug} slug={slug} active={slug === active} still={still} />
      ))}
    </group>
  );
}

export default function RoleStageCanvas({ slugs, active, still }: { slugs: string[]; active: string; still: boolean }) {
  return (
    <Canvas
      camera={{ position: [3, 2.6, 4], fov: 34 }}
      dpr={[1, 2]}
      frameloop={still ? "demand" : "always"}
      onCreated={({ gl, camera }) => {
        gl.setClearColor(GROUND, 0);
        camera.lookAt(0, 0.75, 0);
      }}
    >
      <Turntable slugs={slugs} active={active} still={still} />
    </Canvas>
  );
}
