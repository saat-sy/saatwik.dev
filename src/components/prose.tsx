import Link from "next/link";
import type { Paragraph } from "@/content/pages";

export function Prose({ paragraph }: { paragraph: Paragraph }) {
  return paragraph.map((segment, i) =>
    typeof segment === "string" ? (
      segment
    ) : (
      <Link key={i} href={segment.href}>
        {segment.text}
      </Link>
    ),
  );
}
