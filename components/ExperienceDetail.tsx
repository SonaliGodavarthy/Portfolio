"use client";

import { experiences, type ExperienceItem } from "@/lib/data";
import { FramedText, useFraming } from "@/lib/framing";
import CaseStudy, { BulletList } from "./CaseStudy";

export default function ExperienceDetail({ exp }: { exp: ExperienceItem }) {
  const { framing } = useFraming();
  const withPages = experiences.filter((e) => !e.minor);
  const next = withPages[(withPages.findIndex((e) => e.slug === exp.slug) + 1) % withPages.length];
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
      next={{ href: `/experience/${next.slug}`, label: `${next.companyShort}, ${next.role[framing]}` }}
    />
  );
}
