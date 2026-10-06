"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { MapPin, Translate, GraduationCap } from "@phosphor-icons/react";
import { profile } from "@/lib/data";
import TiltCard from "./TiltCard";
import { useFraming } from "@/lib/framing";

const EASE = [0.23, 1, 0.32, 1] as const;

export default function About() {
  const { framing } = useFraming();
  return (
    <section id="about" className="mx-auto max-w-[1400px] px-5 md:px-10 lg:px-14 py-24 md:py-36">
      <div className="grid gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 lg:gap-24 items-start">
        <figure data-follow="to" className="md:sticky md:top-28 max-w-[420px]">
          <TiltCard className="rounded-3xl" depth={0}>
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-[0_40px_80px_-40px_rgba(5,3,12,0.8)]"
          >
            <Image
              src="/sonali-about.webp"
              alt="Sonali standing on the grass by a lake in a teal knit dress, a gull flying overhead."
              fill
              sizes="(min-width: 768px) 420px, 90vw"
              className="object-cover"
              priority={false}
            />
          </motion.div>
          </TiltCard>
        </figure>

        <div>
          <h2 className="font-display text-[length:clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[1] tracking-[-0.02em]">
            Hello, I’m Sonali.
          </h2>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={framing}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="mt-8 space-y-5 max-w-[60ch]"
            >
              {profile.about[framing].map((para, i) => (
                <p
                  key={i}
                  className={i === 0 ? "text-[1.3125rem] md:text-[1.4375rem] leading-[1.5] text-ink" : "text-[1.0625rem] leading-[1.7] text-ink-2"}
                >
                  {para}
                </p>
              ))}
            </motion.div>
          </AnimatePresence>

          <dl className="mt-12 grid gap-x-10 gap-y-7 sm:grid-cols-2 max-w-[640px]">
            <Fact icon={<MapPin size={18} weight="duotone" aria-hidden />} term="Based in">
              {profile.location}. {profile.relocate}.
            </Fact>
            <Fact icon={<GraduationCap size={18} weight="duotone" aria-hidden />} term="Studied">
              M.Sc. Computer Science (Visual Computing), University of Siegen
            </Fact>
            <Fact icon={<Translate size={18} weight="duotone" aria-hidden />} term="Speaks">
              {profile.languages.map((l, i) => (
                <span key={l.name}>
                  {l.name}
                  {l.level && <span className="text-ink-3"> ({l.level.replace("Conversational (", "").replace(")", "")})</span>}
                  {i < profile.languages.length - 1 ? ", " : ""}
                </span>
              ))}
            </Fact>
          </dl>
        </div>
      </div>
    </section>
  );
}

function Fact({ icon, term, children }: { icon: React.ReactNode; term: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line pt-4">
      <dt className="flex items-center gap-2 text-[0.8125rem] tracking-[0.01em] font-semibold text-lavender">
        {icon}
        {term}
      </dt>
      <dd className="mt-1.5 text-[1rem] leading-[1.5] text-ink">{children}</dd>
    </div>
  );
}
