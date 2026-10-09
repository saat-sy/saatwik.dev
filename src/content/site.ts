// Facts on this site come from Saatwik's resume and project interviews.
// Narrative copy that does not exist yet is marked `placeholder: true` so
// pages can render it as unbuilt.

export const person = {
  name: "Saatwik S Yajaman",
  shortName: "Saatwik",
  tagline: "I build the systems that stay up, and the apps that run on them.",
  availability: "Open to full-time roles",
  location: "Los Angeles, CA",
  email: "saatwik.sy@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/saatwik-yajaman",
    github: "https://github.com/saat-sy",
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
  start: string;
  end: string;
  summary: string;
  points: string[];
  metrics: Metric[];
  stack: string[];
  /** Written when the project interview has supplied a real narrative. */
  caseStudy?: CaseStudySection[];
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
    summary: "Streams generated music that follows a video in real time.",
    points: [
      "Built a real-time video-to-music streaming backend with FastAPI and WebSockets and a React and Next.js frontend, maintaining sub-two-second end-to-end latency across concurrent sessions.",
    ],
    metrics: [
      { label: "End-to-end latency", after: { value: 2, unit: "s", display: "< 2 s" } },
    ],
    stack: ["FastAPI", "WebSockets", "React", "Next.js"],
  },
];

/** Smaller work listed on the projects page without a case study. */
export type ProjectNote = {
  name: string;
  status: Exclude<ProjectStatus, "shipped">;
  period: string;
  summary: string;
  stack: string[];
  href?: string;
  /** Not real yet: rendered as construction lines until Saatwik fills it in. */
  placeholder?: boolean;
};

export const projectNotes: ProjectNote[] = [
  { name: "Next project", status: "building", period: "2026", summary: "Something currently on the bench.", stack: ["TBD"], placeholder: true },
  { name: "Archived project", status: "archived", period: "2024", summary: "An earlier project worth keeping on record.", stack: ["TBD"], placeholder: true },
  { name: "Archived project", status: "archived", period: "2023", summary: "An earlier project worth keeping on record.", stack: ["TBD"], placeholder: true },
  { name: "Archived project", status: "archived", period: "2021", summary: "An earlier project worth keeping on record.", stack: ["TBD"], placeholder: true },
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

export const placeholderParagraph =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatMonth(ym: string) {
  if (ym === "present") return "Present";
  const [y, m] = ym.split("-").map(Number);
  return `${monthNames[m - 1]} ${y}`;
}

export function formatRange(start: string, end: string) {
  return `${formatMonth(start)} - ${formatMonth(end)}`;
}
