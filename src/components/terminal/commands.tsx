import Link from "next/link";
import type { ReactNode } from "react";
import { experience, leadership, person, projects, type Role } from "@/content/site";

// What the hero terminal understands. Every answer comes from the site's facts.

const roles: Role[] = [...leadership, ...experience];

type Entry = { slug: string; name: string; href: string; line: string; metric: string; kind: "role" | "project" };

const entries: Entry[] = [
  ...roles.map<Entry>((r) => ({
    slug: r.slug,
    name: r.org,
    href: `/#station-${r.slug}`,
    line: r.points[0],
    metric: r.metrics[0].before
      ? `${r.metrics[0].label}: ${r.metrics[0].before.display} -> ${r.metrics[0].after.display}`
      : `${r.metrics[0].label}: ${r.metrics[0].after.display}`,
    kind: "role",
  })),
  ...projects.map<Entry>((p) => ({
    slug: p.slug,
    name: p.name,
    href: `/projects/${p.slug}`,
    line: p.points[0],
    metric: `${p.metrics[0].label}: ${p.metrics[0].after.display}`,
    kind: "project",
  })),
];

const commandNames = ["help", "whoami", "ls", "cat", "open", "contact", "status", "clear", "sudo hire-me"];
const slugs = ["status.txt", ...entries.map((e) => e.slug)];

type Effect = { navigate?: string; clear?: boolean };
type Result = { output: ReactNode; effect?: Effect };

const Muted = ({ children }: { children: ReactNode }) => <span className="text-ink-faint">{children}</span>;
const Red = ({ children }: { children: ReactNode }) => <span className="text-redline">{children}</span>;

function Listing({ kind }: { kind?: "role" | "project" }) {
  const show = (k: "role" | "project", label: string) => (
    <div>
      <Muted>{label}/</Muted>
      <ul className="flex flex-wrap gap-x-6">
        {entries
          .filter((e) => e.kind === k)
          .map((e) => (
            <li key={e.slug}>
              <Link href={e.href} className="underline decoration-ink-faint underline-offset-4 hover:text-redline hover:decoration-redline">
                {e.slug}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
  return (
    <div className="space-y-2">
      {kind ? null : <p>status.txt</p>}
      {kind !== "project" ? show("role", "work") : null}
      {kind !== "role" ? show("project", "projects") : null}
    </div>
  );
}

/** The one place availability is stated: revealed on request, in redline. */
function Status() {
  return (
    <span className="bg-redline px-1.5 py-0.5 text-sheet">
      {person.availability.toLowerCase()}. based in {person.location.toLowerCase()}.
    </span>
  );
}

export function run(input: string): Result {
  const [cmd, ...args] = input.trim().split(/\s+/);
  const arg = args.join(" ").toLowerCase();
  switch (cmd?.toLowerCase()) {
    case "":
    case undefined:
      return { output: null };
    case "help":
      return {
        output: (
          <ul className="grid gap-x-6 sm:grid-cols-[auto_1fr]">
            {[
              ["whoami", "who this is"],
              ["ls [work|projects]", "what I've worked on"],
              ["cat <name>", "details and the number that matters"],
              ["open <name>", "go to it"],
              ["cat status.txt", "what I'm looking for"],
              ["contact", "how to reach me"],
              ["clear", "clear the screen"],
            ].map(([c, d]) => (
              <li key={c} className="contents">
                <span>{c}</span>
                <Muted>{d}</Muted>
              </li>
            ))}
          </ul>
        ),
      };
    case "whoami":
      return { output: <span>{person.name.toLowerCase()}. {person.tagline.toLowerCase()}</span> };
    case "ls":
      return { output: <Listing kind={arg.startsWith("proj") ? "project" : arg.startsWith("work") ? "role" : undefined} /> };
    case "cat":
      if (arg === "status.txt" || arg === "status") return { output: <Status /> };
    // falls through
    case "open": {
      const entry = entries.find((e) => e.slug === arg || e.name.toLowerCase() === arg);
      if (!arg) return { output: <Muted>usage: {cmd} &lt;name&gt;. try: ls</Muted> };
      if (!entry) return { output: <Muted>{cmd}: {arg}: no such file. try: ls</Muted> };
      if (cmd === "open") return { output: <Muted>opening {entry.slug}...</Muted>, effect: { navigate: entry.href } };
      return {
        output: (
          <div className="space-y-1">
            <p className="max-w-[70ch] text-ink-soft">{entry.line}</p>
            <Red>{entry.metric}</Red>
          </div>
        ),
      };
    }
    case "status":
      return { output: <Status /> };
    case "contact":
      return {
        output: (
          <span>
            <a href={`mailto:${person.email}`} className="underline decoration-ink-faint underline-offset-4 hover:text-redline">
              {person.email}
            </a>{" "}
            <Muted>(details below)</Muted>
          </span>
        ),
        effect: { navigate: "#contact" },
      };
    case "sudo":
      if (arg === "hire-me" || arg === "hire me") {
        return { output: <Red>permission granted. taking you to contact...</Red>, effect: { navigate: "#contact" } };
      }
      return { output: <Muted>nice try.</Muted> };
    case "clear":
      return { output: null, effect: { clear: true } };
    default:
      return { output: <Muted>command not found: {cmd}. try: help</Muted> };
  }
}

/** Completes the last word against commands or names. */
export function complete(input: string) {
  const parts = input.split(" ");
  const pool = parts.length > 1 ? slugs : commandNames;
  const last = parts[parts.length - 1].toLowerCase();
  if (!last) return input;
  const hits = pool.filter((p) => p.startsWith(last));
  if (hits.length !== 1) return input;
  parts[parts.length - 1] = hits[0];
  return parts.join(" ") + (parts.length > 1 ? "" : " ");
}
