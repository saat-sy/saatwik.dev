import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import { ProjectPlate } from "@/components/project-plate";
import { projectNotes, projects, type ProjectNote } from "@/content/site";

export const metadata: Metadata = {
  title: "Projects",
  description: "What I'm building now, what I've shipped, and the archive.",
};

function NoteRow({ note }: { note: ProjectNote }) {
  const body = (
    <>
      <span className="lettering pt-1 text-ink-faint">{note.period}</span>
      <span className="font-display text-2xl font-semibold uppercase leading-tight">
        {note.name}
        {note.href ? <ArrowUpRight size={16} className="ml-1 inline align-baseline" aria-hidden /> : null}
      </span>
      <span className="text-ink-soft">{note.summary}</span>
      <span className="lettering text-ink-faint sm:text-right">{note.stack.join(", ")}</span>
    </>
  );
  const grid = "grid gap-1 py-5 sm:grid-cols-[5rem_minmax(0,14rem)_minmax(0,1fr)_auto] sm:items-baseline sm:gap-6";
  if (note.placeholder) {
    return (
      <li className={`${grid} border-b border-dashed border-ink-faint text-ink-faint`}>
        <span className="sr-only">Placeholder entry.</span>
        {body}
      </li>
    );
  }
  return (
    <li className="border-b border-rule">
      {note.href ? (
        <a href={note.href} rel="noopener" className={`${grid} hover:text-redline`}>
          {body}
        </a>
      ) : (
        <div className={grid}>{body}</div>
      )}
    </li>
  );
}

function Group({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-20">
      <h2 id={id} className="font-display text-4xl font-semibold uppercase sm:text-5xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function ProjectsPage() {
  const building = projects.filter((p) => p.status === "building");
  const shipped = projects.filter((p) => p.status === "shipped");
  const buildingNotes = projectNotes.filter((n) => n.status === "building");
  const archive = projectNotes.filter((n) => n.status === "archived");

  return (
    <div className="mx-auto max-w-(--sheet-max) px-(--gutter) pb-24 pt-16">
      <h1 className="font-display text-7xl font-semibold uppercase leading-[0.9] sm:text-8xl">Projects</h1>

      <Group id="building" title="Building now">
        <ol className="mt-8 border-t border-ink">
          {building.map((p) => (
            <li key={p.slug} className="border-b border-rule">
              <ProjectPlate project={p} />
            </li>
          ))}
        </ol>
        {buildingNotes.length ? <ul className="mt-2">{buildingNotes.map((n, i) => <NoteRow key={i} note={n} />)}</ul> : null}
      </Group>

      <Group id="shipped" title="Shipped">
        <ol className="mt-8 border-t border-ink">
          {shipped.map((p) => (
            <li key={p.slug} className="border-b border-rule">
              <ProjectPlate project={p} />
            </li>
          ))}
        </ol>
      </Group>

      <Group id="archive" title="Archive">
        <p className="mt-3 max-w-[56ch] text-ink-soft">Earlier and smaller work, kept on record.</p>
        <ul className="mt-6 border-t border-ink">
          {archive.map((n, i) => (
            <NoteRow key={i} note={n} />
          ))}
        </ul>
      </Group>
    </div>
  );
}
