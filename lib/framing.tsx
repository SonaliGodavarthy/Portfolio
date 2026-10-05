"use client";

import { createContext, useContext, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import type { Framed, Framing } from "./data";

// The site presents one profile (AI Research Engineer), so the framing is
// fixed. Content in data.ts keeps both CV framings; this picks which one shows.
const FRAMING: Framing = "research";

const FramingContext = createContext<{ framing: Framing }>({ framing: FRAMING });

export function FramingProvider({ children }: { children: ReactNode }) {
  return (
    <FramingContext.Provider value={{ framing: FRAMING }}>
      {/* Reduced motion: Motion drops transforms and keeps gentle fades. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </FramingContext.Provider>
  );
}

export function useFraming() {
  return useContext(FramingContext);
}

/** Text for the site's framing. */
export function FramedText({
  value,
  as: Tag = "span",
  className,
}: {
  value: Framed;
  as?: "span" | "p" | "div";
  className?: string;
}) {
  const { framing } = useFraming();
  return <Tag className={className}>{value[framing]}</Tag>;
}
