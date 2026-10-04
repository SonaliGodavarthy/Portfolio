"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { PointCloud } from "@/lib/particles";
import { PORTRAIT } from "@/lib/portrait";
import { usePaused } from "@/lib/pause";

const LABELS = ["Lens", "Sensor", "View", "Domain"];

/**
 * An exploded view: the same portrait pulled apart into four layers, one per
 * imaging factor. An illustration of what MULTI separates, not model output.
 */
export default function FactorStack() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const reduce = useReducedMotion();
  const paused = usePaused();
  const pausedRef = useRef(paused);
  const cloudRef = useRef<PointCloud | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    pausedRef.current = paused;
    cloudRef.current?.setPaused(paused);
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cloud: PointCloud | null = null;
    let io: IntersectionObserver | null = null;
    let cancelled = false;

    // Only load and build once the figure is close to the viewport.
    const boot = async () => {
      try {
        const { PointCloud, sampleCutout } = await import("@/lib/particles");
        const data = await sampleCutout(PORTRAIT, 200);
        if (cancelled) return;
        cloud = new PointCloud(canvas, data, {
          draggable: true,
          additive: false,
          reducedMotion: !!reduce,
          restYaw: 0.72,
          restPitch: -0.18,
          pointSize: 20,
          introSeconds: 2,
          onLayers: (pts) =>
            pts.forEach((p, i) => {
              const el = labelRefs.current[i];
              if (el) el.style.transform = `translate(${p.x}px, ${p.y}px)`;
            }),
        });
        cloud.setPaused(pausedRef.current);
        cloudRef.current = cloud;
        io = new IntersectionObserver(
          ([e]) => {
            if (!cloud) return;
            cloud.explode.target = e.isIntersecting ? 1 : 0;
            cloud.kick();
          },
          { threshold: 0.45 },
        );
        io.observe(canvas);
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    const near = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          near.disconnect();
          boot();
        }
      },
      { rootMargin: "600px 0px" },
    );
    near.observe(canvas);
    return () => {
      cancelled = true;
      near.disconnect();
      io?.disconnect();
      cloud?.dispose();
      cloudRef.current = null;
    };
  }, [reduce]);

  // Arrow keys give the same push a drag would.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const push = { ArrowLeft: [-1.6, 0], ArrowRight: [1.6, 0], ArrowUp: [0, -0.9], ArrowDown: [0, 0.9] }[e.key];
    if (!push || !cloudRef.current) return;
    e.preventDefault();
    cloudRef.current.nudge(push[0], push[1]);
  };

  if (failed) return null;

  return (
    <figure className="relative">
      <div className="relative aspect-[5/4] w-full select-none">
        <div aria-hidden className="glow absolute inset-[-10%]" />
        <canvas
          ref={canvasRef}
          aria-label="Illustration: a portrait separated into four layers labelled Lens, Sensor, View and Domain. Use the arrow keys to turn it."
          role="img"
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="absolute inset-0 rounded-3xl size-full touch-pan-y cursor-grab data-[dragging=true]:cursor-grabbing"
        />
        {LABELS.map((l, i) => (
          <span
            key={l}
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 -translate-x-full whitespace-nowrap pr-2
                       font-mono text-[0.75rem] text-lavender will-change-transform"
          >
            {l}
          </span>
        ))}
      </div>
      <figcaption className="mt-2 text-[0.8125rem] leading-[1.5] tracking-[0.01em] text-ink-3">
        One image, four factors pulled apart. An illustration of what MULTI separates, rendered
        live as 3D points from a photo of her. Drag it, or focus it and use the arrow keys, to turn it.
      </figcaption>
    </figure>
  );
}
