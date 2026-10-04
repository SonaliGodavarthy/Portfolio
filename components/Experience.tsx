"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { experiences } from "@/lib/data";
import { FramedText, useFraming } from "@/lib/framing";

const EASE = [0.23, 1, 0.32, 1] as const;

const yearOf = (d: string) => d.match(/\d{4}/)?.[0] ?? d;

export default function Experience() {
  const { framing } = useFraming();
  const [active, setActive] = useState(0);
  const rowRefs = useRef<(HTMLElement | null)[]>([]);

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
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 lg:px-14 py-24 md:py-36">
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

          <ol className="space-y-4">
            {experiences.map((exp, i) => (
              <li
                key={exp.slug}
                ref={(el) => { rowRefs.current[i] = el; }}
                data-index={i}
                className={`group rounded-3xl p-6 md:p-8 transition-[background-color,box-shadow] duration-300
                            ${i === active ? "bg-surface ring-1 ring-line shadow-[0_30px_60px_-30px_rgba(5,3,12,0.7)]" : "bg-transparent"}`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="text-[0.875rem] font-semibold text-lavender">
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
                  {!exp.minor && (
                    <Link
                      href={`/experience/${exp.slug}`}
                      className="relative before:absolute before:-inset-x-1 before:-inset-y-3 before:content-[''] inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-lavender hover:underline active:opacity-50"
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
