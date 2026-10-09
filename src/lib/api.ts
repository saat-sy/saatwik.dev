import { education, experience, leadership, person, projects, projectPeriod, siteUrl } from "@/content/site";
import type { Project } from "@/content/site";

export const openapiUrl = `${siteUrl}/openapi.json`;

const baseHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Accept, Content-Type",
};

export function apiJson(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  for (const [name, value] of Object.entries(baseHeaders)) headers.set(name, value);
  return Response.json(data, { ...init, headers });
}

export type ApiErrorCode = "not_found" | "method_not_allowed" | "invalid_parameter";

/** Every API failure has this shape; see the Error schema in /openapi.json. */
export function apiError(status: number, code: ApiErrorCode, message: string, hint: string, init: ResponseInit = {}): Response {
  return apiJson({ error: { status, code, message, hint, documentation: openapiUrl } }, { ...init, status });
}

export function apiPreflight(): Response {
  return new Response(null, { status: 204, headers: baseHeaders });
}

export function methodNotAllowed(method: string): Response {
  return apiError(405, "method_not_allowed", `${method} is not supported. This API is read-only.`, "Send a GET request. See the operations in /openapi.json.", {
    headers: { Allow: "GET, HEAD, OPTIONS" },
  });
}

export function pathNotFound(pathname: string): Response {
  return apiError(404, "not_found", `No API endpoint exists at ${pathname}.`, "GET /api lists the available endpoints; /openapi.json describes them.");
}

export const projectStatuses = ["building", "shipped", "archived"] as const;

export function profileData() {
  return {
    name: person.name,
    tagline: person.tagline,
    location: person.location,
    email: person.email,
    website: siteUrl,
    links: person.links,
    education,
  };
}

export function experienceData() {
  return { experience, leadership };
}

export function projectSummary(project: Project) {
  const { slug, name, status, featured, kind, summary, stack, liveUrl, repoUrl } = project;
  return { slug, name, status, featured, kind, period: projectPeriod(project), summary, stack, liveUrl, repoUrl, url: `${siteUrl}/projects/${slug}` };
}

export function projectDetail(project: Project) {
  return { ...projectSummary(project), points: project.points, metrics: project.metrics, caseStudy: project.caseStudy };
}

export function apiIndex() {
  return {
    name: `${person.name} public API`,
    description: "Read-only JSON access to the content of saatwik.dev.",
    openapi: openapiUrl,
    endpoints: [
      { method: "GET", path: "/api/profile", description: "Who Saatwik is, how to reach them, and their education." },
      { method: "GET", path: "/api/experience", description: "Work experience and leadership roles." },
      { method: "GET", path: "/api/projects", description: "Projects, optionally filtered by status or featured." },
      { method: "GET", path: "/api/projects/{slug}", description: "One project with its full case study." },
    ],
    projectSlugs: projects.map((p) => p.slug),
  };
}
