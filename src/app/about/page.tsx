import type { Metadata } from "next";
import { Prose } from "@/components/prose";
import { aboutParagraphs } from "@/content/pages";
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
            {aboutParagraphs.map((paragraph, i) => (
              <p key={i} className={i === 0 ? styles.lead : undefined}>
                <Prose paragraph={paragraph} />
              </p>
            ))}
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
