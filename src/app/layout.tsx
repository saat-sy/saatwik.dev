import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed, IBM_Plex_Sans, Martian_Mono } from "next/font/google";
import { Backdrop } from "@/components/backdrop";
import { Contact } from "@/components/contact";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { person } from "@/content/site";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: "600",
});

const plex = IBM_Plex_Sans({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  // Only the contact band at the bottom uses it; don't compete with the first paint.
  preload: false,
});

const martian = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://saatwik.dev"),
  title: {
    default: `${person.name}, infrastructure and product engineer`,
    template: `%s | ${person.name}`,
  },
  description: person.tagline,
  openGraph: {
    type: "website",
    siteName: "saatwik.dev",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0c0b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable} ${plex.variable} ${martian.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <Backdrop />
        <a
          href="#main"
          className="lettering fixed left-4 top-3 z-(--z-skip) -translate-y-16 bg-ink px-3 py-2 text-sheet-deep focus:translate-y-0"
        >
          Skip to content
        </a>
        <SiteNav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Contact />
        <SiteFooter />
      </body>
    </html>
  );
}
