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

// A film strip stands behind an audio track. A redline playhead sweeps across
// both: the waveform draws itself behind the playhead and swells with each
// scene's mood, with the newest chunk (one streamed block) in redline.
const TIMBRE_SCENES = 3;
const TIMBRE_STROKES = 120;
const TIMBRE_LIVE_STROKES = 5;
const TIMBRE_SPAN = 1.9;
const TIMBRE_STRIP_Z = -0.5;
const TIMBRE_TRACK_Z = 0.25;
const TIMBRE_TRACK_HEIGHT = 0.6;
const TIMBRE_STRIP_LIFT = 0.7;
const TIMBRE_MOOD = [0.08, 0.17, 0.27];
const TIMBRE_SWEEP_SECONDS = 8;
const TIMBRE_HOLD_SECONDS = 1.4;
const TIMBRE_FRAME_WIDTH = 0.55;
const TIMBRE_FRAME_STEP = TIMBRE_SPAN / TIMBRE_SCENES;
const TIMBRE_FRAME_Y = 0.1;

function timbreFrameX(scene: number) {
  return -TIMBRE_SPAN / 2 + TIMBRE_FRAME_STEP * (scene + 0.5);
}

function timbreGlyph(scene: number): [number, number, number][] {
  const pts: [number, number, number][] = [];
  const steps = 24;
  const amp = [0.03, 0.07, 0.13][scene];
  const cycles = [1, 2, 4][scene];
  for (let i = 0; i < steps; i++) {
    const wave = (u: number) => (scene === 2 ? (Math.floor(u * cycles * 2) % 2 ? 1 : -1) * amp : Math.sin(u * cycles * Math.PI * 2) * amp);
    const u0 = i / steps;
    const u1 = (i + 1) / steps;
    pts.push([-0.2 + u0 * 0.4, 0.2 + wave(u0), 0.02], [-0.2 + u1 * 0.4, 0.2 + wave(u1), 0.02]);
  }
  return pts;
}

/** Mood amplitude at position u (0..1) along the timeline, blended across scene cuts. */
function timbreMood(u: number) {
  const scaled = u * TIMBRE_SCENES;
  const scene = Math.min(Math.floor(scaled), TIMBRE_SCENES - 1);
  const edge = scaled - scene;
  const next = TIMBRE_MOOD[Math.min(scene + 1, TIMBRE_SCENES - 1)];
  return TIMBRE_MOOD[scene] + (next - TIMBRE_MOOD[scene]) * smooth((edge - 0.8) / 0.2);
}

