// Facts on this site come from Saatwik's resume and project interviews.

export const person = {
  name: "Saatwik Yajaman",
  shortName: "Saatwik",
  tagline: "I build the systems that stay up, and the apps that run on them.",
  availability: "Open to full-time roles",
  location: "Los Angeles, CA",
  email: "saatwik.sy@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/saatwik-yajaman",
    github: "https://github.com/saat-sy",
    resume: "https://drive.google.com/uc?export=download&id=1PWmdA_XqjkRfSPmyyNsOD1K2QK7dY5aG",
  },
} as const;

export type Metric = {
  /** What was measured, in plain words. */
  label: string;
  before?: { value: number; unit: string; display: string };
  after: { value: number; unit: string; display: string };
};

export type Role = {
  slug: string;
  org: string;
  title: string;
  place: string;
  start: string;
  end: string;
  points: string[];
  metrics: Metric[];
  stack: string[];
};

export const experience: Role[] = [
  {
    slug: "meta",
    org: "Meta",
    title: "Production Engineer Intern",
    place: "Bellevue, WA",
    start: "2026-05",
    end: "2026-08",
    points: [
      "Streamlined six-week drain test scheduling across Meta's products and services, cutting planning time from 1 day to 2 hours, by deploying a Python LLM agent adopted by the Disaster Recovery (DR) team.",
      "Preempted service failures during drain tests by publishing daily forecasts of at-risk services and failure modes, giving service owners a 7-day advance notification window.",
      "Quantified drain test ROI across 15+ historical tests for the DR team by designing an evaluation framework that correlated SEV root causes with risk telemetry to isolate novel failure modes.",
    ],
    metrics: [
      {
        label: "Drain test planning time",
        before: { value: 24, unit: "h", display: "1 day" },
        after: { value: 2, unit: "h", display: "2 hours" },
      },
      {
        label: "Advance warning for service owners",
        after: { value: 7, unit: "d", display: "7 days" },
      },
      {
        label: "Historical drain tests evaluated",
        after: { value: 15, unit: "+", display: "15+" },
      },
    ],
    stack: ["Python", "LLM agents", "Risk telemetry"],
  },
  {
    slug: "crio",
    org: "Crio.Do",
    title: "Product Engineer Intern",
    place: "Bengaluru, India",
    start: "2025-01",
    end: "2025-07",
    points: [
      "Delivered an end-to-end AWS deployment curriculum for 50+ learners by building starter stubs, reference solutions and Docker Compose setups across EC2 and Lambda for a four-microservice app.",
    ],
    metrics: [
      { label: "Learners taught to deploy on AWS", after: { value: 50, unit: "+", display: "50+" } },
      { label: "Microservices in the reference app", after: { value: 4, unit: "", display: "4" } },
    ],
    stack: ["AWS EC2", "AWS Lambda", "Docker Compose"],
  },
  {
    slug: "anb",
    org: "ANB Solutions",
    title: "Software Engineering Intern",
    place: "Remote",
    start: "2024-08",
    end: "2024-12",
    points: [
      "Automated e-commerce product cataloging, reducing manual tagging effort by 50%, by deploying a multimodal pipeline using a Llama 3 vision model to extract and validate structured metadata from item images.",
    ],
    metrics: [
      {
        label: "Manual tagging effort",
        before: { value: 100, unit: "%", display: "100%" },
        after: { value: 50, unit: "%", display: "50%" },
      },
    ],
    stack: ["Llama 3 Vision", "Python", "Multimodal pipelines"],
  },
  {
    slug: "gsoc",
    org: "Google Summer of Code",
    title: "Software Contributor @ Catrobat",
    place: "Remote",
    start: "2022-06",
    end: "2022-10",
    points: [
      "Enhanced drawing precision across 13 canvas tools, shipped to production for 1M+ users, by implementing an interactive canvas magnifier with dynamic coordinate mapping and viewport positioning.",
      "Prevented UI regressions across an Android app with 1M+ downloads by building reusable UI test helpers and 4 Espresso E2E tests validating visibility and placement.",
    ],
    metrics: [
      { label: "Users reached in production", after: { value: 1_000_000, unit: "+", display: "1M+" } },
      { label: "Canvas tools made more precise", after: { value: 13, unit: "", display: "13" } },
      { label: "Espresso E2E tests added", after: { value: 4, unit: "", display: "4" } },
    ],
    stack: ["Kotlin", "Android", "Espresso"],
  },
];

