// How each project works, as a left-to-right flow. Only resume-backed facts.

export type DiagramStep = { label: string; note?: string };
export type DiagramLink = { label?: string; hot?: boolean };
export type Diagram = {
  title: string;
  steps: DiagramStep[];
  /** links[i] joins steps[i] and steps[i + 1]. */
  links: DiagramLink[];
  footnote?: string;
};

export const diagrams: Record<string, Diagram> = {
  everygpu: {
    title: "Pipeline-parallel inference",
    steps: [
      { label: "Prompt", note: "input sequence" },
      { label: "Stage 1", note: "OLMoE layers on GPU node A" },
      { label: "Stage 2", note: "OLMoE layers on GPU node B" },
      { label: "Output", note: "generated tokens" },
    ],
    links: [{}, { label: "full-sequence transfer, up to 55.6% of latency", hot: true }, {}],
    footnote: "An OpenTelemetry profiler times every stage's compute against its transport.",
  },
  dictate: {
    title: "From any text to background speech",
    steps: [
      { label: "Text in", note: "typed, files, or camera via Google Vision OCR" },
      { label: "Library", note: "local SQLite storage" },
      { label: "TTS engine", note: "long-running playback" },
      { label: "Background", note: "keeps reading with the app closed" },
    ],
    links: [{}, {}, { hot: true }],
    footnote: "Maintained in production for 5+ years: 90K+ installs, 5K+ monthly users.",
  },
  timbre: {
    title: "Video in, music out, in real time",
    steps: [
      { label: "Browser", note: "React and Next.js client" },
      { label: "Stream", note: "WebSockets, both directions" },
      { label: "Backend", note: "FastAPI video-to-music service" },
      { label: "Soundtrack", note: "streamed back to the player" },
    ],
    links: [{}, { label: "under 2 s end to end", hot: true }, {}],
    footnote: "Latency held under two seconds across concurrent sessions.",
  },
};
