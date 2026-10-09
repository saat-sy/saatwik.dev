import { projects } from "@/content/site";
import { apiError, apiJson, projectDetail } from "@/lib/api";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function GET(_request: Request, { params }: RouteContext<"/api/projects/[slug]">) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) {
    return apiError(404, "not_found", `No project has the slug "${slug}".`, `Use one of: ${projects.map((p) => p.slug).join(", ")}. GET /api/projects lists them.`);
  }
  return apiJson(projectDetail(project));
}
