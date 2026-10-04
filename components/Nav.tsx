"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, List, X } from "@phosphor-icons/react";
import { useFraming } from "@/lib/framing";
import type { Framing } from "@/lib/data";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#papers", label: "Papers" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

const SPRING = { type: "spring", bounce: 0, duration: 0.4 } as const;

function FramingSwitch({ compact = false }: { compact?: boolean }) {
  const { framing, setFraming } = useFraming();
  const options: { id: Framing; label: string; short: string }[] = [
    { id: "research", label: "Researcher", short: "Research" },
    { id: "engineering", label: "Engineer", short: "Engineering" },
  ];
  // Radio group keyboard pattern: one tab stop, arrow keys move and select.
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    const next = options[(options.findIndex((o) => o.id === framing) + 1) % options.length];
    setFraming(next.id);
    e.currentTarget.querySelector<HTMLButtonElement>(`[data-id="${next.id}"]`)?.focus();
  };
  return (
    <div
      role="radiogroup"
      aria-label="Frame this portfolio as"
      onKeyDown={onKeyDown}
      className="relative flex items-center rounded-full p-0.5 ring-cur-soft"
    >
      {options.map((o) => {
        const active = framing === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            data-id={o.id}
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => setFraming(o.id)}
            className={`relative rounded-full px-3 py-3 sm:py-1.5 text-[0.8125rem] tracking-[0.01em] font-semibold transition-colors duration-200
                        ${active ? "text-paper" : "opacity-75 hover:opacity-100"}`}
          >
            {active && (
              <motion.span
                layoutId={compact ? "framing-pill-m" : "framing-pill"}
                className="absolute inset-0 rounded-full bg-lavender"
                transition={SPRING}
              />
            )}
            <span className="relative">{compact ? o.short : o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const solid = scrolled || !isHome;

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > window.innerHeight * 0.82);
  });

  // Escape closes the menu, like any sheet.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Wayfinding: which section is under the reading line right now.
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!isHome) return;
    const sections = links
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = `#${e.target.id}`;
          setActive((prev) => (e.isIntersecting ? id : prev === id ? null : prev));
        }
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [isHome]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]
                  transition-[background-color,color] duration-300
                  ${solid || menuOpen ? "material-bar scroll-edge" : ""}`}
      style={{
        color: solid || menuOpen ? "var(--color-ink)" : "var(--scene-ink, var(--color-ink))",
      }}
    >
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5 md:px-10 lg:px-14">
        {isHome ? (
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            translate="no"
            className="relative before:absolute before:-inset-x-1 before:-inset-y-3 before:content-[''] font-display text-[1.0625rem] font-semibold tracking-[-0.02em] transition-colors duration-150 hover:text-lavender"
          >
            Sonali G.
          </a>
        ) : (
          <Link
            href="/"
            translate="no"
            className="relative before:absolute before:-inset-x-1 before:-inset-y-3 before:content-[''] inline-flex items-center gap-2 text-[0.875rem] font-semibold hover:text-lavender transition-colors"
          >
            <ArrowLeft size={15} weight="bold" aria-hidden />
            Sonali G.
          </Link>
        )}

        {isHome && (
          <ul className="hidden lg:flex items-center gap-1">
            {links.map((l) => {
              const on = active === l.href;
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    aria-current={on ? "location" : undefined}
                    className={`relative block rounded-full px-3.5 py-1.5 text-[0.875rem] font-medium
                                transition-opacity duration-150 active:opacity-50 active:duration-75
                                ${on ? "opacity-100" : "opacity-75 hover:opacity-100"}`}
                  >
                    {on && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-ink/[0.07]"
                        transition={SPRING}
                      />
                    )}
                    <span className="relative">{l.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <FramingSwitch />
          </div>
          <div className="sm:hidden">
            <FramingSwitch compact />
          </div>
          {isHome && (
            <button
              type="button"
              className="lg:hidden grid place-items-center size-11 rounded-full hover:bg-ink/10 active:bg-ink/15"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={20} weight="bold" aria-hidden /> : <List size={20} weight="bold" aria-hidden />}
            </button>
          )}
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="lg:hidden"
            // Opacity and transform only: a height: "auto" animation makes Motion
            // measure and restore the scroll position, which cancels anchor jumps.
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            transition={SPRING}
          >
            <ul className="flex flex-col px-5 md:px-10 py-4">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => {
                      // Collapsing the sheet cancels the browser's own anchor scroll on
                      // phones, so close it and scroll on the next frame ourselves.
                      e.preventDefault();
                      setMenuOpen(false);
                      history.replaceState(null, "", l.href);
                      requestAnimationFrame(() =>
                        document.querySelector(l.href)?.scrollIntoView({
                          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                        }),
                      );
                    }}
                    aria-current={active === l.href ? "location" : undefined}
                    className={`block py-2.5 font-display text-[1.375rem] font-semibold tracking-[-0.02em] transition-colors duration-150
                                hover:text-lavender active:opacity-50 ${active === l.href ? "text-lavender" : ""}`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
