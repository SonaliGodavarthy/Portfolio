import type { CutoutSpec } from "./particles";

// The 3D portrait source: a background-removed cutout of Sonali (segmented once,
// offline, with rembg's u2net_human_seg) and a depth map derived from its
// silhouette. Face position is in 0..1 image coordinates.
export const PORTRAIT: CutoutSpec = {
  src: "/portrait.webp",
  depth: "/portrait-depth.png",
  aspect: 600 / 800,
  face: { x: 0.49, y: 0.39, rx: 0.17, ry: 0.16 },
};
