"use client";

import { useSyncExternalStore, type ReactNode } from "react";

const noop = () => () => {};
const isClassic = () => new URLSearchParams(window.location.search).get("scroll") === "classic";

/**
 * Temporary: shows the earlier nine-card deck at /?scroll=classic so the two
 * scroll treatments can be compared. Delete once one is chosen.
 */
export default function ScrollCompare({ current, classic }: { current: ReactNode; classic: ReactNode }) {
  const useClassic = useSyncExternalStore(noop, isClassic, () => false);
  return <>{useClassic ? classic : current}</>;
}
