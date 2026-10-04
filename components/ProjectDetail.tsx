"use client";

import { projects, type ProjectItem } from "@/lib/data";
import CaseStudy, { BulletList } from "./CaseStudy";

export default function ProjectDetail({ project }: { project: ProjectItem }) {
  const next = projects[(projects.findIndex((p) => p.slug === project.slug) + 1) % projects.length];
  return (
    <CaseStudy
      backHref="/#projects"
      backLabel="All Projects"
      kicker="Project"
      title={project.title}
      impact={project.impact}
      context={project.fullDesc}
      diagramType={project.diagramType}
      bullets={<BulletList items={project.fullBullets} />}
      tools={project.tools}
      next={{ href: `/projects/${next.slug}`, label: next.title }}
    />
  );
}
