import { Label } from "@/components/projects/project-cover";
import covers from "@/components/projects/projects.module.css";
import type { Role } from "@/content/site";
import styles from "./work.module.css";

// The pinned figure beside the experience line: one drafted sleeve per role,
// stacked. The active sleeve slides in from the direction of travel and its
// redline strokes draw themselves; the rest wait above or below it.

const concepts: Record<string, { outcome: string; input: string; output: string }> = {
  cyborg: { outcome: "An isolated challenge box for every competitor.", input: "Weekly CTF", output: "20+ isolated containers" },
  meta: { outcome: "Which outages drain tests can predict.", input: "15+ tests + SEVs", output: "Drain test ROI" },
  crio: { outcome: "Four microservices, deployed end to end on AWS.", input: "Starter stubs", output: "50+ learners deploying" },
  anb: { outcome: "Product photos in. Catalog metadata out.", input: "Item images", output: "Validated tags, half the effort" },
  gsoc: { outcome: "Precise drawing under your fingertip.", input: "Canvas touch", output: "Magnified, for 1M+ users" },
};

/** A redline stroke that draws itself when its sleeve becomes active. */
function Draw({ d }: { d: string }) {
  return <path d={d} pathLength={1} className={styles.draw} />;
}

function Artwork({ slug }: { slug: string }) {
  if (slug === "cyborg") {
    const rows = [170, 225, 280];
    return <>
      {rows.map((y) => <g key={y}>
        <circle cx="60" cy={y - 6} r="7" className={covers.coverLines} />
        <path className={covers.coverLines} d={`M48 ${y + 12}q12-14 24 0`} />
        <rect x="262" y={y - 22} width="250" height="44" className={covers.coverLines} strokeDasharray="4 4" />
        {[0, 1, 2].map((i) => <rect key={i} x={276 + i * 78} y={y - 14} width="54" height="28" fill={i === 0 ? "var(--redline)" : "#000"} stroke={i === 0 ? "none" : undefined} />)}
      </g>)}
      <rect x="150" y="148" width="70" height="154" fill="#000" stroke="var(--redline)" />
      <g stroke="var(--redline)">{rows.map((y) => <Draw key={y} d={`M80 ${y}h70m70 0h42`} />)}</g>
      <Label x={60} y={330}>teams</Label><Label x={185} y={330} accent>Traefik</Label>
      <Label x={387} y={136}>isolated challenge containers</Label><Label x={387} y={330}>Kubernetes on GCP</Label>
    </>;
  }
  if (slug === "meta") {
    const past = [146, 180, 214, 248, 282];
    const predicted = [146, 170, 194];
    const gaps = [262, 286];
    const ticks = [54, 40, 62, 34, 48];
    return <>
      <Label x={120} y={130}>historical SEVs</Label>
      {past.map((y, i) => <g key={y}>
        <rect x="70" y={y} width="100" height="16" fill="#000" className={covers.coverLines} />
        <path className={covers.coverLines} d={`M80 ${y + 8}h${ticks[i]}M170 ${y + 8}h30`} />
      </g>)}
      <path className={covers.coverLines} d="M200 154v136M200 222h30m-7-5 7 5-7 5" />
      <rect x="230" y="192" width="100" height="60" fill="#000" stroke="var(--redline)" />
      <Label x={280} y={218} accent>eval</Label><Label x={280} y={236} accent>framework</Label>
      <path className={covers.coverLines} d="M280 306V256m-5 7 5-7 5 7" />
      <Label x={280} y={326}>risk telemetry</Label>
      <Label x={450} y={130}>predictable</Label>
      {predicted.map((y, i) => <g key={y}>
        <rect x="400" y={y} width="100" height="16" fill="#000" className={covers.coverLines} />
        <path className={covers.coverLines} d={`M410 ${y + 8}h${[48, 62, 36][i]}`} />
      </g>)}
      <Label x={450} y={252} accent>needs onboarding</Label>
      {gaps.map((y) => <rect key={y} x="400" y={y} width="100" height="16" fill="var(--redline)" stroke="none" />)}
      <g stroke="var(--redline)"><Draw d="M330 222h30M360 178v104M360 178h32m-7-5 7 5-7 5M360 282h32m-7-5 7 5-7 5" /></g>
    </>;
  }
  if (slug === "crio") {
    return <>
      <rect x="70" y="140" width="220" height="160" className={covers.coverLines} strokeDasharray="4 4" />
      {[[88, 158], [192, 158], [88, 232], [192, 232]].map(([x, y]) => <g key={`${x}-${y}`}>
        <rect x={x} y={y} width="80" height="50" fill="#000" />
        <path className={covers.coverLines} d={`M${x + 12} ${y + 16}h40m-40 10h56m-56 10h28`} />
      </g>)}
      <Label x={180} y={326}>Docker Compose</Label>
      <rect x="380" y="150" width="110" height="60" fill="#000" stroke="var(--redline)" />
      <rect x="380" y="240" width="110" height="60" fill="#000" stroke="var(--redline)" />
      <Label x={435} y={185} accent>EC2</Label><Label x={435} y={275} accent>Lambda</Label>
      <g stroke="var(--redline)"><Draw d="M290 200 380 180m-9-5 9 5-8 6" /><Draw d="M290 240 380 270m-6-8 6 8-10 2" /></g>
      <Label x={435} y={326}>AWS</Label>
    </>;
  }
  if (slug === "anb") {
    return <>
      <rect x="70" y="160" width="100" height="100" fill="#000" />
      <path className={covers.coverLines} d="M82 246l28-36 20 22 14-14 16 28ZM146 186a8 8 0 1 0 .1 0" />
      <Label x={120} y={290}>item image</Label>
      <path className={covers.coverLines} d="M180 210h28m-7-5 7 5-7 5M332 210h28m-7-5 7 5-7 5" />
      <rect x="215" y="180" width="110" height="60" fill="#000" stroke="var(--redline)" />
      <Label x={270} y={206} accent>Llama 3</Label><Label x={270} y={226} accent>Vision</Label>
      {[170, 200, 230, 260].map((y) => <path key={y} className={covers.coverLines} d={`M370 ${y}h36m10 0h${y === 230 ? 40 : 56}`} />)}
      <g stroke="var(--redline)">{[170, 200, 230, 260].map((y) => <Draw key={y} d={`M488 ${y - 1}l4 4 8-9`} />)}</g>
      <Label x={435} y={290}>validated metadata</Label>
    </>;
  }
  // gsoc: a canvas, the point under the finger, and the magnifier over it.
  const lens = { x: 400, y: 215, r: 75 };
  return <>
    <defs><clipPath id="gsoc-lens"><circle cx={lens.x} cy={lens.y} r={lens.r} /></clipPath></defs>
    <rect x="70" y="140" width="230" height="170" className={covers.coverLines} />
    <path d="M96 270c30-60 60-80 94-40s52 10 84-60" />
    <path className={covers.coverLines} d="M190 218v24m-12-12h24" />
    <path className={covers.coverLines} strokeDasharray="2 6" d="M202 228 325 215" />
    <g clipPath="url(#gsoc-lens)">
      <path className={covers.coverLines} d={Array.from({ length: 11 }, (_, i) => `M${325 + i * 15} 140v150M325 ${140 + i * 15}h150`).join("")} />
      {[[355, 260], [370, 245], [385, 230], [400, 215], [415, 200], [430, 185], [445, 170]].map(([x, y]) => <rect key={x} x={x} y={y} width="15" height="15" fill="currentColor" stroke="none" />)}
      <path stroke="var(--redline)" d="M407.5 190v50m-25-25h50" />
    </g>
    <g stroke="var(--redline)"><circle cx={lens.x} cy={lens.y} r={lens.r} fill="none" /><Draw d="M453 268l40 40" /></g>
    <Label x={185} y={334}>canvas</Label><Label x={400} y={334} accent>magnifier</Label>
  </>;
}

export function RoleCovers({ roles, active }: { roles: Role[]; active: string }) {
  const at = Math.max(0, roles.findIndex((r) => r.slug === active));
  return (
    <div className={styles.covers} aria-hidden>
      {roles.map((role, i) => {
        const concept = concepts[role.slug];
        return (
          <figure key={role.slug} className={`${covers.cover} ${styles.roleCover}`} data-place={i < at ? "before" : i > at ? "after" : "active"}>
            <span className={covers.coverTitle}>{concept?.outcome ?? role.org}</span>
            <svg viewBox="0 0 560 420" fill="none" stroke="currentColor" strokeWidth="1.2"><Artwork slug={role.slug} /></svg>
            {concept ? <span className={covers.coverStack}>{concept.input} <span>→</span> {concept.output}</span> : null}
          </figure>
        );
      })}
    </div>
  );
}
