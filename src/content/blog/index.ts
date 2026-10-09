type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
};

// Newest first. Each slug has a matching `<slug>.mdx` file in this folder.
export const posts: PostMeta[] = [
  {
    slug: "sample-post",
    title: "Sample post",
    date: "2026-10-09",
    summary: "A placeholder post that shows how writing renders on the site.",
  },
];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
