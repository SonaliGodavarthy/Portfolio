"use client";

import { useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { MapPin, Translate, GraduationCap } from "@phosphor-icons/react";
import { profile } from "@/lib/data";
import TiltCard from "./TiltCard";
import { useFraming } from "@/lib/framing";

const EASE = [0.23, 1, 0.32, 1] as const;

export default function About() {
  const { framing } = useFraming();
  return (
    <section id="about" className="mx-auto max-w-[1400px] px-5 md:px-10 lg:px-14 py-24 md:py-36">
      <div className="grid gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 lg:gap-24 items-start">
        <figure data-follow="to" className="md:sticky md:top-28 max-w-[420px]">
          <TiltCard className="rounded-3xl" depth={0}>
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-[0_40px_80px_-40px_rgba(5,3,12,0.8)]"
          >
            <Image
              src="/sonali-about.webp"
              alt="Sonali standing on the grass by a lake in a teal knit dress, a gull flying overhead."
              fill
              sizes="(min-width: 768px) 420px, 90vw"
              className="object-cover"
              priority={false}
            />
          </motion.div>
          </TiltCard>
        </figure>

        <div>
          <h2 className="font-display text-[length:clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[1] tracking-[-0.02em]">
            <Rise text="Hello, I’m Sonali." />
          </h2>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={framing}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="mt-8 space-y-5 max-w-[60ch]"
            >
              {profile.about[framing].map((para, i) =>
                i === 0 ? (
                  <ReadAlong key={i} text={para} className="text-[1.3125rem] md:text-[1.4375rem] leading-[1.5] text-ink" />
                ) : (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className="text-[1.0625rem] leading-[1.7] text-ink-2"
                  >
                    {para}
                  </motion.p>
                ),
              )}
            </motion.div>
          </AnimatePresence>

          <dl className="mt-12 grid gap-x-10 gap-y-7 sm:grid-cols-2 max-w-[640px]">
            <Fact icon={<MapPin size={18} weight="duotone" aria-hidden />} term="Based in">
              {profile.location}. {profile.relocate}.
            </Fact>
            <Fact icon={<GraduationCap size={18} weight="duotone" aria-hidden />} term="Studied">
              M.Sc. Computer Science (Visual Computing), University of Siegen
            </Fact>
            <Fact icon={<Translate size={18} weight="duotone" aria-hidden />} term="Speaks">
              {profile.languages.map((l, i) => (
                <span key={l.name}>
                  {l.name}
                  {l.level && <span className="text-ink-3"> ({l.level.replace("Conversational (", "").replace(")", "")})</span>}
                  {i < profile.languages.length - 1 ? ", " : ""}
                </span>
              ))}
            </Fact>
          </dl>
        </div>
      </div>
    </section>
  );
}

/** The heading rises word by word out of its own line, once, as it comes into view. */
function Rise({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <motion.span
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.8 }}
      transition={{ staggerChildren: 0.08 }}
      className="inline"
    >
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            variants={{ hidden: { y: "110%" }, show: { y: 0, transition: { duration: 0.8, ease: EASE } } }}
            className="inline-block"
          >
            {w}
          </motion.span>
          {i < words.length - 1 && "\u00a0"}
        </span>
      ))}
    </motion.span>
  );
}

/**
 * The lead paragraph lights up word by word as you scroll, from a faint
 * outline of itself to full ink, finishing as it reaches the middle of the screen.
 * Reduced motion: plain text.
 */
function ReadAlong({ text, className }: { text: string; className: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const progress = useTransform(() => {
    scrollY.get();
    const el = ref.current;
    if (!el || typeof window === "undefined") return 1;
    const vh = window.innerHeight;
    return Math.min(1, Math.max(0, (vh * 0.9 - el.getBoundingClientRect().top) / (vh * 0.45)));
  });
  if (reduce) return <p className={className}>{text}</p>;
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={progress} at={i / words.length} span={1 / words.length}>
          {w + (i < words.length - 1 ? " " : "")}
        </Word>
      ))}
    </p>
  );
}

function Word({ progress, at, span, children }: { progress: MotionValue<number>; at: number; span: number; children: string }) {
  // Each word brightens over a short window that overlaps its neighbours, so the light runs smoothly.
  const opacity = useTransform(progress, [at - span * 3, at + span * 3], [0.18, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

function Fact({ icon, term, children }: { icon: React.ReactNode; term: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line pt-4">
      <dt className="flex items-center gap-2 text-[0.8125rem] tracking-[0.01em] font-semibold text-lavender">
        {icon}
        {term}
      </dt>
      <dd className="mt-1.5 text-[1rem] leading-[1.5] text-ink">{children}</dd>
    </div>
  );
}
