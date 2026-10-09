import { ImageResponse } from "next/og";
import { person } from "@/content/site";

export const alt = `${person.name}: ${person.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Share card in the site's terminal style: the whoami session, name large.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 88px",
          background: "#0a0c0b",
          color: "#e8ede9",
          fontFamily: "monospace",
        }}
      >
        <div style={{ fontSize: 30, color: "#7d877f" }}>saatwik@dev:~$ whoami</div>
        <div style={{ fontSize: 104, fontWeight: 700, lineHeight: 1, marginTop: 28, textTransform: "uppercase", fontFamily: "sans-serif" }}>
          {person.name}
        </div>
        <div style={{ fontSize: 36, color: "#a3ada6", marginTop: 28, maxWidth: 900, fontFamily: "sans-serif" }}>{person.tagline}</div>
      </div>
    ),
    size,
  );
}
