import type { MetadataRoute } from "next";
import { posts } from "@/content/blog";
import { projects } from "@/content/site";

const base = "https://saatwik.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, priority: 1 },
    { url: `${base}/projects`, priority: 0.8 },
    { url: `${base}/about`, priority: 0.6 },
    { url: `${base}/blog`, priority: 0.6 },
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}`, priority: 0.8 })),
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.date, priority: 0.5 })),
  ];
}
