import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Page Not Found | Sonali Godavarthy",
};

export default function NotFound() {
  return (
    <main className="relative grid min-h-[100dvh] place-items-center overflow-hidden px-5 pb-[env(safe-area-inset-bottom)]">
      <div aria-hidden className="glow absolute left-1/2 top-1/2 size-[90vmin] -translate-x-1/2 -translate-y-1/2" />
      <div className="relative max-w-[34rem] text-center">
        <p className="font-mono text-[0.8125rem] text-lavender tabular">404</p>
        <h1 className="mt-3 font-display text-[length:clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[1] tracking-[-0.02em] text-ink">
          Page Not Found
        </h1>
        <p className="mx-auto mt-5 max-w-[40ch] text-[1.0625rem] leading-[1.6] text-ink-2">
          This link may be out of date. Her papers, projects and contact details are all on the home page.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-lavender px-6 py-3 text-[0.9375rem] font-semibold text-[#140f26]
                     shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_12px_28px_-14px_rgba(5,3,12,0.9)]
                     transition-[background-color,transform] duration-150 ease-out hover:bg-white active:scale-[0.97] active:duration-75"
        >
          <ArrowLeft size={15} weight="bold" aria-hidden />
          Back to Home
        </Link>
      </div>
    </main>
  );
}
