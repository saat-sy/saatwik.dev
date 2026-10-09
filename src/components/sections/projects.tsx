import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { ProjectSleeve } from "@/components/projects/project-sleeve";
import sleeves from "@/components/projects/projects.module.css";
import { projects } from "@/content/site";
import styles from "./home.module.css";

// Featured projects on the home page; the full list lives at /projects.

export function Projects() {
  const featured = projects.filter((p) => p.featured);
  return (
    <section id="projects" aria-labelledby="projects-title" className="mx-auto max-w-(--sheet-max) px-(--gutter) py-24">
      <div className={styles.head}>
        <h2 id="projects-title">projects<span aria-hidden>_</span></h2>
        <Link href="/projects" className={styles.more}>
          All projects, including archive
          <ArrowRight size={14} aria-hidden />
        </Link>
      </div>
      <ul className={sleeves.sleeves}>
        {featured.map((project) => (
          <li key={project.slug}>
            <ProjectSleeve project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}
