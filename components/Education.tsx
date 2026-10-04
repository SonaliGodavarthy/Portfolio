"use client";

import { motion } from "motion/react";
import { GraduationCap } from "@phosphor-icons/react";

const EASE = [0.23, 1, 0.32, 1] as const;

const degrees = [
  {
    degree: "M.Sc. Computer Science (Visual Computing)",
    institution: "University of Siegen",
    period: "10/2023 – 08/2026",
    location: "Siegen, Germany",
    gpa: "1.6 (1.1 Thesis)",
    thesis:
      "Incremental Learning for Disentangling of Multiple Visual Concepts for Text-to-Image",
  },
  {
    degree: "B.E. Information Technology",
    institution: "Vasavi College of Engineering",
    period: "07/2018 – 08/2022",
    location: "Hyderabad, India",
    gpa: "1.5",
    thesis:
      "Voice Control and Command System for Unmanned Aerial and Ground Vehicles",
  },
];

export default function Education() {
  return (
    <section id="education" className="py-24 border-t border-white/6">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, transform: "translateY(20px)" }}
          whileInView={{ opacity: 1, transform: "translateY(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#f0f0f0]">
            Education
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {degrees.map((edu, i) => (
            <motion.div
              key={edu.degree}
              initial={{ opacity: 0, transform: "translateY(20px)" }}
              whileInView={{ opacity: 1, transform: "translateY(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              className="p-6 rounded-2xl border border-white/7 bg-[#161616] hover:border-white/12 transition-colors duration-300 space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#10b981]/10 shrink-0 mt-0.5">
                  <GraduationCap size={18} weight="duotone" className="text-[#10b981]" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-semibold text-[#f0f0f0] text-sm leading-snug">
                    {edu.degree}
                  </h3>
                  <p className="text-xs text-[#888]">{edu.institution}</p>
                </div>
              </div>

              <div className="pl-12 space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-[11px] text-[#555]">{edu.period}</span>
                  <span className="text-[#333]">·</span>
                  <span className="font-mono text-[11px] text-[#555]">{edu.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#555]">
                    GPA
                  </span>
                  <span className="font-mono text-sm text-[#10b981] font-semibold">
                    {edu.gpa}
                  </span>
                  <span className="font-mono text-[10px] text-[#444]">(German scale)</span>
                </div>
                <p className="text-xs text-[#666] leading-relaxed italic">
                  Thesis: {edu.thesis}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
