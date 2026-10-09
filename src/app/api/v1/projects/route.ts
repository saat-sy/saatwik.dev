import { apiError, apiJson, projectStatuses, projectSummary } from "@/lib/api";
import { projects } from "@/content/site";

export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const status = params.get("status");
  const featured = params.get("featured");

  if (status !== null && !projectStatuses.some((s) => s === status)) {
    return apiError(400, "invalid_parameter", `status must be one of ${projectStatuses.join(", ")}; got "${status}".`, "Use ?status=building, ?status=shipped or ?status=archived, or omit it.");
  }
  if (featured !== null && featured !== "true" && featured !== "false") {
    return apiError(400, "invalid_parameter", `featured must be true or false; got "${featured}".`, "Use ?featured=true, ?featured=false, or omit it.");
  }

  const matches = projects.filter((p) => (status === null || p.status === status) && (featured === null || p.featured === (featured === "true")));
  return apiJson({ projects: matches.map(projectSummary) });
}
