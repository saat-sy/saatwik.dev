import { ArrowLeft, ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProjectCover } from "@/components/projects/project-cover";
import styles from "@/components/projects/projects.module.css";
import { diagrams } from "@/content/diagrams";
import { projectPeriod, projects } from "@/content/site";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return project ? { title: project.name, description: project.summary } : {};
}

const statusLabel = { building: "In progress", shipped: "Shipped", archived: "Archived" } as const;

export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return <Suspense fallback={<div className={`black-sheet ${styles.page}`} aria-busy="true"><div className={styles.sheet}><p role="status">Loading project…</p></div></div>}><ProjectDetail params={params} /></Suspense>;
}

async function ProjectDetail({ params }: Pick<PageProps<"/projects/[slug]">, "params">) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const diagram = diagrams[project.slug];
  const chapters = [
    { id: "overview", heading: "What it does" },
    ...project.caseStudy.map((section, i) => ({ id: `chapter-${i + 1}`, heading: section.heading })),
    ...(diagram ? [{ id: "system", heading: "How it works" }] : []),
  ];

  return (
    <article className={`black-sheet ${styles.page}`}>
      <div className={styles.caseSheet}>
        <Link href="/projects" className={styles.back}><ArrowLeft size={14} aria-hidden /> All projects</Link>

        <header className={styles.caseHeader}>
          <div>
            <h1 className={styles.caseTitle}>{project.name}</h1>
            <p className={styles.caseKind}>{project.kind}</p>
            <p className={styles.caseSummary}>{project.summary}</p>
            <div className={styles.caseActions}>
              {project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.action}>Try the live app <ArrowUpRight size={16} aria-hidden /></a> : null}
              {project.repoUrl ? <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className={styles.action}>View the source <ArrowUpRight size={16} aria-hidden /></a> : null}
            </div>
          </div>
          <div className={styles.caseCover}><ProjectCover project={project} /></div>
        </header>

        <dl className={styles.specs}>
          <div><dt>Status</dt><dd><span className={project.status === "building" ? styles.status : undefined}>{statusLabel[project.status]}</span></dd></div>
          <div><dt>Period</dt><dd>{projectPeriod(project)}</dd></div>
          <div><dt>Built with</dt><dd><ul>{project.stack.length ? project.stack.map((tool) => <li key={tool}>{tool}</li>) : <li>Not chosen yet</li>}</ul></dd></div>
        </dl>

        <div className={styles.caseBody}>
          <nav className={styles.chapterNav} aria-label="Project chapters">
            <p>In this project</p>
            <ul>{chapters.map((chapter) => <li key={chapter.id}><a href={`#${chapter.id}`}>{chapter.heading}</a></li>)}</ul>
          </nav>
          <div className={styles.caseContent}>
            <section id="overview" className={styles.caseSection}>
              <h2>What it does</h2>
              <ul className={styles.pointList}>{project.points.map((point) => <li key={point}><span>{point}</span></li>)}</ul>
            </section>
            {project.caseStudy.map((section, i) => (
              <section key={section.heading} id={`chapter-${i + 1}`} className={styles.caseSection}>
                <h2>{section.heading}</h2>
                <p>{section.body}</p>
              </section>
            ))}
            {diagram ? <section id="system" className={styles.caseSection}>
              <h2>How it works</h2>
              <ol className={styles.pipeline} aria-label={diagram.title}>
                {diagram.steps.map((step, i) => <li key={step.label}>
                  <span className={styles.pipelineMark} aria-hidden />
                  <div><h3>{step.label}</h3>{step.note ? <p>{step.note}</p> : null}{diagram.links[i]?.label ? <small>{diagram.links[i].label}</small> : null}</div>
                </li>)}
              </ol>
              {diagram.footnote ? <p className={styles.footnote}>{diagram.footnote}</p> : null}
            </section> : null}
            <Link href={`/projects/${next.slug}`} className={styles.next}>
              <span><span className={styles.nextLabel}>Next project</span><strong>{next.name}</strong></span><ArrowRight size={24} aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