function Timbre({ color }: { color: string }) {
  const played = useRef<THREE.LineSegments>(null);
  const live = useRef<THREE.LineSegments>(null);
  const playhead = useRef<THREE.Group>(null);
  const marker = useRef<THREE.Group>(null);
  const note = useRef<THREE.Group>(null);
  const sprockets = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 26; i++) {
      const x = -0.97 + i * 0.077;
      pts.push([x, 0.02, 0.012], [x, 0.06, 0.012], [x, 0.58, 0.012], [x, 0.62, 0.012]);
    }
    return pts;
  }, []);
  const playheadLines = useMemo<[number, number, number][]>(
    () => [
      [0, 0, TIMBRE_STRIP_Z], [0, TIMBRE_STRIP_LIFT + 0.75, TIMBRE_STRIP_Z],
      [0, 0.045, TIMBRE_STRIP_Z], [0, 0.045, TIMBRE_TRACK_Z],
      [0, 0, TIMBRE_TRACK_Z + 0.03], [0, TIMBRE_TRACK_HEIGHT, TIMBRE_TRACK_Z + 0.03],
    ],
    [],
  );
  const markerLines = useMemo<[number, number, number][]>(() => {
    const hw = TIMBRE_FRAME_WIDTH / 2 + 0.04;
    const y0 = TIMBRE_STRIP_LIFT + TIMBRE_FRAME_Y - 0.04;
    const y1 = TIMBRE_STRIP_LIFT + TIMBRE_FRAME_Y + 0.44;
    const z = TIMBRE_STRIP_Z + 0.03;
    return [[-hw, y0, z], [hw, y0, z], [hw, y0, z], [hw, y1, z], [hw, y1, z], [-hw, y1, z], [-hw, y1, z], [-hw, y0, z]];
  }, []);
  const noteLines = useMemo(() => {
    const pts: [number, number, number][] = [];
    const steps = 14;
    for (let i = 0; i < steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const b = ((i + 1) / steps) * Math.PI * 2;
      pts.push([Math.cos(a) * 0.055, Math.sin(a) * 0.04, 0], [Math.cos(b) * 0.055, Math.sin(b) * 0.04, 0]);
    }
    pts.push([0.055, 0, 0], [0.055, 0.24, 0], [0.055, 0.24, 0], [0.13, 0.15, 0]);
    return pts;
  }, []);
  const strokes = useMemo(() => {
    const centerY = TIMBRE_TRACK_HEIGHT / 2;
    const z = TIMBRE_TRACK_Z;
    const positions = new Float32Array(TIMBRE_STROKES * 6);
    for (let i = 0; i < TIMBRE_STROKES; i++) {
      const u = (i + 0.5) / TIMBRE_STROKES;
      const x = -TIMBRE_SPAN / 2 + u * TIMBRE_SPAN;
      const texture = 0.45 + 0.55 * Math.abs(Math.sin(i * 0.9) * 0.6 + Math.sin(i * 2.7 + 1) * 0.4);
      const h = Math.max(timbreMood(u) * texture, 0.012);
      positions.set([x, centerY - h, z, x, centerY + h, z], i * 6);
    }
    const make = () => {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      return g;
    };
    return { played: make(), live: make() };
  }, []);

  useFrame(({ clock }) => {
    const t = (clock.elapsedTime + 4.5) % (TIMBRE_SWEEP_SECONDS + TIMBRE_HOLD_SECONDS);
    const progress = Math.min(t / TIMBRE_SWEEP_SECONDS, 1);
    const x = -TIMBRE_SPAN / 2 + progress * TIMBRE_SPAN;
    if (playhead.current) playhead.current.position.x = x;
    if (marker.current) marker.current.position.x = timbreFrameX(Math.min(Math.floor(progress * TIMBRE_SCENES), TIMBRE_SCENES - 1));
    if (note.current) {
      note.current.position.y = TIMBRE_TRACK_HEIGHT + 0.1 + Math.sin(clock.elapsedTime * 3) * 0.04;
    }
    const drawn = Math.floor(progress * TIMBRE_STROKES);
    const liveStart = Math.max(drawn - TIMBRE_LIVE_STROKES, 0);
    strokes.played.setDrawRange(0, liveStart * 2);
    strokes.live.setDrawRange(liveStart * 2, (drawn - liveStart) * 2);
  });

  return (
    <group position={[0, 0.05, 0]} scale={0.9}>
      <Block size={[TIMBRE_SPAN + 0.2, 0.04, 1.3]} position={[0, 0, -0.05]} color={color} />
      <group position={[0, 0.04, 0]}>
        <Block size={[TIMBRE_SPAN + 0.05, 0.62, 0.02]} position={[0, TIMBRE_STRIP_LIFT, TIMBRE_STRIP_Z - 0.03]} color={color} />
        {[-1, 1].map((side) => (
          <Block key={side} size={[0.04, TIMBRE_STRIP_LIFT, 0.04]} position={[(side * TIMBRE_SPAN) / 2, 0, TIMBRE_STRIP_Z - 0.03]} color={color} />
        ))}
        <group position={[0, TIMBRE_STRIP_LIFT, TIMBRE_STRIP_Z]}>
          <Lines points={sprockets} color={SOFT} />
        </group>
        {Array.from({ length: TIMBRE_SCENES }, (_, scene) => (
          <group key={scene} position={[timbreFrameX(scene), TIMBRE_STRIP_LIFT + TIMBRE_FRAME_Y - 0.1, TIMBRE_STRIP_Z]}>
            <Block size={[TIMBRE_FRAME_WIDTH, 0.4, 0.03]} position={[0, 0.1, 0]} color={color} />
            <group position={[0, 0.1, 0]}>
              <Lines points={timbreGlyph(scene)} color={SOFT} />
            </group>
          </group>
        ))}
        <group ref={marker}>
          <Lines points={markerLines} color={RED} />
        </group>
        {/* An open frame, so the waveform reads from both sides as the model turns. */}
        <mesh position={[0, TIMBRE_TRACK_HEIGHT / 2, TIMBRE_TRACK_Z]}>
          <boxGeometry args={[TIMBRE_SPAN + 0.05, TIMBRE_TRACK_HEIGHT, 0.04]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          <Edges color={color} />
        </mesh>
        <lineSegments ref={played} geometry={strokes.played} frustumCulled={false}>
          <lineBasicMaterial color={color} />
        </lineSegments>
        <lineSegments ref={live} geometry={strokes.live} frustumCulled={false}>
          <lineBasicMaterial color={RED} />
        </lineSegments>
        <group ref={playhead}>
          <Lines points={playheadLines} color={RED} />
          <group ref={note} position={[0, TIMBRE_TRACK_HEIGHT + 0.1, TIMBRE_TRACK_Z + 0.03]}>
            <Lines points={noteLines} color={RED} />
          </group>
        </group>
      </group>
    </group>
  );
}

// A 4x4 board of 2048-style tiles and a chess pawn. The pawn hops, a tile
// slides along its row onto its twin, and the pair merges into one taller
// redline tile before the board resets.
const GOBBLE_CELL = 0.4;
const GOBBLE_LEVELS = [0.1, 0.16, 0.24, 0.34];
const GOBBLE_TILES: { i: number; j: number; level: number }[] = [
  { i: 0, j: 0, level: 0 },
  { i: 3, j: 0, level: 1 },
  { i: 2, j: 3, level: 0 },
  { i: 0, j: 3, level: 2 },
  { i: 3, j: 2, level: 0 },
];
const GOBBLE_ROW = 2;
const GOBBLE_BOARD_Y = 0.06;
const GOBBLE_LOOP_SECONDS = 6;

