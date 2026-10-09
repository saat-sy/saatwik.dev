"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Each navigation eases the new page in. The first load is left alone so the
// server-rendered page is never hidden.

let firstRender = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (firstRender) {
        firstRender = false;
        return;
      }
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(ref.current, { autoAlpha: 0, y: 18, duration: 0.55, ease: "expo.out", clearProps: "all" });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
