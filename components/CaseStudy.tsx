"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import type { Impact } from "@/lib/data";
import { DiagramByType } from "./Diagrams";

const EASE = [0.23, 1, 0.32, 1] as const;

export interface CaseStudyProps {
  backHref: string;
  backLabel: string;
  kicker: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  impact: Impact[];
  context: string;
  diagramType: string;
  bullets: React.ReactNode;
  tools: string[];
  next?: { href: string; label: string };
}

export default function CaseStudy(p: CaseStudyProps) {
  return (
    <main className="pt-[calc(7rem+env(safe-area-inset-top))] pb-[calc(6rem+env(safe-area-inset-bottom))]">
      {/* A thin lavender band, the same light as the home page */}
      <div aria-hidden className="fixed inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#2e2552,#b9a7ff,#2e2552)] z-[60]" />

      <article className="mx-auto max-w-[920px] px-5 md:px-10">
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Link
            href={p.backHref}
            className="relative before:absolute before:-inset-x-1 before:-inset-y-3 before:content-[''] inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-lavender hover:underline active:opacity-50"
          >
            <ArrowLeft size={14} weight="bold" aria-hidden />
            {p.backLabel}
          </Link>
          <p className="mt-10 text-[0.875rem] font-semibold text-ink-2">{p.kicker}</p>
          <h1 className="mt-3 font-display text-[length:clamp(2.25rem,5.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.02em]">
            {p.title}
          </h1>
          {p.subtitle && <div className="mt-4 text-[1.1875rem] leading-[1.5] text-ink-2">{p.subtitle}</div>}
        </motion.header>

        {p.impact.length > 0 && (
          <motion.dl
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 border-y border-line py-8"
          >
            {p.impact.map((m) => (
              <div key={m.label}>
                <dt className="sr-only">{m.label}</dt>
                <dd>
                  <span className="block font-display text-[length:clamp(1.75rem,3.2vw,2.5rem)] font-semibold leading-none tracking-[-0.022em] text-lavender tabular">
                    {m.value}
                  </span>
                  <span className="mt-2 block text-[0.875rem] leading-[1.4] text-ink-2">{m.label}</span>
                </dd>
              </div>
            ))}
          </motion.dl>
        )}

        {p.context && (
          <section className="mt-16">
            <h2 className="font-display text-[1.5rem] font-semibold tracking-[-0.02em]">The Problem</h2>
            <p className="mt-4 max-w-[65ch] text-[1.125rem] leading-[1.7] text-ink-2">{p.context}</p>
          </section>
        )}

        {p.diagramType && (
          <section className="mt-16">
            <h2 className="font-display text-[1.5rem] font-semibold tracking-[-0.02em]">How It Fits Together</h2>
            <div className="mt-6">
              <DiagramByType type={p.diagramType} />
            </div>
          </section>
        )}

        <section className="mt-16">
          <h2 className="font-display text-[1.5rem] font-semibold tracking-[-0.02em]">What I Did</h2>
          <div className="mt-5">{p.bullets}</div>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-[1.5rem] font-semibold tracking-[-0.02em]">Tools</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {p.tools.map((t) => (
              <li key={t} className="rounded-lg bg-paper-2 px-3 py-1.5 text-[0.9375rem] font-medium">
                {t}
              </li>
            ))}
          </ul>
        </section>

        {p.next && (
          <Link
            href={p.next.href}
            className="group mt-24 flex items-center justify-between gap-6 rounded-3xl bg-lavender p-6 md:p-8 text-paper
                       hover:bg-lavender-deep transition-colors duration-200"
          >
            <span className="min-w-0">
              <span className="block text-[0.875rem] font-semibold text-lavender-soft">Next</span>
              <span className="mt-1 block font-display text-[length:clamp(1.375rem,3vw,2rem)] font-semibold tracking-[-0.02em] break-words">
                {p.next.label}
              </span>
            </span>
            <ArrowRight size={26} weight="bold" className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
          </Link>
        )}
      </article>
    </main>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3.5 max-w-[68ch]">
      {items.map((b) => (
        <li key={b} className="relative pl-6 text-[1.0625rem] leading-[1.65] text-ink-2">
          <span className="absolute left-0 top-[0.8em] h-px w-3 bg-lavender" aria-hidden />
          {b}
        </li>
      ))}
    </ul>
  );
}
