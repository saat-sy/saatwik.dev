# saatwik.dev

Personal portfolio of Saatwik S Yajaman. A minimal, terminal-black site with a working shell in the hero, edge-drawn 3D models, and every resume number drawn to scale.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | [Next.js](https://nextjs.org) 16 (App Router, Turbopack, Cache Components), React 19, TypeScript |
| Styling | Tailwind CSS v4, design tokens in `src/app/globals.css` |
| 2D motion | [GSAP](https://gsap.com) with ScrollTrigger, DrawSVG, ScrollTo, ScrambleText (via `@gsap/react`) |
| 3D | [three.js](https://threejs.org) via React Three Fiber and drei |
| Icons | Phosphor |
| Fonts | Barlow, Barlow Condensed, Martian Mono, IBM Plex Sans (self-hosted by `next/font`) |
| Hosting | Vercel |

## Run it locally

Requirements: Node.js 20.9 or newer (developed on Node 24) and npm.

```bash
git clone <this-repo-url> saatwik.dev
cd saatwik.dev
npm ci
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build (also type-checks)
npm run start      # serve the production build
npm run lint       # ESLint
npm run test       # Vitest: negotiation, proxy, API, OpenAPI, Markdown, discovery files
```

No environment variables or API keys are needed.

## Deploy

1. Push the repo to GitHub.
2. In Vercel, **Add New Project** and import the repo. The defaults (framework Next.js, `npm run build`) are correct.
3. Under **Settings > Domains**, add `saatwik.dev` and follow the DNS instructions.

Every push to the default branch deploys; pull requests get preview URLs.

## Editing content

All facts live in a few typed files, so content changes rarely touch components.

| What | Where |
| --- | --- |
| Name, tagline, availability, email, links | `src/content/site.ts` (`person`) |
| Jobs and leadership roles, with metrics | `src/content/site.ts` (`experience`, `leadership`) |
| Projects, each with a case-study page | `src/content/site.ts` (`projects`); set `status` (building, shipped, or archived), `featured` (home page), and `caseStudy` |
| Education | `src/content/site.ts` (`education`) |
| About, contact and privacy prose | `src/content/pages.ts` (shared by the HTML pages, the Markdown renderings and the API) |
| "How it works" diagram per project | `src/content/diagrams.ts` |
| 3D model per role or project | `src/components/work-scene/models.tsx` (keyed by slug) |
| Terminal commands in the hero | `src/components/terminal/commands.tsx` |
| Contact band copy | `src/components/contact.tsx` |

Metrics are typed (`before`/`after` with numeric `value`), and the site draws them to scale: before/after pairs become two dimension lines, percentages become a share of a full line. Copy that has not been written yet is wrapped in `<Construction>` and renders as a dashed placeholder box; replace it when the real text exists.

Availability ("open to full-time roles") is shown only when a visitor runs `cat status.txt` in the hero terminal. Keep it out of other copy.

## Project structure

```
src/
  app/                   routes: home, /projects, /projects/[slug], /about, /contact, /privacy, /api, /md
                         plus layout, template (page transitions), metadata, sitemap, robots, OG image, icon
  components/
    terminal/            the working shell in the hero
    sections/            home page sections (Work line, Projects)
    work-scene/          3D: models, Work stage, project model viewer
    backdrop/            the faint, blurred 3D background on every page
    drafting/            dimension lines, metric drawings, flow diagrams, scroll plotting
    site-nav.tsx         nav with sliding marker and click animations
    contact.tsx          contact band and its short form
  content/               all site data (see Editing content)
  lib/                   GSAP registration, media and viewport hooks; Markdown, API, OpenAPI and llms.txt builders
  proxy.ts               Accept: text/markdown negotiation and API method handling
tests/                   Vitest suites
```

## For agents

Everything is readable without a browser, from the same content as the pages.

| What | Where |
| --- | --- |
| Any page as Markdown: send `Accept: text/markdown` to its normal URL (the response has `Vary: Accept`; unknown paths get a Markdown 404) | `src/proxy.ts` rewrites to `src/app/md/[[...path]]`, rendered by `src/lib/markdown.ts` |
| Read-only JSON API: `/api`, `/api/profile`, `/api/experience`, `/api/projects`, `/api/projects/{slug}`; every error is `{"error": {status, code, message, hint, documentation}}` | `src/app/api/`, `src/lib/api.ts` |
| OpenAPI 3.1 description of the API at `/openapi.json` | `src/lib/openapi.ts` |
| Guide for agents, with when-to-use, at `/llms.txt` | `src/lib/llms.ts` |
| RFC 9727 API catalog at `/.well-known/api-catalog` | `src/app/.well-known/api-catalog/route.ts` |
| schema.org JSON-LD on the home page | `src/lib/structured-data.ts` |

When you add an endpoint, add it to `src/lib/openapi.ts`, `apiIndex()` in `src/lib/api.ts` and `src/lib/llms.ts`; the tests fail if the spec and the responses disagree. A new page needs an entry in `markdownFor()` and `src/app/sitemap.ts`.

## Motion and accessibility

Every animation honors `prefers-reduced-motion`: the page renders complete and still, the terminal intro is static, and 3D stops moving. 3D is decorative or duplicated in text, and the site degrades to plain content without WebGL. The background canvas mounts after the page is idle and renders at about 30fps; the Work stage mounts only when it nears the viewport.

## What stays out of git

`.gitignore` keeps local and agent tooling out of the repository: `node_modules/`, `.next/`, `.vercel`, `.env*`, the source resume in `resources/`, and design-agent files (`.agents/`, `.codex/`, `.impeccable/`, `AGENTS.md`, `PRODUCT.md`, `DESIGN.md`, `skills-lock.json`). Run `git status` before committing; only the app, config, and this README should appear.

## Optional: the design tooling used to build this

The site was designed with AI coding agents and two design skills. None of this is needed to run or edit the site; the files it produces are git-ignored.

- **TasteSkill** (anti-template frontend guidance): `npx skills add Leonxlnx/taste-skill`
- **Impeccable** (design direction, critique, and the design-system record in `PRODUCT.md` / `DESIGN.md`): install from [impeccable.style](https://impeccable.style).

With both installed, `PRODUCT.md` holds the product brief and `DESIGN.md` the design system (palette, type, components, rules) for agents to follow when extending the site.
