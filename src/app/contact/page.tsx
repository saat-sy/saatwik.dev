import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import { person } from "@/content/site";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${person.name}.`,
};

export default function ContactPage() {
  return (
    <div className={`black-sheet ${styles.page}`}>
      <div className={styles.sheet}>
        <header className={styles.intro}>
          <h1>contact<span aria-hidden>_</span></h1>
          <p>Always up for a conversation about systems, infrastructure, and the products built on them.</p>
        </header>

        <a href={`mailto:${person.email}`} className={styles.email}>{person.email}</a>

        <ul className={styles.links}>
          <li>
            <a href={person.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={16} aria-hidden /></a>
          </li>
          <li>
            <a href={person.links.github} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={16} aria-hidden /></a>
          </li>
        </ul>

        <p className={styles.status}><span>*</span> {person.availability} · {person.location}</p>
      </div>
    </div>
  );
}
