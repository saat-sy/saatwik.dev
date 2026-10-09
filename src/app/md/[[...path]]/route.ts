import { markdownFor, markdownPaths, notFoundMarkdown } from "@/lib/markdown";

const headers = { "Content-Type": "text/markdown; charset=utf-8", Vary: "Accept" };

// The Markdown of a page. The proxy rewrites `Accept: text/markdown` requests here.
export function generateStaticParams() {
  return markdownPaths().map((path) => ({ path: path.split("/").filter(Boolean) }));
}

export async function GET(_request: Request, { params }: RouteContext<"/md/[[...path]]">) {
  const { path = [] } = await params;
  const pathname = `/${path.join("/")}`;
  const body = markdownFor(pathname);
  if (body === null) return new Response(notFoundMarkdown(pathname), { status: 404, headers: { ...headers, "Cache-Control": "no-store" } });
  return new Response(body, { headers });
}
