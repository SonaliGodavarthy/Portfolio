# Design

A generative-AI researcher's portfolio that generates itself. The hero is a **colour brush**: her portrait (`public/portrait-hero.webp`, background removed) stays clear, and the visitor's pointer trails soft colours across it that come and go. The Papers section turns the same portrait into a rotating 3D point cloud split into imaging factors, and the page closes with points denoising into "Say Hello.".

## Colour

Dark theme: an aubergine night lit by lavender (her choice). Token names are kept from the earlier light theme, so `paper` is the ground and `ink` the text.

| Token | Value | Use |
|---|---|---|
| `paper` | `#0d0a18` | Page ground |
| `paper-2` | `#141024` | Alternate sections |
| `surface` / `surface-2` | `#1b1631` / `#241d40` | Cards, chips |
| `ink` / `ink-2` / `ink-3` | `#f1edff` / `#c6bde3` / `#9d93bf` | Text, secondary, tertiary |
| `lavender` | `#b9a7ff` | Accent fills (dark `#140f26` text on top), focus, selection |
| `lavender-deep` | `#9c87f7` | Hover |
| `lavender-soft` | `#2e2552` | Secondary text on lavender fills |
| `line` | `rgba(241,237,255,.12)` | Hairlines and card rings |

A soft lavender radial `.glow` sits behind each 3D piece.

## Type

System faces (SF Pro on Apple devices, Segoe UI Variable on Windows, Roboto on Android). Display semibold with size-specific tracking; body in `rem`; small text +0.01em; mono only for measurements (the `t = …` readout, dates).

## 3D pieces

- `lib/particles.ts`: the three.js point-cloud engine. Image or text sampling, noise-to-image denoise, cursor repulsion, Apple-style drag with spring momentum (`lib/spring.ts`), scroll re-noising, and an exploded view. Loaded with a dynamic import so three.js never blocks first paint; pauses off-screen.
- Hero: `lib/colorbrush.ts`. The pointer paints a drifting pastel hue into a colour mask (ping-pong render targets) that bleeds like ink and fades over a second or two; the mask is screen-blended over the photo and the ground. Faster strokes cycle the hue faster, leaving a small rainbow. An opening pass plus occasional idle passes (stopped by the pause switch) keep it alive. The photo is cropped in the shader at 85.5% of its height so her hands stay out of frame, and the edges are feathered. Reduced motion skips the ambient passes.
- Point-cloud portrait (Papers): `lib/particles.ts` with `lib/portrait.ts`. The face is sampled at full density as a halftone (point size follows brightness); dark hair and clothes glow lavender.
- Portrait assets were made once, offline: segmented with rembg's `u2net_human_seg` (`portrait-hero.webp` 1200x1600 for the hero; `portrait.webp` 600x800 plus `portrait-depth.png` for the points). To swap the photo, regenerate them and update the face position in `components/Hero.tsx` and `lib/portrait.ts`.
- Papers: `FactorStack`, the same portrait pulled apart into four layers labelled Lens, Sensor, View, Domain. Labelled as an illustration of what MULTI separates, not model output.
- Contact: "Say Hello." as particles.
- `TiltCard`: 3D tilt with pointer sheen and floating `[data-depth]` layers, adapted from "Optimized Tilt Card" by sh20raj on 21st.dev, rebuilt on springs. Used for paper cards, project tiles and the About photo.

## Motion and interaction

Apple's *Designing Fluid Interfaces* rules: critically damped springs by default, damping 0.8 only after a flick; everything interruptible; press feedback on pointer-down; a sliding pill marks the current section in the nav. `prefers-reduced-motion`: no colour intro, breathing or scroll scatter; dragging still works. Accessibility from the UI/UX Pro Max audit: skip link, 44px phone targets, pointer cursors, Escape closes the menu.

## Content rules

Every number traces to a line in one of the two CVs. Demonstrations are labelled as illustrations. No em or en dashes in visible copy.
