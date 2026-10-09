import { describe, expect, it } from "vitest";
import { GET as getOpenapi } from "@/app/openapi.json/route";
import { GET as getExperience } from "@/app/api/experience/route";
import { GET as getProfile } from "@/app/api/profile/route";
import { GET as listProjects } from "@/app/api/projects/route";
import { GET as getProject } from "@/app/api/projects/[slug]/route";
import { projects } from "@/content/site";
import { openapi } from "@/lib/openapi";

type Schema = { $ref?: string; allOf?: Schema[]; type?: string; required?: string[]; properties?: Record<string, Schema>; items?: Schema; enum?: unknown[] };
type Operation = { operationId?: string; description?: string; parameters?: { name: string; in: string; schema?: Schema; description?: string }[]; responses: Record<string, { content?: Record<string, { schema: Schema }> }> };

const operations = Object.entries(openapi.paths).flatMap(([path, item]) =>
  Object.entries(item).map(([method, operation]) => ({ path, method, operation: operation as unknown as Operation })),
);

const lookup = (ref: string): Schema => {
  const node = ref.replace("#/components/schemas/", "").split("/").reduce<unknown>((acc, key) => (acc as Record<string, unknown>)[key], openapi.components.schemas);
  expect(node, ref).toBeDefined();
  return node as Schema;
};

/** Flattens $ref and allOf into the required keys and typed properties of an object schema. */
function shape(schema: Schema): { required: string[]; properties: Record<string, Schema> } {
  if (schema.$ref) return shape(lookup(schema.$ref));
  const parts = (schema.allOf ?? []).map(shape);
  return {
    required: [...(schema.required ?? []), ...parts.flatMap((p) => p.required)],
    properties: Object.assign({}, schema.properties, ...parts.map((p) => p.properties)),
  };
}

function refsIn(node: unknown): string[] {
  if (Array.isArray(node)) return node.flatMap(refsIn);
  if (node && typeof node === "object") return Object.entries(node).flatMap(([k, v]) => (k === "$ref" ? [String(v)] : refsIn(v)));
  return [];
}

describe("OpenAPI document", () => {
  it("is OpenAPI 3.1 with a server and the four operations", () => {
    expect(openapi.openapi).toBe("3.1.0");
    expect(openapi.servers[0].url).toBe("https://saatwik.dev");
    expect(operations.map((o) => `${o.method.toUpperCase()} ${o.path}`).sort()).toEqual([
      "GET /api/experience",
      "GET /api/profile",
      "GET /api/projects",
      "GET /api/projects/{slug}",
    ]);
  });

  it("gives every operation a unique camelCase operationId and a description", () => {
    const ids = operations.map((o) => o.operation.operationId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const { operation, path } of operations) {
      expect(operation.operationId, path).toMatch(/^[a-z][A-Za-z0-9]+$/);
      expect(operation.description!.length, path).toBeGreaterThan(30);
    }
  });

  it("types and describes every parameter, and declares path parameters in the path", () => {
    for (const { operation, path } of operations) {
      for (const parameter of operation.parameters ?? []) {
        expect(parameter.schema?.type, `${path} ${parameter.name}`).toBeDefined();
        expect(parameter.description, `${path} ${parameter.name}`).toBeTruthy();
      }
      const declared = (operation.parameters ?? []).filter((p) => p.in === "path").map((p) => p.name);
      expect(declared.sort(), path).toEqual([...path.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort());
    }
  });

  it("defines a JSON schema for every response, including errors", () => {
    for (const { operation, path } of operations) {
      expect(operation.responses["200"], path).toBeDefined();
      expect(operation.responses.default, path).toBeDefined();
      for (const [status, response] of Object.entries(operation.responses)) {
        expect(response.content?.["application/json"]?.schema, `${path} ${status}`).toBeDefined();
      }
    }
  });

  it("resolves every $ref", () => {
    const refs = refsIn(openapi);
    expect(refs.length).toBeGreaterThan(0);
    for (const ref of refs) lookup(ref);
  });

  it("offers the project slugs as the path parameter's enum", () => {
    const parameter = openapi.paths["/api/projects/{slug}"].get.parameters[0];
    expect(parameter.schema.enum).toEqual(projects.map((p) => p.slug));
  });
});

describe("OpenAPI document matches the API", () => {
  const slug = projects[0].slug;
  const responses: Record<string, () => Promise<Response> | Response> = {
    "/api/profile": () => getProfile(),
    "/api/experience": () => getExperience(),
    "/api/projects": () => listProjects(new Request("https://saatwik.dev/api/projects")),
    "/api/projects/{slug}": () => getProject(new Request(`https://saatwik.dev/api/projects/${slug}`), { params: Promise.resolve({ slug }) } as never),
  };

  it.each(Object.keys(responses))("%s returns every required property with a matching type", async (path) => {
    const { operation } = operations.find((o) => o.path === path)!;
    const body = await (await responses[path]()).json();
    const check = (value: unknown, schema: Schema, where: string) => {
      const { required, properties } = shape(schema);
      if (schema.items) return (value as unknown[]).forEach((item, i) => check(item, schema.items!, `${where}[${i}]`));
      if (schema.$ref && !Object.keys(properties).length) return;
      const object = value as Record<string, unknown>;
      for (const key of required) expect(object, `${where}.${key}`).toHaveProperty(key);
      for (const [key, sub] of Object.entries(properties)) {
        if (!(key in object)) continue;
        const resolved = sub.$ref ? lookup(sub.$ref) : sub;
        if (resolved.type === "array") (object[key] as unknown[]).forEach((item, i) => resolved.items && check(item, resolved.items, `${where}.${key}[${i}]`));
        else if (resolved.type === "object" || resolved.allOf) check(object[key], resolved, `${where}.${key}`);
        else if (resolved.type === "string") expect(typeof object[key], `${where}.${key}`).toBe("string");
        else if (resolved.type === "boolean") expect(typeof object[key], `${where}.${key}`).toBe("boolean");
        if (resolved.enum) expect(resolved.enum, `${where}.${key}`).toContain(object[key]);
      }
    };
    check(body, operation.responses["200"].content!["application/json"].schema, path);
  });
});

describe("GET /openapi.json", () => {
  it("serves the document as JSON", async () => {
    const response = getOpenapi();
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(openapi)));
  });
});
