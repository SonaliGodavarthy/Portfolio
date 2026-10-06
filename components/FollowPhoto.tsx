"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { FEATHER } from "./Hero";

// The flight ends once About's top edge has travelled this share of the screen,
// well before About sticks and Experience starts to slide over it.
const TRAVEL = 0.8;
// The two photos swap in turn rather than blending: the flyer fades out, then About's photo fades in.
const OUT = [0.84, 0.92] as const;
const IN = [0.9, 1] as const;

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const range = (v: number, [a, b]: readonly [number, number]) => clamp((v - a) / (b - a));
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * The hero portrait follows you down the page. As About scrolls in, a copy of
 * the photo lifts off the hero ([data-follow="from"]), rides above the deck and
 * lands on the About photo ([data-follow="to"]), where it hands over to that
 * picture. Scroll-linked, so it runs backwards too. Only transform and opacity
 * change. Reduced motion: no flight, both photos stay where they are.
 */
export default function FollowPhoto() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    const flyer = ref.current;
    const from = document.querySelector<HTMLElement>('[data-follow="from"]');
    const to = document.querySelector<HTMLElement>('[data-follow="to"]');
    const about = document.getElementById("about");
    if (!flyer || !from || !to || !about) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      // Untransformed size of the hero photo; the flyer is drawn at this size and scaled.
      const w = from.offsetWidth;
      const h = from.offsetHeight;
      flyer.style.width = `${w}px`;
      flyer.style.height = `${h}px`;

      // 0 while About is below the screen, 1 once its top has risen TRAVEL of the way up.
      const p = clamp((vh - about.getBoundingClientRect().top) / (vh * TRAVEL));
      const e = smooth(p);
      const s = lerp(a.height / h, b.height / h, e);
      const x = lerp(a.left, b.left + b.width / 2 - (w * b.height) / h / 2, e);
      const y = lerp(a.top, b.top, e);
      flyer.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;

      const flying = p > 0 && p < 1;
      flyer.style.opacity = flying ? String(1 - range(p, OUT)) : "0";
      from.style.opacity = p > 0 ? "0" : "1";
      to.style.opacity = String(range(p, IN));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      from.style.opacity = "";
      to.style.opacity = "";
    };
  }, [reduce]);

  if (reduce) return null;
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-30 origin-top-left overflow-hidden opacity-0 will-change-transform"
      style={{ maskImage: FEATHER, WebkitMaskImage: FEATHER, maskComposite: "intersect", WebkitMaskComposite: "source-in" }}
    >
      <Image src="/portrait-hero.webp" alt="" width={1200} height={1600} sizes="620px" className="h-auto w-full" />
    </div>
  );
}
