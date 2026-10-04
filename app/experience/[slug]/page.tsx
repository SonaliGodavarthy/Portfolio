import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { experiences } from "@/lib/data";
import ExperienceDetail from "@/components/ExperienceDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return experiences.filter((e) => !e.minor).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exp = experiences.find((e) => e.slug === slug);
  if (!exp) return {};
  return {
    title: `${exp.company}, ${exp.role.research} | Sonali Godavarthy`,
    description: exp.summary.research,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const exp = experiences.find((e) => e.slug === slug);
  if (!exp || exp.minor) notFound();
  return <ExperienceDetail exp={exp} />;
}
