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
- **Tailwind CSS v4**: `@import "tailwindcss"` in `globals.css`, NO `tailwind.config.js`; tokens via `@theme { }` block
- **Motion** (`motion/react`): import from `"motion/react"` not `"framer-motion"`
- **Phosphor Icons** (`@phosphor-icons/react` v2)
- **sonner** for toasts
- **three.js** for the particle portrait (`lib/particles.ts`), loaded via dynamic import

## Architecture

```
app/
  page.tsx                    Home: Hero, About, Experience, Publications, Projects, Skills, Education, Milestones, Contact
  experience/[slug]/page.tsx  Experience case studies (roles marked `minor` get none)
  projects/[slug]/page.tsx    Project case studies
  icon.svg, opengraph-image.tsx
  api/chat/route.ts           Chatbot endpoint: Gemini (GEMINI_API_KEY, optional GEMINI_MODEL) answering from knowledge_base.md

components/
  Hero.tsx                    Her photo, cropped above her hands (plain image, feathered with a CSS mask)
  Deck.tsx                    Home page as a deck: sticky sections, the next slides over the last
  ColorTrail.tsx              Site-wide thin colour trail behind the mouse, in the root layout (lib/colortrail.ts)
  FactorStack.tsx             Exploded view of the portrait in Papers (Lens / Sensor / View / Domain)
  TiltCard.tsx                3D tilt card (adapted from 21st.dev, see file header)
  Demos.tsx                   Live mini-demos on project tiles
  CaseStudy.tsx + Diagrams.tsx  Shared detail-page layout and flow diagrams

lib/
  data.ts      ALL content. Most fields are `Framed` ({ research, engineering }), one per CV
  framing.tsx  Fixed framing ("research"); the site presents one profile, AI Research Engineer, with no switch
  particles.ts three.js point clouds (image/text sampling, denoise, drag, explode)
  portrait.ts  Crop of the photo used for the portrait
  colortrail.ts Colour-trail shader: ping-pong mask, screen-blended fixed canvas
  spring.ts    Apple-style springs, momentum projection, rubber-banding
```

**To update content:** edit `lib/data.ts`, and mirror the change in `knowledge_base.md` (what the chatbot in `components/ChatWidget.tsx` knows). Keep both framings in sync with the two CVs, and only use numbers that appear in a CV.

## Design System

See `DESIGN.md` (dark aubergine + lavender, system fonts, three.js particle pieces, Apple-style springs via `lib/spring.ts`) and `PRODUCT.md` (audience and content rules). No em/en dashes in visible copy.

UI follows Vercel's Web Interface Guidelines (`.claude/skills/web-design-guidelines`, which fetches the current rules). In practice:
- Animate only `transform` and `opacity`, never `filter`, `clip-path` or `transition-all`.
- Title Case for buttons, links and headings; curly quotes and apostrophes (’); non-breaking space between a number and its unit.
- Decorative icons get `aria-hidden`, icon-only buttons get `aria-label`, and every gesture has a click or keyboard alternative.
- Ambient motion obeys the shared pause switch in `lib/pause.ts`.
- Respect the `env(safe-area-inset-*)` insets, since the viewport uses `viewport-fit=cover`.

Taste rules (`.claude/skills/design-taste-frontend`, `.claude/skills/redesign-skill`):
- Corner radius system: containers `rounded-3xl` (24px), inner tiles `rounded-xl`, chips `rounded-lg`, controls `rounded-full`.
- Shadows are tinted aubergine (`rgba(5,3,12,…)`), never black, and buttons get no glows.
- Pointer-driven values live in refs or motion values, never React state.
- In global CSS, use `text-wrap-style`, not the `text-wrap` shorthand. The shorthand overrides Tailwind's `whitespace-nowrap`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
