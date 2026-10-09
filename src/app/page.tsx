import { Contact } from "@/components/contact";
import { JsonLd } from "@/components/json-ld";
import { ExperienceLine } from "@/components/sections/experience-line";
import styles from "@/components/sections/home.module.css";
import { Projects } from "@/components/sections/projects";
import { TerminalHero } from "@/components/terminal/terminal-hero";
import { homeStructuredData } from "@/lib/structured-data";

export default function Home() {
  return (
    <div className={`black-sheet ${styles.home}`}>
      <JsonLd data={homeStructuredData()} />
      <TerminalHero />
      <ExperienceLine />
      <Projects />
      <Contact />
    </div>
  );
}
