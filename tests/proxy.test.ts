import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "@/proxy";

// Each request gets its own client address unless a test pins one, so the rate limiter never interferes.
let clients = 0;
const run = (path: string, init: { method?: string; accept?: string; ip?: string } = {}) =>
  proxy(
    new NextRequest(`https://saatwik.dev${path}`, {
      method: init.method,
      headers: { "x-forwarded-for": init.ip ?? `203.0.113.${++clients}`, ...(init.accept ? { accept: init.accept } : {}) },
    }),
  );

const rewrittenTo = (response: Response) => response.headers.get("x-middleware-rewrite");

describe("proxy: Markdown negotiation", () => {
  it("rewrites page requests that ask for Markdown", () => {
    expect(rewrittenTo(run("/", { accept: "text/markdown" }))).toBe("https://saatwik.dev/md");
    expect(rewrittenTo(run("/about", { accept: "text/markdown" }))).toBe("https://saatwik.dev/md/about");
    expect(rewrittenTo(run("/projects/dictate", { accept: "text/markdown" }))).toBe("https://saatwik.dev/md/projects/dictate");
  });

  it("rewrites unknown paths too, so the 404 body is Markdown", () => {
    expect(rewrittenTo(run("/__ora-404-probe", { accept: "text/markdown" }))).toBe("https://saatwik.dev/md/__ora-404-probe");
  });

  it("leaves HTML requests alone", () => {
    for (const accept of ["text/html", "*/*", "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8", undefined]) {
      expect(rewrittenTo(run("/", { accept }))).toBeNull();
    }
  });

  it.each(["/llms.txt", "/openapi.json", "/sitemap.xml", "/robots.txt", "/icon.svg", "/.well-known/api-catalog", "/opengraph-image", "/md/about", "/_next/static/x.js"])(
    "does not rewrite %s",
    (path) => {
      expect(rewrittenTo(run(path, { accept: "text/markdown" }))).toBeNull();
    },
  );

  it("only rewrites reads", () => {
    expect(rewrittenTo(run("/about", { method: "POST", accept: "text/markdown" }))).toBeNull();
    expect(rewrittenTo(run("/about", { method: "HEAD", accept: "text/markdown" }))).toBe("https://saatwik.dev/md/about");
  });
});

describe("proxy: API", () => {
  it("does not rewrite API reads, even when Markdown is requested", () => {
    expect(rewrittenTo(run("/api/v1/profile", { accept: "text/markdown" }))).toBeNull();
  });

  it("answers writes with a JSON 405", async () => {
    for (const method of ["POST", "PUT", "PATCH", "DELETE"]) {
      const response = run("/api/v1/projects", { method });
      expect(response.status).toBe(405);
      expect(response.headers.get("content-type")).toContain("application/json");
      expect(response.headers.get("allow")).toBe("GET, HEAD, OPTIONS");
      const { error } = await response.json();
      expect(error).toMatchObject({ status: 405, code: "method_not_allowed" });
      expect(error.hint.length).toBeGreaterThan(0);
    }
  });

  it("answers preflight requests", () => {
    const response = run("/api/v1/profile", { method: "OPTIONS" });
    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
  });
});

describe("proxy: rate limiting", () => {
  it("reports the window on every API response", () => {
    const response = run("/api/v1/profile");
    expect(response.headers.get("ratelimit-limit")).toBe("60");
    expect(response.headers.get("ratelimit-remaining")).toBe("59");
    expect(response.headers.get("ratelimit-reset")).toMatch(/^\d+$/);
    expect(response.headers.get("ratelimit-policy")).toBe("60;w=60");
    expect(response.headers.get("retry-after")).toBeNull();
  });

  it("counts a client's requests down, then answers 429 with Retry-After and a JSON error", async () => {
    const ip = "198.51.100.7";
    const remaining = Array.from({ length: 60 }, () => run("/api/v1/profile", { ip }).headers.get("ratelimit-remaining"));
    expect(remaining[0]).toBe("59");
    expect(remaining[59]).toBe("0");

    const blocked = run("/api/v1/profile", { ip });
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("retry-after")).toMatch(/^\d+$/);
    expect(blocked.headers.get("ratelimit-remaining")).toBe("0");
    expect(blocked.headers.get("content-type")).toContain("application/json");
    const { error } = await blocked.json();
    expect(error).toMatchObject({ status: 429, code: "rate_limited" });
    expect(error.hint).toContain("Retry-After");

    expect(run("/api/v1/profile").status).toBe(200);
  });

  it("does not limit pages", () => {
    const ip = "198.51.100.8";
    for (let i = 0; i < 70; i++) expect(run("/about", { ip }).headers.get("ratelimit-limit")).toBeNull();
  });
});

describe("proxy: API versioning", () => {
  it.each([
    ["/api/profile", "/api/v1/profile"],
    ["/api/experience", "/api/v1/experience"],
    ["/api/projects", "/api/v1/projects"],
    ["/api/projects/dictate", "/api/v1/projects/dictate"],
  ])("redirects the unversioned %s to %s and marks it deprecated", (from, to) => {
    const response = run(from);
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(`https://saatwik.dev${to}`);
    expect(response.headers.get("deprecation")).toBe("@1791504000");
    expect(response.headers.get("link")).toBe(`<https://saatwik.dev${to}>; rel="successor-version"`);
  });

  it("keeps the query string", () => {
    expect(run("/api/projects?status=building").headers.get("location")).toBe("https://saatwik.dev/api/v1/projects?status=building");
  });

  it("does not redirect versioned paths, the API root or unknown paths", () => {
    for (const path of ["/api", "/api/v1", "/api/v1/profile", "/api/nonexistent", "/api/profile/extra"]) {
      const response = run(path);
      expect(response.status, path).toBe(200);
      expect(response.headers.get("location"), path).toBeNull();
      expect(response.headers.get("deprecation"), path).toBeNull();
    }
  });
});
