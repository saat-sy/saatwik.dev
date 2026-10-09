import { describe, expect, it } from "vitest";
import { endpoints } from "@/lib/api";
import { developerSections } from "@/lib/developers";
import { openapi } from "@/lib/openapi";

const sections = developerSections();
const text = sections.map((s) => [s.heading, ...s.paragraphs.map((p) => p.map((x) => (typeof x === "string" ? x : x.text)).join("")), s.code ?? ""].join("\n")).join("\n");

describe("developer docs", () => {
  it("cover versioning, deprecation, rate limits, errors and the CLI", () => {
    expect(sections.map((s) => s.heading)).toEqual(["Overview", "Endpoints", "Versioning and deprecation", "Rate limits", "Errors", "Command line"]);
    for (const word of ["API-Version", "Deprecation", "Sunset", "successor-version", "Retry-After", "RateLimit-Remaining", "invalid_parameter", "npx saatwik"]) expect(text).toContain(word);
  });

  it("list every operation of the OpenAPI document with its ID and versioned path", () => {
    const ids = Object.values(openapi.paths).map((item) => item.get.operationId);
    expect(endpoints.map((e) => e.operationId).sort()).toEqual([...ids].sort());
    for (const e of endpoints) expect(text).toContain(`${e.method} ${e.path}   ${e.operationId}`);
  });
});
