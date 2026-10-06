"use client";

import type { ReactNode } from "react";
import { EnvelopeSimple, GithubLogo, LinkedinLogo, Student } from "@phosphor-icons/react";
import { profile } from "@/lib/data";

const LINKS: { label: string; href: string; icon: ReactNode }[] = [
  { label: "LinkedIn", href: profile.links.linkedin, icon: <LinkedinLogo size={20} weight="regular" aria-hidden /> },
  { label: "GitHub", href: profile.links.github, icon: <GithubLogo size={20} weight="regular" aria-hidden /> },
  { label: "Google Scholar", href: profile.links.scholar, icon: <Student size={20} weight="regular" aria-hidden /> },
  { label: "Email", href: `mailto:${profile.email}`, icon: <EnvelopeSimple size={20} weight="regular" aria-hidden /> },
];

/**
 * Get in Touch, always one click away: a column of icons fixed to the bottom
 * left, ending in a hairline that runs off the screen. Each label slides out
 * on hover or focus. Wide screens only; phones have the Contact section.
 */
export default function SocialRail() {
  return (
    <nav
      aria-label="Get in Touch"
      className="fixed bottom-0 left-[calc(0.75rem+env(safe-area-inset-left))] z-40 hidden flex-col items-center gap-1 lg:flex"
    >
      {LINKS.map((l) => (
        <a
          key={l.label}
          href={l.href}
          aria-label={l.label}
          {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="group relative grid size-10 place-items-center rounded-full text-ink-3 transition-[color,background-color,transform] duration-150 ease-out
                     hover:bg-ink/10 hover:text-lavender active:scale-[0.92] active:duration-75 focus-visible:text-lavender"
        >
          {l.icon}
          <span
            aria-hidden
            className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-lg border border-line bg-surface px-2.5 py-1 text-[0.8125rem] text-ink
                       opacity-0 -translate-x-1 transition-[opacity,transform] duration-150 ease-out
                       group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
          >
            {l.label}
          </span>
        </a>
      ))}
      <span aria-hidden className="mt-3 h-24 w-px bg-line" />
    </nav>
  );
}
