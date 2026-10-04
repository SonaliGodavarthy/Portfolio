"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { ArrowUpRight, CaretDown } from "@phosphor-icons/react";
import { experiences, RoleType } from "@/lib/data";

/* Apple §4: critically damped, no overshoot */
const SPRING = { type: "spring", bounce: 0, duration: 0.38 } as const;

const badge: Record<RoleType, { text: string; border: string; bg: string }> = {
  Research:    { text: "#c084fc", border: "rgba(192,132,252,0.28)", bg: "rgba(192,132,252,0.07)" },
  Engineering: { text: "#60a5fa", border: "rgba(96,165,250,0.28)",  bg: "rgba(96,165,250,0.07)"  },
  Both:        { text: "#10b981", border: "rgba(16,185,129,0.28)",  bg: "rgba(16,185,129,0.07)"  },
};

const badgeLabel: Record<RoleType, string> = {
  Research:    "Research",
  Engineering: "Engineering",
  Both:        "Research + Eng",
};

export default function Experience() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="experience" className="py-24 border-t border-white/6">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={SPRING}
          className="mb-12 flex items-end justify-between"
        >
          <h2
            className="text-3xl md:text-4xl font-semibold text-[#f0f0f0]"
            style={{ letterSpacing: "-0.03em" }}
          >
            Experience
          </h2>
          <p className="hidden md:block text-[13px] text-[#3a3a3a]">
            Tap a role to expand
          </p>
        </motion.div>

        <div className="divide-y divide-white/6">
          {experiences.map((exp, i) => {
            const isOpen = open === exp.slug;
            const c      = badge[exp.type];

            return (
              <motion.div
                key={exp.slug}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ ...SPRING, delay: i * 0.035 }}
              >
                <button
                  className="w-full text-left py-5 group"
                  onClick={() => setOpen(isOpen ? null : exp.slug)}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-4">
                    {/* Row number */}
                    <span className="font-mono text-[10px] text-[#2e2e2e] mt-[3px] shrink-0 w-5 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Main */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className="font-semibold text-[#e8e8e8] group-hover:text-[#10b981] transition-colors duration-150 text-[15px]">
                          {exp.company}
                        </span>
                        {exp.current && (
                          <span className="font-mono text-[9px] uppercase tracking-widest
                                           text-[#10b981] border border-[#10b981]/25 px-1.5 py-0.5 rounded-sm">
                            now
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-[#666]">{exp.role}</p>

                      {/* Expand: tools + CTA only */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{   opacity: 0, height: 0 }}
                            transition={SPRING}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 space-y-4">
                              {/* Tools */}
                              <div className="flex flex-wrap gap-1.5">
                                {exp.tools.map((t) => (
                                  <span
                                    key={t}
                                    className="font-mono text-[11px] text-[#555]
                                               bg-white/4 border border-white/7
                                               px-2 py-[3px] rounded-md"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                              {/* CTA */}
                              <Link
                                href={`/experience/${exp.slug}`}
                                className="inline-flex items-center gap-1.5 text-[13px]
                                           text-[#10b981] hover:text-[#34d399] transition-colors duration-150"
                                onClick={(e) => e.stopPropagation()}
                              >
                                View case study
                                <ArrowUpRight size={13} />
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Right meta */}
                    <div className="shrink-0 flex flex-col items-end gap-2 min-w-[120px]">
                      <span className="font-mono text-[11px] text-[#3a3a3a] text-right leading-tight">
                        {exp.period}
                      </span>
                      <span
                        className="font-mono text-[10px] uppercase tracking-[0.1em]
                                   px-2 py-[3px] rounded-md border hidden sm:inline-block"
                        style={{ color: c.text, borderColor: c.border, background: c.bg }}
                      >
                        {badgeLabel[exp.type]}
                      </span>
                      {/* Apple §4: spring-driven caret rotation */}
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={SPRING}
                      >
                        <CaretDown size={13} className="text-[#444]" />
                      </motion.div>
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
