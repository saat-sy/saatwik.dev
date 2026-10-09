import { projects, siteUrl } from "@/content/site";
import { projectStatuses } from "./api";

// The OpenAPI 3.1 description of /api, served at /openapi.json.

const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
const json = (schema: object) => ({ "application/json": { schema } });
const errorResponse = (description: string) => ({ description, content: json(ref("Error")) });

const string = (description: string, extra: object = {}) => ({ type: "string", description, ...extra });
const array = (items: object, description: string) => ({ type: "array", description, items });

const metricValue = {
  type: "object",
  description: "A measured value.",
  required: ["value", "unit", "display"],
  properties: {
    value: { type: "number", description: "The numeric value." },
    unit: string("Unit of the value, such as h, d, % or tok/s. Empty when the value is a plain count."),
    display: string("The value as shown on the site, such as '2 hours'."),
  },
};

const role = {
  type: "object",
  description: "A work or leadership role.",
  required: ["slug", "org", "title", "place", "start", "end", "points", "metrics", "stack"],
  properties: {
    slug: string("Stable identifier of the role."),
    org: string("Organization name."),
    title: string("Job title."),
    place: string("Where the role was based."),
    start: string("Start month as YYYY-MM.", { pattern: "^\\d{4}-\\d{2}$" }),
    end: string("End month as YYYY-MM, or 'present'."),
    points: array(string("One accomplishment."), "What was accomplished."),
    metrics: array(ref("Metric"), "Measured results."),
    stack: array(string("A technology."), "Technologies used."),
  },
};

const projectSummary = {
  type: "object",
  description: "A project in the project list.",
  required: ["slug", "name", "status", "featured", "kind", "period", "summary", "stack", "url"],
  properties: {
    slug: string("Stable identifier; use it with getProject."),
    name: string("Project name."),
    status: { type: "string", enum: [...projectStatuses], description: "Where the project stands." },
    featured: { type: "boolean", description: "Whether the project is featured on the home page." },
    kind: string("What sort of project it is."),
    period: string("When it was built; empty when not recorded."),
    summary: string("One-sentence description."),
    stack: array(string("A technology."), "Technologies used."),
    liveUrl: string("A published app or demo.", { format: "uri" }),
    repoUrl: string("The public source repository.", { format: "uri" }),
    url: string("The project's page on the website.", { format: "uri" }),
  },
};

const slugs = projects.map((p) => p.slug);

