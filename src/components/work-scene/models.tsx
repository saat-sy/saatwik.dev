"use client";

import { Edges } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// Each role and project as a small drafted model: solid faces in the ground
// colour hide the lines behind them, and only the edges are drawn.

export const GROUND = "#0a0c0b";
export const INK = "#e8ede9";
const SOFT = "#7d877f";
const RED = "#ff8a52";

type BlockProps = {
  size: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  color: string;
};

function Block({ size, position = [0, 0, 0], rotation, color }: BlockProps) {
  return (
    <mesh position={[position[0], position[1] + size[1] / 2, position[2]]} rotation={rotation}>
      <boxGeometry args={size} />
      <meshBasicMaterial color={GROUND} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
      <Edges color={color} />
    </mesh>
  );
}

function Lines({ points, color }: { points: [number, number, number][]; color: string }) {
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(...p))), [points]);
  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={color} />
    </lineSegments>
  );
}

function Rack({ x, color }: { x: number; color: string }) {
  const slots = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 1; i <= 9; i++) pts.push([x - 0.24, i * 0.2, 0.301], [x + 0.24, i * 0.2, 0.301]);
    return pts;
  }, [x]);
  return (
    <group>
      <Block size={[0.6, 2, 0.6]} position={[x, 0, 0]} color={color} />
      <Lines points={slots} color={color === RED ? RED : SOFT} />
    </group>
  );
}

function Meta({ color }: { color: string }) {
  return (
    <group>
      <Rack x={-0.4} color={color} />
      {/* The rack being drained is always in redline. */}
      <Rack x={0.4} color={RED} />
    </group>
  );
}

// A pool of spare GPUs around a router. The pipeline route runs GPU to router
// to GPU, and packets (activation vectors) travel along it in redline.
const POOL_RADIUS = 1.05;
const POOL_NODES: { size: [number, number, number]; angle: number }[] = [
  { size: [0.46, 0.28, 0.34], angle: 0.35 },
  { size: [0.36, 0.2, 0.3], angle: 1.4 },
  { size: [0.4, 0.34, 0.3], angle: 2.45 },
  { size: [0.5, 0.22, 0.36], angle: 3.5 },
  { size: [0.34, 0.3, 0.28], angle: 4.55 },
  { size: [0.42, 0.24, 0.32], angle: 5.6 },
];
const POOL_ROUTE = [0, 2, 4];
const LINE_Y = 0.1;

function EveryGpu({ color }: { color: string }) {
  const packets = useRef<(THREE.Mesh | null)[]>([]);
  const nodes = useMemo(
    () => POOL_NODES.map((n) => ({ ...n, position: new THREE.Vector3(Math.cos(n.angle) * POOL_RADIUS, LINE_Y, Math.sin(n.angle) * POOL_RADIUS) })),
    [],
  );
  const hub = useMemo(() => new THREE.Vector3(0, LINE_Y, 0), []);
  const route = useMemo(() => {
    const stops: THREE.Vector3[] = [];
    POOL_ROUTE.forEach((n, i) => {
      if (i > 0) stops.push(hub);
      stops.push(nodes[n].position);
    });
    return stops;
  }, [nodes, hub]);
  const spokes = useMemo(() => {
    const hot: [number, number, number][] = [];
    const idle: [number, number, number][] = [];
    nodes.forEach((n, i) => (POOL_ROUTE.includes(i) ? hot : idle).push(hub.toArray(), n.position.toArray()));
    return { hot, idle };
  }, [nodes, hub]);
  const boundary = useMemo(() => {
    const pts: [number, number, number][] = [];
    const steps = 64;
    for (let i = 0; i < steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const b = ((i + 1) / steps) * Math.PI * 2;
      pts.push([Math.cos(a) * 1.5, 0.01, Math.sin(a) * 1.5], [Math.cos(b) * 1.5, 0.01, Math.sin(b) * 1.5]);
    }
    return pts;
  }, []);

  useFrame(({ clock }) => {
    const segments = route.length - 1;
    packets.current.forEach((mesh, i) => {
      if (!mesh) return;
      const u = (((clock.elapsedTime * 0.18 + i / packets.current.length) % 1) + 1) % 1 * segments;
      const seg = Math.min(Math.floor(u), segments - 1);
      mesh.position.lerpVectors(route[seg], route[seg + 1], u - seg);
    });
  });

  return (
    <group position={[0, 0.35, 0]} scale={0.62}>
      <Lines points={boundary} color={SOFT} />
      <Lines points={spokes.idle} color={SOFT} />
      <Lines points={spokes.hot} color={RED} />
      <Block size={[0.7, 0.12, 0.5]} color={color} />
      {nodes.map((n, i) => (
        <Block key={n.angle} size={n.size} position={[n.position.x, 0, n.position.z]} color={POOL_ROUTE.includes(i) ? RED : color} />
      ))}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(m) => {
            packets.current[i] = m;
          }}
          position={route[0].toArray()}
        >
          <boxGeometry args={[0.08, 0.08, 0.08]} />
          <meshBasicMaterial color={RED} />
        </mesh>
      ))}
    </group>
  );
}

