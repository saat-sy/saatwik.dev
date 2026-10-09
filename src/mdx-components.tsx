import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h2: (props) => (
    <h2 className="mt-14 mb-4 font-display text-3xl font-semibold uppercase leading-tight tracking-[0.01em]" {...props} />
  ),
  h3: (props) => <h3 className="mt-10 mb-3 font-display text-2xl font-semibold uppercase" {...props} />,
  p: (props) => <p className="my-5 text-ink-soft" {...props} />,
  a: (props) => <a className="text-ink underline decoration-ink-faint hover:decoration-redline" {...props} />,
  ul: (props) => <ul className="my-5 list-[square] space-y-2 pl-5 text-ink-soft marker:text-ink-faint" {...props} />,
  ol: (props) => <ol className="my-5 list-decimal space-y-2 pl-5 text-ink-soft marker:text-ink-faint" {...props} />,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  code: (props) => <code className="lettering bg-sheet-deep px-1.5 py-0.5 text-[0.8125rem] text-ink" {...props} />,
  pre: (props) => (
    // Focusable so keyboard users can scroll long lines.
    <pre tabIndex={0} className="lettering my-6 overflow-x-auto border border-rule bg-sheet-deep p-4 text-[0.8125rem]" {...props} />
  ),
  blockquote: (props) => <blockquote className="my-6 border-l border-ink pl-5 text-ink" {...props} />,
  hr: () => <hr className="my-12 border-dashed border-rule" />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
