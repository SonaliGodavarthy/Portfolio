"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";

// Small, honest illustrations of what each project does. None of them show
// real model output; captions on the tiles say so where it matters.

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function useCanvasLoop(
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, dt: number) => boolean,
  active: boolean,
) {
  const ref = useRef<HTMLCanvasElement>(null);
  const kickRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let last = performance.now();
    let w = 0;
    let h = 0;
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const loop = (now: number) => {
      raf = 0;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const more = draw(ctx, w, h, dt);
      if (more) raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    kickRef.current = kick;
    const ro = new ResizeObserver(() => {
      size();
      kick();
    });
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [draw]);

  useEffect(() => {
    kickRef.current();
  }, [active]);

  return ref;
}

// ─── Retrieval: a query finds its nearest chunks ─────────────────────────────

const DOTS = (() => {
  const rnd = seeded(7);
  const centers = Array.from({ length: 9 }, () => [0.1 + rnd() * 0.8, 0.12 + rnd() * 0.76]);
  return Array.from({ length: 900 }, () => {
    const c = centers[Math.floor(rnd() * centers.length)];
    const a = rnd() * Math.PI * 2;
    const r = Math.pow(rnd(), 0.7) * 0.13;
    return [c[0] + Math.cos(a) * r * 1.2, c[1] + Math.sin(a) * r] as [number, number];
  });
})();

