import { education, person, siteUrl } from "@/content/site";

export const personId = `${siteUrl}/#person`;

const [locality, region] = person.location.split(",").map((part) => part.trim());

/** schema.org JSON-LD for the home page: the site and the person it describes. */
export function homeStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "saatwik.dev",
        description: person.tagline,
        inLanguage: "en",
        publisher: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: person.name,
        url: siteUrl,
        description: person.tagline,
        jobTitle: "Infrastructure and product engineer",
        email: `mailto:${person.email}`,
        sameAs: [person.links.linkedin, person.links.github],
        address: {
          "@type": "PostalAddress",
          addressLocality: locality,
          addressRegion: region,
          addressCountry: "US",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "professional inquiries",
          email: person.email,
          availableLanguage: "English",
        },
        alumniOf: education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school })),
        knowsAbout: ["Inference engineering", "Distributed systems", "Site reliability engineering", "Kubernetes", "AWS", "Android"],
      },
    ],
  };
}
