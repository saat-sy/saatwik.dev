import type { CSSProperties } from "react";

// Display headings are sized for short names. A long name (Hyprlander,
// FlutterGenerator) would overrun its column, so each heading is capped at the
// size where the whole word fits: narrow is the full-width layout, wide is the
// share of the sheet its column takes at lg and above.

const GLYPH_WIDTH = 0.46;
const SHEET = "min(100vw, 1280px)";

export function fitHeading(name: string, wideShare: number): CSSProperties {
  const glyphs = name.length * GLYPH_WIDTH;
  return {
    "--fit-narrow": `calc((100vw - 3rem) / ${glyphs})`,
    "--fit-wide": `calc(${SHEET} * ${wideShare} / ${glyphs})`,
  } as CSSProperties;
}
