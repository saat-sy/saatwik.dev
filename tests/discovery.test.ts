import { describe, expect, it } from "vitest";
import { GET as getApiCatalog } from "@/app/.well-known/api-catalog/route";
import { GET as getLlms } from "@/app/llms.txt/route";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { projects } from "@/content/site";
import { markdownPaths } from "@/lib/markdown";
import { homeStructuredData } from "@/lib/structured-data";

describe("/llms.txt", () => {
  it("follows the llms.txt layout", async () => {
    const response = getLlms();
    expect(response.headers.get("content-type")).toContain("text/plain");
    const text = await response.text();
    expect(text.startsWith("# Saatwik Yajaman\n\n> ")).toBe(true);
    expect(text.match(/^# /gm)).toHaveLength(1);
    expect(text).toMatch(/^## Optional$/m);
  });

  it("tells agents when to use the site and how to call it", async () => {
    const text = await getLlms().text();
    const when = text.split("## When to use this site")[1].split("\n## ")[0];
    expect(when.match(/^- /gm)!.length).toBeGreaterThanOrEqual(3);
    expect(text).toContain("## How to call it");
    expect(text).toContain("Accept: text/markdown");
    for (const operationId of ["getProfile", "listExperience", "listProjects", "getProject"]) expect(text).toContain(operationId);
  });

  it("links the OpenAPI document, the API, every featured project and the sitemap", async () => {
    const text = await getLlms().text();
    for (const url of ["/openapi.json", "/api", "/.well-known/api-catalog", "/sitemap.xml"]) expect(text).toContain(`(https://saatwik.dev${url})`);
    for (const p of projects.filter((p) => p.featured)) expect(text).toContain(`(https://saatwik.dev/projects/${p.slug})`);
  });
});

describe("availability", () => {
  it("stays out of copy that the contact page and hero terminal do not already carry", async () => {
    const { markdownFor } = await import("@/lib/markdown");
    const { profileData } = await import("@/lib/api");
    const { person } = await import("@/content/site");
    const texts = [await getLlms().text(), markdownFor("/")!, markdownFor("/about")!, JSON.stringify(profileData())];
    for (const text of texts) expect(text).not.toContain(person.availability);
  });
});

describe("/.well-known/api-catalog", () => {
  it("is an RFC 9727 linkset pointing at the OpenAPI document", async () => {
    const response = getApiCatalog();
    expect(response.headers.get("content-type")).toContain("application/linkset+json");
    const { linkset } = await response.json();
    expect(linkset[0].anchor).toBe("https://saatwik.dev/api");
    expect(linkset[0]["service-desc"][0].href).toBe("https://saatwik.dev/openapi.json");
  });
});

describe("home page JSON-LD", () => {
  const graph = homeStructuredData()["@graph"];
  const person = graph.find((node) => node["@type"] === "Person")!;

  it("describes the person with identity, contact and address", () => {
    expect(homeStructuredData()["@context"]).toBe("https://schema.org");
    expect(person).toMatchObject({ name: "Saatwik Yajaman", url: "https://saatwik.dev" });
    expect(person.description).toBeTruthy();
    expect(person.sameAs).toEqual(expect.arrayContaining([expect.stringContaining("linkedin.com"), expect.stringContaining("github.com")]));
    expect(person.contactPoint).toMatchObject({ "@type": "ContactPoint", email: "saatwik.sy@gmail.com", contactType: expect.any(String) });
    expect(person.address).toEqual({ "@type": "PostalAddress", addressLocality: "Los Angeles", addressRegion: "CA", addressCountry: "US" });
  });

  it("describes the website and ties it to the person", () => {
    const site = graph.find((node) => node["@type"] === "WebSite")!;
    expect(site.url).toBe("https://saatwik.dev");
    expect(site.publisher).toEqual({ "@id": person["@id"] });
  });
});

describe("crawler files", () => {
  it("lists every page with a Markdown rendering in the sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);
    for (const path of markdownPaths()) expect(urls).toContain(`https://saatwik.dev${path === "/" ? "" : path}`);
    expect(urls).toContain("https://saatwik.dev/privacy");
  });

  it("points at the sitemap", () => {
    expect(robots().sitemap).toBe("https://saatwik.dev/sitemap.xml");
  });
});
