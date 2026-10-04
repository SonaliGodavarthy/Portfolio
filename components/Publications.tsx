"use client";

import { motion } from "motion/react";
import { toast } from "sonner";
import { ArrowUpRight, Quotes } from "@phosphor-icons/react";
import FactorStack from "./FactorStack";
import TiltCard from "./TiltCard";
import { papers, profile, type Paper } from "@/lib/data";

const SPRING = { type: "spring", bounce: 0, duration: 0.7 } as const;

function PaperCard({ paper, featured }: { paper: Paper; featured?: boolean }) {
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
    <TiltCard className="rounded-3xl bg-surface p-7 md:p-9 ring-1 ring-line shadow-[0_40px_80px_-40px_rgba(5,3,12,0.8)]">
      <div data-depth className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-[0.8125rem] font-semibold tracking-[0.01em]
                      ${featured ? "bg-lavender text-[#140f26]" : "bg-surface-2 text-ink"}`}
        >
          {paper.venue}
        </span>
        <span className="text-[0.8125rem] font-medium tracking-[0.01em] text-lavender">{paper.status}</span>
      </div>

      <h3
        data-depth
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
    </TiltCard>
  );
}

export default function Publications() {
  const [main, workshop] = papers;
  return (
    <section id="papers" className="relative overflow-hidden bg-paper-2">
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

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
          <FactorStack />
          <div className="space-y-6">
            <PaperCard paper={main} featured />
            <PaperCard paper={workshop} />
          </div>
        </div>
      </div>
    </section>
  );
}
