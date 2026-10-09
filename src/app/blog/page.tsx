import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/content/blog";
import { formatDate } from "@/content/dates";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on systems, infrastructure, and building products.",
};

export default function BlogIndex() {
  return (
    <div className="mx-auto max-w-(--sheet-max) px-(--gutter) py-16">
      <h1 className="font-display text-7xl font-semibold uppercase leading-[0.9] sm:text-8xl">Writing</h1>
      {posts.length === 0 ? (
        <p className="construction mt-12 max-w-xl">No posts yet. The first one is on the drafting table.</p>
      ) : (
        <ul className="mt-12 divide-y divide-rule border-y border-rule">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group grid gap-2 py-6 sm:grid-cols-[10rem_1fr] sm:gap-8">
                <time dateTime={post.date} className="lettering pt-1.5 text-ink-faint">
                  {formatDate(post.date)}
                </time>
                <span>
                  <span className="block font-display text-3xl font-semibold uppercase group-hover:text-redline">
                    {post.title}
                  </span>
                  <span className="mt-1 block text-ink-soft">{post.summary}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
