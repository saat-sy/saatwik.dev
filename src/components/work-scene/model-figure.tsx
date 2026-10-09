"use client";

import dynamic from "next/dynamic";
import { useMedia, useWebGL } from "@/lib/media";

const Viewer = dynamic(() => import("./viewer"), { ssr: false, loading: () => null });

function Corner({ className }: { className: string }) {
  return <span className={`absolute size-5 border-ink-faint ${className}`} aria-hidden />;
}

/** A project's 3D model as the figure on its case-study sheet, framed by corner marks. */
export function ModelFigure({ slug, label, className = "" }: { slug: string; label: string; className?: string }) {
  const still = useMedia("(prefers-reduced-motion: reduce)");
  const touch = useMedia("(pointer: coarse)");
  const webgl = useWebGL();
  return (
    <figure className={`relative ${className}`} role="img" aria-label={label}>
      <Corner className="left-0 top-0 border-l border-t" />
      <Corner className="right-0 top-0 border-r border-t" />
      <Corner className="bottom-0 left-0 border-b border-l" />
      <Corner className="bottom-0 right-0 border-b border-r" />
      {webgl ? <Viewer slug={slug} still={still} touch={touch} /> : null}
    </figure>
  );
}
