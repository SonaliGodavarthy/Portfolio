"use client";

import { motion } from "motion/react";
import { Medal, GraduationCap } from "@phosphor-icons/react";
import { awards, education } from "@/lib/data";

const EASE = [0.23, 1, 0.32, 1] as const;

const list = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** One milestone: a large figure anchors it, the details sit beside it. */
function Entry({
  figure,
  figureLabel,
  title,
  meta,
  period,
  children,
}: {
  figure: string;
  figureLabel: string;
  title: string;
  meta: string;
  period: string;
  children: React.ReactNode;
}) {
  return (
    <motion.li variants={item} className="grid gap-x-8 gap-y-4 border-t border-line pt-8 sm:grid-cols-[11.5rem_minmax(0,1fr)]">
      <div>
        <p className="font-display whitespace-nowrap text-[length:clamp(2.5rem,4.2vw,3.5rem)] font-semibold leading-[0.9] tracking-[-0.03em] text-lavender tabular">
          {figure}
        </p>
        <p className="mt-2 text-[0.8125rem] leading-[1.4] tracking-[0.01em] text-ink-3">{figureLabel}</p>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4">
          <h4 className="font-display text-[1.375rem] font-semibold leading-[1.2] tracking-[-0.015em]">{title}</h4>
          <p className="font-mono text-[0.75rem] tracking-[0.01em] text-ink-3 tabular">{period}</p>
        </div>
        <p className="mt-1 text-[0.9375rem] text-ink-2">{meta}</p>
        <div className="mt-4">{children}</div>
      </div>
    </motion.li>
  );
}

export default function Milestones() {
  return (
    <section id="education" className="mx-auto max-w-[1400px] px-5 md:px-10 lg:px-14 py-24 md:py-36">
      <h2 className="font-display text-[length:clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[1] tracking-[-0.02em]">
        Milestones
      </h2>

      <div className="mt-14 grid gap-16 lg:grid-cols-2 lg:gap-20">
        <div>
          <h3 className="flex items-center gap-2 text-[0.875rem] font-semibold text-lavender">
            <GraduationCap size={18} weight="duotone" aria-hidden />
            Education
          </h3>
          <motion.ol
            variants={list}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="mt-6 space-y-10"
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
        </div>

        <div>
          <h3 className="flex items-center gap-2 text-[0.875rem] font-semibold text-lavender">
            <Medal size={18} weight="duotone" aria-hidden />
            Recognition
          </h3>
          <motion.ol
            variants={list}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="mt-6 space-y-10"
          >
            {awards.map((a) => (
              <Entry
                key={a.title}
                figure={a.figure}
                figureLabel={a.figureNote}
                title={a.title}
                meta={a.issuer}
                period={a.date}
              >
                <p className="max-w-[52ch] text-[1.0625rem] leading-[1.55] text-ink-2">{a.note}</p>
              </Entry>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
