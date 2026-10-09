import { pathNotFound } from "@/lib/api";

// Anything under /api without a handler of its own.
export function GET(request: Request) {
  return pathNotFound(new URL(request.url).pathname);
}
