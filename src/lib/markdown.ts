import { diagrams } from "@/content/diagrams";
import { aboutParagraphs, contactParagraphs, privacyParagraphs, privacyUpdated } from "@/content/pages";
import type { Paragraph } from "@/content/pages";
import { education, experience, formatRange, leadership, person, projectPeriod, projects, siteUrl } from "@/content/site";
import type { Metric, Project, Role } from "@/content/site";

// Markdown renderings of the pages, served for `Accept: text/markdown`. Each reads
// the same content as its HTML page.

const statusLabel = { building: "In progress", shipped: "Shipped", archived: "Archived" } as const;

function link(text: string, path: string) {
  return `[${text}](${siteUrl}${path === "/" ? "" : path})`;
}

function paragraph(p: Paragraph) {
  return p.map((s) => (typeof s === "string" ? s : link(s.text, s.href))).join("");
}

function metric(m: Metric) {
  return `${m.label}: ${m.before ? `${m.before.display} → ` : ""}${m.after.display}`;
}

function role(r: Role) {
  return [
    `### ${r.title}, ${r.org}`,
    `${formatRange(r.start, r.end)} · ${r.place}`,
    r.points.map((p) => `- ${p}`).join("\n"),
    ...(r.metrics.length ? [`Numbers:\n${r.metrics.map((m) => `- ${metric(m)}`).join("\n")}`] : []),
    `Stack: ${r.stack.join(", ")}`,
  ].join("\n\n");
}

function projectLine(p: Project) {
  return `- ${link(p.name, `/projects/${p.slug}`)} (${statusLabel[p.status]}): ${p.summary}`;
}

const contactLines = [
  `- Email: ${person.email}`,
  `- LinkedIn: ${person.links.linkedin}`,
  `- GitHub: ${person.links.github}`,
  `- Resume: ${person.links.resume}`,
];

function home() {
  return [
    `# ${person.name}`,
    `> ${person.tagline}`,
    `Infrastructure and product engineer in ${person.location}.`,
    "## Experience",
    [...leadership, ...experience].map(role).join("\n\n"),
    "## Featured projects",
    projects.filter((p) => p.featured).map(projectLine).join("\n"),
    `All projects: ${link("projects", "/projects")}`,
    "## Contact",
    contactLines.join("\n"),
    `More: ${link("About", "/about")} · ${link("Contact", "/contact")} · ${link("Privacy", "/privacy")}`,
  ].join("\n\n");
}

function projectsIndex() {
  const groups = (["building", "shipped", "archived"] as const)
    .map((status) => ({ status, items: projects.filter((p) => p.status === status) }))
    .filter((g) => g.items.length);
  return [
    "# Projects",
    "What I'm building now, what I've shipped, and the experiments along the way.",
    ...groups.flatMap((g) => [`## ${statusLabel[g.status]}`, g.items.map(projectLine).join("\n")]),
  ].join("\n\n");
}

function projectPage(p: Project) {
  const diagram = diagrams[p.slug];
  const period = projectPeriod(p);
  return [
    `# ${p.name}`,
    `> ${p.kind}`,
    p.summary,
    [
      `- Status: ${statusLabel[p.status]}`,
      ...(period ? [`- Period: ${period}`] : []),
      `- Built with: ${p.stack.length ? p.stack.join(", ") : "Not chosen yet"}`,
      ...(p.liveUrl ? [`- Live app: ${p.liveUrl}`] : []),
      ...(p.repoUrl ? [`- Source: ${p.repoUrl}`] : []),
    ].join("\n"),
    "## What it does",
    p.points.map((point) => `- ${point}`).join("\n"),
    ...(p.metrics.length ? ["## Numbers", p.metrics.map((m) => `- ${metric(m)}`).join("\n")] : []),
    ...p.caseStudy.flatMap((section) => [`## ${section.heading}`, section.body]),
    ...(diagram
      ? [
          "## How it works",
          diagram.title,
          diagram.steps.map((step, i) => `${i + 1}. ${step.label}${step.note ? `: ${step.note}` : ""}`).join("\n"),
          ...(diagram.footnote ? [diagram.footnote] : []),
        ]
      : []),
    `Back to ${link("all projects", "/projects")}.`,
  ].join("\n\n");
}

function about() {
  return [
    "# About",
    aboutParagraphs.map(paragraph).join("\n\n"),
    "## Education",
    education
      .map((e) => `- ${e.school}: ${e.degree}${e.note ? ` (${e.note})` : ""}, ${e.place}, ${formatRange(e.start, e.end)}`)
      .join("\n"),
  ].join("\n\n");
}

function contact() {
  return [
    "# Contact",
    "Always up for a conversation about systems, infrastructure, and the products built on them.",
    contactLines.join("\n"),
    contactParagraphs.map(paragraph).join("\n\n"),
    `${person.availability} · ${person.location}`,
  ].join("\n\n");
}

function privacy() {
  return ["# Privacy", `Last updated ${privacyUpdated}.`, privacyParagraphs.map(paragraph).join("\n\n")].join("\n\n");
}

/** Every path that has a Markdown rendering, as it appears in the URL. */
export function markdownPaths(): string[] {
  return ["/", "/projects", "/about", "/contact", "/privacy", ...projects.map((p) => `/projects/${p.slug}`)];
}

/** The Markdown for a page path, or null when the site has no such page. */
export function markdownFor(pathname: string): string | null {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const slug = path.match(/^\/projects\/([^/]+)$/)?.[1];
  const project = slug ? projects.find((p) => p.slug === slug) : undefined;
  const body =
    path === "/" ? home()
    : path === "/projects" ? projectsIndex()
    : path === "/about" ? about()
    : path === "/contact" ? contact()
    : path === "/privacy" ? privacy()
    : project ? projectPage(project)
    : null;
  return body === null ? null : `${body}\n`;
}

export function notFoundMarkdown(pathname: string): string {
  return [
    "# 404 Not Found",
    `There is no page at \`${pathname.replace(/`/g, "")}\` on saatwik.dev. The link may be old or mistyped.`,
    "Where to look instead:",
    [
      `- ${link("Home", "/")}`,
      `- ${link("Projects", "/projects")}`,
      `- ${link("About", "/about")}`,
      `- ${link("Contact", "/contact")}`,
      `- ${link("llms.txt", "/llms.txt")}: a guide to the site for agents`,
      `- ${link("sitemap.xml", "/sitemap.xml")}: every page`,
      `- ${link("openapi.json", "/openapi.json")}: the JSON API`,
    ].join("\n"),
  ].join("\n\n") + "\n";
}
