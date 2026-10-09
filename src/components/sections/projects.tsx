import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { ProjectPlate } from "@/components/project-plate";
import { projects } from "@/content/site";

// Featured projects on the home page; the full list lives at /projects.

export function Projects() {
  const featured = projects.filter((p) => p.featured);
  return (
    <section id="projects" aria-labelledby="projects-title" className="mx-auto max-w-(--sheet-max) px-(--gutter) py-24">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <h2 id="projects-title" className="font-display text-5xl font-semibold uppercase sm:text-6xl">
          Projects
        </h2>
        <Link href="/projects" className="group lettering inline-flex items-center gap-2 text-ink-soft hover:text-ink sm:text-[0.8125rem]">
          All projects, including archive
          <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
        </Link>
      </div>
      <ol className="border-t border-ink">
        {featured.map((project) => (
          <li key={project.slug} className="border-b border-rule">
            <ProjectPlate project={project} />
          </li>
        ))}
      </ol>
    </section>
  );
}
