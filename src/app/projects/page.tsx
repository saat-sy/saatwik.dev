import type { Metadata } from "next";
import { ProjectPlate } from "@/components/project-plate";
import { projects, type Project } from "@/content/site";

export const metadata: Metadata = {
  title: "Projects",
  description: "What I'm building now, what I've shipped, and the archive.",
};

function Group({ id, title, intro, projects: items }: { id: string; title: string; intro?: string; projects: Project[] }) {
  return (
    <section aria-labelledby={id} className="mt-20">
      <h2 id={id} className="font-display text-4xl font-semibold uppercase sm:text-5xl">
        {title}
      </h2>
      {intro ? <p className="mt-3 max-w-[56ch] text-ink-soft">{intro}</p> : null}
      <ol className="mt-8 border-t border-ink">
        {items.map((p) => (
          <li key={p.slug} className="border-b border-rule">
            <ProjectPlate project={p} />
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-(--sheet-max) px-(--gutter) pb-24 pt-16">
      <h1 className="font-display text-7xl font-semibold uppercase leading-[0.9] sm:text-8xl">Projects</h1>
      <Group id="building" title="Building now" projects={projects.filter((p) => p.status === "building")} />
      <Group id="shipped" title="Shipped" projects={projects.filter((p) => p.status === "shipped")} />
      <Group id="archive" title="Archive" intro="Earlier work, kept on record." projects={projects.filter((p) => p.status === "archived")} />
    </div>
  );
}
