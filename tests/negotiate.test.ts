import { describe, expect, it } from "vitest";
import { prefersMarkdown } from "@/lib/negotiate";

describe("prefersMarkdown", () => {
  it.each([
    ["text/markdown", true],
    ["text/markdown, text/html;q=0.9", true],
    ["text/markdown;q=0.8, text/html;q=0.5", true],
    ["TEXT/MARKDOWN", true],
    ["text/*;q=0.1, text/markdown", true],
  ])("prefers Markdown for %s", (accept, expected) => {
    expect(prefersMarkdown(accept)).toBe(expected);
  });

  it.each([
    [null],
    [""],
    ["*/*"],
    ["text/html"],
    ["text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"],
    ["text/markdown, text/html"],
    ["text/html, text/markdown;q=0.5"],
    ["text/markdown;q=0"],
    ["application/json"],
    ["text/markdown;q=abc"],
  ])("keeps HTML for %s", (accept) => {
    expect(prefersMarkdown(accept)).toBe(false);
  });
});
