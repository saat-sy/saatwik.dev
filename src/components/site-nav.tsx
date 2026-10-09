"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

// Primary nav. A redline marker slides to the current item, following the
// section in view; a clicked label decodes like terminal output, and in-page
// targets are reached with an eased scroll.

type Item = { href: string; label: string; key: string; section?: string; compact: boolean };

// About and Writing collapse into the footer on the narrowest screens.
const items: Item[] = [
  { href: "/#work", label: "Work", key: "work", section: "work", compact: true },
  { href: "/projects", label: "Projects", key: "projects", compact: true },
  { href: "/about", label: "About", key: "about", compact: false },
  { href: "/blog", label: "Writing", key: "writing", compact: false },
  { href: "#contact", label: "Contact", key: "contact", section: "contact", compact: true },
];

function routeKey(pathname: string) {
  if (pathname.startsWith("/projects")) return "projects";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/blog")) return "writing";
  return null;
}

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function SiteNav() {
  const pathname = usePathname();
  const list = useRef<HTMLUListElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const links = useRef(new Map<string, HTMLAnchorElement>());
  const labels = useRef(new Map<string, HTMLSpanElement>());
  const [spy, setSpy] = useState<string | null>(null);
  const active = spy ?? routeKey(pathname);

  // Which in-page section is in view: Work on the home page, Contact everywhere.
  useGSAP(
    () => {
      const triggers = items
        .filter((item) => item.section)
        .map((item) => {
          const el = document.getElementById(item.section!);
          if (!el) return null;
          return ScrollTrigger.create({
            trigger: el,
            start: "top 50%",
            end: "bottom 50%",
            onToggle: (self) => setSpy((cur) => (self.isActive ? item.key : cur === item.key ? null : cur)),
          });
        });
      return () => {
        triggers.forEach((t) => t?.kill());
        setSpy(null);
      };
    },
    { dependencies: [pathname] },
  );

  const placeMarker = useCallback(
    (animate: boolean) => {
      const m = marker.current;
      const ul = list.current;
      const link = active ? links.current.get(active) : undefined;
      if (!m || !ul) return;
      if (!link || link.offsetParent === null) {
        gsap.to(m, { autoAlpha: 0, duration: animate ? 0.2 : 0 });
        return;
      }
      const box = link.getBoundingClientRect();
      const base = ul.getBoundingClientRect();
      gsap.to(m, {
        x: box.left - base.left,
        width: box.width,
        autoAlpha: 1,
        duration: animate && !reduced() ? 0.5 : 0,
        ease: "expo.out",
      });
    },
    [active],
  );

  useEffect(() => {
    placeMarker(true);
    const onResize = () => placeMarker(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [placeMarker]);

  function onClick(e: MouseEvent<HTMLAnchorElement>, item: Item) {
    const label = labels.current.get(item.key);
    if (label && !reduced()) {
      gsap.to(label, { duration: 0.55, scrambleText: { text: item.label, chars: "01<>/_$#", speed: 0.7 }, ease: "none" });
    }
    if (!item.section) return;
    const target = document.getElementById(item.section);
    if (!target) return; // another page: let the link navigate
    e.preventDefault();
    setSpy(item.key);
    history.replaceState(null, "", `#${item.section}`);
    if (reduced()) target.scrollIntoView();
    else gsap.to(window, { duration: 1, scrollTo: { y: target, offsetY: 64 }, ease: "power3.inOut" });
  }

  return (
    <header className="sticky top-0 z-(--z-nav) border-b border-rule bg-sheet/90 backdrop-blur-sm">
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-(--sheet-max) items-center justify-between gap-6 px-(--gutter)">
        <Link href="/" className="font-display text-xl font-semibold uppercase tracking-[0.04em] hover:text-redline">
          saatwik<span className="hidden text-ink-faint sm:inline">.dev</span>
        </Link>
        <ul ref={list} className="relative flex items-center gap-3 sm:gap-7">
          {items.map((item) => (
            <li key={item.key} className={item.compact ? undefined : "hidden sm:block"}>
              <Link
                href={item.href}
                ref={(el) => {
                  if (el) links.current.set(item.key, el);
                  else links.current.delete(item.key);
                }}
                onClick={(e) => onClick(e, item)}
                aria-current={active === item.key ? (item.section ? "location" : "page") : undefined}
                className={`lettering block py-2 transition-colors duration-200 sm:text-[0.8125rem] ${active === item.key ? "text-ink" : "text-ink-soft hover:text-ink"}`}
              >
                <span
                  ref={(el) => {
                    if (el) labels.current.set(item.key, el);
                    else labels.current.delete(item.key);
                  }}
                  className="inline-block"
                >
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
          <span ref={marker} className="pointer-events-none invisible absolute -bottom-[13px] left-0 h-0.5 w-0 bg-redline" aria-hidden />
        </ul>
      </nav>
    </header>
  );
}
