"use client";

import { useEffect, useRef } from "react";
import type { ColorTrail as Trail } from "@/lib/colortrail";
import { usePaused } from "@/lib/pause";

/**
 * A thin line of colour that follows the mouse across every page and fades.
 * Lives in the root layout, so it carries on across page navigations.
 * Mouse only (no touch), off for reduced motion and while the pause switch is on.
 */
export default function ColorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<Trail | null>(null);
  const paused = usePaused();
  const pausedRef = useRef(paused);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let trail: Trail | null = null;
    import("@/lib/colortrail")
      .then(({ ColorTrail }) => {
        if (cancelled) return;
        trail = new ColorTrail(canvas);
        trail.setEnabled(!pausedRef.current);
        trailRef.current = trail;
      })
      .catch((err) => console.warn("Colour trail unavailable:", err));
    return () => {
      cancelled = true;
      trail?.dispose();
      trailRef.current = null;
    };
  }, []);

  useEffect(() => {
    pausedRef.current = paused;
    trailRef.current?.setEnabled(!paused);
  }, [paused]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] size-full mix-blend-screen invisible"
    />
  );
}
