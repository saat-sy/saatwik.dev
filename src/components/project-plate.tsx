import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { MetricDrawing } from "@/components/drafting/dimension";
import { Plot } from "@/components/drafting/plot";
import { projectPeriod, type Project } from "@/content/site";
import { fitHeading } from "@/lib/fit-heading";

/** A project as a drawing plate: name at display scale, numbers drawn to measure. */
export function ProjectPlate({ project, headingLevel = 3 }: { project: Project; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <Plot className="grid gap-8 py-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_auto] lg:items-end lg:gap-12">
      <div>
        <p className="lettering flex items-center gap-2 text-ink-faint">
          {project.status === "building" ? (
            <>
              <span className="size-1.5 rounded-full bg-redline" aria-hidden />
              <span className="text-redline">In progress</span>
              <span aria-hidden>/</span>
            </>
          ) : null}
          {projectPeriod(project)}
        </p>
        <Heading
          style={fitHeading(project.name, 0.38)}
          className="mt-2 font-display font-semibold uppercase leading-[0.9] [--h-base:3.75rem] sm:[--h-base:4.5rem] lg:[--h-base:6rem] text-[length:min(var(--h-base),var(--fit-narrow))] lg:text-[length:min(var(--h-base),var(--fit-wide))]"
        >
          {project.name}
        </Heading>
        <p className="mt-3 text-lg text-ink">{project.kind}</p>
        <p className="mt-2 max-w-[48ch] text-ink-soft">{project.summary}</p>
      </div>
      <div className="grid gap-6">
        {project.metrics.slice(0, 2).map((metric) => (
          <MetricDrawing key={metric.label} metric={metric} />
        ))}
      </div>
      <Link
        href={`/projects/${project.slug}`}
        className="group inline-flex items-center gap-2 self-start border border-ink px-4 py-3 font-display text-lg font-semibold uppercase tracking-[0.02em] transition-colors duration-200 hover:bg-ink hover:text-sheet active:translate-y-px lg:self-end"
      >
        Case study
        <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
        <span className="sr-only">: {project.name}</span>
      </Link>
    </Plot>
  );
}
