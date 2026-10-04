# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- Hiring managers and technical recruiters for AI Researcher / AI Engineer roles (industry research labs, applied-ML teams, mostly in Europe). They usually arrive from a CV link or LinkedIn, skim for about a minute, and decide whether to read deeper.
- Academic readers: PhD supervisors, research collaborators, and conference contacts (ICPR 2026, ECCV 2026 MUCG workshop) who want the papers, the thesis topic, and evidence of research depth.
- Peers and friends who are shown the site (secondary).
*(Inferred from the two CVs and the existing site; confirm with Sonali.)*

## Product Purpose
Personal portfolio of Sonali Godavarthy. It should make a reader believe within one screen that she is a published generative-AI / computer-vision researcher who can also ship production systems, and then let them go deeper into case studies of each role and project.

## Positioning
Her distinctive mechanism is **disentanglement**: her ICPR 2026 oral paper (MULTI) and ECCV 2026 workshop paper (X-MULTI) teach image generators to separate camera lens, sensor, viewpoint, and domain into independent controllable factors. She does both research (Bosch Research + ETH Zurich thesis, Uni Siegen HAR work) and engineering (Fraunhofer RAG/OCR, S&P SRE), and the two CVs reflect these two framings ("AI Researcher" and "AI Engineer").

## Operating Context
Read on laptops during hiring screens and on phones via LinkedIn. Links out to Google Scholar, GitHub, LinkedIn, and email. Static Next.js site, to be deployed to Vercel.

## Capabilities and Constraints
- Stack fixed: Next.js 16 App Router, Tailwind v4, Motion, Phosphor icons. Content lives in `lib/data.ts`.
- Detail pages exist for each experience and project (`/experience/[slug]`, `/projects/[slug]`).
- No paper PDFs, project page, or result images are in the repo. Paper links point to Google Scholar.

## Brand Commitments
- Name: Sonali Godavarthy. Titles: AI Researcher and AI Engineer.
- Photos: `public/sonali-desk.webp` (About: at a desk with laptop and iPad) and `public/sonali.jpeg` (lakeside, used by the jigsaw demo in Projects).
- Contact: godavarthysonali@gmail.com, LinkedIn `sonali-godavarthy-982a31184`, GitHub `SonaliGodavarthy`, Scholar `Qn4h9lwAAAAJ`.

## Evidence on Hand
- Two CVs (research and engineering framing) in the repo root, dated 2026-10-04.
- Publications: MULTI (ICPR 2026, oral, pp. 279-293; co-authors M. Neuwirth-Trapp, T. F. Faasch, M. Bieshaar, M. Moeller and others), X-MULTI (ECCV 2026 MUCG workshop).
- Awards: Deutschlandstipendium (2024), Best Final Year Project 2021-22 (1st of ~120 teams).
- Metrics only as stated in the CVs. Do not invent numbers, testimonials, or result images presented as real paper figures.

## Product Principles
1. Research first, engineering close behind: the papers lead, the production record proves range.
2. Every number on the page traces to a CV line.
3. Show the idea, not just list it: her work is visual (image generation), so the site should demonstrate disentanglement rather than only describe it.
4. A recruiter must get name, role, papers, and contact in the first viewport.

## Accessibility & Inclusion
WCAG AA contrast, full keyboard navigation, `prefers-reduced-motion` respected.
