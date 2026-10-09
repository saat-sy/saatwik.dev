import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Construction } from "@/components/construction";
import { MetricDrawing } from "@/components/drafting/dimension";
import { FlowDiagram } from "@/components/drafting/flow-diagram";
import { Plot } from "@/components/drafting/plot";
import { ModelFigure } from "@/components/work-scene/model-figure";
import { diagrams } from "@/content/diagrams";
import { formatRange, projects } from "@/content/site";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return project ? { title: project.name, description: project.summary } : {};
}

const statusLabel = { building: "In progress", shipped: "Shipped", archived: "Archived" } as const;
const caseStudyPlaceholderSections = ["Why I built it", "The hard part", "Decisions", "What I learned"];

function Spec({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-rule px-5 py-4 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <dt className="lettering text-ink-faint">{term}</dt>
      <dd className="mt-1.5">{children}</dd>
    </div>
  );
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const diagram = diagrams[project.slug];
  const caseStudy = project.caseStudy ?? caseStudyPlaceholderSections.map((heading) => ({ heading, body: "" }));

  return (
    <article className="mx-auto max-w-(--sheet-max) px-(--gutter) pb-24 pt-10">
      <Link href="/projects" className="lettering inline-flex items-center gap-2 text-ink-soft hover:text-ink sm:text-[0.8125rem]">
        <ArrowLeft size={14} aria-hidden /> All projects
      </Link>

      <header className="mt-8 grid items-center gap-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)]">
        <div>
          <h1 className="font-display text-7xl font-semibold uppercase leading-[0.88] sm:text-8xl xl:text-[10rem]">{project.name}</h1>
          <p className="mt-6 text-xl text-ink sm:text-2xl">{project.kind}</p>
          <p className="mt-2 max-w-[48ch] text-lg text-ink-soft">{project.summary}</p>
        </div>
        <ModelFigure slug={project.slug} label={`3D line drawing representing ${project.name}`} className="aspect-square w-full max-lg:max-h-[60vh]" />
      </header>

      <dl className="mt-10 grid border border-ink sm:grid-cols-[auto_auto_minmax(0,1fr)]">
        <Spec term="Status">
          <span className={`font-display text-xl font-semibold uppercase ${project.status === "building" ? "text-redline" : ""}`}>
            {statusLabel[project.status]}
          </span>
        </Spec>
        <Spec term="Period">
          <span className="font-display text-xl font-semibold uppercase">{formatRange(project.start, project.end)}</span>
        </Spec>
        <Spec term="Built with">
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((tool) => (
              <li key={tool} className="lettering border border-rule px-2.5 py-1 text-ink sm:text-[0.8125rem]">
                {tool}
              </li>
            ))}
          </ul>
        </Spec>
      </dl>

      <section aria-label="By the numbers" className="mt-20">
        <Plot className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {project.metrics.map((metric) => (
            <MetricDrawing key={metric.label} metric={metric} />
          ))}
        </Plot>
      </section>

      {diagram ? (
        <section aria-label="How it works" className="mt-24 border-t border-rule pt-12">
          <FlowDiagram diagram={diagram} />
        </section>
      ) : null}

      <div className="mt-24 grid gap-x-14 gap-y-10 border-t border-rule pt-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,8fr)]">
        <h2 className="font-display text-3xl font-semibold uppercase">What it does</h2>
        <ul className="max-w-[68ch] list-[square] space-y-3 pl-5 text-lg text-ink-soft marker:text-redline">
          {project.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        {caseStudy.map((section) => (
          <section key={section.heading} className="contents">
            <h2 className="font-display text-3xl font-semibold uppercase">{section.heading}</h2>
            <div className="max-w-[68ch]">
              {section.body ? <p className="text-lg text-ink-soft">{section.body}</p> : <Construction note="case study copy" lines={2} />}
            </div>
          </section>
        ))}
      </div>

      <Link href={`/projects/${next.slug}`} className="group mt-24 flex items-end justify-between gap-6 border-t border-ink pt-6">
        <span>
          <span className="lettering block text-ink-faint">Next project</span>
          <span className="font-display text-5xl font-semibold uppercase leading-none group-hover:text-redline sm:text-6xl">{next.name}</span>
        </span>
        <ArrowRight size={32} className="mb-2 shrink-0 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
      </Link>
    </article>
  );
}
