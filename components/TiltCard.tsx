"use client";

// Adapted from "Optimized Tilt Card" by sh20raj on 21st.dev
// (https://21st.dev/@sh20raj/components/optimized-tilt-card): pointer-tracked
// tilt via CSS variables, touch-hold support and a light sheen. Changes here:
// spring physics instead of a fixed transition (so it follows the hand and
// settles naturally), a floating depth layer, and reduced-motion support.

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { spring, stepSpring } from "@/lib/spring";

const MAX_TILT = 9;

export default function TiltCard({
  children,
  className = "",
  wrapperClassName = "",
  depth = 30,
}: {
  children: ReactNode;
  className?: string;
  /** classes for the outer perspective wrapper (grid spans and the like) */
  wrapperClassName?: string;
  /** how far (px) [data-depth] children float above the card face */
  depth?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const rx = spring(0, 1, 0.35);
    const ry = spring(0, 1, 0.35);
    const lift = spring(0, 1, 0.35);
    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const moving = [rx, ry, lift].map((s) => stepSpring(s, dt)).some(Boolean);
      el.style.setProperty("--rx", `${rx.x}deg`);
      el.style.setProperty("--ry", `${ry.x}deg`);
      el.style.setProperty("--lift", `${lift.x}`);
      if (moving) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    const aim = (x: number, y: number) => {
      const r = el.getBoundingClientRect();
      const px = Math.min(1, Math.max(0, (x - r.left) / r.width));
      const py = Math.min(1, Math.max(0, (y - r.top) / r.height));
      ry.target = (px - 0.5) * 2 * MAX_TILT;
      rx.target = (0.5 - py) * 2 * MAX_TILT;
      lift.target = 1;
      el.style.setProperty("--px", `${px * 100}%`);
      el.style.setProperty("--py", `${py * 100}%`);
      kick();
    };
    const rest = () => {
      rx.target = ry.target = lift.target = 0;
      kick();
    };
    const onMove = (e: PointerEvent) => aim(e.clientX, e.clientY);
    const onUp = (e: PointerEvent) => e.pointerType === "touch" && rest();
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", rest);
    el.addEventListener("pointercancel", rest);
    el.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", rest);
      el.removeEventListener("pointercancel", rest);
      el.removeEventListener("pointerup", onUp);
    };
  }, [reduce]);

  return (
    <div className={`[perspective:1100px] ${wrapperClassName}`}>
      <div
        ref={ref}
        className={`group/tilt relative [transform-style:preserve-3d] ${className}`}
        style={
          {
            "--depth": `${depth}px`,
            transform:
              "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateZ(calc(var(--lift, 0) * 12px))",
          } as React.CSSProperties
        }
      >
        {children}
        {/* sheen that follows the pointer */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
          style={{
            background:
              "radial-gradient(circle at var(--px, 50%) var(--py, 50%), rgba(185,167,255,0.22), transparent 60%)",
          }}
        />
      </div>
    </div>
  );
}
