import type { Metadata } from "next";
import { Prose } from "@/components/prose";
import { developerSections, developersIntro } from "@/lib/developers";
import styles from "./developers.module.css";

export const metadata: Metadata = {
  title: "API docs",
  description: "The saatwik.dev API: endpoints, versioning, rate limits, errors and the command line tool.",
};

export default function DevelopersPage() {
  return (
    <div className={`black-sheet ${styles.page}`}>
      <div className={styles.sheet}>
        <header className={styles.intro}>
          <h1>developers<span aria-hidden>_</span></h1>
          <p>{developersIntro}</p>
        </header>

        <div className={styles.docs}>
          {developerSections().map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph, i) => (
                <p key={i}>
                  <Prose paragraph={paragraph} />
                </p>
              ))}
              {section.code ? <pre tabIndex={0}><code>{section.code}</code></pre> : null}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
