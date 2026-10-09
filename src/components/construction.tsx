import { placeholderParagraph } from "@/content/site";

/** Copy that has not been written yet, drawn as construction lines. */
export function Construction({ note, lines = 1 }: { note: string; lines?: number }) {
  return (
    <div className="construction">
      <p className="lettering mb-2 text-redline">Placeholder: {note}</p>
      {Array.from({ length: lines }, (_, i) => (
        <p key={i} className="mt-2 first:mt-0">
          {placeholderParagraph}
        </p>
      ))}
    </div>
  );
}
