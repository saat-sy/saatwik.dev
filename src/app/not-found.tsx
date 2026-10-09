import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { MissingPath } from "./missing-path";
import styles from "./not-found.module.css";

const destinations = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <div className={`black-sheet ${styles.page}`}>
      <div className={styles.sheet}>
        <header className={styles.intro}>
          <h1>404<span aria-hidden>_</span></h1>
          <p>Nothing lives at this address. The link may be old or mistyped.</p>
        </header>

        <MissingPath className={styles.path} />

        <ul className={styles.links}>
          {destinations.map((d) => (
            <li key={d.href}>
              <Link href={d.href}>{d.label} <ArrowRight size={16} aria-hidden /></Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
