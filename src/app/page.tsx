import { ExperienceLine } from "@/components/sections/experience-line";
import styles from "@/components/sections/home.module.css";
import { Projects } from "@/components/sections/projects";
import { TerminalHero } from "@/components/terminal/terminal-hero";

export default function Home() {
  return (
    <div className={`black-sheet ${styles.home}`}>
      <TerminalHero />
      <ExperienceLine />
      <Projects />
    </div>
  );
}
