"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import {
  siClaude,
  siDocker,
  siHuggingface,
  siKubernetes,
  siLangchain,
  siOpencv,
  siPython,
  siPytorch,
  type SimpleIcon,
} from "simple-icons";
import { skills } from "@/lib/data";

const EASE = [0.23, 1, 0.32, 1] as const;

// Groups cascade in, in reading order, so the eye lands on the headline group first.
const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/**
 * Brand marks from simple-icons (CC0) for the tools she leans on most, as
 * stickers in their own colours. Left ones fly in from the left edge, right
 * ones from the right. x is where the sticker's centre lands (% of the strip),
 * y its top (px), turn the angle it settles at.
 */
const STICKERS: { icon: SimpleIcon; label: string; side: -1 | 1; x: number; y: number; turn: number }[] = [
  { icon: siPytorch, label: "PyTorch", side: -1, x: 6, y: 18, turn: -8 },
  { icon: siPython, label: "Python", side: -1, x: 19, y: 76, turn: 6 },
  { icon: siHuggingface, label: "Hugging Face", side: -1, x: 32, y: 8, turn: -4 },
  { icon: siOpencv, label: "OpenCV", side: -1, x: 44, y: 64, turn: 9 },
  { icon: siLangchain, label: "LangChain", side: 1, x: 56, y: 14, turn: -7 },
  { icon: siDocker, label: "Docker", side: 1, x: 68, y: 72, turn: 5 },
  { icon: siKubernetes, label: "Kubernetes", side: 1, x: 81, y: 4, turn: -5 },
  { icon: siClaude, label: "Claude Code", side: 1, x: 94, y: 58, turn: 8 },
];

/**
 * The toolkit: a row of logo stickers that fly in from both sides as the
 * section scrolls up, then the full lists, which fade up group by group as
 * they come into view. Reduced motion: the stickers sit in place.
 */
export default function Skills() {
  const [lead, ...rest] = skills;
  return (
    <section id="skills" className="bg-paper-2/70 border-y border-line">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 lg:px-14 py-24 md:py-32">
        <h2 className="font-display text-[length:clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[1] tracking-[-0.02em]">
          Toolkit
        </h2>
        <p className="mt-5 max-w-[52ch] text-[1.0625rem] leading-[1.6] text-ink-2">
          What I reach for, from open research questions to systems in production.
        </p>

        <Stickers />

        <motion.div variants={list} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} className="mt-10">
          {/* the lead group gets the full row and the accent */}
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

          <div className="mt-12 grid gap-x-10 gap-y-10 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {rest.map((g) => (
              <motion.div key={g.label} variants={item}>
                <h3 className="text-[0.875rem] font-semibold text-lavender">{g.label}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {g.items.map((s) => (
                    <li key={s} className="rounded-lg bg-surface px-3 py-1.5 text-[0.9375rem] font-medium text-ink ring-1 ring-line">
                      {s}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * The sticker strip. Progress is 0 when the strip's top meets the bottom of
 * the screen and 1 once it reaches 55% from the top, which the strip always
 * passes before the Toolkit card sticks. Measured from the live box, since the
 * deck's sticky cards throw off motion's own target offsets.
 */
function Stickers() {
  const ref = useRef<HTMLUListElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollY } = useScroll();
  const progress = useTransform(() => {
    scrollY.get();
    const el = ref.current;
    if (!el || typeof window === "undefined") return 1;
    const vh = window.innerHeight;
    return Math.min(1, Math.max(0, (vh - el.getBoundingClientRect().top) / (vh * 0.45)));
  });

  return (
    <ul ref={ref} aria-label="Favourite tools" className="relative mt-10 h-[140px] md:h-[150px]">
      {STICKERS.map((s, i) => (
        <Sticker key={s.label} sticker={s} order={i % 4} progress={progress} still={reduce} />
      ))}
    </ul>
  );
}

// Each sticker flies for this share of the progress; the four on each side leave in turn.
const FLIGHT = 0.6;

function Sticker({
  sticker: { icon, label, side, x, y, turn },
  order,
  progress,
  still,
}: {
  sticker: (typeof STICKERS)[number];
  order: number;
  progress: MotionValue<number>;
  still: boolean;
}) {
  // The outermost sticker on each side arrives first, so they fill in toward the middle.
  const start = ((side === -1 ? order : 3 - order) / 3) * (1 - FLIGHT);
  const t = useTransform(progress, (p) => {
    const v = Math.min(1, Math.max(0, (p - start) / FLIGHT));
    return 1 - (1 - v) ** 3;
  });
  // Starts off screen on its own side, spun and small, and settles at its resting angle.
  const transform = useTransform(t, (e) => {
    const vw = typeof window === "undefined" ? 1400 : window.innerWidth;
    const from = side * vw * 0.7;
    return `translate3d(${from * (1 - e)}px, ${40 * (1 - e)}px, 0) rotate(${turn + side * 160 * (1 - e)}deg) scale(${0.55 + 0.45 * e})`;
  });

  return (
    <li className="absolute -translate-x-1/2" style={{ left: `${x}%`, top: y }} title={label}>
      <motion.div
        style={still ? { transform: `rotate(${turn}deg)` } : { transform }}
        className="grid size-12 place-items-center rounded-xl bg-surface ring-1 ring-line shadow-[0_18px_36px_-18px_rgba(5,3,12,0.9)] md:size-16"
      >
        <svg viewBox="0 0 24 24" role="img" aria-label={label} className="size-6 md:size-8" style={{ fill: `#${icon.hex}` }}>
          <path d={icon.path} />
        </svg>
      </motion.div>
    </li>
  );
}
