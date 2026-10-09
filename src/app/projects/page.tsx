import type { Metadata } from "next";
import { ProjectDirectory } from "@/components/projects/project-directory";
import styles from "@/components/projects/projects.module.css";
import { projects } from "@/content/site";

export const metadata: Metadata = {
  title: "Projects",
  description: "What I'm building now, what I've shipped, and the archive.",
};

export default function ProjectsPage() {
  return (
    <div className={`black-sheet ${styles.page}`}>
      <div className={styles.sheet}>
        <header className={styles.intro}>
          <h1>projects<span aria-hidden>_</span></h1>
          <p>What I&apos;m building now, what I&apos;ve shipped, and the experiments along the way.</p>
        </header>
        <ProjectDirectory projects={projects} />
      </div>
    </div>
  );
}