function Dictate({ color }: { color: string }) {
  return (
    <group rotation={[0, -0.4, 0]}>
      <Block size={[0.8, 1.5, 0.08]} position={[0, 0, 0]} color={color} />
      <Lines
        points={[
          [-0.3, 0.25, 0.05], [0.3, 0.25, 0.05],
          [0.3, 0.25, 0.05], [0.3, 1.3, 0.05],
          [0.3, 1.3, 0.05], [-0.3, 1.3, 0.05],
          [-0.3, 1.3, 0.05], [-0.3, 0.25, 0.05],
          [-0.2, 1.05, 0.05], [0.2, 1.05, 0.05],
          [-0.2, 0.9, 0.05], [0.15, 0.9, 0.05],
          [-0.2, 0.75, 0.05], [0.2, 0.75, 0.05],
        ]}
        color={SOFT}
      />
    </group>
  );
}

function Timbre({ color }: { color: string }) {
  const heights = [0.3, 0.7, 1.1, 0.6, 0.9, 1.3, 0.5, 0.8, 0.4];
  return (
    <group>
      {heights.map((h, i) => (
        <Block key={i} size={[0.1, h, 0.1]} position={[(i - 4) * 0.16, 0, 0]} color={color} />
      ))}
    </group>
  );
}

function Crio({ color }: { color: string }) {
  return (
    <group>
      <Block size={[1.4, 0.08, 0.7]} color={color} />
      {[0, 1, 2, 3].map((i) => (
        <Block key={i} size={[0.24, 0.4 + (i % 2) * 0.25, 0.3]} position={[-0.48 + i * 0.32, 0.08, 0]} color={color} />
      ))}
    </group>
  );
}

function Anb({ color }: { color: string }) {
  return (
    <group>
      <Block size={[0.7, 0.9, 0.06]} position={[-0.35, 0, 0]} rotation={[0, 0.3, 0]} color={color} />
      <Block size={[0.45, 0.45, 0.45]} position={[0.45, 0, 0.1]} color={color} />
    </group>
  );
}

function Gsoc({ color }: { color: string }) {
  const grid = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 5; i++) {
      const t = -0.6 + i * 0.24;
      pts.push([t, 0.01, -0.6], [t, 0.01, 0.6], [-0.6, 0.01, t], [0.6, 0.01, t]);
    }
    return pts;
  }, []);
  return (
    <group>
      <Lines points={grid} color={SOFT} />
      <mesh position={[0.1, 0.75, 0]} rotation={[0, 0.5, 0]}>
        <torusGeometry args={[0.35, 0.025, 8, 40]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <Lines points={[[0.33, 0.48, -0.13], [0.6, 0.12, -0.3]]} color={color} />
    </group>
  );
}

function CybOrg({ color }: { color: string }) {
  return (
    <group>
      <Block size={[0.4, 0.6, 0.4]} position={[-0.7, 0, 0]} color={color} />
      {[0, 1, 2].flatMap((i) =>
        [0, 1].map((j) => <Block key={`${i}${j}`} size={[0.26, 0.26, 0.26]} position={[-0.15 + i * 0.36, 0, -0.2 + j * 0.4]} color={color} />),
      )}
    </group>
  );
}

const models: Record<string, (p: { color: string }) => React.ReactElement> = {
  meta: Meta,
  everygpu: EveryGpu,
  dictate: Dictate,
  timbre: Timbre,
  crio: Crio,
  anb: Anb,
  gsoc: Gsoc,
  cyborg: CybOrg,
};

export function Model({ slug, color }: { slug: string; color: string }) {
  const M = models[slug];
  return M ? <M color={color} /> : null;
}
