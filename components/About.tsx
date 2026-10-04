"use client";

import { motion } from "motion/react";

const SPRING = { type: "spring", bounce: 0, duration: 0.5 } as const;

export default function About() {
  return (
    <section id="about" className="py-24 border-t border-white/6">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16 items-start">

          {/* Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={SPRING}
            className="space-y-5"
          >
            <h2
              className="text-3xl md:text-4xl font-semibold text-[#f0f0f0]"
              style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}
            >
              Where research meets{" "}
              <span className="text-[#10b981]">production.</span>
            </h2>
            <p className="text-[#777] leading-relaxed max-w-[56ch]">
              Researcher and engineer who doesn't pick sides. My work spans the
              full arc - from designing novel architectures and benchmarks at
              Bosch Research and ETH Zurich, to shipping production-grade
              pipelines at Fraunhofer, to sustaining 99.9% uptime at
              S&P Capital IQ.
            </p>
            <p className="text-[#777] leading-relaxed max-w-[56ch]">
              My M.Sc. thesis on{" "}
              <em className="text-[#bbb] not-italic">
                Incremental Learning for Disentangling Visual Concepts
              </em>{" "}
              produced two accepted papers - one oral at ICPR 2026 - and a
              benchmark others can build on. I care about research that runs
              in the real world.
            </p>
            <p className="text-[#777] leading-relaxed max-w-[56ch]">
              English, Hindi, and conversational German (B1). Open to roles
              across Europe and beyond.
            </p>
          </motion.div>

          {/* Stats list — Apple §16: hierarchy through weight + size, not size alone */}
          <div className="divide-y divide-white/6">
            {[
              { value: "2",      label: "Peer-reviewed publications", sub: "ICPR 2026 (oral) / ECCV 2026" },
              { value: "4+",     label: "Years in ML", sub: "Research and production" },
              { value: "Top 1%", label: "Deutschlandstipendium", sub: "National merit scholarship" },
              { value: "1st",    label: "Best Final Year Project", sub: "120 competing teams" },
            ].map(({ value, label, sub }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ ...SPRING, delay: i * 0.06 }}
                className="py-4"
              >
                <div className="flex items-baseline gap-3">
                  <span
                    className="font-mono text-xl font-semibold text-[#10b981]"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {value}
                  </span>
                  <span className="text-sm text-[#888]">{label}</span>
                </div>
                <p className="text-[11px] font-mono text-[#444] mt-0.5">{sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
