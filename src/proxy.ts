import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { apiPreflight, LEGACY_DEPRECATION, legacyApiTarget, methodNotAllowed, rateLimited } from "@/lib/api";
import { prefersMarkdown } from "@/lib/negotiate";
import { apiRateLimiter, rateLimitHeaders } from "@/lib/rate-limit";

const READ_METHODS = ["GET", "HEAD"];

// Paths that are never pages: the API, the Markdown route itself, discovery
// documents and generated images. Any path ending in a file extension is a file.
const NOT_PAGES = /^\/(api|md|\.well-known|_next|opengraph-image|icon)(\/|$)|\.[^/]+$/;

function clientKey(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "anonymous";
}

function withHeaders(response: NextResponse, headers: Record<string, string>) {
  for (const [name, value] of Object.entries(headers)) response.headers.set(name, value);
  return response;
}

function proxyApi(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (request.method === "OPTIONS") return apiPreflight();
  if (!READ_METHODS.includes(request.method)) return methodNotAllowed(request.method);

  const result = apiRateLimiter.check(clientKey(request));
  const headers = rateLimitHeaders(result);
  if (!result.allowed) return rateLimited(headers);

  const target = legacyApiTarget(pathname);
  if (target) {
    // The unversioned paths forward to v1 and say so.
    const location = new URL(`${target}${search}`, request.url);
    return withHeaders(NextResponse.redirect(location, 308), {
      ...headers,
      Deprecation: LEGACY_DEPRECATION,
      Link: `<${location.origin}${target}>; rel="successor-version"`,
    });
  }
  return withHeaders(NextResponse.next(), headers);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/api" || pathname.startsWith("/api/")) return proxyApi(request);

  if (!NOT_PAGES.test(pathname) && READ_METHODS.includes(request.method) && prefersMarkdown(request.headers.get("accept"))) {
    return NextResponse.rewrite(new URL(`/md${pathname === "/" ? "" : pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/).*)"],
};
