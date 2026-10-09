import { ExperienceLine } from "@/components/sections/experience-line";
import { LatestWriting } from "@/components/sections/latest-writing";
import { Projects } from "@/components/sections/projects";
import { TerminalHero } from "@/components/terminal/terminal-hero";

export default function Home() {
  return (
    <>
      <TerminalHero />
      <ExperienceLine />
      <Projects />
      <LatestWriting />
    </>
  );
}
