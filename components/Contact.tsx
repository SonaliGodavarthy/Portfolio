"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { toast } from "sonner";
import {
  ArrowUpRight,
  Copy,
  EnvelopeSimple,
  GithubLogo,
  GraduationCap,
  LinkedinLogo,
} from "@phosphor-icons/react";
import { profile } from "@/lib/data";
import type { PointCloud } from "@/lib/particles";
import { usePaused } from "@/lib/pause";

const socials = [
  { label: "LinkedIn", href: profile.links.linkedin, Icon: LinkedinLogo },
  { label: "GitHub", href: profile.links.github, Icon: GithubLogo },
  { label: "Google Scholar", href: profile.links.scholar, Icon: GraduationCap },
];

const HEADING = "Say Hello.";

/** The page closes the way it opened: points denoising into shape, this time words. */
export default function Contact() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const paused = usePaused();
  const pausedRef = useRef(paused);
  const cloudRef = useRef<PointCloud | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    pausedRef.current = paused;
    cloudRef.current?.setPaused(paused);
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cloud: PointCloud | null = null;
    let cancelled = false;
    const near = new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting) return;
        near.disconnect();
        try {
          const { PointCloud, sampleText } = await import("@/lib/particles");
          const family = getComputedStyle(document.body).fontFamily;
          const data = sampleText(HEADING, `600 200px ${family}`);
          if (cancelled) return;
          cloud = new PointCloud(canvas, data, {
            reducedMotion: !!reduce,
            pointSize: 30,
            introSeconds: 2.4,
          });
          cloud.setPaused(pausedRef.current);
          cloudRef.current = cloud;
          setLive(true);
        } catch {
          /* the DOM heading stays visible */
        }
      },
      { threshold: 0.3 },
    );
    near.observe(canvas);
    return () => {
      cancelled = true;
      near.disconnect();
      cloud?.dispose();
      cloudRef.current = null;
    };
  }, [reduce]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      toast("Email Copied", { description: profile.email });
    } catch {
      toast("Couldn’t Reach the Clipboard", { description: `Select and copy it instead: ${profile.email}` });
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-paper">
      <div aria-hidden className="glow absolute left-1/2 top-[38%] size-[110vmin] -translate-x-1/2 -translate-y-1/2" />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10 lg:px-14 pt-28 md:pt-36">
        <p className="mx-auto max-w-[40ch] text-center text-[1.0625rem] leading-[1.55] text-ink-2">
          Open to research collaborations and AI research or engineering roles, in Germany or elsewhere.
        </p>

        <div className="relative mx-auto mt-6 h-[38vw] max-h-[420px] min-h-[180px] w-full max-w-[1100px]">
          <canvas
            ref={canvasRef}
            aria-hidden
            className={`absolute inset-0 size-full transition-opacity duration-700 ${live ? "opacity-100" : "opacity-0"}`}
          />
          <h2
            className={`absolute inset-0 grid place-items-center font-display font-semibold tracking-[-0.03em]
                        text-[length:clamp(3rem,12vw,9rem)] leading-none text-ink transition-opacity duration-700
                        ${live ? "opacity-0" : "opacity-100"}`}
          >
            {HEADING}
          </h2>
        </div>

        <div className="relative mt-4 flex flex-col items-center pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-28">
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-lavender px-6 py-3 text-[1rem] font-semibold text-[#140f26]
                         shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_12px_28px_-14px_rgba(5,3,12,0.9)] hover:bg-white active:scale-[0.97] active:duration-75
                         transition-[background-color,transform] duration-150"
            >
              <EnvelopeSimple size={18} weight="bold" aria-hidden />
              Get in Touch
            </a>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[0.9375rem] font-medium text-ink ring-cur
                         active:scale-[0.97] active:duration-75 transition-[box-shadow,transform] duration-150"
            >
              <span translate="no" className="font-mono text-[0.875rem]">{profile.email}</span>
              <Copy size={16} aria-hidden />
              <span className="sr-only">Copy email address</span>
            </button>
          </div>

          <ul className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-6">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative before:absolute before:-inset-x-1 before:-inset-y-3 before:content-[''] inline-flex items-center gap-2 text-[1rem] font-medium text-ink-2 hover:text-ink active:opacity-50"
                >
                  <Icon size={18} aria-hidden />
                  {label}
                  <ArrowUpRight size={13} weight="bold" className="opacity-70" aria-hidden />
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-20 flex w-full flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-[0.8125rem] tracking-[0.01em] text-ink-3">
            {/* the year is baked at build time; the client may be a new year ahead */}
            <p suppressHydrationWarning translate="no">
              Sonali Godavarthy, {new Date().getFullYear()}
            </p>
            <p>{profile.location}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