export function RetrievalDemo({
  active,
  pointerRef,
}: {
  active: boolean;
  pointerRef: RefObject<{ x: number; y: number } | null>;
}) {
  const state = useRef({ qx: 0.6, qy: 0.5, glow: 0, t: 0 });
  const activeRef = useLatest(active);

  const ref = useCanvasLoop(
    useRefCallback((ctx: CanvasRenderingContext2D, w: number, h: number, dt: number) => {
      const s = state.current;
      const p = pointerRef.current;
      s.t += dt;
      const tx = p ? p.x : 0.6 + Math.sin(s.t * 0.5) * 0.18;
      const ty = p ? p.y : 0.5 + Math.cos(s.t * 0.4) * 0.12;
      s.qx += (tx - s.qx) * (1 - Math.exp(-dt * 8));
      s.qy += (ty - s.qy) * (1 - Math.exp(-dt * 8));
      s.glow += ((activeRef.current ? 1 : 0) - s.glow) * (1 - Math.exp(-dt * 6));

      ctx.clearRect(0, 0, w, h);
      const qx = s.qx * w;
      const qy = s.qy * h;
      const near = DOTS.map((d, i) => [Math.hypot(d[0] * w - qx, d[1] * h - qy), i])
        .sort((a, b) => a[0] - b[0])
        .slice(0, 8);
      const nearSet = new Set(near.map((n) => n[1]));

      for (let i = 0; i < DOTS.length; i++) {
        if (nearSet.has(i)) continue;
        ctx.fillStyle = "rgba(185,167,255,0.5)";
        ctx.fillRect(DOTS[i][0] * w - 1.1, DOTS[i][1] * h - 1.1, 2.2, 2.2);
      }
      ctx.lineWidth = 1;
      for (const [, i] of near) {
        const x = DOTS[i][0] * w;
        const y = DOTS[i][1] * h;
        ctx.strokeStyle = `rgba(241,237,255,${0.15 + 0.5 * s.glow})`;
        ctx.beginPath();
        ctx.moveTo(qx, qy);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fillStyle = "#f1edff";
        ctx.beginPath();
        ctx.arc(x, y, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#f3d9a4";
      ctx.beginPath();
      ctx.arc(qx, qy, 5 + s.glow * 1.5, 0, Math.PI * 2);
      ctx.fill();
      return activeRef.current || s.glow > 0.01;
    }),
    active,
  );
  return <canvas ref={ref} aria-hidden className="absolute inset-0 size-full" />;
}

// ─── Denoising: noise lifts while you hover ──────────────────────────────────

const DN_W = 180;
const DN_H = 120;
const CELLS = (() => {
  const rnd = seeded(21);
  const img = new Float32Array(DN_W * DN_H);
  const blobs = Array.from({ length: 16 }, () => ({
    x: rnd() * DN_W,
    y: rnd() * DN_H,
    r: 8 + rnd() * 14,
    e: 0.6 + rnd() * 0.5,
  }));
  for (let y = 0; y < DN_H; y++) {
    for (let x = 0; x < DN_W; x++) {
      let v = 0.06;
      for (const b of blobs) {
        const d = Math.hypot((x - b.x) / b.e, y - b.y) / b.r;
        if (d < 1) v = Math.max(v, 0.22 + 0.55 * Math.exp(-Math.pow((d - 0.86) * 9, 2)) + 0.18 * (1 - d));
        if (d < 0.22) v = Math.max(v, 0.78);
      }
      img[y * DN_W + x] = v;
    }
  }
  return img;
})();

export function DenoiseDemo({ active }: { active: boolean }) {
  const state = useRef({ noise: 1, buf: null as ImageData | null, off: null as HTMLCanvasElement | null });
  const activeRef = useLatest(active);

  const ref = useCanvasLoop(
    useRefCallback((ctx: CanvasRenderingContext2D, w: number, h: number, dt: number) => {
      const s = state.current;
      if (!s.off) {
        s.off = document.createElement("canvas");
        s.off.width = DN_W;
        s.off.height = DN_H;
        s.buf = s.off.getContext("2d")!.createImageData(DN_W, DN_H);
      }
      const target = activeRef.current ? 0.05 : 1;
      s.noise += (target - s.noise) * (1 - Math.exp(-dt * 2.6));
      const data = s.buf!.data;
      for (let i = 0; i < CELLS.length; i++) {
        const n = (Math.random() + Math.random() + Math.random() - 1.5) * 0.55 * s.noise;
        const v = Math.max(0, Math.min(1, CELLS[i] + n));
        data[i * 4] = 79 + v * 153;
        data[i * 4 + 1] = 66 + v * 161;
        data[i * 4 + 2] = 130 + v * 118;
        data[i * 4 + 3] = 255;
      }
      s.off.getContext("2d")!.putImageData(s.buf!, 0, 0);
      ctx.imageSmoothingEnabled = true;
      const scale = Math.max(w / DN_W, h / DN_H);
      ctx.drawImage(s.off, (w - DN_W * scale) / 2, (h - DN_H * scale) / 2, DN_W * scale, DN_H * scale);
      return Math.abs(target - s.noise) > 0.01 || s.noise > 0.06;
    }),
    active,
  );
  return <canvas ref={ref} aria-hidden className="absolute inset-0 size-full" />;
}

// ─── Jigsaw: her photo, scrambled, solves itself ─────────────────────────────

const SCRAMBLE = [5, 2, 7, 0, 8, 3, 1, 6, 4];
const TURNS = [90, 180, 0, 270, 90, 0, 180, 270, 90];

export function JigsawDemo({ active }: { active: boolean }) {
  return (
    <div aria-hidden className="relative grid grid-cols-3 gap-[3px] aspect-square w-full max-w-[260px]">
      {Array.from({ length: 9 }, (_, i) => {
        const home = { c: i % 3, r: Math.floor(i / 3) };
        const slot = SCRAMBLE[i];
        const away = { c: slot % 3, r: Math.floor(slot / 3) };
        const dx = (away.c - home.c) * 100;
        const dy = (away.r - home.r) * 100;
        return (
          <div
            key={i}
            className="aspect-square rounded-[4px] bg-[url('/sonali.jpeg')] bg-[length:300%_300%] shadow-[0_4px_10px_-4px_rgba(31,26,51,0.5)]"
            style={{
              backgroundPosition: `${home.c * 50}% ${home.r * 50}%`,
              transform: active
                ? "translate(0,0) rotate(0deg)"
                : `translate(calc(${dx}% + ${dx * 0.03}px), calc(${dy}% + ${dy * 0.03}px)) rotate(${TURNS[i]}deg)`,
              transition: `transform 700ms cubic-bezier(0.77, 0, 0.175, 1) ${active ? i * 45 : (8 - i) * 30}ms`,
            }}
          />
        );
      })}
    </div>
  );
}

/** A ref that always holds the latest value, synced after render. */
function useLatest<T>(value: T) {
  const ref = useRef(value);
  useLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
}

/** Stable callback identity so canvas loops are not torn down on re-render. */
function useRefCallback<A extends unknown[], R>(fn: (...args: A) => R) {
  const ref = useLatest(fn);
  const [stable] = useState(() => (...args: A) => ref.current(...args));
  return stable;
}
