import Link from "next/link";
import { posts } from "@/content/blog";
import { formatDate } from "@/content/dates";

export function LatestWriting() {
  const latest = posts.slice(0, 3);
  return (
    <section aria-labelledby="writing-title" className="mx-auto max-w-(--sheet-max) px-(--gutter) py-24">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <h2 id="writing-title" className="font-display text-5xl font-semibold uppercase sm:text-6xl">
          Writing
        </h2>
        <Link href="/blog" className="lettering text-ink-soft underline decoration-ink-faint hover:text-ink hover:decoration-redline sm:text-[0.8125rem]">
          All posts
        </Link>
      </div>
      {latest.length === 0 ? (
        <p className="construction max-w-xl">No posts yet. The first one is on the drafting table.</p>
      ) : (
        <ul className="grid border-l border-t border-rule md:grid-cols-3">
          {latest.map((post) => (
            <li key={post.slug} className="border-b border-r border-rule">
              <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col gap-3 p-6">
                <time dateTime={post.date} className="lettering text-ink-faint">
                  {formatDate(post.date)}
                </time>
                <span className="font-display text-2xl font-semibold uppercase leading-tight group-hover:text-redline">{post.title}</span>
                <span className="text-ink-soft">{post.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
