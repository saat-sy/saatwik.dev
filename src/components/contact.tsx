import { person } from "@/content/site";

// Contact band: flat near-black, off-white type, headline and email carry it.

const outlined =
  "inline-flex items-center gap-2 rounded-[4px] border border-band-ink px-5 py-3 text-base font-medium text-band-ink transition-colors duration-200 hover:bg-band-ink hover:text-band active:translate-y-px";

function Links() {
  return (
    <ul className="flex flex-wrap gap-3">
      <li>
        <a href={person.links.linkedin} rel="noopener" className={outlined}>
          LinkedIn <span aria-hidden>↗</span>
        </a>
      </li>
      <li>
        <a href={person.links.github} rel="noopener" className={outlined}>
          GitHub <span aria-hidden>↗</span>
        </a>
      </li>
    </ul>
  );
}

function Email({ className }: { className: string }) {
  return (
    <a
      href={`mailto:${person.email}`}
      className={`w-fit break-all font-medium text-band-ink underline decoration-band-ink decoration-2 underline-offset-[0.2em] hover:decoration-redline ${className}`}
    >
      {person.email}
    </a>
  );
}

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-band font-plex text-band-ink">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-6 px-10 py-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-band-muted">Contact</p>
        <h2 id="contact-title" className="text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
          Let&apos;s build something.
        </h2>
        <p className="max-w-[560px] text-lg text-band-ink/75">
          Always up for a conversation about systems, infrastructure, and the products built on them.
        </p>
        <Email className="text-[clamp(1.375rem,2.6vw,2rem)]" />
        <Links />
      </div>
    </section>
  );
}

/** The short form that closes the Work section. */
export function ContactShort() {
  return (
    <div className="mt-16 flex flex-col items-start gap-5 rounded-[4px] bg-band px-10 py-12 font-plex text-band-ink">
      <p className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-tight tracking-[-0.03em]">Have something in mind?</p>
      <Email className="text-[clamp(1.125rem,2vw,1.5rem)]" />
      <Links />
    </div>
  );
}
