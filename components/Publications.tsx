"use client";

import { motion } from "motion/react";
import { Megaphone, Article, ArrowUpRight } from "@phosphor-icons/react";

const EASE = [0.23, 1, 0.32, 1] as const;

const papers = [
  {
    title:
      "MULTI: Disentangling Camera Lens, Sensor, View, and Domain for Novel Image Generation",
    venue: "ICPR 2026",
    venueLabel: "Int'l Conference on Pattern Recognition",
    type: "Oral Presentation",
    icon: Megaphone,
    accent: "#f59e0b",
    accentBg: "rgba(245,158,11,0.08)",
    accentBorder: "rgba(245,158,11,0.25)",
    abstract:
      "Novel multi-embedding architecture that disentangles visual factors (camera lens, sensor, viewpoint, domain) in text-to-image generation. Achieves ~10% improvement in factor disentanglement over established baselines.",
    authors: "S. Godavarthy et al.",
  },
  {
    title:
      "X-MULTI: VLM-based Imaging Factor Disentanglement for Factor-Aware Image Synthesis",
    venue: "ECCV 2026",
    venueLabel: "Workshop on Multimodal LLMs for Comprehension & Generation",
    type: "Accepted Paper",
    icon: Article,
    accent: "#10b981",
    accentBg: "rgba(16,185,129,0.08)",
    accentBorder: "rgba(16,185,129,0.25)",
    abstract:
      "Vision-language model approach extending factor-aware image synthesis. Presented at MUCG Workshop, ECCV 2026.",
    authors: "S. Godavarthy et al.",
  },
];

export default function Publications() {
  return (
    <section id="publications" className="py-24 border-t border-white/6">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, transform: "translateY(20px)" }}
          whileInView={{ opacity: 1, transform: "translateY(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-14"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#444] mb-2">03</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#f0f0f0]">
            Publications
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {papers.map((paper, i) => {
            const Icon = paper.icon;
            return (
              <motion.div
                key={paper.title}
                initial={{ opacity: 0, transform: "translateY(24px)" }}
                whileInView={{ opacity: 1, transform: "translateY(0px)" }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                className="relative p-6 rounded-2xl border border-white/7 bg-[#161616] flex flex-col gap-5 group hover:border-white/12 transition-colors duration-300"
              >
                {/* Top: venue badge + type */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono text-xs uppercase tracking-widest px-2.5 py-1 rounded-full border font-semibold"
                      style={{
                        background: paper.accentBg,
                        color: paper.accent,
                        borderColor: paper.accentBorder,
                      }}
                    >
                      {paper.venue}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#555]">
                    <Icon
                      size={13}
                      weight="duotone"
                      style={{ color: paper.accent }}
                    />
                    <span style={{ color: paper.accent }}>{paper.type}</span>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-semibold text-[#f0f0f0] leading-snug text-base">
                    {paper.title}
                  </h3>
                  <p className="text-xs text-[#555] mt-1">{paper.venueLabel}</p>
                </div>

                {/* Abstract */}
                <p className="text-sm text-[#777] leading-relaxed flex-1">
                  {paper.abstract}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-1 border-t border-white/6">
                  <span className="text-xs text-[#555] font-mono">
                    {paper.authors}
                  </span>
                  <a
                    href="https://scholar.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#555] hover:text-[#10b981] transition-colors flex items-center gap-1"
                  >
                    Scholar
                    <ArrowUpRight size={11} />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
