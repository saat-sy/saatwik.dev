"use client";

import { ArrowRight, MagnifyingGlass, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/content/site";
import { ProjectSleeve } from "./project-sleeve";
import styles from "./projects.module.css";

const groups = [
  { status: "building", id: "building", label: "Building now" },
  { status: "shipped", id: "shipped", label: "Shipped" },
  { status: "archived", id: "archive", label: "Archive" },
] as const;

export function ProjectDirectory({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const search = useRef<HTMLInputElement>(null);
  const matches = projects.filter((p) =>
    (filter === "all" || p.status === filter) &&
    `${p.name} ${p.kind} ${p.summary} ${p.stack.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        search.current?.focus();
      }
    };
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, []);

  return <>
    <div className={styles.toolbar}>
      <div className={styles.filters} aria-label="Filter projects">
        <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>All <span>{projects.length}</span></button>
        {groups.map((group) => <button type="button" key={group.status} aria-pressed={filter === group.status} onClick={() => setFilter(group.status)}>
          {group.label} <span>{projects.filter((p) => p.status === group.status).length}</span>
        </button>)}
      </div>
      <div className={styles.search}>
        <MagnifyingGlass size={16} aria-hidden />
        <label htmlFor="project-search" className="sr-only">Search projects by name or technology</label>
        <input ref={search} id="project-search" type="search" placeholder="Find a project" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Escape") { setQuery(""); e.currentTarget.blur(); } }} />
        {query ? <button type="button" onClick={() => { setQuery(""); search.current?.focus(); }} aria-label="Clear search"><X size={14} /></button> : <kbd aria-hidden>/</kbd>}
      </div>
    </div>
    <div className={styles.collection}>
      {groups.map((group) => {
        const items = matches.filter((p) => p.status === group.status);
        return <section key={group.id} id={group.id} aria-labelledby={`${group.id}-heading`} hidden={!items.length} className={styles.sleeveGroup}>
          <h2 id={`${group.id}-heading`}>{group.label}<span>{String(items.length).padStart(2, "0")}</span></h2>
          <ul className={styles.sleeves}>
            {items.map((project) => <li key={project.slug}><ProjectSleeve project={project} /></li>)}
          </ul>
        </section>;
      })}
      {!matches.length ? <div className={styles.empty}><p>No projects match “{query}”.</p><button type="button" onClick={() => { setQuery(""); setFilter("all"); }}>Reset filters <ArrowRight size={14} aria-hidden /></button></div> : null}
      <p className={styles.resultCount} role="status">{matches.length} of {projects.length} projects</p>
    </div>
  </>;
}
