"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Pause, Play } from "@phosphor-icons/react";
import { profile } from "@/lib/data";
import { setPaused, usePaused } from "@/lib/pause";

const SPRING = { type: "spring", bounce: 0, duration: 0.7 } as const;

// The photo is cut off at 85.5% of its height (1368 of 1600 px), just above
// her hands; the sides and the cut edge are feathered into the ground.
export const FEATHER =
  "linear-gradient(90deg,transparent 0%,#000 10%,#000 90%,transparent 100%), linear-gradient(180deg,#000 86%,transparent 100%)";

/** Her portrait on a soft lavender light. The colour trail (components/ColorTrail) plays over the whole site. */
export default function Hero() {
  const paused = usePaused();
  const reduce = useReducedMotion();

  return (
    <section aria-label="Introduction" className="relative h-[100svh] min-h-[680px] overflow-hidden bg-paper">
      <div
        className="absolute left-1/2 top-10 h-[54%] aspect-[1200/1368] -translate-x-1/2
                   md:left-auto md:top-auto md:bottom-0 md:right-[max(24px,5%)] md:h-[82%] md:translate-x-0"
      >
        {/* soft lavender light behind her */}
        <div
          aria-hidden
          className="absolute inset-[-20%] bg-[radial-gradient(closest-side,rgba(185,167,255,0.16),transparent)] [translate:0_8%]"
        />
        <div
          data-follow="from"
          className="relative size-full overflow-hidden"
          style={{ maskImage: FEATHER, WebkitMaskImage: FEATHER, maskComposite: "intersect", WebkitMaskComposite: "source-in" }}
        >
          <Image
            src="/portrait-hero.webp"
            alt="Portrait of Sonali Godavarthy"
            width={1200}
            height={1600}
            sizes="(min-width: 768px) 620px, 60vw"
            className="h-auto w-full"
            priority
          />
        </div>
      </div>

      {/* a soft fade so the copy always sits on a calm ground */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(13,10,24,0.92)_0%,rgba(13,10,24,0.6)_35%,transparent_60%)]
                   max-md:bg-[linear-gradient(0deg,rgba(13,10,24,0.95)_0%,rgba(13,10,24,0.75)_32%,transparent_55%)]"
      />

      <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-5 pb-[calc(3rem+env(safe-area-inset-bottom))] md:justify-center md:px-10 md:pb-0 lg:px-14">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.4 }}
          className="pointer-events-auto max-w-[34rem]"
        >
          <h1 translate="no" className="font-display text-[length:clamp(3.25rem,8vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-ink">
            Sonali
            <br />
            Godavarthy
          </h1>
          <p className="mt-6 max-w-[30rem] text-[1.0625rem] leading-[1.5] text-ink-2 md:text-[1.1875rem]">
            <span className="font-semibold text-ink">{profile.title}.</span> {profile.heroLine}
          </p>
          <div className="mt-8">
            <a
              href="#contact"
              className="inline-flex items-center rounded-full bg-lavender px-6 py-3 text-[0.9375rem] font-semibold text-[#140f26]
                         shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_12px_28px_-14px_rgba(5,3,12,0.9)] transition-[background-color,transform] duration-150 ease-out
                         hover:bg-white active:scale-[0.97] active:duration-75"
            >
              Get in Touch
            </a>
          </div>
        </motion.div>
      </div>

      {!reduce && (
        <div className="absolute bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-[calc(1.75rem+env(safe-area-inset-right))] z-10 md:bottom-24 md:right-[2.125rem]">
          <HeroControl label="Pause Background Motion" pressed={paused} onClick={() => setPaused(!paused)}>
            {paused ? <Play size={14} weight="fill" aria-hidden /> : <Pause size={14} weight="fill" aria-hidden />}
          </HeroControl>
        </div>
      )}
    </section>
  );
}

/** A small icon control on the counter line, with a 44px hit area. */
function HeroControl({
  label,
  pressed,
  onClick,
  children,
}: {
  label: string;
  pressed?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      onClick={onClick}
      className="relative grid size-7 place-items-center rounded-full text-ink-3 transition-[color,background-color] duration-150
                 before:absolute before:-inset-2 before:content-[''] hover:bg-ink/10 hover:text-ink active:bg-ink/15"
    >
      {children}
    </button>
  );
}
