import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, posts } from "@/content/blog";
import { formatDateLong } from "@/content/dates";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return post ? { title: post.title, description: post.summary } : {};
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const { default: Body } = await import(`@/content/blog/${slug}.mdx`);

  return (
    <article className="mx-auto max-w-(--sheet-max) px-(--gutter) py-16">
      <Link href="/blog" className="lettering text-ink-soft hover:text-ink">
        All writing
      </Link>
      <header className="mt-10 max-w-4xl">
        <time dateTime={post.date} className="lettering text-ink-faint">
          {formatDateLong(post.date)}
        </time>
        <h1 className="font-display text-5xl font-semibold uppercase leading-none sm:text-6xl">{post.title}</h1>
      </header>
      <div className="mt-10 max-w-[68ch] text-lg">
        <Body />
      </div>
    </article>
  );
}
