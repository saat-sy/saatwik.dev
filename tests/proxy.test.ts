import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "@/proxy";

const run = (path: string, init: { method?: string; accept?: string } = {}) =>
  proxy(new NextRequest(`https://saatwik.dev${path}`, { method: init.method, headers: init.accept ? { accept: init.accept } : {} }));

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
    expect(rewrittenTo(run("/api/profile", { accept: "text/markdown" }))).toBeNull();
  });

  it("answers writes with a JSON 405", async () => {
    for (const method of ["POST", "PUT", "PATCH", "DELETE"]) {
      const response = run("/api/projects", { method });
      expect(response.status).toBe(405);
      expect(response.headers.get("content-type")).toContain("application/json");
      expect(response.headers.get("allow")).toBe("GET, HEAD, OPTIONS");
      const { error } = await response.json();
      expect(error).toMatchObject({ status: 405, code: "method_not_allowed" });
      expect(error.hint.length).toBeGreaterThan(0);
    }
  });

  it("answers preflight requests", () => {
    const response = run("/api/profile", { method: "OPTIONS" });
    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
  });
});
