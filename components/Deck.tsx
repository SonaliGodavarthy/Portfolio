"use client";

import { Children, useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

/**
 * The home page as a deck of cards. Each section sticks once its bottom edge
 * reaches the bottom of the screen, and the next section slides up over it,
 * while the one underneath settles back (scales down a touch and dims).
 * Native scrolling throughout: nothing hijacks the wheel or the trackpad.
 * Reduced motion: a plain page, no sticking, no scaling.
 */
export default function Deck({ children }: { children: ReactNode }) {
  const items = Children.toArray(children);
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <>
      {items.map((child, i) => (
        <Card key={i} index={i} last={i === items.length - 1}>
          {child}
        </Card>
      ))}
    </>
  );
}

function Card({ index, last, children }: { index: number; last: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  // Where the card's bottom edge sits in the page, ignoring the sticky offset.
  const end = useMotionValue(Infinity);

  // Stick when the bottom edge meets the bottom of the screen, however tall the
  // section is: top = min(0, viewport height - section height).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const place = () => {
      el.style.top = `${Math.min(0, window.innerHeight - el.offsetHeight)}px`;
      // offsetTop includes the sticky shift once stuck, so add up the cards above instead.
      let y = el.offsetHeight;
      for (let n = el.previousElementSibling; n instanceof HTMLElement; n = n.previousElementSibling) y += n.offsetHeight;
      const parent = el.offsetParent;
      end.set(y + (parent instanceof HTMLElement ? parent.getBoundingClientRect().top + window.scrollY : 0));
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(el);
    window.addEventListener("resize", place);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", place);
    };
  }, [end]);

  return (
    <div
      ref={ref}
      className={`sticky bg-paper ${index > 0 ? "overflow-clip rounded-t-3xl border-t border-line shadow-[0_-30px_60px_-30px_rgba(5,3,12,0.9)]" : ""}`}
      style={{ zIndex: index + 1 }}
    >
      {last ? children : <Settle end={end}>{children}</Settle>}
    </div>
  );
}

/** Scales and dims a card as the next one slides over it. */
function Settle({ end, children }: { end: MotionValue<number>; children: ReactNode }) {
  const { scrollY } = useScroll();
  // 0 while the card's bottom edge (where the next card begins) is at or below
  // the bottom of the screen, 1 once that edge reaches the top and the next card covers it.
  const progress = useTransform(() => {
    const vh = typeof window === "undefined" ? 1 : window.innerHeight;
    return Math.min(1, Math.max(0, (scrollY.get() + vh - end.get()) / vh));
  });
  const transform = useTransform(progress, (p) => `scale(${1 - 0.06 * p})`);
  const shade = useTransform(progress, [0, 1], [0, 0.65]);

  return (
    <motion.div style={{ transform, transformOrigin: "50% 100%" }} className="relative">
      {children}
      <motion.div aria-hidden style={{ opacity: shade }} className="pointer-events-none absolute inset-0 bg-[#05030c]" />
    </motion.div>
  );
}