function gobbleCoord(index: number) {
  return (index - 1.5) * GOBBLE_CELL;
}

function GobbleTile({ level, color, tile }: { level: number; color: string; tile?: React.Ref<THREE.Group> }) {
  return (
    <group ref={tile} scale={[1, GOBBLE_LEVELS[level], 1]}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[GOBBLE_CELL * 0.84, 1, GOBBLE_CELL * 0.84]} />
        <meshBasicMaterial color={GROUND} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
        <Edges color={color} />
      </mesh>
    </group>
  );
}

function Gobble({ color }: { color: string }) {
  const slider = useRef<THREE.Group>(null);
  const sliderTile = useRef<THREE.Group>(null);
  const target = useRef<THREE.Group>(null);
  const merged = useRef<THREE.Group>(null);
  const pawn = useRef<THREE.Group>(null);
  const grid = useMemo(() => {
    const pts: [number, number, number][] = [];
    const half = GOBBLE_CELL * 2;
    for (let n = 0; n <= 4; n++) {
      const c = -half + n * GOBBLE_CELL;
      pts.push([c, 0, -half], [c, 0, half], [-half, 0, c], [half, 0, c]);
    }
    return pts;
  }, []);

  useFrame(({ clock }) => {
    const t = (clock.elapsedTime + 3) % GOBBLE_LOOP_SECONDS;
    const hop = (from: number, to: number, u: number) => {
      const k = smooth(u);
      return { z: from + (to - from) * k, lift: Math.sin(Math.min(Math.max(u, 0), 1) * Math.PI) * 0.22 };
    };
    if (pawn.current) {
      const a = gobbleCoord(0);
      const b = gobbleCoord(1);
      const move = t < 4.4 ? hop(a, b, (t - 1) / 0.8) : hop(b, a, (t - 4.4) / 0.8);
      pawn.current.position.set(gobbleCoord(1), GOBBLE_BOARD_Y + move.lift, move.z);
    }
    const slide = smooth((t - 1.8) / 0.8);
    const back = t >= 5.2 ? smooth((t - 5.2) / 0.8) : t >= 2.6 ? 0.001 : 1;
    if (slider.current) slider.current.position.x = t < 5.2 ? gobbleCoord(0) + (gobbleCoord(2) - gobbleCoord(0)) * slide : gobbleCoord(0);
    if (sliderTile.current) sliderTile.current.scale.y = GOBBLE_LEVELS[1] * back;
    if (target.current) target.current.scale.y = GOBBLE_LEVELS[1] * back;
    if (merged.current) {
      const grow = t < 2.6 ? 0 : t < 3.4 ? smooth((t - 2.6) / 0.8) * (1 + Math.sin(((t - 2.6) / 0.8) * Math.PI) * 0.18) : t < 5.2 ? 1 : 1 - smooth((t - 5.2) / 0.6);
      merged.current.scale.y = Math.max(GOBBLE_LEVELS[2] * grow, 0.001);
    }
  });

  return (
    <group position={[0, 0.45, 0]} scale={1.1}>
      <Block size={[GOBBLE_CELL * 4 + 0.16, GOBBLE_BOARD_Y, GOBBLE_CELL * 4 + 0.16]} color={color} />
      <group position={[0, GOBBLE_BOARD_Y + 0.002, 0]}>
        <Lines points={grid} color={SOFT} />
      </group>
      <group position={[0, GOBBLE_BOARD_Y, 0]}>
        {GOBBLE_TILES.map((tile) => (
          <group key={`${tile.i}-${tile.j}`} position={[gobbleCoord(tile.i), 0, gobbleCoord(tile.j)]}>
            <GobbleTile level={tile.level} color={color} />
          </group>
        ))}
        <group ref={slider} position={[gobbleCoord(0), 0, gobbleCoord(GOBBLE_ROW)]}>
          <GobbleTile level={1} color={color} tile={sliderTile} />
        </group>
        <group position={[gobbleCoord(2), 0, gobbleCoord(GOBBLE_ROW)]}>
          <GobbleTile level={1} color={color} tile={target} />
          <GobbleTile level={2} color={RED} tile={merged} />
        </group>
      </group>
      <group ref={pawn}>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.11, 0.12, 0.06, 8]} />
          <meshBasicMaterial color={GROUND} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
          <Edges color={color} />
        </mesh>
        <mesh position={[0, 0.17, 0]}>
          <cylinderGeometry args={[0.04, 0.085, 0.22, 8]} />
          <meshBasicMaterial color={GROUND} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
          <Edges color={color} />
        </mesh>
        <mesh position={[0, 0.34, 0]}>
          <icosahedronGeometry args={[0.075, 0]} />
          <meshBasicMaterial color={GROUND} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
          <Edges color={color} />
        </mesh>
      </group>
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
  gobble: Gobble,
  crio: Crio,
  anb: Anb,
  gsoc: Gsoc,
  cyborg: CybOrg,
};

export function Model({ slug, color }: { slug: string; color: string }) {
  const M = models[slug];
  return M ? <M color={color} /> : null;
}
