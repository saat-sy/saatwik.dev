"use client";

import dynamic from "next/dynamic";
import { formatRange, type Role } from "@/content/site";
import { useRef } from "react";
import { useMedia, useNearViewport, useWebGL } from "@/lib/media";

const StageCanvas = dynamic(() => import("./role-stage-canvas"), { ssr: false, loading: () => null });

/**
 * The pinned figure beside the experience line: the active role's model and
 * its headline number. Purely illustrative; the stations carry the content.
 */
export function RoleStage({ roles, active }: { roles: Role[]; active: string }) {
  const still = useMedia("(prefers-reduced-motion: reduce)");
  const webgl = useWebGL();
  const box = useRef<HTMLDivElement>(null);
  const near = useNearViewport(box);
  const role = roles.find((r) => r.slug === active) ?? roles[0];
  const metric = role.metrics[0];

  return (
    <div ref={box} className="relative h-full border border-rule bg-sheet" aria-hidden>
      {webgl && near ? (
        <div className="absolute inset-0">
          <StageCanvas slugs={roles.map((r) => r.slug)} active={role.slug} still={still} />
        </div>
      ) : null}
      <div key={role.slug} className="stage-caption absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-5">
        <div>
          <p className="font-display text-2xl font-semibold uppercase leading-none sm:text-3xl">{role.org}</p>
          <p className="lettering mt-1 text-ink-faint">{formatRange(role.start, role.end)}</p>
        </div>
        <p className="text-right">
          <span className="block font-display text-2xl font-semibold leading-none text-redline sm:text-4xl">
            {metric.before ? `${metric.before.display} to ${metric.after.display}` : metric.after.display}
          </span>
          <span className="lettering block max-w-[20ch] text-ink-soft">{metric.label.toLowerCase()}</span>
        </p>
      </div>
    </div>
  );
}
