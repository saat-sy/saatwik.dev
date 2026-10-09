import type { Project } from "@/content/site";
import styles from "./projects.module.css";

const descriptions: Record<string, string> = {
  everygpu: "GPU shards exchange activation vectors over TCP through a laptop-hosted server.",
  dictate: "PDFs, photos, and text become sentence-by-sentence speech with pauses for handwriting.",
  timbre: "Video frames and dialogue inform a musical mood, then a score streams over WebSockets.",
  gobble: "Players move and merge tiles tactically to eliminate the opponent's color.",
  mach: "Proposed routing evaluates a task and repository to choose a coding model and harness.",
  hyprlander: "A plain-language request enters a reason, act, observe loop that edits Hyprland configuration.",
  fluttergenerator: "A screenshot passes through an Inception V3 encoder and LSTM decoder to generate Dart code.",
};

const concepts: Record<string, { outcome: string; input: string; output: string }> = {
  everygpu: { outcome: "One language model. Multiple spare GPUs.", input: "Scattered GPU memory", output: "Distributed inference" },
  dictate: { outcome: "Your notes, read at your writing pace.", input: "PDF, photo or text", output: "Speech with time to write" },
  timbre: { outcome: "A soundtrack that follows the scene.", input: "Video + dialogue", output: "Live, scene-aware music" },
  gobble: { outcome: "Outmaneuver. Merge. Take the board.", input: "Two players", output: "One color left standing" },
  mach: { outcome: "The right coding agent for the task.", input: "Task + repository", output: "Agent routing (proposed)" },
  hyprlander: { outcome: "Describe your desktop. Let the agent configure it.", input: "A plain-language request", output: "Hyprland configuration" },
  fluttergenerator: { outcome: "From a UI screenshot to Flutter code.", input: "Screenshot", output: "Experimental Dart generation" },
};

export function Label({ x, y, children, accent = false, anchor = "middle" }: { x: number; y: number; children: React.ReactNode; accent?: boolean; anchor?: "start" | "middle" | "end" }) {
  return <text x={x} y={y} textAnchor={anchor} className={accent ? styles.coverLabelAccent : styles.coverLabel}>{children}</text>;
}

