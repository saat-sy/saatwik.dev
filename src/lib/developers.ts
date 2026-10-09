import type { Paragraph } from "@/content/pages";
import { siteUrl } from "@/content/site";
import { API_BASE, API_VERSION, endpoints, SUPPORT_MONTHS } from "./api";
import { RATE_LIMIT } from "./rate-limit";

// The developer docs. The /developers page and its Markdown rendering both read from here.

export type DocSection = { heading: string; paragraphs: Paragraph[]; code?: string };

export const developersIntro = "A read-only JSON API for the content of this site: profile, experience and projects. No key, no sign-up.";

export function developerSections(): DocSection[] {
  const base = `${siteUrl}${API_BASE}`;
  return [
    {
      heading: "Overview",
      paragraphs: [
        [`The base URL is ${base}. Every endpoint is a GET, returns JSON and allows cross-origin requests. The full contract is the OpenAPI 3.1 document at `, { text: "/openapi.json", href: "/openapi.json" }, `, and `, { text: "/llms.txt", href: "/llms.txt" }, ` explains when to use the site.`],
        ["Every page also has a Markdown version: request its normal URL with the header Accept: text/markdown."],
      ],
      code: `curl ${base}/projects?status=building`,
    },
    {
      heading: "Endpoints",
      paragraphs: [["Each endpoint is an OpenAPI operation; the operation ID is the name to use as a tool or function name."]],
      code: endpoints.map((e) => `${e.method} ${e.path}   ${e.operationId}`).join("\n"),
    },
    {
      heading: "Versioning and deprecation",
      paragraphs: [
        [`The version is in the path (${API_BASE}) and in the API-Version response header. Within a version, changes only add: new endpoints, new response fields, new optional parameters. Anything breaking ships as a new version under a new path.`],
        [`A superseded version keeps working for at least ${SUPPORT_MONTHS} months after its successor is announced. Deprecation is signalled with a Deprecation header (RFC 9745). Once a retirement date is set the response also carries a Sunset header (RFC 8594), and a Link header with rel="successor-version" points at the replacement.`],
        [`The unversioned paths /api/profile, /api/experience and /api/projects are deprecated. They answer 308 and redirect to v${API_VERSION}, with a Deprecation header.`],
      ],
    },
    {
      heading: "Rate limits",
      paragraphs: [
        [`${RATE_LIMIT.limit} requests per ${RATE_LIMIT.windowSeconds} seconds per client. Every response reports the state of the window, so a client can pace itself. Past the limit the API answers 429 with a Retry-After header, in seconds.`],
        ["The count is kept per server instance, so treat the limit as best-effort."],
      ],
      code: `RateLimit-Limit: ${RATE_LIMIT.limit}\nRateLimit-Remaining: 59\nRateLimit-Reset: ${RATE_LIMIT.windowSeconds}\nRateLimit-Policy: ${RATE_LIMIT.limit};w=${RATE_LIMIT.windowSeconds}`,
    },
    {
      heading: "Errors",
      paragraphs: [["Every failure is JSON with a stable code and a hint for fixing the request. The codes are not_found, method_not_allowed, invalid_parameter and rate_limited."]],
      code: JSON.stringify({ error: { status: 404, code: "not_found", message: 'No project has the slug "x".', hint: "Use one of the slugs from GET /projects.", documentation: `${siteUrl}/openapi.json` } }, null, 2),
    },
    {
      heading: "Command line",
      paragraphs: [["The saatwik package wraps the API for scripts and agents. It prints JSON and honours Retry-After."]],
      code: "npx saatwik projects --status building\nnpx saatwik project everygpu\nnpx saatwik page /about",
    },
  ];
}
