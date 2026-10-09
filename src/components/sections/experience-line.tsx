"use client";

import { useRef, useState } from "react";
import { ContactShort } from "@/components/contact";
import { MetricDrawing } from "@/components/drafting/dimension";
import { RoleStage } from "@/components/work-scene/role-stage";
import { experience, formatRange, leadership } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

// Survey alignment: one line surveyed through time, a station per role with
// its chainage (the start date). The line is plotted by scroll, and the pinned
// stage beside it swaps to each role's 3D model as its station arrives.

const roles = [...leadership, ...experience];

export function ExperienceLine() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(roles[0].slug);

  useGSAP(
    () => {
      // Which station is current is state, not motion: it tracks for everyone.
      gsap.utils.toArray<HTMLElement>("[data-station]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setActive(el.dataset.station!);
          },
        });
      });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-alignment]", {
          drawSVG: 0,
          ease: "none",
          scrollTrigger: { trigger: "[data-track]", start: "top 55%", end: "bottom 55%", scrub: 0.6 },
        });
        gsap.utils.toArray<HTMLElement>("[data-station]").forEach((el) => {
          gsap.from(el.querySelectorAll("[data-reveal]"), {
            autoAlpha: 0,
            y: 12,
            duration: 0.7,
            stagger: 0.08,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 70%" },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="work" aria-labelledby="work-title" className="mx-auto max-w-(--sheet-max) px-(--gutter) py-24">
      <h2 id="work-title" className="mb-10 font-display text-5xl font-semibold uppercase sm:text-6xl">
        Work
      </h2>
      <div className="grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-14">
        <div className="sticky top-16 z-(--z-content) -mx-(--gutter) h-[36dvh] self-start bg-sheet px-(--gutter) pb-3 md:top-24 md:mx-0 md:h-[min(34rem,calc(100dvh-8rem))] md:px-0 md:pb-0">
          <RoleStage roles={roles} active={active} />
        </div>

        <div data-track className="relative pl-10 sm:pl-14">
          <svg className="absolute inset-y-0 left-3 h-full w-px overflow-visible sm:left-5" aria-hidden>
            <line x1="0" y1="0" x2="0" y2="100%" className="stroke-ink-faint" strokeDasharray="2 4" />
            <line x1="0" y1="0" x2="0" y2="100%" data-alignment className="stroke-ink" strokeWidth={2} />
          </svg>
          <ol>
            {roles.map((role) => {
              const on = role.slug === active;
              return (
                <li
                  key={role.slug}
                  id={`station-${role.slug}`}
                  data-station={role.slug}
                  className="relative flex min-h-[64dvh] flex-col justify-center gap-4 py-12 md:min-h-[78dvh]"
                >
                  <span
                    className={`absolute -left-10 top-1/2 size-3 -translate-x-[calc(50%-0.75rem-0.5px)] -translate-y-1/2 rotate-45 border-2 transition-colors duration-300 sm:-left-14 sm:-translate-x-[calc(50%-1.25rem-0.5px)] ${on ? "border-redline bg-redline" : "border-ink-faint bg-sheet"}`}
                    aria-hidden
                  />
                  <div data-reveal>
                    <h3 className="font-display text-4xl font-semibold uppercase leading-none sm:text-5xl">{role.org}</h3>
                    <p className="mt-1 text-ink">{role.title}</p>
                    <p className="lettering mt-1 text-ink-faint">
                      {formatRange(role.start, role.end)}, {role.place}
                    </p>
                  </div>
                  <ul data-reveal className="max-w-[60ch] list-[square] space-y-2 pl-5 text-[0.9375rem] text-ink-soft marker:text-ink-faint">
                    {role.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <div data-reveal className="grid max-w-xl gap-6 sm:grid-cols-2">
                    {role.metrics.slice(0, 2).map((m) => (
                      <MetricDrawing key={m.label} metric={m} />
                    ))}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
      <ContactShort />
    </section>
  );
}