function GPU({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect x="-53" y="-39" width="106" height="78" fill="#000" />
    <rect x="-34" y="-23" width="42" height="42" />
    <circle cx="-13" cy="-2" r="13" className={styles.coverLines} />
    <path className={styles.coverLines} d="M19-23h18M19-12h18M19-1h18M19 10h18M-35 30h70" />
  </g>;
}

/** Explanatory sleeve diagrams, built from each project's supplied facts. */
function Artwork({ slug }: { slug: string }) {
  if (slug === "everygpu") return <>
    <GPU x={130} y={185} /><GPU x={430} y={185} />
    <Label x={130} y={131}>GPU shard</Label><Label x={430} y={131}>GPU shard</Label>
    <g stroke="var(--redline)"><path d="M183 185h43v89h16M377 185h-43v89h-16" /><circle cx="226" cy="228" r="3" fill="var(--redline)" /><circle cx="334" cy="228" r="3" fill="var(--redline)" /></g>
    <rect x="242" y="248" width="76" height="51" fill="#000" /><path d="M234 308h92l-8-9h-76Z" />
    <path className={styles.coverLines} d="M252 259h56v29h-56Z" />
    <Label x={280} y={339}>Laptop server</Label><Label x={280} y={174} accent>activation vectors</Label><Label x={280} y={194} accent>over TCP</Label>
  </>;
  if (slug === "dictate") return <>
    <g className={styles.coverLines}><rect x="83" y="140" width="84" height="104" /><path d="M100 162h49m-49 16h49m-49 16h34m-34 16h49m-49 16h22" /><path d="M177 192h30m-7-5 7 5-7 5" /></g>
    <Label x={125} y={272}>PDF / OCR / text</Label>
    <g stroke="var(--redline)" strokeLinecap="round">{Array.from({ length: 20 }, (_, i) => {
      const h = (12 + Math.pow(Math.sin(i * 0.35), 2) * 70).toFixed(2);
      return <path key={i} d={`M${226 + i * 6} ${(192 - Number(h) / 2).toFixed(2)}v${h}`} />;
    })}</g>
    <path className={styles.coverLines} strokeDasharray="2 6" d="M352 192h60" />
    <g stroke="var(--redline)">{[22, 40, 65, 48, 27, 42, 18].map((h, i) => <path key={i} d={`M${420 + i * 6} ${192 - h / 2}v${h}`} />)}</g>
    <Label x={282} y={272} accent>read</Label><Label x={375} y={272}>pause</Label><Label x={449} y={292} accent>continue</Label>
    <path className={styles.coverLines} d="M342 306h80m-80 14h61m-61 14h71" /><Label x={383} y={357}>time to write</Label>
  </>;
  if (slug === "timbre") return <>
    <g className={styles.coverLines}>{[0, 1, 2].map((i) => <g key={i}><rect x={74 + i * 22} y={144 + i * 18} width="84" height="65" fill="#000" /><path d={`M${84 + i * 22} ${191 + i * 18}l19-21 14 12 15-18 21 27`} /></g>)}<path d="M99 279h78m-78 12h56M215 211h37m-7-5 7 5-7 5M317 211h29m-7-5 7 5-7 5" /></g>
    <rect x="252" y="181" width="66" height="60" fill="#000" stroke="var(--redline)" />
    <Label x={285} y={207} accent>scene</Label><Label x={285} y={225} accent>mood</Label>
    <g stroke="var(--redline)">{Array.from({ length: 23 }, (_, i) => { const h = Math.round(10 + Math.abs(Math.sin(i * 0.7)) * (20 + i * 2)); return <path key={i} d={`M${359 + i * 5} ${211 - h / 2}v${h}`} />; })}</g>
    <Label x={150} y={324}>frames + dialogue</Label><Label x={415} y={291} accent>live score</Label><Label x={415} y={312}>WebSockets</Label>
  </>;
  if (slug === "gobble") return <>
    <g transform="translate(136 132)">{Array.from({ length: 16 }, (_, i) => {
      const x = (i % 4) * 38;
      const y = Math.floor(i / 4) * 38;
      return <g key={i}><rect x={x} y={y} width="34" height="34" className={styles.coverLines} />{[1, 4, 6, 9, 12, 15].includes(i) ? <rect x={x + 8} y={y + 8} width="18" height="18" fill={[4, 9, 12].includes(i) ? "var(--redline)" : "currentColor"} stroke="none" /> : null}</g>;
    })}</g>
    <path stroke="var(--redline)" d="M180 188h55v34m-5-7 5 7 5-7" />
    <g stroke="var(--redline)"><rect x="337" y="154" width="24" height="24" /><rect x="383" y="154" width="24" height="24" /><path d="M372 160v12m-6-6h12M372 191v29m-5-7 5 7 5-7" /><rect x="350" y="232" width="44" height="44" fill="var(--redline)" /></g>
    <Label x={209} y={314}>move + position</Label><Label x={372} y={314} accent>gobble + merge</Label><Label x={280} y={350}>Eliminate the opponent&apos;s color.</Label>
  </>;
  if (slug === "mach") return <>
    <g className={styles.coverLines}><rect x="72" y="183" width="105" height="70" /><path d="M177 218h55M302 218l83-62h65m-148 62h148m-148 0 83 62h65" /></g>
    <Label x={124} y={211}>task</Label><Label x={124} y={230}>+ repository</Label>
    <path stroke="var(--redline)" d="M177 218h55m70 0 83-62h65" /><path stroke="var(--redline)" fill="#000" d="m267 181 37 37-37 37-37-37Z" />
    <Label x={470} y={160} anchor="start" accent>Codex</Label><Label x={470} y={222} anchor="start">Claude</Label><Label x={470} y={284} anchor="start">other</Label>
    <Label x={267} y={291}>model + harness</Label><Label x={267} y={311}>cost / speed / task fit</Label>
  </>;
  if (slug === "hyprlander") return <>
    <Label x={280} y={122}>“make my desktop more minimalist”</Label>
    <g className={styles.coverLines}><path d="M280 140v30m-5-7 5 7 5-7" /><rect x="104" y="181" width="95" height="47" /><rect x="232" y="181" width="95" height="47" /><rect x="360" y="181" width="95" height="47" /><path d="M199 205h33m-7-5 7 5-7 5M327 205h33m-7-5 7 5-7 5M408 238v54H152v-54" /></g>
    <Label x={152} y={210}>reason</Label><Label x={280} y={210} accent>act</Label><Label x={408} y={210}>observe</Label>
    <Label x={280} y={280}>repeat</Label><path stroke="var(--redline)" d="M280 302v25m-5-7 5 7 5-7" /><Label x={280} y={355} accent>Hyprland configuration</Label>
  </>;
  return <>
    <g className={styles.coverLines}><rect x="75" y="155" width="92" height="124" /><path d="M87 168h68v25H87Zm0 37h31v26H87Zm39 0h29v26h-29Zm-39 39h68v21H87ZM178 216h32m-7-5 7 5-7 5" /><rect x="210" y="182" width="66" height="67" /><rect x="301" y="182" width="66" height="67" /><path d="M276 216h25m-7-5 7 5-7 5M367 216h32m-7-5 7 5-7 5" /></g>
    <Label x={243} y={211}>image</Label><Label x={243} y={229}>encoder</Label><Label x={334} y={211}>code</Label><Label x={334} y={229}>decoder</Label>
    <Label x={233} y={278}>Inception V3</Label><Label x={344} y={298}>LSTM</Label><path stroke="var(--redline)" d="m431 182-22 34 22 34m33-68 22 34-22 34m-13-72-12 76" />
    <Label x={121} y={314}>screenshot</Label><Label x={449} y={314} accent>Dart code</Label>
  </>;
}

export function ProjectCover({ project }: { project: Pick<Project, "slug" | "name" | "stack"> }) {
  const concept = concepts[project.slug];
  return <figure className={styles.cover} role="img" aria-label={`${project.name}: ${descriptions[project.slug] || project.name}`}>
    <span className={styles.coverTitle} aria-hidden>{concept?.outcome}</span>
    <svg viewBox="0 0 560 420" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><Artwork slug={project.slug} /></svg>
    <span className={styles.coverStack} aria-hidden>{concept?.input} <span>→</span> {concept?.output}</span>
  </figure>;
}
