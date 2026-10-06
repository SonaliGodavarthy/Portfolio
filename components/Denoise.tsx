"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

// A static grain tile. The SVG filter only draws the image once; nothing animates it.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.73 0 0 0 0 0.65 0 0 0 0 1 0 0 0 1.4 -0.45'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * A section that comes out of noise as it scrolls in, like a diffusion
 * schedule run by the scrollbar: grain fades out, the content settles into
 * place, and a small readout counts t from 1.00 down to 0.00.
 * Only transform and opacity animate. Reduced motion: the plain section.
 */
export default function Denoise({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  // 0 when the section's top meets the bottom of the screen, 1 once it reaches 35% from the top.
  const p = useTransform(() => {
    scrollY.get();
    const el = ref.current;
    if (!el || typeof window === "undefined") return 1;
    const vh = window.innerHeight;
    const top = el.getBoundingClientRect().top;
    return Math.min(1, Math.max(0, (vh - top) / (vh * 0.65)));
  });
  const opacity = useTransform(p, [0, 1], [0.25, 1]);
  const transform = useTransform(p, (v) => `translateY(${(1 - v) * 32}px) scale(${0.985 + 0.015 * v})`);
  const grain = useTransform(p, [0, 0.85], [0.9, 0]);
  const readout = useTransform(p, [0, 0.8, 1], [1, 1, 0]);
  const t = useTransform(p, (v) => `t = ${(1 - v).toFixed(2)}`);

  if (reduce) return <>{children}</>;
  return (
    <div ref={ref} className="relative">
      <motion.div style={{ opacity, transform }}>{children}</motion.div>
      <motion.div
        aria-hidden
        style={{ opacity: grain, backgroundImage: GRAIN }}
        className="pointer-events-none absolute inset-0"
      />
      <motion.span
        aria-hidden
        style={{ opacity: readout }}
        className="pointer-events-none absolute right-5 top-6 font-mono text-[0.75rem] tabular text-ink-3 md:right-10 lg:right-14"
      >
        {t}
      </motion.span>
    </div>
  );
}
