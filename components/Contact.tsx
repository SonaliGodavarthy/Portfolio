"use client";

import { motion } from "motion/react";
import {
  EnvelopeSimple,
  LinkedinLogo,
  GithubLogo,
  BookOpen,
} from "@phosphor-icons/react";

const EASE = [0.23, 1, 0.32, 1] as const;

const links = [
  {
    label: "Email",
    value: "godavarthysonali@gmail.com",
    href: "mailto:godavarthysonali@gmail.com",
    Icon: EnvelopeSimple,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/sonali-godavarthy-982a31184",
    href: "https://www.linkedin.com/in/sonali-godavarthy-982a31184/",
    Icon: LinkedinLogo,
  },
  {
    label: "GitHub",
    value: "github.com/SonaliGodavarthy",
    href: "https://github.com/SonaliGodavarthy",
    Icon: GithubLogo,
  },
  {
    label: "Google Scholar",
    value: "S. Godavarthy — ICPR 2026, ECCV 2026",
    href: "https://scholar.google.com/citations?user=Qn4h9lwAAAAJ&hl=en&oi=ao",
    Icon: BookOpen,
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24 border-t border-white/6">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, transform: "translateY(20px)" }}
            whileInView={{ opacity: 1, transform: "translateY(0px)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="space-y-4 mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#f0f0f0]">
              Let&apos;s connect.
            </h2>
            <p className="text-[#888] leading-relaxed max-w-[52ch]">
              Open to research collaborations, AI engineering roles, and
              interesting conversations. Based in Siegen, Germany — open to
              relocate across Europe and beyond.
            </p>
          </motion.div>

          {/* Primary CTA */}
          <motion.div
            initial={{ opacity: 0, transform: "translateY(16px)" }}
            whileInView={{ opacity: 1, transform: "translateY(0px)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="mb-10"
          >
            <a
              href="mailto:godavarthysonali@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#10b981] text-[#0d0d0d] font-semibold hover:bg-[#34d399] transition-all duration-200"
              style={{ transition: "transform 160ms cubic-bezier(0.23,1,0.32,1), background-color 200ms ease" }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.97)")
              }
              onMouseUp={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <EnvelopeSimple size={18} weight="bold" />
              Get in touch
            </a>
          </motion.div>

          {/* Link list */}
          <div className="space-y-3">
            {links.map(({ label, value, href, Icon }, i) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, transform: "translateX(-12px)" }}
                whileInView={{ opacity: 1, transform: "translateX(0px)" }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/7 bg-[#161616] hover:border-[#10b981]/25 hover:bg-[#10b981]/4 transition-all duration-200 group"
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/4 text-[#555] group-hover:text-[#10b981] transition-colors duration-200">
                  <Icon size={17} weight="regular" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-[#555] font-mono uppercase tracking-wider">
                    {label}
                  </p>
                  <p className="text-sm text-[#888] truncate group-hover:text-[#bbb] transition-colors duration-200">
                    {value}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto px-6 mt-20 pt-8 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-mono text-[11px] text-[#444] uppercase tracking-widest">
          Sonali Godavarthy &copy; 2026
        </p>
        <p className="font-mono text-[11px] text-[#333]">
          Siegen, Germany
        </p>
      </div>
    </section>
  );
}
