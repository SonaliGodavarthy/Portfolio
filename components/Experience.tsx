"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { experiences } from "@/lib/data";
import { FramedText, useFraming } from "@/lib/framing";
import { STACK_LIST, stackTop, useStack } from "./Stack";

const EASE = [0.23, 1, 0.32, 1] as const;

const yearOf = (d: string) => d.match(/\d{4}/)?.[0] ?? d;

export default function Experience() {
  const { framing } = useFraming();
  const [active, setActive] = useState(0);
  const rowRefs = useRef<(HTMLElement | null)[]>([]);
  const stack = useStack<HTMLOListElement>();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    rowRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const cur = experiences[active];

  return (
    <section id="experience" className="bg-paper-2/70 border-y border-line">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 lg:px-14 pt-24 pb-12 md:pt-36 md:pb-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-24">
          <div className="lg:sticky lg:top-24 self-start">
            <h2 className="font-display text-[length:clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[1] tracking-[-0.02em]">
              Experience
            </h2>
            <p className="mt-5 max-w-[38ch] text-[1.0625rem] leading-[1.6] text-ink-2">
              From site reliability in Hyderabad to generative-AI research in Germany.
            </p>

            {/* Pinned readout of the role in view */}
            <div className="hidden lg:block mt-16" aria-hidden>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={cur.slug}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <p className="font-display font-semibold tabular leading-[0.9] tracking-[-0.028em] text-lavender text-[length:clamp(5rem,9vw,8.75rem)]">
                    {yearOf(cur.start)}
                  </p>
                  <p className="mt-3 font-display text-[1.375rem] font-semibold tracking-[-0.015em]">
                    {cur.companyShort}
                  </p>
                  <p className="text-[0.9375rem] text-ink-3">{cur.location}</p>
                </motion.div>
              </AnimatePresence>
              <div className="mt-8 flex gap-1.5">
                {experiences.map((e, i) => (
                  <span
                    key={e.slug}
                    className={`h-1 rounded-full transition-[width,background-color] duration-300 ${i === active ? "w-8 bg-lavender" : "w-3 bg-ink/15"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* The roles stack like a deck (components/Stack). A role with a case study is one big link to it. */}
          <ol ref={stack} className={STACK_LIST}>
            {experiences.map((exp, i) => (
              <li
                key={exp.slug}
                ref={(el) => { rowRefs.current[i] = el; }}
                data-index={i}
                style={stackTop(i)}
                className={`group sticky rounded-3xl bg-surface px-6 pb-6 pt-4 ring-1 transition-[box-shadow] duration-300 md:px-8 md:pb-8 md:pt-[1.125rem]
                            shadow-[0_-24px_48px_-28px_rgba(5,3,12,0.9)] ${i === active ? "ring-lavender/30" : "ring-line"}
                            ${exp.minor ? "" : "cursor-pointer hover:ring-lavender/60"}`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="text-[0.875rem] font-semibold text-lavender">
                    <span className="mr-3 font-mono text-[0.75rem] font-normal tabular text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                    {exp.company}
                    {exp.current && (
                      <span className="ml-2 rounded-full bg-lavender px-2 py-0.5 text-[0.75rem] tracking-[0.01em] font-bold text-paper align-[2px]">
                        Now
                      </span>
                    )}
                  </p>
                  <p className="font-mono text-[0.75rem] tracking-[0.01em] text-ink-3 tabular">
                    {exp.start} - {exp.end}
                  </p>
                </div>
                <h3 className="mt-2 font-display text-[length:clamp(1.5rem,2.6vw,2rem)] font-semibold leading-[1.1] tracking-[-0.02em]">
                  <FramedText value={exp.role} />
                </h3>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.ul
                    key={framing}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22, ease: EASE }}
                    className="mt-4 space-y-2.5"
                  >
                    {exp.bullets[framing].map((b) => (
                      <li key={b} className="relative pl-5 text-[1rem] leading-[1.6] text-ink-2">
                        <span className="absolute left-0 top-[0.72em] h-px w-2.5 bg-lavender" aria-hidden />
                        {b}
                      </li>
                    ))}
                  </motion.ul>
                </AnimatePresence>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <ul className="flex flex-wrap gap-1.5">
                    {exp.tools.slice(0, 5).map((t) => (
                      <li key={t} className="rounded-lg bg-ink/[0.06] px-2 py-1 text-[0.75rem] tracking-[0.01em] font-medium text-ink-2">
                        {t}
                      </li>
                    ))}
                  </ul>
                  {/* stretched over the whole card, so clicking anywhere on it opens the case study */}
                  {!exp.minor && (
                    <Link
                      href={`/experience/${exp.slug}`}
                      className="inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-lavender group-hover:underline group-active:opacity-50
                                 after:absolute after:inset-0 after:rounded-3xl after:content-[''] focus-visible:outline-none
                                 focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-lavender"
                    >
                      Case Study
                      <ArrowRight size={14} weight="bold" className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
