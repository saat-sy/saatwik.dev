import type { Metadata } from "next";
import { Prose } from "@/components/prose";
import { privacyParagraphs, privacyUpdated } from "@/content/pages";
import styles from "./privacy.module.css";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What this site records about visitors, and what it does not.",
};

export default function PrivacyPage() {
  return (
    <div className={`black-sheet ${styles.page}`}>
      <div className={styles.sheet}>
        <header className={styles.intro}>
          <h1>privacy<span aria-hidden>_</span></h1>
          <p>What this site records about visitors, and what it does not.</p>
        </header>

        <div className={styles.story}>
          {privacyParagraphs.map((paragraph, i) => (
            <p key={i}>
              <Prose paragraph={paragraph} />
            </p>
          ))}
        </div>

        <p className={styles.updated}>Last updated <time dateTime={privacyUpdated}>{privacyUpdated}</time></p>
      </div>
    </div>
  );
}
