"use client";

import { useRef, useState } from "react";
import { ContactShort } from "@/components/contact";
import { MetricDrawing } from "@/components/drafting/dimension";
import { experience, formatRange, leadership } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import home from "./home.module.css";
import { RoleCovers } from "./role-covers";
import styles from "./work.module.css";

// Survey alignment: one line surveyed through time, a station per role with
// its chainage (the start date). The line is plotted by scroll, and the pinned
// figure beside it slides to each role's drafted sleeve as its station arrives.

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
          start: "top 60%",
          onEnter: () => setActive(el.dataset.station!),
          onLeaveBack: () => {
            const index = roles.findIndex((role) => role.slug === el.dataset.station);
            setActive(roles[Math.max(0, index - 1)].slug);
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
    <section ref={ref} id="work" aria-labelledby="work-title" className={`mx-auto max-w-(--sheet-max) px-(--gutter) py-24 ${styles.work}`}>
      <div className={home.head}>
        <h2 id="work-title">work<span aria-hidden>_</span></h2>
      </div>
      <div className={styles.layout}>
        <div className={styles.stagePanel}>
          <RoleCovers roles={roles} active={active} />
          <nav className={styles.map} aria-label="Work map">
            <ol>{roles.map((role) => <li key={role.slug}>
              <a href={`#station-${role.slug}`} aria-current={role.slug === active ? "step" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  setActive(role.slug);
                  window.history.replaceState(null, "", `#station-${role.slug}`);
                  const target = document.getElementById(`station-${role.slug}`);
                  const offset = window.matchMedia("(max-width: 767px)").matches ? (ref.current?.querySelector<HTMLElement>(`.${styles.stagePanel}`)?.offsetHeight ?? 0) + 80 : 112;
                  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                  if (target) gsap.to(window, { scrollTo: { y: target, offsetY: offset }, duration: reduce ? 0 : 0.65, ease: "expo.out", onComplete: () => setActive(role.slug) });
                }}>
                <span className={styles.mapStation} aria-hidden />
                <span>{role.org}</span><time dateTime={role.start}>{role.start.slice(0, 4)}</time>
              </a>
            </li>)}</ol>
          </nav>
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
                  className={`relative flex flex-col justify-center gap-5 ${styles.station}`}
                >
                  <span
                    className={`absolute -left-10 top-1/2 size-3 -translate-x-[calc(50%-0.75rem-0.5px)] -translate-y-1/2 rotate-45 border-2 transition-colors duration-300 sm:-left-14 sm:-translate-x-[calc(50%-1.25rem-0.5px)] ${on ? "border-redline bg-redline" : "border-ink-faint bg-sheet"}`}
                    aria-hidden
                  />
                  <div data-reveal>
                    <h3>{role.org}</h3>
                    <p className="mt-1 text-ink">{role.title}</p>
                    <p className="lettering mt-1 text-ink-faint">
                      {formatRange(role.start, role.end)}, {role.place}
                    </p>
                  </div>
                  <ul data-reveal className="max-w-[65ch] list-[square] space-y-3 pl-5 text-base text-ink-soft marker:text-ink-faint">
                    {role.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <div data-reveal className="grid max-w-xl gap-6 sm:grid-cols-2">
                    {role.metrics.slice(0, 2).map((m) => (
                      <MetricDrawing key={m.label} metric={m} />
                    ))}
                  </div>
                  <ul className={styles.stack} aria-label="Technologies used">{role.stack.map((tool) => <li key={tool}>{tool}</li>)}</ul>
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
