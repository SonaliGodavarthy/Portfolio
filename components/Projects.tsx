"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { projects } from "@/lib/data";

/* Apple spring — critically damped, no overshoot */
const SPRING = { type: "spring", bounce: 0, duration: 0.4 } as const;
const EASE   = [0.23, 1, 0.32, 1] as const;

/** Spotlight-border card: a radial glow tracks the mouse within each card */
function SpotlightCard({
  children,
  accent,
  delay,
}: {
  children: React.ReactNode;
  accent: string;
  delay: number;
}) {
  const ref                       = useRef<HTMLDivElement>(null);
  const [pos, setPos]             = useState({ x: -999, y: -999 });
  const [hovered, setHovered]     = useState(false);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ ...SPRING, delay }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-2xl border border-white/7 bg-[#111] group cursor-pointer"
    >
      {/* Spotlight glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(300px circle at ${pos.x}px ${pos.y}px, ${accent}18, transparent 70%)`,
        }}
      />
      {/* Border highlight under cursor */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(200px circle at ${pos.x}px ${pos.y}px, ${accent}30, transparent 60%)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
        }}
      />
      {children}
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-24 border-t border-white/6">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={SPRING}
          className="mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#f0f0f0]">
            Projects
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <SpotlightCard key={project.slug} accent={project.accent} delay={i * 0.05}>
              <Link
                href={`/projects/${project.slug}`}
                className="flex flex-col gap-5 p-6 h-full"
              >
                {/* Top row */}
                <div className="flex items-center justify-between">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: project.accent }}
                  />
                  <ArrowUpRight
                    size={15}
                    className="text-[#444] group-hover:text-[#10b981] transition-colors duration-200"
                  />
                </div>

                {/* Title + tools */}
                <div className="flex-1 space-y-3">
                  <h3 className="text-sm font-semibold text-[#e8e8e8] leading-snug">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tools.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[10px] text-[#555] bg-white/4 border border-white/6 px-2 py-0.5 rounded-md"
                      >
                        {t}
                      </span>
                    ))}
                    {project.tools.length > 3 && (
                      <span className="font-mono text-[10px] text-[#3a3a3a]">
                        +{project.tools.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
