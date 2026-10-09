import { describe, expect, it } from "vitest";
import { GET as getVersions } from "@/app/api/route";
import { GET as getIndex } from "@/app/api/v1/route";
import { GET as getCatchAll } from "@/app/api/[...path]/route";
import { GET as getExperience } from "@/app/api/v1/experience/route";
import { GET as getProfile } from "@/app/api/v1/profile/route";
import { GET as listProjects } from "@/app/api/v1/projects/route";
import { GET as getProject, generateStaticParams } from "@/app/api/v1/projects/[slug]/route";
import { projects } from "@/content/site";

const list = (query = "") => listProjects(new Request(`https://saatwik.dev/api/projects${query}`));
const one = (slug: string) => getProject(new Request(`https://saatwik.dev/api/projects/${slug}`), { params: Promise.resolve({ slug }) } as never);

async function expectError(response: Response, status: number, code: string) {
  expect(response.status).toBe(status);
  expect(response.headers.get("content-type")).toContain("application/json");
  const { error } = await response.json();
  expect(error).toMatchObject({ status, code, documentation: "https://saatwik.dev/openapi.json" });
  expect(error.message.length).toBeGreaterThan(10);
  expect(error.hint.length).toBeGreaterThan(10);
}

describe("successful responses", () => {
  it("are JSON, readable cross-origin and say which version answered", async () => {
    for (const response of [getVersions(), getIndex(), getProfile(), getExperience(), await list(), await one(projects[0].slug)]) {
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain("application/json");
      expect(response.headers.get("access-control-allow-origin")).toBe("*");
      expect(response.headers.get("api-version")).toBe("1");
      expect(response.headers.get("access-control-expose-headers")).toContain("RateLimit-Remaining");
    }
  });

  it("describe the profile", async () => {
    const profile = await getProfile().json();
    expect(profile).toMatchObject({ name: "Saatwik Yajaman", website: "https://saatwik.dev" });
    expect(profile.education.length).toBeGreaterThan(0);
  });

  it("list experience and leadership", async () => {
    const body = await getExperience().json();
    expect(body.experience.length).toBeGreaterThan(0);
    expect(body.leadership.length).toBeGreaterThan(0);
  });

  it("index the endpoints of this version", async () => {
    const body = await getIndex().json();
    expect(body.openapi).toBe("https://saatwik.dev/openapi.json");
    expect(body.version).toBe("1");
    expect(body.endpoints.map((e: { path: string }) => e.path)).toEqual(["/api/v1/profile", "/api/v1/experience", "/api/v1/projects", "/api/v1/projects/{slug}"]);
    expect(body.projectSlugs).toEqual(projects.map((p) => p.slug));
  });

  it("list the versions", async () => {
    const body = await getVersions().json();
    expect(body.versions).toEqual([{ version: "1", status: "current", url: "https://saatwik.dev/api/v1", openapi: "https://saatwik.dev/openapi.json" }]);
    expect(body.documentation).toBe("https://saatwik.dev/developers");
  });
});

describe("GET /api/projects", () => {
  it("lists every project", async () => {
    const { projects: listed } = await (await list()).json();
    expect(listed.map((p: { slug: string }) => p.slug)).toEqual(projects.map((p) => p.slug));
    expect(listed[0].url).toBe(`https://saatwik.dev/projects/${projects[0].slug}`);
    expect(listed[0]).not.toHaveProperty("caseStudy");
  });

  it("filters by status", async () => {
    const { projects: listed } = await (await list("?status=building")).json();
    expect(listed.length).toBe(projects.filter((p) => p.status === "building").length);
    expect(listed.every((p: { status: string }) => p.status === "building")).toBe(true);
  });

  it("filters by featured", async () => {
    const yes = await (await list("?featured=true")).json();
    const no = await (await list("?featured=false")).json();
    expect(yes.projects.length).toBe(projects.filter((p) => p.featured).length);
    expect(yes.projects.length + no.projects.length).toBe(projects.length);
  });

  it("combines filters", async () => {
    const { projects: listed } = await (await list("?status=shipped&featured=true")).json();
    expect(listed.length).toBe(projects.filter((p) => p.status === "shipped" && p.featured).length);
  });

  it("rejects an invalid status with a JSON 400", async () => {
    const response = await list("?status=done");
    await expectError(response, 400, "invalid_parameter");
  });

  it("rejects an invalid featured value with a JSON 400", async () => {
    await expectError(await list("?featured=maybe"), 400, "invalid_parameter");
  });
});

describe("GET /api/projects/{slug}", () => {
  it("returns the full project", async () => {
    const project = projects[0];
    const body = await (await one(project.slug)).json();
    expect(body.name).toBe(project.name);
    expect(body.caseStudy).toEqual(project.caseStudy);
  });

  it("answers an unknown slug with a JSON 404 that lists the valid slugs", async () => {
    const response = await one("nope");
    await expectError(response, 404, "not_found");
    expect((await one("nope").then((r) => r.json())).error.hint).toContain(projects[0].slug);
  });

  it("prerenders every project", () => {
    expect(generateStaticParams()).toEqual(projects.map((p) => ({ slug: p.slug })));
  });
});

describe("unknown API paths", () => {
  it("get a JSON 404", async () => {
    await expectError(getCatchAll(new Request("https://saatwik.dev/api/nonexistent")), 404, "not_found");
  });
});
