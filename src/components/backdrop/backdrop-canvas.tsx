"use client";

import { Edges } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type * as THREE from "three";

// Faint outline solids behind every page. Each drifts on its own and moves at
// its own rate as the page scrolls, so depth reads without drawing attention.

type Solid = {
  kind: "ico" | "octa" | "dodeca" | "box" | "torus";
  position: [number, number, number];
  size: number;
  /** Fraction of scroll distance the solid travels: the parallax depth. */
  depth: number;
  spin: number;
  accent?: boolean;
};

const solids: Solid[] = [
  { kind: "ico", position: [-6.8, 2.2, -5], size: 2.2, depth: 0.2, spin: 0.04 },
  { kind: "box", position: [5.6, 3.8, -4], size: 1.2, depth: 0.3, spin: 0.05, accent: true },
  { kind: "octa", position: [7, -6, -7], size: 2.4, depth: 0.12, spin: -0.03 },
  { kind: "dodeca", position: [-6, -11, -6], size: 1.8, depth: 0.16, spin: 0.03 },
];

function Shape({ solid, still }: { solid: Solid; still: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock, viewport }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = still ? 0 : clock.elapsedTime;
    // Scroll in screen heights, converted to world units at this depth.
    const scrolled = window.scrollY / window.innerHeight;
    mesh.position.y = solid.position[1] + scrolled * viewport.height * solid.depth * 4 + Math.sin(t * 0.3 + solid.size) * 0.2;
    mesh.rotation.x = t * solid.spin + scrolled * solid.spin * 3;
    mesh.rotation.y = t * solid.spin * 1.3 + 0.4;
  });
  const s = solid.size;
  return (
    <mesh ref={ref} position={solid.position}>
      {solid.kind === "ico" ? <icosahedronGeometry args={[s, 0]} /> : null}
      {solid.kind === "octa" ? <octahedronGeometry args={[s, 0]} /> : null}
      {solid.kind === "dodeca" ? <dodecahedronGeometry args={[s, 0]} /> : null}
      {solid.kind === "box" ? <boxGeometry args={[s, s, s]} /> : null}
      {solid.kind === "torus" ? <torusGeometry args={[s, s * 0.32, 6, 14]} /> : null}
      <meshBasicMaterial visible={false} />
      <Edges color={solid.accent ? "#ff8a52" : "#e8ede9"} transparent opacity={solid.accent ? 0.22 : 0.09} />
    </mesh>
  );
}

/** Renders at about 30fps: plenty for slow, blurred drift at half the cost. */
function Ticker() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      if (now - last > 33) {
        last = now;
        invalidate();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [invalidate]);
  return null;
}

export default function BackdropCanvas({ still }: { still: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={1} gl={{ antialias: true, alpha: true }} frameloop="demand">
      {still ? null : <Ticker />}
      {solids.map((solid, i) => (
        <Shape key={i} solid={solid} still={still} />
      ))}
    </Canvas>
  );
}
