"use client";

import { AnimatePresence, motion } from "motion/react";
import { skills } from "@/lib/data";
import { useFraming } from "@/lib/framing";

const EASE = [0.23, 1, 0.32, 1] as const;

// Groups cascade in, in reading order, so the eye lands on the headline group first.
const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function Skills() {
  const { framing } = useFraming();
  const [lead, ...rest] = skills[framing];
  return (
    <section id="skills" className="bg-paper-2/70 border-y border-line">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 lg:px-14 py-24 md:py-32">
        <h2 className="font-display text-[length:clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[1] tracking-[-0.02em]">
          Toolkit
        </h2>
        <p className="mt-5 max-w-[52ch] text-[1.0625rem] leading-[1.6] text-ink-2">
          {framing === "research"
            ? "What I reach for when the question is still open."
            : "What I reach for when it has to run in production."}
        </p>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={framing}
            variants={list}
            initial="hidden"
            whileInView="show"
            exit="exit"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-14"
          >
            {/* the lead group carries the framing, so it gets the full row and the accent */}
            <motion.div variants={item}>
              <h3 className="text-[0.875rem] font-semibold text-lavender">{lead.label}</h3>
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {lead.items.map((s) => (
                  <li
                    key={s}
                    className="rounded-lg bg-lavender px-4 py-2 font-display text-[1.0625rem] font-semibold tracking-[-0.01em] text-paper md:text-[1.1875rem]"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>

            <div className="mt-12 grid gap-x-10 gap-y-10 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((g) => (
                <motion.div key={g.label} variants={item}>
                  <h3 className="text-[0.875rem] font-semibold text-lavender">{g.label}</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {g.items.map((s) => (
                      <li
                        key={s}
                        className="rounded-lg bg-surface px-3 py-1.5 text-[0.9375rem] font-medium text-ink ring-1 ring-line"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