export const openapi = {
  openapi: "3.1.0",
  info: {
    title: "saatwik.dev public API",
    version: "1.0.0",
    summary: "Read-only JSON access to the content of saatwik.dev.",
    description:
      "Profile, experience and projects of Saatwik Yajaman, an infrastructure and product engineer. Every endpoint is a public, unauthenticated GET. Failures return the Error schema as JSON. Pages are also available as Markdown by sending `Accept: text/markdown`. A guide for agents is at /llms.txt.",
    contact: { name: "Saatwik Yajaman", url: `${siteUrl}/contact`, email: "saatwik.sy@gmail.com" },
  },
  servers: [{ url: siteUrl, description: "Production" }],
  tags: [
    { name: "profile", description: "Who Saatwik is and how to reach them." },
    { name: "projects", description: "Projects and their case studies." },
  ],
  externalDocs: { description: "Guide for agents", url: `${siteUrl}/llms.txt` },
  paths: {
    "/api/profile": {
      get: {
        operationId: "getProfile",
        tags: ["profile"],
        summary: "Get the profile",
        description: "Returns name, tagline, location, contact email, profile links and education.",
        responses: {
          "200": { description: "The profile.", content: json(ref("Profile")) },
          default: errorResponse("An error."),
        },
      },
    },
    "/api/experience": {
      get: {
        operationId: "listExperience",
        tags: ["profile"],
        summary: "List work experience",
        description: "Returns work experience and leadership roles, each with accomplishments, measured results and the technologies used.",
        responses: {
          "200": {
            description: "Work and leadership roles.",
            content: json({
              type: "object",
              required: ["experience", "leadership"],
              properties: {
                experience: array(ref("Role"), "Work experience, most recent first."),
                leadership: array(ref("Role"), "Leadership roles."),
              },
            }),
          },
          default: errorResponse("An error."),
        },
      },
    },
    "/api/projects": {
      get: {
        operationId: "listProjects",
        tags: ["projects"],
        summary: "List projects",
        description: "Returns the projects, optionally filtered by status or by whether they are featured. Use getProject for a project's case study.",
        parameters: [
          {
            name: "status",
            in: "query",
            required: false,
            description: "Only projects with this status.",
            schema: { type: "string", enum: [...projectStatuses] },
          },
          {
            name: "featured",
            in: "query",
            required: false,
            description: "Only featured projects (true) or only the others (false).",
            schema: { type: "boolean" },
          },
        ],
        responses: {
          "200": {
            description: "The matching projects.",
            content: json({
              type: "object",
              required: ["projects"],
              properties: { projects: array(ref("ProjectSummary"), "Matching projects.") },
            }),
          },
          "400": errorResponse("A query parameter has an invalid value."),
          default: errorResponse("An error."),
        },
      },
    },
    "/api/projects/{slug}": {
      get: {
        operationId: "getProject",
        tags: ["projects"],
        summary: "Get a project",
        description: "Returns one project with what it does, measured results and its full case study.",
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            description: "The project's slug, from listProjects.",
            schema: { type: "string", enum: slugs },
          },
        ],
        responses: {
          "200": { description: "The project.", content: json(ref("Project")) },
          "404": errorResponse("No project has this slug."),
          default: errorResponse("An error."),
        },
      },
    },
  },
  components: {
    schemas: {
      Error: {
        type: "object",
        description: "Returned with every non-2xx response.",
        required: ["error"],
        properties: {
          error: {
            type: "object",
            required: ["status", "code", "message", "hint", "documentation"],
            properties: {
              status: { type: "integer", description: "The HTTP status code." },
              code: { type: "string", enum: ["not_found", "method_not_allowed", "invalid_parameter"], description: "A stable, machine-readable error code." },
              message: string("What went wrong."),
              hint: string("How to fix the request."),
              documentation: string("Where the API is described.", { format: "uri" }),
            },
          },
        },
      },
      Profile: {
        type: "object",
        description: "The person behind the site.",
        required: ["name", "tagline", "location", "email", "website", "links", "education"],
        properties: {
          name: string("Full name."),
          tagline: string("One-sentence description of the work."),
          location: string("City and state."),
          email: string("Contact email address.", { format: "email" }),
          website: string("The site's URL.", { format: "uri" }),
          links: {
            type: "object",
            description: "Profiles elsewhere on the web.",
            required: ["linkedin", "github", "resume"],
            properties: {
              linkedin: string("LinkedIn profile.", { format: "uri" }),
              github: string("GitHub profile.", { format: "uri" }),
              resume: string("Download link for the resume.", { format: "uri" }),
            },
          },
          education: array(
            {
              type: "object",
              required: ["school", "degree", "place", "start", "end"],
              properties: {
                school: string("Institution."),
                degree: string("Degree."),
                note: string("Additional note, such as a teaching role."),
                place: string("Where the institution is."),
                start: string("Start month as YYYY-MM."),
                end: string("End month as YYYY-MM."),
              },
            },
            "Degrees, most recent first.",
          ),
        },
      },
      Metric: {
        type: "object",
        description: "A measured result, optionally with the value before it.",
        required: ["label", "after"],
        properties: {
          label: string("What was measured."),
          before: metricValue,
          after: metricValue,
        },
      },
      Role: role,
      ProjectSummary: projectSummary,
      Project: {
        allOf: [
          ref("ProjectSummary"),
          {
            type: "object",
            required: ["points", "metrics", "caseStudy"],
            properties: {
              points: array(string("One thing the project does."), "What the project does."),
              metrics: array(ref("Metric"), "Measured results; empty when none were recorded."),
              caseStudy: array(
                {
                  type: "object",
                  required: ["heading", "body"],
                  properties: { heading: string("Section heading."), body: string("Section text.") },
                },
                "The case study, in reading order.",
              ),
            },
          },
        ],
      },
    },
  },
};
