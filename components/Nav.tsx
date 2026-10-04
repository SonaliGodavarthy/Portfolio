"use client";

import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, List, X } from "@phosphor-icons/react";

const links = [
  { href: "#about",        label: "About"        },
  { href: "#experience",   label: "Experience"   },
  { href: "#publications", label: "Research"     },
  { href: "#projects",     label: "Projects"     },
  { href: "#skills",       label: "Skills"       },
  { href: "#contact",      label: "Contact"      },
];

/* Apple spring: critically damped, no overshoot, response 0.4s */
const SPRING = { type: "spring", bounce: 0, duration: 0.4 } as const;

export default function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const pathname = usePathname();
  const router   = useRouter();
  const isDetail = pathname !== "/";

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 32));

  return (
    <motion.header
      /* Apple §12: translucent material — content scrolls underneath */
      className="fixed top-0 inset-x-0 z-50"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1,  y: 0   }}
      transition={SPRING}
    >
      {/* Glass layer — only after scrolling */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          backgroundColor: scrolled ? "rgba(10,10,10,0.72)" : "rgba(10,10,10,0)",
          backdropFilter:  scrolled ? "blur(20px) saturate(160%)" : "blur(0px)",
          borderBottom:    scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(255,255,255,0)",
        }}
        transition={SPRING}
      />

      <nav className="relative max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Left — back arrow on detail pages, nothing on home */}
        {isDetail ? (
          <motion.button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-[#666] hover:text-[#f0f0f0]"
            whileTap={{ scale: 0.96 }}
            transition={SPRING}
          >
            <ArrowLeft size={15} />
            Back
          </motion.button>
        ) : (
          <div className="w-16" />           /* placeholder keeps flex centred */
        )}

        {/* Centre — anchor links (home only) */}
        {!isDetail && (
          <ul className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-[13px] text-[#666] hover:text-[#f0f0f0] transition-colors duration-150"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* Right */}
        <div className="flex items-center gap-3">
          {isDetail ? (
            <Link
              href="/"
              className="text-[13px] text-[#555] hover:text-[#10b981] transition-colors duration-150"
            >
              Home
            </Link>
          ) : (
            <>
              <a
                href="#contact"
                className="hidden md:inline-flex items-center text-[13px] font-medium
                           bg-[#10b981] text-[#0a0a0a] px-4 py-1.5 rounded-full
                           hover:bg-[#34d399] active:scale-[0.97]
                           transition-colors duration-150"
              >
                Get in touch
              </a>
              {/* Mobile burger */}
              <button
                className="md:hidden text-[#666] hover:text-[#f0f0f0] transition-colors"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={19} /> : <List size={19} />}
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile sheet */}
      {menuOpen && !isDetail && (
        <motion.div
          className="md:hidden border-t border-white/6 bg-[#0a0a0a]/90 backdrop-blur-xl"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={SPRING}
        >
          <ul className="flex flex-col px-6 py-5 gap-5">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm text-[#777] hover:text-[#f0f0f0] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#contact" className="text-sm font-medium text-[#10b981]" onClick={() => setMenuOpen(false)}>
                Get in touch
              </a>
            </li>
          </ul>
        </motion.div>
      )}
    </motion.header>
  );
}
