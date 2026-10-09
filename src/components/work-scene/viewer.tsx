"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";
import { GROUND, INK, Model } from "./models";

// One model on its own, turning slowly like a part on a viewer.

function Turntable({ slug, still }: { slug: string; still: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current && !still) ref.current.rotation.y += delta * 0.25;
  });
  return (
    <group ref={ref} rotation={[0, -0.5, 0]}>
      <Model slug={slug} color={INK} />
    </group>
  );
}

export default function ModelViewer({ slug, still, touch }: { slug: string; still: boolean; touch: boolean }) {
  return (
    <Canvas
      camera={{ position: [2.8, 2.3, 3.6], fov: 34 }}
      dpr={[1, 2]}
      frameloop={still ? "demand" : "always"}
      onCreated={({ gl, camera }) => {
        gl.setClearColor(GROUND, 0);
        camera.lookAt(0, 0.6, 0);
      }}
    >
      <Turntable slug={slug} still={still} />
      {touch ? null : (
        <OrbitControls target={[0, 0.6, 0]} enableZoom={false} enablePan={false} minPolarAngle={Math.PI * 0.2} maxPolarAngle={Math.PI * 0.48} />
      )}
    </Canvas>
  );
}
