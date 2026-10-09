import { siteUrl } from "@/content/site";

// RFC 9727: a linkset pointing at the API's description.
export function GET() {
  const catalog = {
    linkset: [
      {
        anchor: `${siteUrl}/api`,
        "service-desc": [{ href: `${siteUrl}/openapi.json`, type: "application/json" }],
        "service-doc": [{ href: `${siteUrl}/llms.txt`, type: "text/plain" }],
      },
    ],
  };
  return new Response(JSON.stringify(catalog), {
    headers: { "Content-Type": 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"' },
  });
}