export const leadership: Role[] = [
  {
    slug: "cyborg",
    org: "CybOrg at USC",
    title: "Infrastructure Tech Lead, TACTICS",
    place: "Los Angeles, CA",
    start: "2026-09",
    end: "present",
    points: [
      "Executed a platform migration across GCP environments to sustain weekly CTF events, managing Kubernetes infrastructure and Traefik ingress routing to dynamically spin up isolated challenge containers for 20+ competitors.",
    ],
    metrics: [
      { label: "Competitors per weekly CTF", after: { value: 20, unit: "+", display: "20+" } },
    ],
    stack: ["GCP", "Kubernetes", "Traefik"],
  },
];

export type ProjectStatus = "building" | "shipped" | "archived";

export type CaseStudySection = {
  heading: string;
  body: string;
};

/** A project with a full case-study page. */
export type Project = {
  slug: string;
  name: string;
  status: ProjectStatus;
  /** Shown on the home page. */
  featured: boolean;
  kind: string;
  /** Both omitted when the dates are not recorded. */
  start?: string;
  end?: string;
  summary: string;
  points: string[];
  /** Only real, measured numbers; empty when the project has none. */
  metrics: Metric[];
  stack: string[];
  /** A published app or demo, when the project has one. */
  liveUrl?: string;
  /** The public source repository, when there is one. */
  repoUrl?: string;
  caseStudy: CaseStudySection[];
};

