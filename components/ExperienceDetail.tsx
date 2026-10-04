"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";
import { ExperienceItem } from "@/lib/data";
import { DiagramByType } from "./Diagrams";

const EASE = [0.23, 1, 0.32, 1] as const;

const typeColors = {
  Research: { text: "#c084fc", bg: "rgba(192,132,252,0.08)", border: "rgba(192,132,252,0.25)" },
  Engineering: { text: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.25)" },
  Both: { text: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.25)" },
};

const typeLabel = {
  Research: "Research",
  Engineering: "Engineering",
  Both: "Research + Engineering",
};

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, transform: "translateY(20px)" }}
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      transition={{ duration: 0.65, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export default function ExperienceDetail({ exp }: { exp: ExperienceItem }) {
  const color = typeColors[exp.type];

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6 space-y-16">

        {/* ── Hero ── */}
        <div className="space-y-6">
          <FadeUp delay={0.05}>
            <Link
              href="/#experience"
              className="inline-flex items-center gap-1.5 text-sm text-[#555] hover:text-[#10b981] transition-colors duration-200"
            >
              <ArrowLeft size={14} />
              All experience
            </Link>
          </FadeUp>

          <FadeUp delay={0.12}>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-full border"
                  style={{ background: color.bg, color: color.text, borderColor: color.border }}
                >
                  {typeLabel[exp.type]}
                </span>
                {exp.current && (
                  <span className="font-mono text-[10px] text-[#10b981] uppercase tracking-widest">
                    current
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#f0f0f0]">
                {exp.company}
              </h1>
              <p className="text-lg text-[#888]">{exp.role}</p>
              <p className="font-mono text-sm text-[#555]">
                {exp.period} · {exp.location}
              </p>
            </div>
          </FadeUp>
        </div>

        {/* ── Impact metrics ── */}
        <FadeUp delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {exp.impact.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, transform: "translateY(16px)" }}
                animate={{ opacity: 1, transform: "translateY(0px)" }}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.07, ease: EASE }}
                className="p-4 rounded-xl border border-white/7 bg-[#161616] text-center"
              >
                <div className="text-xl md:text-2xl font-mono font-semibold text-[#10b981] tracking-tight">
                  {value}
                </div>
                <div className="text-xs text-[#666] mt-1 leading-snug">{label}</div>
              </motion.div>
            ))}
          </div>
        </FadeUp>

        {/* ── Context ── */}
        <FadeUp delay={0.35}>
          <div className="space-y-3">
            <h2 className="text-sm font-mono uppercase tracking-widest text-[#444]">Context</h2>
            <p className="text-[#888] leading-relaxed text-base max-w-[65ch]">{exp.context}</p>
          </div>
        </FadeUp>

        {/* ── Architecture diagram ── */}
        <FadeUp delay={0.45}>
          <div className="space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-widest text-[#444]">
              System Architecture
            </h2>
            <DiagramByType type={exp.diagramType} />
          </div>
        </FadeUp>

        {/* ── Full story ── */}
        <FadeUp delay={0.55}>
          <div className="space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-widest text-[#444]">
              What I did
            </h2>
            <ul className="space-y-3">
              {exp.fullBullets.map((b, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, transform: "translateX(-8px)" }}
                  animate={{ opacity: 1, transform: "translateX(0px)" }}
                  transition={{ duration: 0.45, delay: 0.58 + i * 0.05, ease: EASE }}
                  className="flex gap-3 text-sm text-[#888] leading-relaxed"
                >
                  <span className="text-[#10b981] mt-0.5 shrink-0">▸</span>
                  <span>{b}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </FadeUp>

        {/* ── Tech stack ── */}
        <FadeUp delay={0.65}>
          <div className="space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-widest text-[#444]">
              Tools & Technologies
            </h2>
            <div className="flex flex-wrap gap-2">
              {exp.tools.map((tool, i) => (
                <motion.span
                  key={tool}
                  initial={{ opacity: 0, transform: "scale(0.88)" }}
                  animate={{ opacity: 1, transform: "scale(1)" }}
                  transition={{ duration: 0.3, delay: 0.68 + i * 0.04, ease: EASE }}
                  className="px-3 py-1.5 rounded-lg border border-white/8 bg-white/4 text-sm text-[#bbb] font-mono"
                >
                  {tool}
                </motion.span>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* ── Footer nav ── */}
        <FadeUp delay={0.75}>
          <div className="pt-4 border-t border-white/6 flex items-center justify-between">
            <Link
              href="/#experience"
              className="inline-flex items-center gap-1.5 text-sm text-[#555] hover:text-[#10b981] transition-colors duration-200"
            >
              <ArrowLeft size={14} />
              Back to all experience
            </Link>
            <Link
              href="/"
              className="text-sm text-[#555] hover:text-[#f0f0f0] transition-colors"
            >
              Home
            </Link>
          </div>
        </FadeUp>
      </div>
    </main>
  );
}
