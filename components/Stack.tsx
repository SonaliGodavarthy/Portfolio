"use client";

import { useEffect, useRef } from "react";

/**
 * A list whose cards stack like a deck: each card sticks a strip lower than
 * the one before, so every header stays in view as the next slides over.
 * Used by Experience and Papers.
 *
 * Sticky cards can only rest until the list's content ends, and once the
 * section's deck card sticks nothing inside moves again. So the whole stack,
 * last card included, has to fit above that point or the last card gets
 * pushed up over the others. The strip height is fitted to the screen:
 * as tall as STEP, shrinking on short screens until the last card fits.
 */

// Largest strip per card (px) on wide screens and on phones.
const STEP = { wide: 52, narrow: 12 };
const MIN_STEP = 8;

/** Classes for the list: spacing, a spacer so the last card can land, and the stack's top. */
export const STACK_LIST =
  "space-y-6 after:block after:h-[30vh] after:content-[''] [--stack-step:0.75rem] [--stack-top:5rem] lg:[--stack-step:3.25rem] lg:[--stack-top:6rem]";

/** Where card i sticks. */
export const stackTop = (i: number) => ({ top: `calc(var(--stack-top) + ${i} * var(--stack-step))` });

export function useStack<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const list = ref.current;
    const section = list?.closest("section");
    if (!list || !section) return;

    const fit = () => {
      const cards = Array.from(list.children).filter((c): c is HTMLElement => c instanceof HTMLElement);
      if (cards.length < 2) return;
      const wide = window.matchMedia("(min-width: 1024px)").matches;
      const top = parseFloat(getComputedStyle(cards[0]).top) || 0;
      // The list's content ends this far above the section's bottom, which is where the deck card sticks.
      const below = section.getBoundingClientRect().bottom - list.getBoundingClientRect().bottom;
      const room = window.innerHeight - below - top - cards[cards.length - 1].offsetHeight;
      const step = Math.max(MIN_STEP, Math.min(wide ? STEP.wide : STEP.narrow, room / (cards.length - 1)));
      list.style.setProperty("--stack-step", `${step}px`);
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(list);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  return ref;
}
