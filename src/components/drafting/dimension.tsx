import type { Metric } from "@/content/site";

/**
 * A horizontal dimension line: extension ticks at both ends, arrowheads, and the
 * measured value lettered above. `width` is a fraction of the container.
 */
function Dimension({
  width = 1,
  label,
  tone = "ink",
}: {
  width?: number;
  label: string;
  tone?: "ink" | "soft" | "red";
}) {
  const color = tone === "red" ? "text-redline" : tone === "soft" ? "text-ink-faint" : "text-ink";
  return (
    <div className={`${color} min-w-12`} style={{ width: `${Math.max(width, 0.04) * 100}%` }}>
      <p className="lettering mb-1 whitespace-nowrap" data-plot-fade>
        {label}
      </p>
      <div data-extend className="relative h-3">
        <span className="absolute inset-y-0 left-0 w-px bg-current" />
        <span className="absolute inset-y-0 right-0 w-px bg-current" />
        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
        <span className="absolute left-px top-1/2 size-0 -translate-y-1/2 border-y-[4px] border-l-[7px] border-y-transparent border-l-current" />
        <span className="absolute right-px top-1/2 size-0 -translate-y-1/2 border-y-[4px] border-r-[7px] border-y-transparent border-r-current" />
      </div>
    </div>
  );
}

/**
 * A metric drawn to scale. Before/after metrics become two dimension lines in
 * proportion; single values become a lettered callout. Redline marks the change.
 */
export function MetricDrawing({ metric }: { metric: Metric }) {
  const { before, after, label } = metric;
  if (before) {
    const ratio = after.value / before.value;
    return (
      <figure className="w-full">
        <figcaption className="mb-3 text-sm text-ink-soft">
          {label}: {before.display} to {after.display}
        </figcaption>
        <div className="space-y-3" aria-hidden>
          <Dimension width={1} label={`was ${before.display}`} tone="soft" />
          <Dimension width={ratio} label={`now ${after.display}`} tone="red" />
        </div>
      </figure>
    );
  }
  if (after.unit === "%") {
    // A share of the whole: the full line is 100%, the redline is the part.
    return (
      <figure className="w-full">
        <div className="flex items-end gap-3">
          <span data-plot-fade className="whitespace-nowrap font-display text-5xl font-semibold leading-none text-redline">
            {after.display}
          </span>
          <figcaption data-plot-fade className="mb-1 max-w-[28ch] text-sm leading-snug text-ink-soft">
            {label}
          </figcaption>
        </div>
        <div className="relative mt-4 h-3" aria-hidden>
          <span className="absolute inset-x-0 top-1/2 h-px bg-ink-faint" />
          <span className="absolute inset-y-0 left-0 w-px bg-ink-faint" />
          <span className="absolute inset-y-0 right-0 w-px bg-ink-faint" />
          <span data-extend className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 bg-redline" style={{ width: `${after.value}%` }} />
        </div>
      </figure>
    );
  }
  return (
    <figure className="flex items-end gap-3">
      <span data-plot-fade className="whitespace-nowrap font-display text-5xl font-semibold leading-none text-redline">
        {after.display}
      </span>
      <span data-extend className="mb-2 hidden h-px w-8 bg-ink-faint sm:block" aria-hidden />
      <figcaption data-plot-fade className="mb-1 max-w-[24ch] text-sm leading-snug text-ink-soft">
        {label}
      </figcaption>
    </figure>
  );
}