export const projects: Project[] = [
  {
    slug: "everygpu",
    name: "EveryGPU",
    status: "building",
    featured: true,
    kind: "Distributed LLM inference engine",
    start: "2026-09",
    end: "present",
    summary: "An experiment in joining spare GPUs into an efficient inference pipeline, with instrumentation that shows where every request waits.",
    points: [
      "Built a distributed inference prototype that passes activation vectors over TCP from one GPU, through a laptop-hosted server, to the next GPU shard.",
      "Built an evaluation platform that breaks every request into end-to-end latency, per-shard prefill and decode time, vector transport overhead, and server-queue wait time.",
      "Now optimizing a small model toward 15-20 tokens per second before testing a larger model across more distributed GPU networks.",
    ],
    metrics: [
      { label: "Tokens per second targeted for the first small model", after: { value: 20, unit: "tok/s", display: "15-20" } },
      { label: "Latency signals the evaluator records per request", after: { value: 4, unit: "", display: "4" } },
    ],
    stack: ["Python", "CUDA", "TCP", "OpenTelemetry"],
    caseStudy: [
      {
        heading: "Why I built it",
        body: "EveryGPU began with a simple question: if a laptop, Colab, and Kaggle can each offer usable GPU capacity, why can’t they work together to run a model that none could serve alone? I started by exploring how scattered, otherwise-idle GPUs could act as one inference system.",
      },
      {
        heading: "The hard part",
        body: "The first prototype made clear that adding GPUs is not enough. Each request must be split, scheduled, and carried between machines without letting queueing or network transfer erase the gains from extra compute. Right now, activation vectors travel over TCP through a laptop-hosted server between GPU shards.",
      },
      {
        heading: "What I learned",
        body: "Distributed inference needs measurement before optimization. The evaluation platform separates queue wait, per-shard prefill and decode, and transport overhead, so I can see where a request actually spends time.",
      },
      {
        heading: "Where it goes next",
        body: "The immediate target is an efficient small-model system at roughly 15-20 tokens per second. From there, I want to test direct peer-to-peer transport, potentially with QUIC, and scale to larger models and more remote GPUs. The longer-term work is routing requests well across n GPUs and m shards, sustaining useful concurrent throughput, recovering from unreliable nodes, and building a desktop app that gives a participant’s GPU back when they need it.",
      },
    ],
  },
  {
    slug: "dictate",
    name: "Dictate",
    status: "shipped",
    featured: true,
    kind: "Text-to-speech Android app",
    start: "2020-05",
    end: "present",
    summary: "An Android study companion that turns PDFs, photos, and typed text into adjustable, paced dictation.",
    points: [
      "Built a native Android app that accepts PDFs, photos, and direct text, then turns the material into sentence-by-sentence dictation for students writing by hand.",
      "Designed paced text-to-speech playback that reads a sentence, pauses for writing, and continues, with adjustable sentence length and pause duration.",
      "Added real-time auto-save for typed material after a user reported losing their notes, and continued refining the app through reviews, feature requests, and bug reports.",
      "Maintained and scaled the app to 90K+ installs and 5K+ monthly active users across more than five years in production.",
    ],
    metrics: [
      { label: "Installs", after: { value: 90_000, unit: "+", display: "90K+" } },
      { label: "Monthly active users", after: { value: 5_000, unit: "+", display: "5K+" } },
      { label: "Years in production", after: { value: 5, unit: "+", display: "5+" } },
    ],
    stack: ["Kotlin", "Android", "Google Vision OCR", "SQLite"],
    caseStudy: [
      {
        heading: "Why I built it",
        body: "In India, students often receive assignments that require copying source material by hand. I knew the routine of asking a parent to dictate line by line while I wrote. Dictate began as a way to automate that routine when there was no app built for it.",
      },
      {
        heading: "How it helps students",
        body: "A student can add a PDF, take photos of a textbook, or type material directly into the app. Dictate reads one sentence at a time, pauses so the student can write, then continues. Both sentence length and pause duration can be adjusted to match the student's pace.",
      },
      {
        heading: "How feedback shaped it",
        body: "User feedback has guided the app's evolution. When a user reported that their notes had disappeared before they could start dictation, I added real-time auto-save so typed material is saved as it is entered. Reviews and bug reports have continued to shape new features and fixes.",
      },
      {
        heading: "What keeps it going",
        body: "Dictate has been in production for more than five years, reaching 90K+ installs and 5K+ monthly active users. I still receive reviews from people using it today, which keeps the work grounded in a real problem rather than a one-time project.",
      },
    ],
  },
  {
    slug: "timbre",
    name: "Timbre",
    status: "shipped",
    featured: true,
    kind: "AI video soundtracking platform",
    start: "2025-09",
    end: "2025-10",
    summary: "Analyzes a video’s scenes and dialogue, then streams a score that follows its mood in real time.",
    points: [
      "Built a video-to-music system that detects scenes, samples each scene’s middle frame, and pairs those images with a transcript for multimodal analysis.",
      "Used Groq and a Llama model to turn the video analysis into a music prompt and mood direction for every scene.",
      "Connected the client, backend, and real-time music API with WebSockets, streaming a new audio chunk every two seconds and handling buffering for continuous playback.",
      "Built the live experience end to end, coordinating scene analysis, transcription, prompt generation, streaming, buffering, and playback at sub-two-second latency.",
    ],
    metrics: [
      { label: "End-to-end latency", after: { value: 2, unit: "s", display: "< 2 s" } },
    ],
    stack: ["FastAPI", "WebSockets", "Groq", "Google Lyria", "React", "Next.js"],
    liveUrl: "https://timbreapp.tech",
    caseStudy: [
      {
        heading: "Why I built it",
        body: "A score can completely change how a video feels. When I saw that real-time music APIs made immediate generation possible, I wanted to make it possible for any video to receive a background score without treating music as a slow export step.",
      },
      {
        heading: "How it works",
        body: "Timbre detects scenes and analyzes the transcript in parallel. It selects a representative frame from every scene, then sends those images and the transcript to Groq and a Llama model to determine the prompt and mood for the music. The client, backend, and real-time music API stay connected over WebSockets while the score streams back in two-second chunks.",
      },
      {
        heading: "The hard part",
        body: "The challenge was connecting the moving parts into one coherent experience. Scene detection, transcription, multimodal prompting, streaming, buffering, and playback all had to work together closely enough that the user hears a continuous score instead of a collection of separate systems.",
      },
      {
        heading: "Proof in the scene",
        body: "The moment it clicked was using an Avengers: Infinity War fight scene and hearing Timbre generate a score that matched the action. Timbre is live today, so the project is more than a technical pipeline: it is an experience people can try.",
      },
    ],
  },
  {
    slug: "gobble",
    name: "Gobble",
    status: "shipped",
    featured: true,
    kind: "1v1 strategy game",
    start: "2022-03",
    end: "2022-04",
    summary: "A 1v1 strategy game that combines chess-like movement with 2048-style merging.",
    points: [
      "Built Gobble before college, learning Flutter and the BLoC pattern from scratch.",
      "Designed a turn-based game where players choose which tiles to gobble, aiming to eliminate the opponent’s color from the board.",
      "Combined chess-inspired movement and positioning with 2048-style tile merging, so winning depends on tactics rather than score alone.",
      "Implemented real-time multiplayer with Cloud Firestore: players create or join a six-digit room, subscribe to game-state updates, and synchronize moves and turns live.",
    ],
    metrics: [{ label: "Digits in a room code", after: { value: 6, unit: "", display: "6" } }],
    stack: ["Flutter", "Dart", "BLoC", "Cloud Firestore", "Firebase"],
    liveUrl: "https://gobble-game.web.app/",
    caseStudy: [
      {
        heading: "Why I built it",
        body: "Gobble started as a fun idea: combine the tactical decisions of chess with the satisfying merges of 2048. I built the entire game before college while teaching myself Flutter and BLoC from scratch.",
      },
      {
        heading: "How it plays",
        body: "Gobble is a 1v1 game, not a score chase. Players move and gobble tiles across the board, and the goal is to eliminate the opponent’s color. Every move is a decision about positioning, timing, and which tile is worth taking.",
      },
      {
        heading: "Multiplayer",
        body: "I used Cloud Firestore as the real-time game layer. A player creates a six-digit room code, a second player joins it, and both clients listen to the shared room state. Each move updates the board action and whose turn comes next.",
      },
      {
        heading: "What I learned",
        body: "Gobble was my first full game project. It taught me Flutter, BLoC state management, and how to make a turn-based multiplayer game stay synchronized in real time.",
      },
    ],
  },
  {
    slug: "mach",
    name: "MACH",
    status: "building",
    featured: false,
    kind: "Meta-harness for coding agents",
    start: "2026-10",
    end: "present",
    summary: "A model-agnostic coding harness that chooses the right model and execution setup for a task automatically.",
    points: [
      "Conceived MACH after repeatedly having to decide whether a coding task belonged with Codex, Claude, or another model.",
      "Designed it as a meta-harness that evaluates the task, repository context, model capabilities, cost, and speed.",
      "Intends to route work to the most suitable model and harness automatically instead of requiring manual model selection.",
      "Currently at the idea stage, with the core product question defined before implementation begins.",
    ],
    metrics: [],
    stack: [],
    caseStudy: [
      {
        heading: "Why it exists",
        body: "Different coding models excel at different kinds of work, but deciding which one to use adds friction before the task even begins. MACH started from that daily decision problem.",
      },
      {
        heading: "The idea",
        body: "MACH is a meta-harness. It would evaluate the task, its repository context, the available models, cost, and speed, then choose the appropriate model and execution harness automatically.",
      },
      {
        heading: "Current status",
        body: "MACH is a new concept in active development. The routing problem is clear; the implementation is the next step.",
      },
    ],
  },
  {
    slug: "hyprlander",
    name: "Hyprlander",
    status: "shipped",
    featured: false,
    kind: "Command-line tool for the Hyprland window manager",
    start: "2025-09",
    end: "2025-11",
    summary: "Describe the change you want in plain language, and Hyprlander edits your Hyprland config for you.",
    points: [
      "Built a command-line tool that manages and customizes the Hyprland window manager from plain-language requests, such as “make my desktop more minimalist”.",
      "Used a ReAct agent architecture: the agent reasons about the request and the current setup, acts on the config files, observes the result, and iterates until the task is done.",
      "Integrated the Gemini API to interpret requests, with actions that read, back up, and modify Hyprland config files.",
      "Wrote it in Go, inspired by tools like gemini-cli and claude-code.",
    ],
    metrics: [{ label: "Stages in the agent’s reason, act, observe, iterate loop", after: { value: 4, unit: "", display: "4" } }],
    stack: ["Go", "Gemini API", "Hyprland"],
    repoUrl: "https://github.com/saat-sy/hyprlander",
    caseStudy: [
      {
        heading: "What it is",
        body: "Hyprlander is a command-line tool that makes it easier to manage and customize the Hyprland window manager. Instead of digging through config files or memorizing syntax, you type what you want to change and it works out the edits.",
      },
      {
        heading: "How it works",
        body: "Hyprlander runs a ReAct loop. The agent reasons about your request and your current Hyprland configuration, acts by reading, backing up, and modifying config files, then observes the result and checks for conflicts. It keeps iterating until the task is complete, using the Gemini API to interpret what you ask for.",
      },
      {
        heading: "Using it",
        body: "Running hyprlander init stores your Gemini API key. After that, a request like hyprlander prompt “I’m having screen tearing issues” starts a conversation with your Hyprland setup.",
      },
    ],
  },
  {
    slug: "fluttergenerator",
    name: "FlutterGenerator",
    status: "archived",
    featured: false,
    kind: "Screenshot-to-Flutter-code experiment",
    start: "2021-11",
    end: "2021-12",
    summary: "An early experiment in generating Flutter UI code from screenshots.",
    points: [
      "Built an end-to-end screenshot-to-code experiment after seeing neural networks learn visual tasks in GTA V.",
      "Created a training-data pipeline that collected Flutter projects, transformed widgets into runnable examples, rendered them in DartPad, and paired screenshots with Dart source code.",
      "Trained an image-to-sequence model using an Inception V3 encoder and LSTM decoder to generate Flutter code token by token from a UI screenshot.",
      "Built a Flask upload demo that ran inference and displayed the generated Dart output.",
      "Learned that data collection was the real challenge, and that this kind of convolutional/recurrent model was not well suited to generating convincing UI code from screenshots.",
    ],
    metrics: [],
    stack: ["Python", "PyTorch", "Inception V3", "LSTM", "Selenium", "DartPad", "Flask"],
    repoUrl: "https://github.com/saat-sy/FlutterGenerator",
    caseStudy: [
      {
        heading: "Why I built it",
        body: "After watching Sentdex build neural networks that controlled GTA V from visual input, I wondered whether a model could learn to turn a UI screenshot into Flutter code.",
      },
      {
        heading: "The hard part",
        body: "The hard problem was not training the network. It was creating a dataset. I built a pipeline that found Flutter projects, prepared their widgets to run in isolation, rendered them in DartPad, and paired each image with its source code.",
      },
      {
        heading: "How it worked",
        body: "A pretrained image encoder processed the screenshot, while an LSTM decoder generated Dart tokens one at a time. A Flask site accepted an uploaded UI image and displayed the model’s predicted Flutter code.",
      },
      {
        heading: "What I learned",
        body: "The model produced very little that was convincing. That result was useful: the project taught me that the architecture and data representation matter as much as the idea, and that standard neural networks were not a good fit for this kind of code-generation task.",
      },
    ],
  },
];

export const education = [
  {
    school: "University of Southern California",
    degree: "Master of Science in Computer Science",
    note: "Grader, CSCI 585: Database Systems",
    place: "Los Angeles, CA",
    start: "2025-08",
    end: "2027-05",
  },
  {
    school: "M S Ramaiah University of Applied Sciences",
    degree: "Bachelor of Technology in Computer Science",
    place: "Bengaluru, India",
    start: "2021-12",
    end: "2025-06",
  },
];

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatMonth(ym: string) {
  if (ym === "present") return "Present";
  const [y, m] = ym.split("-").map(Number);
  return `${monthNames[m - 1]} ${y}`;
}

export function formatRange(start: string, end: string) {
  return start === end ? formatMonth(start) : `${formatMonth(start)} - ${formatMonth(end)}`;
}

/** A project's period, or "Live" when only its published app is recorded. */
export function projectPeriod(project: Pick<Project, "start" | "end" | "liveUrl">) {
  if (project.start && project.end) return formatRange(project.start, project.end);
  return project.liveUrl ? "Live" : "";
}
