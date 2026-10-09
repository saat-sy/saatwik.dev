import { projects } from "@/content/site";
import { API_BASE, apiError, apiJson, projectDetail } from "@/lib/api";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function GET(_request: Request, { params }: RouteContext<"/api/v1/projects/[slug]">) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) {
    return apiError(404, "not_found", `No project has the slug "${slug}".`, `Use one of: ${projects.map((p) => p.slug).join(", ")}. GET ${API_BASE}/projects lists them.`);
  }
  return apiJson(projectDetail(project));
}
