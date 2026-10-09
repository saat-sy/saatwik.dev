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

// A phone speaks one sentence (sound waves sweep across the page), then
// pauses while a pencil writes that line and glides to the next.
const DICTATE_SHEET = { x: 0.35, z: 0.2, width: 1.5, depth: 1.1 };
const DICTATE_PHONE_X = -0.95;
const DICTATE_LINE_OFFSETS = [-0.33, -0.11, 0.11, 0.33];
const DICTATE_LINE_LENGTHS = [1.1, 0.92, 1.12, 0.66];
const DICTATE_WORDS: [number, number][] = [[0, 0.38], [0.44, 0.72], [0.78, 1]];
const DICTATE_LINE_START = DICTATE_SHEET.x - 0.58;
const DICTATE_SENTENCE_SECONDS = 3.2;
const DICTATE_SPEAK_SHARE = 0.33;
const DICTATE_HOLD_SECONDS = 1.4;
const DICTATE_WAVES = 3;
const DICTATE_WAVE_SECONDS = 1.3;
const DICTATE_LIFT = 0.24;

function smooth(x: number) {
  const t = Math.min(Math.max(x, 0), 1);
  return t * t * (3 - 2 * t);
}

function Dictate({ color }: { color: string }) {
  const waves = useRef<(THREE.Group | null)[]>([]);
  const speaking = useRef<THREE.Mesh>(null);
  const pencil = useRef<THREE.Group>(null);
  const written = useRef<(THREE.Group | null)[]>([]);
  const arc = useMemo(() => {
    const pts: [number, number, number][] = [];
    const steps = 20;
    for (let i = 0; i < steps; i++) {
      const a = -1 + (i / steps) * 2;
      const b = -1 + ((i + 1) / steps) * 2;
      pts.push([Math.cos(a), 0, Math.sin(a)], [Math.cos(b), 0, Math.sin(b)]);
    }
    return pts;
  }, []);
  const arcGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(arc.map((q) => new THREE.Vector3(...q))), [arc]);
  const ruling = useMemo(() => {
    const pts: [number, number, number][] = [];
    DICTATE_LINE_OFFSETS.forEach((z) => pts.push([-0.62, 0.0, z], [0.62, 0.0, z]));
    return pts;
  }, []);
  const pencilStart = useMemo(() => new THREE.Vector3(), []);
  const pencilEnd = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const sentences = DICTATE_LINE_OFFSETS.length;
    const active = sentences * DICTATE_SENTENCE_SECONDS;
    const t = (clock.elapsedTime + 1.7) % (active + DICTATE_HOLD_SECONDS);
    const reading = t < active;
    const index = reading ? Math.floor(t / DICTATE_SENTENCE_SECONDS) : sentences - 1;
    const seconds = reading ? t - index * DICTATE_SENTENCE_SECONDS : DICTATE_SENTENCE_SECONDS;
    const local = seconds / DICTATE_SENTENCE_SECONDS;
    const lineZ = (i: number) => DICTATE_SHEET.z + DICTATE_LINE_OFFSETS[i];

    waves.current.forEach((wave, k) => {
      if (!wave) return;
      const age = seconds - k * 0.28;
      const alive = reading && age >= 0 && age < DICTATE_WAVE_SECONDS;
      wave.visible = alive;
      if (!alive) return;
      const life = age / DICTATE_WAVE_SECONDS;
      const r = 0.2 + 1.75 * life;
      wave.scale.set(r, 1, r);
      ((wave.children[0] as THREE.LineSegments).material as THREE.LineBasicMaterial).opacity = 1 - life;
    });
    if (speaking.current) speaking.current.visible = reading && local < DICTATE_SPEAK_SHARE;

    written.current.forEach((group, i) => {
      if (!group) return;
      const p = !reading || i < index ? 1 : i === index ? smooth((local - DICTATE_SPEAK_SHARE) / (1 - DICTATE_SPEAK_SHARE - 0.07)) : 0;
      group.scale.x = Math.max(p, 0.001);
    });

    if (pencil.current) {
      const rest = pencilEnd.set(DICTATE_SHEET.x + 0.5, DICTATE_LIFT, lineZ(0) - 0.05);
      const from = index === 0 ? rest : pencilStart.set(DICTATE_LINE_START + DICTATE_LINE_LENGTHS[index - 1], DICTATE_LIFT, lineZ(index - 1));
      const writeP = smooth((local - DICTATE_SPEAK_SHARE) / (1 - DICTATE_SPEAK_SHARE - 0.07));
      if (!reading) {
        pencil.current.position.set(DICTATE_LINE_START + DICTATE_LINE_LENGTHS[sentences - 1], DICTATE_LIFT, lineZ(sentences - 1));
      } else if (local < DICTATE_SPEAK_SHARE) {
        const glide = smooth(local / DICTATE_SPEAK_SHARE);
        pencil.current.position.set(
          from.x + (DICTATE_LINE_START - from.x) * glide,
          DICTATE_LIFT,
          from.z + (lineZ(index) - from.z) * glide,
        );
      } else {
        pencil.current.position.set(DICTATE_LINE_START + writeP * DICTATE_LINE_LENGTHS[index], 0.045 + (1 - Math.min(writeP * 8, 1)) * DICTATE_LIFT, lineZ(index));
      }
    }
  });

  return (
    <group position={[0, 0.5, 0]} scale={1.05}>
      <group position={[DICTATE_PHONE_X, 0, DICTATE_SHEET.z]} rotation={[0, Math.PI / 2, 0]}>
        <Block size={[0.5, 0.9, 0.06]} color={color} />
        <Lines points={[[-0.14, 0.62, 0.031], [0.14, 0.62, 0.031], [-0.14, 0.48, 0.031], [0.08, 0.48, 0.031], [-0.14, 0.34, 0.031], [0.14, 0.34, 0.031]]} color={SOFT} />
        <mesh ref={speaking} position={[0, 0.2, 0.034]}>
          <boxGeometry args={[0.3, 0.035, 0.006]} />
          <meshBasicMaterial color={RED} />
        </mesh>
      </group>
      {Array.from({ length: DICTATE_WAVES }, (_, k) => (
        <group
          key={k}
          ref={(g) => {
            waves.current[k] = g;
          }}
          position={[DICTATE_PHONE_X + 0.05, 0.06, DICTATE_SHEET.z]}
          visible={false}
        >
          <lineSegments geometry={arcGeometry}>
            <lineBasicMaterial color={RED} transparent />
          </lineSegments>
        </group>
      ))}
      <group position={[DICTATE_SHEET.x, 0, DICTATE_SHEET.z]}>
        <Block size={[DICTATE_SHEET.width, 0.04, DICTATE_SHEET.depth]} color={color} />
        <group position={[0, 0.042, 0]}>
          <Lines points={ruling} color={SOFT} />
        </group>
      </group>
      {DICTATE_LINE_OFFSETS.map((offset, i) => (
        <group
          key={offset}
          ref={(g) => {
            written.current[i] = g;
          }}
          position={[DICTATE_LINE_START, 0.05, DICTATE_SHEET.z + offset]}
        >
          {DICTATE_WORDS.map(([from, to]) => (
            <mesh key={from} position={[((from + to) / 2) * DICTATE_LINE_LENGTHS[i], 0, 0]}>
              <boxGeometry args={[(to - from) * DICTATE_LINE_LENGTHS[i], 0.012, 0.022]} />
              <meshBasicMaterial color={color} />
            </mesh>
          ))}
        </group>
      ))}
      <group ref={pencil}>
        <group rotation={[-0.3, 0, -0.5]}>
          <mesh position={[0, 0.06, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.03, 0.12, 6]} />
            <meshBasicMaterial color={RED} />
          </mesh>
          <mesh position={[0, 0.52, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.8, 6]} />
            <meshBasicMaterial color={GROUND} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
            <Edges color={color} />
          </mesh>
        </group>
      </group>
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
