"use client";

import type { ProjectItem } from "@/lib/data";
import CaseStudy, { BulletList } from "./CaseStudy";

export default function ProjectDetail({ project }: { project: ProjectItem }) {
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
    />
  );
}
