"use client";

import dynamic from "next/dynamic";
import { useIdle, useMedia, useWebGL } from "@/lib/media";

const BackdropCanvas = dynamic(() => import("./backdrop-canvas"), { ssr: false, loading: () => null });

/** Decorative layer fixed behind all content; never interactive. Loads once the page is idle. */
export function Backdrop() {
  const still = useMedia("(prefers-reduced-motion: reduce)");
  const webgl = useWebGL();
  const idle = useIdle();
  if (!webgl || !idle) return null;
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 blur-[3px]" aria-hidden>
      <BackdropCanvas still={still} />
    </div>
  );
}
