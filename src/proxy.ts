import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { apiPreflight, methodNotAllowed } from "@/lib/api";
import { prefersMarkdown } from "@/lib/negotiate";

const READ_METHODS = ["GET", "HEAD"];

// Paths that are never pages: the API, the Markdown route itself, discovery
// documents and generated images. Any path ending in a file extension is a file.
const NOT_PAGES = /^\/(api|md|\.well-known|_next|opengraph-image|icon)(\/|$)|\.[^/]+$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { method } = request;

  if (pathname === "/api" || pathname.startsWith("/api/")) {
    if (method === "OPTIONS") return apiPreflight();
    if (!READ_METHODS.includes(method)) return methodNotAllowed(method);
    return NextResponse.next();
  }

  if (!NOT_PAGES.test(pathname) && READ_METHODS.includes(method) && prefersMarkdown(request.headers.get("accept"))) {
    return NextResponse.rewrite(new URL(`/md${pathname === "/" ? "" : pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/).*)"],
};
