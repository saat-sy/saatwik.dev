#!/usr/bin/env node
// Command line client for the saatwik.dev API. Zero dependencies; needs Node 18+.

import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const DEFAULT_BASE_URL = "https://saatwik.dev";

export const HELP = `saatwik: command line client for the saatwik.dev API

Usage: saatwik <command> [options]

Commands:
  profile                    Name, location, contact email, links and education
  experience                 Work experience and leadership roles
  projects                   List projects
      --status <status>      building, shipped or archived
      --featured <boolean>   true or false
  project <slug>             One project with its full case study
  page <path>                A page as Markdown, such as /about
  spec                       The OpenAPI document

Options:
  --base-url <url>           Server to call (default ${DEFAULT_BASE_URL})
  --version                  Print the version
  --help                     Print this help

Output is JSON (Markdown for page). Errors go to stderr with the API's hint and
the exit code is 1; a 429 also prints how long to wait.
`;

function parse(argv) {
  const positional = [];
  const options = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) positional.push(arg);
    else if (arg === "--help" || arg === "--version") options[arg.slice(2)] = true;
    else {
      const [name, inline] = arg.slice(2).split("=");
      const value = inline ?? argv[++i];
      if (value === undefined) throw new Error(`--${name} needs a value`);
      options[name] = value;
    }
  }
  return { positional, options };
}

function request(command, args, options) {
  const query = new URLSearchParams();
  for (const name of ["status", "featured"]) if (options[name] !== undefined) query.set(name, options[name]);
  const search = query.toString() ? `?${query}` : "";
  switch (command) {
    case "profile":
    case "experience":
    case "projects":
      return { path: `/api/v1/${command}${command === "projects" ? search : ""}` };
    case "project":
      if (!args[0]) throw new Error("project needs a slug, such as: saatwik project everygpu");
      return { path: `/api/v1/projects/${encodeURIComponent(args[0])}` };
    case "page":
      if (!args[0]) throw new Error("page needs a path, such as: saatwik page /about");
      return { path: args[0].startsWith("/") ? args[0] : `/${args[0]}`, markdown: true };
    case "spec":
      return { path: "/openapi.json" };
    default:
      throw new Error(`unknown command "${command}". Run saatwik --help.`);
  }
}

/** Runs the CLI. `io` is injectable so tests can fake the network and capture output. */
export async function run(argv, io = {}) {
  const { fetch: fetcher = fetch, out = (s) => process.stdout.write(s), err = (s) => process.stderr.write(s) } = io;
  let parsed;
  try {
    parsed = parse(argv);
  } catch (error) {
    err(`saatwik: ${error.message}\n`);
    return 1;
  }
  const { positional, options } = parsed;

  if (options.version) {
    out(`${JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")).version}\n`);
    return 0;
  }
  if (options.help || positional.length === 0) {
    out(HELP);
    return options.help ? 0 : 1;
  }

  let target;
  try {
    target = request(positional[0], positional.slice(1), options);
  } catch (error) {
    err(`saatwik: ${error.message}\n`);
    return 1;
  }

  const base = String(options["base-url"] ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
  let response;
  try {
    response = await fetcher(`${base}${target.path}`, { headers: { Accept: target.markdown ? "text/markdown" : "application/json" } });
  } catch (error) {
    err(`saatwik: could not reach ${base}: ${error.message}\n`);
    return 1;
  }

  const text = await response.text();
  if (response.ok) {
    out(target.markdown || !text ? text : `${JSON.stringify(JSON.parse(text), null, 2)}\n`);
    return 0;
  }

  let detail = text;
  try {
    const { error } = JSON.parse(text);
    detail = `${error.code}: ${error.message}${error.hint ? `\nhint: ${error.hint}` : ""}`;
  } catch {
    // Not a JSON error: print the body as it is.
  }
  err(`saatwik: HTTP ${response.status}\n${detail}\n`);
  const retryAfter = response.headers.get("retry-after");
  if (response.status === 429 && retryAfter) err(`retry after ${retryAfter} seconds\n`);
  return 1;
}

// Run only as the entry point; the bin link that npm creates is a symlink, so compare real paths.
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = await run(process.argv.slice(2));
}
