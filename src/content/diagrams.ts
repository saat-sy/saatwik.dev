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
    title: "From study material to paced dictation",
    steps: [
      { label: "Study material", note: "PDF, photo OCR, or direct text" },
      { label: "Draft", note: "typed text auto-saves in real time" },
      { label: "TTS", note: "reads one sentence at a time" },
      { label: "Writing pace", note: "adjust sentence length and pause duration" },
    ],
    links: [{}, {}, { label: "pause, write, continue", hot: true }],
    footnote: "Built for handwritten assignments and refined through user feedback over 5+ years in production.",
  },
  timbre: {
    title: "From video to a live score",
    steps: [
      { label: "Video", note: "uploaded by the viewer" },
      { label: "Scene + transcript", note: "representative frames and dialogue" },
      { label: "Musical plan", note: "Groq and Llama set the prompt and mood" },
      { label: "Live score", note: "streamed over WebSockets, buffered for playback" },
    ],
    links: [{}, {}, { label: "new audio chunk every 2 s", hot: true }],
    footnote: "Timbre is live at timbreapp.tech, with sub-two-second end-to-end latency.",
  },
  gobble: {
    title: "One move, synced live",
    steps: [
      { label: "Your move", note: "chess-like movement and positioning" },
      { label: "Gobble", note: "choose which tile to take and merge" },
      { label: "Room state", note: "six-digit room on Cloud Firestore" },
      { label: "Opponent", note: "listens to the room and takes their turn" },
    ],
    links: [{}, {}, { label: "moves and turns sync live", hot: true }],
    footnote: "The goal is to eliminate the opponent’s color from the board.",
  },
  mach: {
    title: "One task, the right model and harness",
    steps: [
      { label: "Task", note: "a coding request in a repository" },
      { label: "MACH", note: "weighs the task, repo context, models, cost, and speed" },
      { label: "Model + harness", note: "chosen automatically, such as Codex or Claude" },
    ],
    links: [{}, { label: "routed automatically", hot: true }],
    footnote: "Currently at the idea stage: the routing question is defined, and implementation is next.",
  },
  hyprlander: {
    title: "Plain language to Hyprland config",
    steps: [
      { label: "Your request", note: "“make my desktop more minimalist”" },
      { label: "Reason", note: "reads your request and current setup, with the Gemini API" },
      { label: "Act", note: "reads, backs up, and edits config files" },
      { label: "Observe", note: "validates changes and checks for conflicts" },
    ],
    links: [{}, {}, { label: "repeat until done", hot: true }],
    footnote: "A ReAct agent loop, written in Go.",
  },
  fluttergenerator: {
    title: "From a screenshot to Flutter code",
    steps: [
      { label: "Screenshot", note: "an uploaded image of a Flutter UI" },
      { label: "Image encoder", note: "pretrained Inception V3" },
      { label: "Code decoder", note: "an LSTM predicts Dart tokens" },
      { label: "Flutter code", note: "shown on a Flask page" },
    ],
    links: [{}, {}, { label: "one token at a time", hot: true }],
    footnote: "Training pairs came from open-source Flutter apps rendered in DartPad.",
  },
};
