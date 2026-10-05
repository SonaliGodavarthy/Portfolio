"use client";

import type { ExperienceItem } from "@/lib/data";
import { FramedText, useFraming } from "@/lib/framing";
import CaseStudy, { BulletList } from "./CaseStudy";

export default function ExperienceDetail({ exp }: { exp: ExperienceItem }) {
  const { framing } = useFraming();
  // Show the framing's bullets first, then anything only the other CV mentions.
  const other = framing === "research" ? "engineering" : "research";
  const bullets = [...exp.bullets[framing], ...exp.bullets[other].filter((b) => !exp.bullets[framing].includes(b))];

  return (
    <CaseStudy
      backHref="/#experience"
      backLabel="All Experience"
      kicker={
        <>
          {exp.start} - {exp.end}
          <span className="mx-2 text-ink-3">/</span>
          {exp.location}
        </>
      }
      title={exp.company}
      subtitle={<FramedText value={exp.role} />}
      impact={exp.impact}
      context={exp.context}
      diagramType={exp.diagramType}
      bullets={<BulletList items={bullets} />}
      tools={exp.tools}
    />
  );
}
