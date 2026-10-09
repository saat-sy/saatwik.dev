import type { Metadata } from "next";
import Link from "next/link";
import { education, formatRange, person } from "@/content/site";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description: `About ${person.name}: ${person.tagline}`,
};

export default function AboutPage() {
  return (
    <div className={`black-sheet ${styles.page}`}>
      <div className={styles.sheet}>
        <header className={styles.intro}>
          <h1>about<span aria-hidden>_</span></h1>
        </header>

        <div className={styles.layout}>
          <div className={styles.story}>
            <p className={styles.lead}>
              I’m super interested in inference engineering. I like figuring out how to make models run well when the hardware is limited, the network is unpredictable and someone has to operate the thing once it is deployed.
            </p>
            <p>
              At Meta, I worked on the disaster recovery drain tests. I built an agent that automated planning six weeks of upcoming simulations, including which regions to drain. I also built a system that shared high-risk services with the team before each test.
            </p>
            <p>
              I then built an eval framework around those predictions. It compared them with the SEVs that actually came out of a drain, helped separate prediction misses from service onboarding gaps and gave the team a dashboard to look through past tests and individual incidents.
            </p>
            <p>
              Before Meta, I worked on AWS deployment infrastructure and CI/CD, built an LLM pipeline for inventory automation and contributed Kotlin and Android functionality to Pocket Paint through Google Summer of Code.
            </p>
            <p>
              Outside work, I maintain <Link href="/projects/dictate">Dictate</Link>, a native Android text-to-speech app with 90K+ installs.
            </p>
            <p>
              Right now I am building <Link href="/projects/everygpu">EveryGPU</Link>, a distributed inference experiment across remote GPUs.
            </p>
          </div>

          <section aria-labelledby="education-title">
            <h2 id="education-title" className={styles.label}>education</h2>
            <ol className={styles.education}>
              {education.map((item) => (
                <li key={item.school}>
                  <span className={styles.mark} aria-hidden />
                  <div>
                    <p className={`${styles.meta} ${styles.period}`}>{formatRange(item.start, item.end)}</p>
                    <h3>{item.school}</h3>
                    <p>{item.degree}</p>
                    {item.note ? <p>{item.note}</p> : null}
                    <span className={styles.meta}>{item.place}</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
