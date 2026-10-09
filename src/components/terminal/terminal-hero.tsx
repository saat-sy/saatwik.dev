"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { person } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { complete, run } from "./commands";

// The hero is a working shell. The intro session is in the page from the first
// byte; with motion allowed it is typed out, then the prompt takes commands.

function Prompt({ children }: { children?: ReactNode }) {
  return (
    <p className="whitespace-pre-wrap break-words">
      <span className="text-ink-faint">saatwik@dev</span>
      <span className="text-ink-faint">:~$ </span>
      {children}
    </p>
  );
}

type Line = { id: number; cmd: string; output: ReactNode };

export function TerminalHero() {
  const scope = useRef<HTMLElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [value, setValue] = useState("");
  const history = useRef<string[]>([]);
  const cursor = useRef(-1);
  const nextId = useRef(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ delay: 0.3 });
        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
          const typed = step.querySelector<HTMLElement>("[data-typed]");
          const out = step.querySelector<HTMLElement>("[data-out]");
          gsap.set(step, { autoAlpha: 0 });
          if (out) gsap.set(out, { autoAlpha: 0 });
          tl.set(step, { autoAlpha: 1 });
          if (typed) {
            const text = typed.textContent ?? "";
            const counter = { n: 0 };
            typed.textContent = "";
            tl.to(counter, {
              n: text.length,
              duration: text.length * 0.055,
              ease: "none",
              onUpdate: () => {
                typed.textContent = text.slice(0, Math.round(counter.n));
              },
            });
          }
          if (out) tl.to(out, { autoAlpha: 1, duration: 0.35, ease: "expo.out" }, "+=0.15");
          tl.to({}, { duration: 0.25 });
        });
        tl.from("[data-live]", { autoAlpha: 0, duration: 0.3 });
      });
      return () => mm.revert();
    },
    { scope },
  );

  function submit() {
    const cmd = value;
    setValue("");
    cursor.current = -1;
    if (cmd.trim()) history.current.unshift(cmd);
    const { output, effect } = run(cmd);
    if (effect?.clear) {
      setShowIntro(false);
      setLines([]);
      return;
    }
    setLines((prev) => [...prev, { id: nextId.current++, cmd, output }]);
    if (effect?.navigate) {
      const to = effect.navigate;
      window.setTimeout(() => {
        if (to.startsWith("#")) document.querySelector(to)?.scrollIntoView({ behavior: "smooth" });
        else router.push(to);
      }, 450);
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Tab" && value) {
      e.preventDefault();
      setValue(complete(value));
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const h = history.current;
      cursor.current = Math.max(-1, Math.min(h.length - 1, cursor.current + (e.key === "ArrowUp" ? 1 : -1)));
      setValue(cursor.current === -1 ? "" : h[cursor.current]);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setShowIntro(false);
      setLines([]);
    }
  }

  return (
    <section
      ref={scope}
      aria-label="Introduction"
      className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-(--sheet-max) flex-col justify-center px-(--gutter) py-16 font-mono text-[0.8125rem] leading-relaxed text-ink sm:text-[0.9375rem]"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a, button")) return;
        if (window.getSelection()?.toString()) return;
        input.current?.focus({ preventScroll: true });
      }}
    >
      {showIntro ? (
        <div className="space-y-5">
          <div data-step>
            <Prompt>
              <span data-typed>whoami</span>
            </Prompt>
            <div data-out className="mt-3">
              <h1 className="font-display text-[clamp(3.25rem,10vw,9rem)] font-semibold uppercase leading-[0.9] tracking-[0.005em]">
                {person.name}
              </h1>
              <p className="mt-4 max-w-[46ch] font-sans text-lg text-ink-soft sm:text-2xl">{person.tagline}</p>
            </div>
          </div>
          <div data-step>
            <Prompt>
              <span data-typed>help</span>
            </Prompt>
            <p data-out className="mt-1 text-ink-soft">
              try <span className="text-ink">ls</span>, <span className="text-ink">cat status.txt</span>, <span className="text-ink">cat meta</span>,{" "}
              <span className="text-ink">open everygpu</span>, <span className="text-ink">contact</span>. tab completes, up arrow recalls.
            </p>
          </div>
        </div>
      ) : null}

      <div aria-live="polite" className="mt-5 space-y-4 empty:hidden">
        {lines.map((line) => (
          <div key={line.id}>
            <Prompt>{line.cmd}</Prompt>
            {line.output ? <div className="mt-1">{line.output}</div> : null}
          </div>
        ))}
      </div>

      <div data-live className="mt-5 flex items-baseline border-b border-transparent pb-1 focus-within:border-rule">
        <label htmlFor="shell" className="shrink-0 text-ink-faint">
          saatwik@dev:~$&nbsp;
        </label>
        <input
          ref={input}
          id="shell"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          aria-label="Type a command, for example help"
          className="min-w-0 flex-1 bg-transparent text-ink caret-redline outline-none placeholder:text-ink-faint focus-visible:outline-none"
          placeholder="type help"
        />
      </div>
    </section>
  );
}
