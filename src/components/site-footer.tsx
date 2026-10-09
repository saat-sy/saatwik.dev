import Link from "next/link";
import { person } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="bg-band font-plex text-band-muted">
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-4 border-t border-band-ink/15 px-10 py-8 text-sm">
        <p>© {person.name}</p>
        <ul className="flex gap-5">
          <li>
            <Link href="/about" className="hover:text-band-ink">
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-band-ink">
              Contact
            </Link>
          </li>
          <li>
            <Link href="/developers" className="hover:text-band-ink">
              Developers
            </Link>
          </li>
          <li>
            <Link href="/privacy" className="hover:text-band-ink">
              Privacy
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
