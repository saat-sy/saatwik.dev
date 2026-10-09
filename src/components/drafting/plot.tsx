"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { usePlot } from "./use-plot";

/** Client wrapper that plots any drafted markup inside it. */
export function Plot({
  children,
  className,
  style,
  trigger = "scroll",
  duration,
  stagger,
  delay,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  trigger?: "load" | "scroll";
  duration?: number;
  stagger?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  usePlot(ref, { trigger, duration, stagger, delay });
  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
