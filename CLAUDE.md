# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository

**GitHub:** https://github.com/SonaliGodavarthy/Portfolio  
**Deploy target:** Vercel (free tier) — not yet connected

Push after every major change:
```bash
cd /Users/sonalig/Desktop/Portfolio
git add -A
git commit -m "describe the change"
git push origin main
```

## Environment

All Node.js commands must run inside the `sonali_portfolio` conda environment:
```bash
conda activate sonali_portfolio
# then run npm commands from /Users/sonalig/Desktop/Portfolio/
```

## Commands

From `/Users/sonalig/Desktop/Portfolio/`:

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server at http://localhost:3000 |
| `npm run build` | Production build (validates TypeScript + Tailwind) |
| `npm run lint` | ESLint |

## Stack

- **Next.js 16** (App Router, static export via `generateStaticParams`)
- **Tailwind CSS v4** — `@import "tailwindcss"` in `globals.css`, NO `tailwind.config.js`; tokens via `@theme { }` block
- **Motion** (`motion/react`) — import from `"motion/react"` not `"framer-motion"`
- **Phosphor Icons** (`@phosphor-icons/react` v2) — some icon names differ from v1 (e.g. `FlaskIcon` not `FlaskConical`)

## Architecture

Single-page portfolio (`/`) + dynamic detail pages:

```
app/
  page.tsx                    → Home (all sections)
  experience/[slug]/page.tsx  → Experience detail pages
  projects/[slug]/page.tsx    → Project detail pages

components/
  Nav.tsx          Hero.tsx         About.tsx
  Experience.tsx   Publications.tsx Projects.tsx
  Skills.tsx       Education.tsx    Awards.tsx
  Contact.tsx      CursorGlow.tsx   PageWrapper.tsx
  Diagrams.tsx     ExperienceDetail.tsx  ProjectDetail.tsx

lib/
  data.ts          ← ALL portfolio content lives here (experiences + projects)
```

**To update content:** edit `lib/data.ts` — all experience bullets, tools, impact metrics, and project data live there.

## Design System

| Token | Value |
|-------|-------|
| Background | `#0a0a0a` |
| Surface (cards) | `#111` |
| Border | `rgba(255,255,255,0.07)` |
| Accent (emerald) | `#10b981` |
| Text primary | `#f0f0f0` / `#e8e8e8` |
| Text secondary | `#777` / `#666` |
| Font | Geist Sans + Geist Mono via `next/font/google` |

**Animation standard (Apple Design):** critically damped springs — no overshoot, no bounce for UI.
```js
const SPRING = { type: "spring", bounce: 0, duration: 0.4 }
```
Reserve `bounce: 0.2` only for gesture/momentum interactions.

**Typography (Apple §15):** large headings use `letterSpacing: "-0.03em"`, body copy stays near `0`.

## Assets

- Profile photo: `public/sonali.jpeg`
- Source resumes (not committed): `../Sonali_Godavarthy_FlowCV_Resume_2026-10-04*.pdf`

## Detail Pages

Each experience/project card links to a rich detail page:
- **Impact metrics** (4 quantified numbers)
- **Architecture diagram** (SVG/CSS flow diagram in `Diagrams.tsx`)
- **Full bullet points**
- **Tech stack chips**
- Back navigation

Diagram types in `Diagrams.tsx`: `har`, `multi`, `lora`, `rag`, `sre`, `voice`, `cv`, `unet`, `askdoc`, `transfer`
