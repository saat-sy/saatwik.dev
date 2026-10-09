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
    title: "Spare GPUs working as one inference system",
    steps: [
      { label: "Prompts", note: "requests enter the system" },
      { label: "Router", note: "splits and schedules work; a laptop server today" },
      { label: "GPU shards", note: "spare laptop, Colab, and Kaggle GPUs, each running one model stage" },
      { label: "Tokens", note: "generated output" },
    ],
    links: [{}, { label: "activation vectors over TCP", hot: true }, {}],
    footnote:
      "An evaluator records server-queue wait, per-shard prefill and decode, transport overhead, and end-to-end latency. Next: direct peer-to-peer transport, n GPUs by m shards, and recovery from unreliable nodes.",
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
