import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { projectPeriod, type Project } from "@/content/site";
import { ProjectCover } from "./project-cover";
import styles from "./projects.module.css";

/** A project as a record sleeve: its cover diagram, then name, summary and period. The whole sleeve is the link. */
export function ProjectSleeve({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className={styles.sleeveLink}>
      <ProjectCover project={project} />
      <div className={styles.sleeveCaption}>
        <div className={styles.rowTitle}><h3>{project.name}</h3><ArrowUpRight size={18} aria-hidden /></div>
        <p>{project.summary}</p>
        <span className={styles.sleevePeriod}>{projectPeriod(project)}</span>
      </div>
    </Link>
  );
}
