"use client";

import { motion } from "motion/react";
import Image from "next/image";
import {
  EnvelopeSimple,
  LinkedinLogo,
  GithubLogo,
  BookOpen,
  MapPin,
} from "@phosphor-icons/react";
import CursorGlow from "./CursorGlow";

/* Apple §4: critically damped spring, no overshoot */
const SPRING = { type: "spring", bounce: 0, duration: 0.5 } as const;

const socials = [
  { label: "Email",   href: "mailto:godavarthysonali@gmail.com",                                   Icon: EnvelopeSimple },
  { label: "LinkedIn",href: "https://www.linkedin.com/in/sonali-godavarthy-982a31184/",            Icon: LinkedinLogo  },
  { label: "GitHub",  href: "https://github.com/SonaliGodavarthy",                                 Icon: GithubLogo    },
  { label: "Scholar", href: "https://scholar.google.com/citations?user=Qn4h9lwAAAAJ&hl=en&oi=ao", Icon: BookOpen      },
];

/** Clip-path slide-up: Apple §7 — text enters from below, spatially consistent */
function SlideUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "105%" }}
        animate={{ y: "0%" }}
        transition={{ ...SPRING, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-end pb-16 overflow-hidden">
      <CursorGlow />

      {/* Watermark name — very subtle, background layer */}
      <motion.div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.2 }}
      >
        <span
          className="font-semibold text-center leading-none"
          style={{
            fontSize: "clamp(54px, 13.5vw, 210px)",
            letterSpacing: "-0.04em",
            color: "rgba(255,255,255,0.03)",
          }}
        >
          SONALI<br />GODAVARTHY
        </span>
      </motion.div>

      {/* Photo — top-right, Apple §12: floats as a translucent material */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.45 }}
        className="absolute top-20 right-6 md:right-12"
      >
        <div className="relative w-[88px] h-[106px] md:w-28 md:h-[136px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60">
          <Image
            src="/sonali.jpeg"
            alt="Sonali Godavarthy"
            fill
            className="object-cover object-top"
            priority
          />
          {/* Apple §12: subtle vibrancy hint at bottom */}
          <div
            className="absolute inset-x-0 bottom-0 h-1/3"
            style={{ background: "linear-gradient(to top, rgba(10,10,10,0.45), transparent)" }}
          />
        </div>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="max-w-2xl space-y-8">

          {/* Name + roles */}
          <div className="space-y-3">
            <SlideUp delay={0.1}>
              <h1
                className="text-[clamp(36px,6vw,72px)] font-semibold text-[#f2f2f2] leading-[1.04]"
                style={{ letterSpacing: "-0.03em" }}     /* Apple §15: tight tracking on large type */
              >
                Sonali Godavarthy
              </h1>
            </SlideUp>

            <FadeUp delay={0.22}>
              <div className="flex flex-wrap gap-2">
                {["AI Researcher", "AI Engineer"].map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#10b981]
                               border border-[#10b981]/25 px-2.5 py-[5px] rounded-sm
                               bg-[#10b981]/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </FadeUp>
          </div>

          {/* Tagline */}
          <FadeUp delay={0.32}>
            <p
              className="text-base md:text-lg text-[#777] max-w-[48ch]"
              style={{ lineHeight: 1.65 }}
            >
              Building at the intersection of generative AI, computer vision,
              and production systems.{" "}
              <span className="text-[#bbb]">
                Published at ICPR 2026 and ECCV 2026.
              </span>
            </p>
          </FadeUp>

          {/* Location + socials */}
          <FadeUp delay={0.4}>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5 text-[13px] text-[#555]">
                <MapPin size={12} weight="fill" className="text-[#10b981]" />
                Siegen, Germany - open to relocate
              </div>
              <div className="flex items-center gap-1.5">
                {socials.map(({ label, href, Icon }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={label}
                    /* Apple §1: respond on pointer-down */
                    whileTap={{ scale: 0.92 }}
                    transition={SPRING}
                    className="w-8 h-8 flex items-center justify-center rounded-lg
                               border border-white/8 text-[#555]
                               hover:text-[#10b981] hover:border-[#10b981]/30
                               transition-colors duration-150"
                  >
                    <Icon size={14} />
                  </motion.a>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* CTAs */}
          <FadeUp delay={0.48}>
            <div className="flex flex-wrap gap-3">
              <motion.a
                href="#experience"
                whileTap={{ scale: 0.97 }}          /* Apple §1: instant press feedback */
                transition={SPRING}
                className="inline-flex items-center px-5 py-2.5 rounded-full
                           bg-[#10b981] text-[#0a0a0a] text-sm font-semibold
                           hover:bg-[#34d399] transition-colors duration-150"
              >
                View Work
              </motion.a>
              <motion.a
                href="#contact"
                whileTap={{ scale: 0.97 }}
                transition={SPRING}
                className="inline-flex items-center px-5 py-2.5 rounded-full
                           border border-white/10 text-[#888] text-sm
                           hover:border-white/22 hover:text-[#f0f0f0]
                           transition-colors duration-150"
              >
                Get in touch
              </motion.a>
            </div>
          </FadeUp>

          {/* Stats strip */}
          <FadeUp delay={0.56}>
            <div className="flex flex-wrap gap-8 pt-6 border-t border-white/6">
              {[
                { v: "2",         l: "Publications"  },
                { v: "4+",        l: "Years in ML"   },
                { v: "Top 1%",    l: "Scholarship"   },
                { v: "ICPR/ECCV", l: "Venues 2026"   },
              ].map(({ v, l }) => (
                <div key={l}>
                  <div
                    className="font-mono text-sm font-semibold text-[#f0f0f0]"
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    {v}
                  </div>
                  <div className="font-mono text-[10px] text-[#444] uppercase tracking-wider mt-0.5">
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>

      {/* Bottom rule */}
      <motion.div
        className="absolute bottom-0 inset-x-0 h-px bg-white/6"
        initial={{ scaleX: 0, originX: 1 }}
        animate={{ scaleX: 1 }}
        transition={{ ...SPRING, delay: 0.7 }}
      />
    </section>
  );
}
