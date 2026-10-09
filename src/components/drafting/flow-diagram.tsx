import { Fragment } from "react";
import type { Diagram } from "@/content/diagrams";
import { Plot } from "./plot";

// A system drawn as boxes and leaders: horizontal on wide screens, vertical on
// phones. The hot link (the part that matters) is in redline.

function Connector({ label, hot }: { label?: string; hot?: boolean }) {
  const tone = hot ? "text-redline" : "text-ink-faint";
  return (
    <div className={`relative flex shrink-0 items-center justify-center ${tone} h-14 w-full lg:h-auto lg:w-auto lg:min-w-24 lg:flex-1`} aria-hidden={!label}>
      {/* vertical on phones */}
      <span data-extend className="absolute inset-y-1 left-1/2 w-px bg-current lg:hidden" />
      <span className="absolute bottom-0 left-1/2 size-0 -translate-x-1/2 border-x-[5px] border-t-[8px] border-x-transparent border-t-current lg:hidden" />
      {/* horizontal on wide screens */}
      <span data-extend className="absolute inset-x-1 top-1/2 hidden h-px bg-current lg:block" />
      <span className="absolute right-0 top-1/2 hidden size-0 -translate-y-1/2 border-y-[5px] border-l-[8px] border-y-transparent border-l-current lg:block" />
      {label ? (
        <span data-plot-fade className="lettering relative z-[1] max-w-[18ch] bg-sheet px-2 text-center">
          {label}
        </span>
      ) : null}
    </div>
  );
}

export function FlowDiagram({ diagram }: { diagram: Diagram }) {
  return (
    <figure>
      <figcaption className="mb-6 font-display text-3xl font-semibold uppercase">{diagram.title}</figcaption>
      <Plot className="flex flex-col items-stretch lg:flex-row lg:items-center">
        {diagram.steps.map((step, i) => (
          <Fragment key={step.label}>
            <div data-plot-fade className="border border-ink bg-sheet px-4 py-3 lg:w-44 lg:shrink-0">
              <p className="font-display text-xl font-semibold uppercase leading-none">{step.label}</p>
              {step.note ? <p className="lettering mt-1.5 text-ink-soft">{step.note}</p> : null}
            </div>
            {i < diagram.links.length ? <Connector {...diagram.links[i]} /> : null}
          </Fragment>
        ))}
      </Plot>
      {diagram.footnote ? <p className="mt-6 max-w-[60ch] text-ink-soft">{diagram.footnote}</p> : null}
    </figure>
  );
}
