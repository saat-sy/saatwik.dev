"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

type PlotOptions = {
  /** "load" plots immediately; "scroll" plots when the drawing enters view. */
  trigger?: "load" | "scroll";
  duration?: number;
  stagger?: number;
  delay?: number;
};

/**
 * Plots a drawing the way a pen plotter would: every `[data-plot]` stroke draws
 * itself in document order, then `[data-plot-fade]` labels settle in. Without
 * motion preference the drawing is simply shown complete.
 */
export function usePlot(scope: RefObject<HTMLElement | SVGElement | null>, options: PlotOptions = {}) {
  const { trigger = "scroll", duration = 1.1, stagger = 0.06, delay = 0 } = options;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // DrawSVG drives stroke-dasharray, so dashed strokes fade in instead.
        const all = gsap.utils.toArray<SVGGeometryElement>("[data-plot]");
        const dashed = all.filter((el) => el.hasAttribute("stroke-dasharray"));
        const strokes = all.filter((el) => !el.hasAttribute("stroke-dasharray"));
        const extents = gsap.utils.toArray<HTMLElement>("[data-extend]");
        const labels = gsap.utils.toArray<HTMLElement>("[data-plot-fade]");
        const tl = gsap.timeline({
          delay,
          paused: trigger === "scroll",
          defaults: { ease: "power2.inOut" },
        });
        if (strokes.length) tl.from(strokes, { drawSVG: 0, duration, stagger });
        if (dashed.length) tl.from(dashed, { autoAlpha: 0, duration: 0.6, stagger: 0.05 }, "-=0.6");
        // Dimension lines extend from their origin to measure the value.
        if (extents.length) {
          tl.from(
            extents,
            { scaleX: 0, transformOrigin: "left center", duration: 0.9, stagger: 0.12, ease: "expo.out" },
            strokes.length ? "-=0.6" : 0,
          );
        }
        if (labels.length) {
          tl.from(labels, { autoAlpha: 0, y: 6, duration: 0.5, stagger: 0.05, ease: "expo.out" }, "-=0.5");
        }
        if (trigger === "scroll" && scope.current) {
          ScrollTrigger.create({
            trigger: scope.current,
            start: "top 80%",
            once: true,
            onEnter: () => tl.play(),
          });
        }
      });
      return () => mm.revert();
    },
    { scope },
  );
}
