import { describe, expect, it } from "vitest";
import { projects } from "@/content/site";
import { GET, generateStaticParams } from "@/app/md/[[...path]]/route";
import { markdownFor, markdownPaths, notFoundMarkdown } from "@/lib/markdown";

const get = (...path: string[]) => GET(new Request("https://saatwik.dev/md"), { params: Promise.resolve({ path }) } as never);

describe("markdownFor", () => {
  it("renders every page with a single top-level heading", () => {
    for (const path of markdownPaths()) {
      const body = markdownFor(path);
      expect(body, path).not.toBeNull();
      expect(body!.match(/^# /gm), path).toHaveLength(1);
      expect(body!.startsWith("# "), path).toBe(true);
    }
  });

  it("covers the home page, listings, text pages and every project", () => {
    expect(markdownPaths()).toEqual(expect.arrayContaining(["/", "/projects", "/about", "/contact", "/privacy"]));
    expect(markdownPaths()).toHaveLength(5 + projects.length);
  });

  it("ignores a trailing slash and rejects unknown paths", () => {
    expect(markdownFor("/about/")).toBe(markdownFor("/about"));
    for (const path of ["/nope", "/projects/nope", "/projects/dictate/extra", "/md/about"]) expect(markdownFor(path), path).toBeNull();
  });

  it("renders a project with its case study", () => {
    const project = projects[0];
    const body = markdownFor(`/projects/${project.slug}`)!;
    expect(body).toContain(`# ${project.name}`);
    for (const section of project.caseStudy) expect(body).toContain(`## ${section.heading}`);
  });

  it("turns in-text links into absolute Markdown links", () => {
    expect(markdownFor("/about")).toContain("[Dictate](https://saatwik.dev/projects/dictate)");
  });

  it("gives the trust pages at least 500 characters", () => {
    for (const path of ["/about", "/contact", "/privacy"]) expect(markdownFor(path)!.length, path).toBeGreaterThan(500);
  });
});

describe("notFoundMarkdown", () => {
  it("explains the error and links to llms.txt and the sitemap", () => {
    const body = notFoundMarkdown("/missing");
    expect(body.startsWith("# 404 Not Found")).toBe(true);
    expect(body).toContain("`/missing`");
    expect(body).toContain("(https://saatwik.dev/llms.txt)");
    expect(body).toContain("(https://saatwik.dev/sitemap.xml)");
    expect(body.length).toBeGreaterThan(20);
  });

  it("cannot be broken out of its code span", () => {
    expect(notFoundMarkdown("/a`b")).toContain("`/ab`");
  });
});

describe("/md route", () => {
  it("serves Markdown with Vary: Accept", async () => {
    const response = await get("about");
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    expect(response.headers.get("vary")).toBe("Accept");
    expect(await response.text()).toBe(markdownFor("/about"));
  });

  it("serves the home page for an empty path", async () => {
    expect(await (await get()).text()).toBe(markdownFor("/"));
  });

  it("answers an unknown path with a 404 Markdown body that is not cached", async () => {
    const response = await get("__ora-404-probe-u8msbrf1");
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    expect(response.headers.get("vary")).toBe("Accept");
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.text()).toContain("llms.txt");
  });

  it("prerenders every Markdown path", () => {
    expect(generateStaticParams()).toHaveLength(markdownPaths().length);
  });
});
