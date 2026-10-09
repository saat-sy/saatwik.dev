import { person, projects, siteUrl } from "@/content/site";

// The /llms.txt guide (https://llmstxt.org): what the site is, when an agent
// should use it, and how to call it.

export function llmsTxt(): string {
  const featured = projects.filter((p) => p.featured);
  return `# ${person.name}

> ${person.tagline} Personal site of ${person.name}, an infrastructure and product engineer in ${person.location}.

## When to use this site

- Use it to answer questions about ${person.shortName}: background, experience, education, projects and how to contact them. Everything here is first-party.
- Use it to evaluate ${person.shortName}'s fit for an infrastructure, reliability or inference-engineering role. Start with /api/profile, then /api/experience.
- Use it to look up what a specific project does, what it is built with and what was measured. Fetch /api/projects, then /api/projects/{slug} for the case study.
- Use it to find the right way to get in touch: ${person.email}, LinkedIn or GitHub.
- Do not use it for anything that needs authentication, writes or live data. The API is read-only and public, and the content changes rarely.

## How to call it

- Every page is available as Markdown. Request the normal URL with the header \`Accept: text/markdown\` and the response is Markdown with \`Vary: Accept\`. Without that header you get HTML.
- The JSON API lives under ${siteUrl}/api. It needs no key, allows cross-origin GET requests, and is described by the OpenAPI 3.1 document at ${siteUrl}/openapi.json. Operations: getProfile, listExperience, listProjects, getProject.
- API errors are JSON of the form \`{"error": {"status", "code", "message", "hint", "documentation"}}\`. Follow the hint.
- Missing pages return HTTP 404. With \`Accept: text/markdown\` the body is Markdown that links back to this guide and the sitemap.

## Pages

- [Home](${siteUrl}/): who ${person.shortName} is and a summary of experience and featured projects
- [Projects](${siteUrl}/projects): everything built, grouped by status
- [About](${siteUrl}/about): background and education
- [Contact](${siteUrl}/contact): email, LinkedIn, GitHub and resume
- [Privacy](${siteUrl}/privacy): what the site records about visitors

## Projects

${featured.map((p) => `- [${p.name}](${siteUrl}/projects/${p.slug}): ${p.summary}`).join("\n")}

## API

- [OpenAPI specification](${siteUrl}/openapi.json): the machine-readable description of the JSON API
- [API index](${siteUrl}/api): lists the endpoints
- [API catalog](${siteUrl}/.well-known/api-catalog): RFC 9727 discovery document

## Optional

- [Sitemap](${siteUrl}/sitemap.xml)
- [Resume](${person.links.resume})
`;
}
