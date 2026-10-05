"use client";

import { motion } from "motion/react";
import { education } from "@/lib/data";
import { Entry, list } from "./Milestones";

export default function Education() {
  return (
    <section id="education" className="mx-auto max-w-[1400px] px-5 md:px-10 lg:px-14 py-24 md:py-36">
      <h2 className="font-display text-[length:clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[1] tracking-[-0.02em]">
        Education
      </h2>

      <motion.ol
        variants={list}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="mt-14 max-w-[56rem] space-y-10"
      >
        {education.map((e) => (
          <Entry
            key={e.degree}
            figure={e.grade}
            figureLabel={`Final grade, 1.0 is best.${e.gradeNote === "German scale" ? "" : ` ${e.gradeNote}.`}`}
            title={e.degree}
            meta={`${e.institution}, ${e.location}`}
            period={e.period}
          >
            <blockquote className="text-[1.0625rem] leading-[1.55] text-ink">&ldquo;{e.thesis}&rdquo;</blockquote>
          </Entry>
        ))}
      </motion.ol>
    </section>
  );
}
