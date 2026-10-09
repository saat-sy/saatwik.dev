import { education, experience, leadership, person, projects, projectPeriod, siteUrl } from "@/content/site";
import type { Project } from "@/content/site";

export const openapiUrl = `${siteUrl}/openapi.json`;

/** The current API version. Breaking changes ship as a new version in a new path. */
export const API_VERSION = "1";
export const API_BASE = `/api/v${API_VERSION}`;
/** How long a superseded version keeps working after its successor is announced. */
export const SUPPORT_MONTHS = 6;
/** When the unversioned /api/* paths were deprecated (2026-10-09T00:00:00Z), as an RFC 9745 date. */
export const LEGACY_DEPRECATION = "@1791504000";

const baseHeaders = {
  "API-Version": API_VERSION,
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Accept, Content-Type",
  "Access-Control-Expose-Headers": "API-Version, RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset, RateLimit-Policy, Retry-After, Deprecation, Sunset, Link",
};

export function apiJson(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  for (const [name, value] of Object.entries(baseHeaders)) headers.set(name, value);
  return Response.json(data, { ...init, headers });
}

export type ApiErrorCode = "not_found" | "method_not_allowed" | "invalid_parameter" | "rate_limited";

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
  return apiError(404, "not_found", `No API endpoint exists at ${pathname}.`, `GET ${API_BASE} lists the available endpoints; /openapi.json describes them.`);
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

export const endpoints = [
  { operationId: "getProfile", path: "/profile", description: "Who Saatwik is, how to reach them, and their education." },
  { operationId: "listExperience", path: "/experience", description: "Work experience and leadership roles." },
  { operationId: "listProjects", path: "/projects", description: "Projects, optionally filtered by status or featured." },
  { operationId: "getProject", path: "/projects/{slug}", description: "One project with its full case study." },
].map((endpoint) => ({ method: "GET", ...endpoint, path: `${API_BASE}${endpoint.path}` }));

/** GET /api/v1: this version's endpoints. */
export function apiIndex() {
  return {
    name: `${person.name} public API`,
    description: "Read-only JSON access to the content of saatwik.dev.",
    version: API_VERSION,
    openapi: openapiUrl,
    endpoints,
    projectSlugs: projects.map((p) => p.slug),
  };
}

/** GET /api: the available versions. */
export function apiVersions() {
  return {
    name: `${person.name} public API`,
    versions: [{ version: API_VERSION, status: "current", url: `${siteUrl}${API_BASE}`, openapi: openapiUrl }],
    documentation: `${siteUrl}/developers`,
  };
}

/** Where an unversioned /api path now lives, or null when the path was never an endpoint. */
export function legacyApiTarget(pathname: string): string | null {
  const match = pathname.match(/^\/api\/(profile|experience|projects(?:\/[^/]+)?)$/);
  return match ? `${API_BASE}/${match[1]}` : null;
}

export function rateLimited(headers: Record<string, string>): Response {
  return apiError(429, "rate_limited", "Too many requests.", `Wait Retry-After seconds, then retry. The limit is in the RateLimit-* headers and at ${siteUrl}/developers.`, { headers });
}
