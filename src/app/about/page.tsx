import type { Metadata } from "next";
import { Construction } from "@/components/construction";
import { education, formatRange, person } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${person.name}: ${person.tagline}`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-(--sheet-max) px-(--gutter) pb-24 pt-16">
      <h1 className="font-display text-7xl font-semibold uppercase leading-[0.9] sm:text-8xl">About</h1>

      <div className="mt-14 grid gap-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
        <div className="max-w-[68ch] space-y-6">
          <p className="text-2xl leading-snug text-ink">{person.tagline}</p>
          <Construction note="personal story" lines={3} />
        </div>

        <section aria-labelledby="education-title">
          <h2 id="education-title" className="font-display text-3xl font-semibold uppercase">
            Education
          </h2>
          <ol className="relative mt-8 space-y-10 border-l border-ink-faint pl-8">
            {education.map((item) => (
              <li key={item.school} className="relative">
                <span className="absolute -left-[2.4rem] top-1.5 size-3 rotate-45 border-2 border-redline bg-sheet" aria-hidden />
                <p className="lettering text-redline">{formatRange(item.start, item.end)}</p>
                <p className="mt-1 font-display text-2xl font-semibold uppercase leading-tight">{item.school}</p>
                <p className="text-ink-soft">{item.degree}</p>
                {item.note ? <p className="text-ink-soft">{item.note}</p> : null}
                <p className="lettering mt-1 text-ink-faint">{item.place}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
