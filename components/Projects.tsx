"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { projects, type ProjectItem } from "@/lib/data";
import { DenoiseDemo, JigsawDemo, RetrievalDemo } from "./Demos";
import TiltCard from "./TiltCard";
import { usePaused } from "@/lib/pause";

const bySlug = (slug: string) => projects.find((p) => p.slug === slug)!;

/** Hover on desktop; on touch screens the demo plays once the tile is in view. */
function useNoHover() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(hover: none)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(hover: none)").matches,
    () => false,
  );
}

function Tile({
  project,
  className = "",
  tone,
  visual,
  onPointer,
  onActive,
}: {
  project: ProjectItem;
  className?: string;
  tone: "deep" | "lavender" | "paper" | "sky";
  visual?: ReactNode;
  onPointer?: (p: { x: number; y: number } | null) => void;
  onActive?: (a: boolean) => void;
}) {
  const noHover = useNoHover();
  const paused = usePaused();
  const [el, setEl] = useState<HTMLAnchorElement | null>(null);

  useEffect(() => {
    // On touch screens the demo plays by itself, so it obeys the pause switch.
    if (!noHover || !el || !onActive) return;
    const io = new IntersectionObserver(([e]) => onActive(e.isIntersecting && !paused), { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [noHover, el, onActive, paused]);

  const tones = {
    deep: "bg-surface text-ink ring-1 ring-line",
    lavender: "bg-lavender text-[#140f26]",
    paper: "bg-surface text-ink ring-1 ring-line",
    sky: "bg-surface-2 text-ink ring-1 ring-line",
  } as const;
  const sub = tone === "lavender" ? "text-lavender-soft" : "text-ink-2";

  // Grid spans live on the tilt wrapper; the card face carries the tone.
  const span = className.split(" ").filter((c) => c.includes("col-span")).join(" ");
  const face = className.split(" ").filter((c) => !c.includes("col-span")).join(" ");

  return (
    <TiltCard wrapperClassName={span} className={`rounded-3xl ${tones[tone]}`}>
    <Link
      ref={setEl}
      href={`/projects/${project.slug}`}
      onPointerEnter={() => onActive?.(true)}
      onPointerLeave={() => {
        onActive?.(false);
        onPointer?.(null);
      }}
      onFocus={() => onActive?.(true)}
      onBlur={() => onActive?.(false)}
      onPointerMove={(e) => {
        if (!onPointer) return;
        const r = e.currentTarget.getBoundingClientRect();
        onPointer({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
      }}
      className={`group relative flex min-h-[300px] flex-col overflow-hidden rounded-3xl p-6 md:p-7
                  transition-transform duration-200 ease-out active:scale-[0.985] active:duration-75 ${face}`}
    >
      {visual}
      <div className="relative mt-auto">
        <div className="flex items-start justify-between gap-4">
          <h3 data-depth className="min-w-0 font-display text-[length:clamp(1.375rem,2.2vw,1.75rem)] font-semibold leading-[1.1] tracking-[-0.02em]">
            {project.shortTitle}
          </h3>
          <ArrowUpRight
            size={20}
            weight="bold"
            className="shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden
          />
        </div>
        <p className={`mt-2 max-w-[46ch] text-[1rem] leading-[1.55] ${sub}`}>{project.shortDesc}</p>
        <p className={`mt-4 text-[0.75rem] tracking-[0.01em] font-medium ${sub}`}>{project.tools.slice(0, 4).join("  /  ")}</p>
      </div>
    </Link>
    </TiltCard>
  );
}

export default function Projects() {
  const [ragActive, setRagActive] = useState(false);
  // Read by the canvas loop each frame; kept out of React state so moving the
  // pointer never re-renders the grid.
  const ragPointer = useRef<{ x: number; y: number } | null>(null);
  const [dnActive, setDnActive] = useState(false);
  const [jgActive, setJgActive] = useState(false);
  const [adActive, setAdActive] = useState(false);

  const legal = bySlug("german-legal-ai");
  const jigsaw = bySlug("jigsaw-puzzle");
  const denoise = bySlug("microscopic-denoising");
  const askdoc = bySlug("askdoc");
  const xmas = bySlug("christmas-classification");

  return (
    <section id="projects" className="mx-auto max-w-[1400px] px-5 md:px-10 lg:px-14 py-24 md:py-36">
      <h2 className="font-display text-[length:clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[1] tracking-[-0.02em] text-ink">
        Projects
      </h2>
      <p className="mt-5 max-w-[46ch] text-[1.0625rem] leading-[1.6] text-ink-2">
        Side projects and coursework.{" "}
        <span className="hidden [@media(hover:hover)]:inline">Hover a card to tilt it and see what it does.</span>
        <span className="[@media(hover:hover)]:hidden">Each demo plays as you scroll to it.</span>
      </p>

      <div className="mt-14 grid gap-4 md:grid-cols-6">
        <Tile
          project={legal}
          tone="deep"
          className="md:col-span-4 md:min-h-[440px]"
          onActive={setRagActive}
          onPointer={(p) => {
            ragPointer.current = p;
          }}
          visual={
            <>
              <RetrievalDemo active={ragActive} pointerRef={ragPointer} />
              <span className="relative self-start text-[0.75rem] font-medium tracking-[0.01em] text-ink-3">
                Illustration: 900 dots, 10 chunks each
              </span>
              <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-surface via-surface/85 to-transparent" />
            </>
          }
        />

        <Tile
          project={jigsaw}
          tone="sky"
          className="md:col-span-2 md:min-h-[440px]"
          onActive={setJgActive}
          visual={
            <div className="relative mb-8 grid place-items-center flex-1">
              <JigsawDemo active={jgActive} />
            </div>
          }
        />

        <Tile
          project={denoise}
          tone="lavender"
          className="md:col-span-2 min-h-[380px]"
          onActive={setDnActive}
          visual={
            <>
              <div className="absolute inset-x-0 top-0 h-[55%] overflow-hidden">
                <DenoiseDemo active={dnActive} />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-lavender to-transparent" />
              </div>
            </>
          }
        />

        <Tile
          project={askdoc}
          tone="paper"
          className="md:col-span-2 min-h-[380px]"
          onActive={setAdActive}
          visual={
            <div aria-hidden className="relative mb-6 space-y-3 text-[0.875rem] leading-[1.5]">
              <p className="font-semibold">What does MULTI disentangle?</p>
              <p className="text-ink-2">
                Camera{" "}
                <mark
                  className={`rounded px-0.5 text-ink transition-colors duration-500 ${adActive ? "bg-lavender-soft" : "bg-transparent"}`}
                >
                  lens, sensor, view and domain
                </mark>
                , so each can change on its own.
                <span
                  className={`ml-1.5 inline-block rounded bg-lavender px-1.5 text-[0.75rem] tracking-[0.01em] font-bold text-paper transition-opacity duration-500 ${adActive ? "opacity-100" : "opacity-0"}`}
                >
                  p.1
                </span>
              </p>
              <p className="text-[0.75rem] tracking-[0.01em] text-ink-3">Example question</p>
            </div>
          }
        />

        <Tile
          project={xmas}
          tone="paper"
          className="md:col-span-2 min-h-[380px]"
          visual={
            <ul aria-hidden className="relative mb-6 space-y-1 font-display text-[1.625rem] font-semibold tracking-[-0.02em]">
              <li className="text-ink/25">AlexNet</li>
              <li className="text-ink/25">ResNet</li>
              <li className="flex items-baseline gap-3 text-lavender">
                GoogLeNet
                <span className="font-mono text-[0.875rem] font-medium tabular text-ink-2">91%</span>
              </li>
            </ul>
          }
        />
      </div>
    </section>
  );
}
