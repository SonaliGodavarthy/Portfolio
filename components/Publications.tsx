"use client";

import { motion } from "motion/react";
import { toast } from "sonner";
import { ArrowUpRight, Quotes } from "@phosphor-icons/react";
import FactorStack from "./FactorStack";
import { papers, profile, type Paper } from "@/lib/data";
import { STACK_LIST, stackTop, useStack } from "./Stack";

const SPRING = { type: "spring", bounce: 0, duration: 0.7 } as const;

function PaperCard({ paper, index }: { paper: Paper; index: number }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(paper.bibtex);
      toast("BibTeX Copied", { description: paper.short });
    } catch {
      toast("Couldn’t Reach the Clipboard", {
        description: "Your browser blocked it. The citation is on Google Scholar.",
      });
    }
  };

  return (
    <div className="rounded-3xl bg-surface px-6 pb-6 pt-4 ring-1 ring-line shadow-[0_-24px_48px_-28px_rgba(5,3,12,0.9)] md:px-8 md:pb-8 md:pt-[1.125rem]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-[0.75rem] tabular text-ink-3">{String(index + 1).padStart(2, "0")}</span>
        <span
          className="rounded-full bg-lavender px-3 py-1 text-[0.8125rem] font-semibold tracking-[0.01em] text-[#140f26]"
        >
          {paper.venue}
        </span>
        <span className="text-[0.8125rem] font-medium tracking-[0.01em] text-lavender">{paper.status}</span>
      </div>

      <h3
        className="mt-5 font-display text-[length:clamp(1.25rem,1.9vw,1.625rem)] font-semibold leading-[1.22] tracking-[-0.015em] text-ink"
      >
        {paper.title}
      </h3>

      <p className="mt-4 text-[0.875rem] leading-[1.6] text-ink-3">
        {paper.authors.map((a, i) => (
          <span key={a}>
            {i === 0 ? <span className="font-semibold text-ink">{a}</span> : a}
            {i < paper.authors.length - 1 ? ", " : ", et al."}
          </span>
        ))}
        <br />
        {paper.venueLong}, 2026{paper.pages ? `, pp. ${paper.pages}` : ""}
      </p>

      <p className="mt-5 text-[1rem] leading-[1.65] text-ink-2">{paper.summary}</p>

      <div className="mt-7 flex flex-wrap gap-2">
        <a
          href={profile.links.scholar}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-[0.875rem] font-semibold text-[#140f26]
                     hover:bg-white active:scale-[0.97] active:duration-75 transition-[background-color,transform] duration-150"
        >
          Google Scholar
          <ArrowUpRight size={14} weight="bold" aria-hidden />
        </a>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[0.875rem] font-semibold text-ink ring-cur
                     active:scale-[0.97] active:duration-75 transition-[box-shadow,transform] duration-150"
        >
          <Quotes size={14} weight="fill" aria-hidden />
          Copy BibTeX
        </button>
      </div>
    </div>
  );
}

export default function Publications() {
  const stack = useStack<HTMLOListElement>();
  return (
    // overflow-clip, not overflow-hidden: hidden would make the section a scroll box and stop the cards sticking.
    <section id="papers" className="relative overflow-clip bg-paper-2">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 lg:px-14 py-24 md:py-36">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={SPRING}
          className="font-display text-[length:clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[1] tracking-[-0.02em] text-ink"
        >
          Papers
        </motion.h2>
        <p className="mt-5 max-w-[46ch] text-[1.0625rem] leading-[1.6] text-ink-2">
          Teaching image generators to change one thing at a time.
        </p>

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-24">
            <FactorStack />
          </div>
          {/* The papers stack like the roles in Experience (components/Stack). */}
          <ol ref={stack} className={STACK_LIST}>
            {papers.map((p, i) => (
              <li key={p.short} className="sticky" style={stackTop(i)}>
                <PaperCard paper={p} index={i} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
