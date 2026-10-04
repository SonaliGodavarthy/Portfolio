"use client";

import { motion } from "motion/react";
import { Medal, Trophy } from "@phosphor-icons/react";

const EASE = [0.23, 1, 0.32, 1] as const;

const awards = [
  {
    title: "Deutschlandstipendium",
    org: "Studienförderfonds Siegen e.V.",
    year: "2024",
    desc: "Merit-based national scholarship awarded to the top ~1% of students in Germany, recognising academic excellence and societal commitment.",
    Icon: Medal,
    accent: "#f59e0b",
  },
  {
    title: "Best Project Award",
    org: "Vasavi College of Engineering",
    year: "2022",
    desc: "1st Prize for Best Final Year Project among ~120 competing teams, for the Voice Control & Command System for UAV/UGV.",
    Icon: Trophy,
    accent: "#10b981",
  },
];

export default function Awards() {
  return (
    <section id="awards" className="py-24 border-t border-white/6">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, transform: "translateY(20px)" }}
          whileInView={{ opacity: 1, transform: "translateY(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#f0f0f0]">
            Awards
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {awards.map(({ title, org, year, desc, Icon, accent }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, transform: "translateY(20px)" }}
              whileInView={{ opacity: 1, transform: "translateY(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              className="flex gap-4 p-6 rounded-2xl border border-white/7 bg-[#161616] hover:border-white/12 transition-colors duration-300"
            >
              <div
                className="w-11 h-11 flex items-center justify-center rounded-xl shrink-0"
                style={{ background: `${accent}14`, border: `1px solid ${accent}30` }}
              >
                <Icon size={20} weight="duotone" style={{ color: accent }} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-[#f0f0f0] text-sm">{title}</h3>
                  <span className="font-mono text-[10px] text-[#555]">{year}</span>
                </div>
                <p className="text-xs text-[#555]">{org}</p>
                <p className="text-sm text-[#777] leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
