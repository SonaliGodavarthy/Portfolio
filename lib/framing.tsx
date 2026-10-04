"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import type { Framed, Framing } from "./data";

interface FramingState {
  framing: Framing;
  setFraming: (f: Framing) => void;
}

const FramingContext = createContext<FramingState>({
  framing: "research",
  setFraming: () => {},
});

const STORAGE_KEY = "sg-framing";

// A tiny external store: a shared link (?view=engineering) wins over the
// visitor's last choice, which wins over the research default.
const listeners = new Set<() => void>();
let chosen: Framing | null = null;

function readFraming(): Framing {
  if (chosen) return chosen;
  const param = new URLSearchParams(window.location.search).get("view");
  if (param === "engineering" || param === "research") return (chosen = param);
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "engineering" || saved === "research") return (chosen = saved);
  } catch {}
  return (chosen = "research");
}

function writeFraming(f: Framing) {
  chosen = f;
  try {
    localStorage.setItem(STORAGE_KEY, f);
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function FramingProvider({ children }: { children: ReactNode }) {
  const framing = useSyncExternalStore<Framing>(subscribe, readFraming, () => "research");
  return (
    <FramingContext.Provider value={{ framing, setFraming: writeFraming }}>
      {/* Reduced motion: Motion drops transforms and keeps gentle fades. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </FramingContext.Provider>
  );
}

export function useFraming() {
  return useContext(FramingContext);
}

/** Pick the value for the current framing. */
export function useFramed<T>(value: Framed<T>): T {
  return value[useFraming().framing];
}

/**
 * Text that swaps with the framing. The outgoing copy fades out and the new
 * copy settles in, so the change reads as a refocus rather than a jump.
 */
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
  const MotionTag = motion[Tag];
  return (
    <AnimatePresence mode="wait" initial={false}>
      <MotionTag
        key={framing}
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
      >
        {value[framing]}
      </MotionTag>
    </AnimatePresence>
  );
}
