import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-(--sheet-max) flex-col justify-center gap-5 px-(--gutter) py-16">
      <h1 className="font-display text-8xl font-semibold uppercase leading-[0.9]">404</h1>
      <p className="max-w-[48ch] text-lg text-ink-soft">This page does not exist. The link may be old or mistyped.</p>
      <Link href="/" className="w-fit text-ink underline decoration-ink-faint underline-offset-4 hover:text-redline hover:decoration-redline">
        Back to home
      </Link>
    </div>
  );
}
