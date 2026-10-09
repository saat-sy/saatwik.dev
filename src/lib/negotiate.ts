// Content negotiation for the Accept header (RFC 9110 section 12.5.1).

type Range = { type: string; q: number };

function parseAccept(header: string): Range[] {
  return header
    .split(",")
    .map((part) => {
      const [type, ...params] = part.trim().toLowerCase().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const value = q === undefined ? 1 : Number(q.slice(2));
      return { type: type.trim(), q: Number.isFinite(value) ? value : 0 };
    })
    .filter((range) => range.type.includes("/"));
}

/** The q-value the header gives a media type; the most specific matching range wins. */
function weight(ranges: Range[], mediaType: string): number {
  const [group] = mediaType.split("/");
  const match =
    ranges.find((r) => r.type === mediaType) ??
    ranges.find((r) => r.type === `${group}/*`) ??
    ranges.find((r) => r.type === "*/*");
  return match?.q ?? 0;
}

/** True when the client asks for Markdown ahead of HTML. A tie, or a bare wildcard, stays HTML. */
export function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  const ranges = parseAccept(accept);
  const markdown = weight(ranges, "text/markdown");
  return markdown > 0 && markdown > weight(ranges, "text/html");
}
