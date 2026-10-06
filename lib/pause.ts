"use client";

import { useSyncExternalStore } from "react";

// One switch for every ambient animation on the page (the colour trail, the
// point clouds, the demo loops). Remembered per visitor.
const KEY = "sg-paused";
const listeners = new Set<() => void>();
let paused: boolean | null = null;

function read() {
  if (paused === null) {
    try {
      paused = localStorage.getItem(KEY) === "1";
    } catch {
      paused = false;
    }
  }
  return paused;
}

export function setPaused(p: boolean) {
  paused = p;
  try {
    localStorage.setItem(KEY, p ? "1" : "0");
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function usePaused() {
  return useSyncExternalStore(subscribe, read, () => false);
}
