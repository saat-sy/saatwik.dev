import { describe, expect, it } from "vitest";
import { HELP, run } from "../cli/saatwik.mjs";

type Reply = { status?: number; body?: string; headers?: Record<string, string> };

async function cli(argv: string[], reply: Reply = { body: "{}" }) {
  const calls: { url: string; accept: string }[] = [];
  let out = "";
  let err = "";
  const code: number = await run(argv, {
    fetch: async (url: string, init: { headers: { Accept: string } }) => {
      calls.push({ url, accept: init.headers.Accept });
      return new Response(reply.body ?? "", { status: reply.status ?? 200, headers: reply.headers });
    },
    out: (s: string) => (out += s),
    err: (s: string) => (err += s),
  });
  return { code, out, err, calls };
}

describe("saatwik CLI requests", () => {
  it.each([
    [["profile"], "https://saatwik.dev/api/v1/profile"],
    [["experience"], "https://saatwik.dev/api/v1/experience"],
    [["projects"], "https://saatwik.dev/api/v1/projects"],
    [["projects", "--status", "building"], "https://saatwik.dev/api/v1/projects?status=building"],
    [["projects", "--status=shipped", "--featured", "true"], "https://saatwik.dev/api/v1/projects?status=shipped&featured=true"],
    [["project", "everygpu"], "https://saatwik.dev/api/v1/projects/everygpu"],
    [["project", "a b"], "https://saatwik.dev/api/v1/projects/a%20b"],
    [["spec"], "https://saatwik.dev/openapi.json"],
    [["profile", "--base-url", "http://localhost:3000/"], "http://localhost:3000/api/v1/profile"],
  ])("%j calls %s", async (argv, url) => {
    const { calls, code } = await cli(argv);
    expect(code).toBe(0);
    expect(calls).toEqual([{ url, accept: "application/json" }]);
  });

  it("fetches a page as Markdown", async () => {
    const { calls, out } = await cli(["page", "about"], { body: "# About\n" });
    expect(calls).toEqual([{ url: "https://saatwik.dev/about", accept: "text/markdown" }]);
    expect(out).toBe("# About\n");
  });
});

describe("saatwik CLI output", () => {
  it("pretty-prints JSON", async () => {
    expect((await cli(["profile"], { body: '{"a":1}' })).out).toBe('{\n  "a": 1\n}\n');
  });

  it("prints the API error code, message and hint to stderr and exits 1", async () => {
    const body = JSON.stringify({ error: { status: 404, code: "not_found", message: "No project.", hint: "Use another slug." } });
    const { code, out, err } = await cli(["project", "x"], { status: 404, body });
    expect(code).toBe(1);
    expect(out).toBe("");
    expect(err).toContain("HTTP 404");
    expect(err).toContain("not_found: No project.");
    expect(err).toContain("hint: Use another slug.");
  });

  it("says how long to wait on a 429", async () => {
    const body = JSON.stringify({ error: { status: 429, code: "rate_limited", message: "Too many requests.", hint: "Wait." } });
    const { code, err } = await cli(["profile"], { status: 429, body, headers: { "Retry-After": "17" } });
    expect(code).toBe(1);
    expect(err).toContain("retry after 17 seconds");
  });

  it("prints a non-JSON error body as it is", async () => {
    expect((await cli(["profile"], { status: 502, body: "Bad gateway" })).err).toContain("Bad gateway");
  });

  it("reports an unreachable server", async () => {
    let err = "";
    const code = await run(["profile"], { fetch: async () => { throw new Error("ECONNREFUSED"); }, err: (s: string) => (err += s) });
    expect(code).toBe(1);
    expect(err).toContain("could not reach https://saatwik.dev: ECONNREFUSED");
  });
});

describe("saatwik CLI usage", () => {
  it("prints help and exits 0 for --help", async () => {
    const { code, out, calls } = await cli(["--help"]);
    expect([code, out, calls]).toEqual([0, HELP, []]);
  });

  it("prints help and exits 1 without a command", async () => {
    const { code, out } = await cli([]);
    expect([code, out]).toEqual([1, HELP]);
  });

  it("prints the package version", async () => {
    expect((await cli(["--version"])).out).toMatch(/^1\.0\.0\n$/);
  });

  it.each([
    [["nope"], 'unknown command "nope"'],
    [["project"], "project needs a slug"],
    [["page"], "page needs a path"],
    [["projects", "--status"], "--status needs a value"],
  ])("rejects %j", async (argv, message) => {
    const { code, err, calls } = await cli(argv);
    expect(code).toBe(1);
    expect(err).toContain(message);
    expect(calls).toEqual([]);
  });
});
