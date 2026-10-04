// A point cloud that a diffusion model would be proud of: an image sampled into
// glowing 3D points that start as Gaussian noise and denoise into the picture.
// Loaded on demand (dynamic import) so three.js never blocks first paint.

import * as THREE from "three";
import { VelocityTracker, rubberClamp, spring, stepSpring } from "./spring";

export interface CloudData {
  /** target positions (x, y, z) */
  target: Float32Array;
  /** noise positions the cloud starts from */
  noise: Float32Array;
  color: Float32Array;
  size: Float32Array;
  /** per-point delay 0..1 so the denoise ripples rather than snaps */
  delay: Float32Array;
  /** factor layer 0..3 for the exploded view */
  group: Float32Array;
  count: number;
}

// ─── Sampling ────────────────────────────────────────────────────────────────

function gaussian(rnd: () => number) {
  const u = Math.max(rnd(), 1e-6);
  const v = rnd();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const LAVENDER = [0.73, 0.65, 1.0];

/** Region of the source image to sample, in 0..1 units. */
export interface Crop {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Sample an image into a cloud. The subject (darker, centred) comes forward;
 * the bright background thins out and dissolves toward the edges so the
 * cloud ends organically instead of at the photo's frame.
 */
export async function sampleImage(src: string, grid = 170, crop: Crop = { x: 0, y: 0, w: 1, h: 1 }): Promise<CloudData> {
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  await img.decode();
  const gw = Math.round(grid * (crop.w / crop.h));
  const gh = grid;
  const c = document.createElement("canvas");
  c.width = gw;
  c.height = gh;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(
    img,
    crop.x * img.naturalWidth,
    crop.y * img.naturalHeight,
    crop.w * img.naturalWidth,
    crop.h * img.naturalHeight,
    0,
    0,
    gw,
    gh,
  );
  const px = ctx.getImageData(0, 0, gw, gh).data;
  const rnd = seeded(11);
  const aspect = gw / gh;

  const t: number[] = [];
  const n: number[] = [];
  const col: number[] = [];
  const sz: number[] = [];
  const dl: number[] = [];
  const gr: number[] = [];

  for (let j = 0; j < gh; j++) {
    for (let i = 0; i < gw; i++) {
      const k = (j * gw + i) * 4;
      const r = px[k] / 255;
      const g = px[k + 1] / 255;
      const b = px[k + 2] / 255;
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const u = (i / (gw - 1) - 0.5) * aspect; // keep proportions
      const v = 0.5 - j / (gh - 1);

      // The figure is darker and centred; sky, water and grass are bright.
      const core = Math.abs(u) < 0.13 && v > -0.42; // face and torso column
      const grass = g > r + 0.05 && g > b + 0.02;
      const background = lum > 0.68 || (!core && (lum > 0.56 || grass));
      // Radial falloff from the figure so the frame never shows.
      const dist = Math.hypot(u / 0.62, v / 0.62);
      const keep = background ? 0.32 * Math.max(0, 1 - dist * dist) : Math.max(0, 1.15 - dist * 0.45);
      if (rnd() > keep) continue;

      const centre = Math.exp(-(u * u) / 0.03);
      const z = background ? -0.3 + rnd() * 0.08 : 0.06 + centre * 0.34 + (0.5 - lum) * 0.2;
      t.push(u * 2, v * 2, z);
      n.push(gaussian(rnd) * 0.9, gaussian(rnd) * 0.9, gaussian(rnd) * 0.9);

      const mix = background ? 0.55 : 0.1;
      const boost = background ? 0.32 : 1.15;
      col.push(
        Math.min(1, (r * (1 - mix) + LAVENDER[0] * mix) * boost),
        Math.min(1, (g * (1 - mix) + LAVENDER[1] * mix) * boost),
        Math.min(1, (b * (1 - mix) + LAVENDER[2] * mix) * boost),
      );
      sz.push(background ? 0.55 + rnd() * 0.35 : 0.85 + rnd() * 0.5);
      dl.push(Math.min(1, Math.hypot(u, v) * 0.9 + rnd() * 0.25));
      gr.push(lum);
    }
  }
  // Four equal layers by brightness rank, so every factor layer is as full as the others.
  const order = gr.map((l, i) => [l, i]).sort((a, b) => a[0] - b[0]);
  order.forEach(([, i], rank) => (gr[i] = Math.min(3, Math.floor((rank / order.length) * 4))));
  return pack(t, n, col, sz, dl, gr);
}

async function pixels(src: string, w: number, h: number) {
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  await img.decode();
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h).data;
}

export interface CutoutSpec {
  /** RGBA cutout of the subject (background removed) */
  src: string;
  /** grayscale depth map, white = near */
  depth: string;
  /** width / height of the source */
  aspect: number;
  /** face ellipse in 0..1 image coordinates, sampled at full density */
  face: { x: number; y: number; rx: number; ry: number };
}

/**
 * Sample a background-removed portrait. Alpha decides which points exist, the
 * depth map gives real relief, the face gets full density, and dark hair and
 * clothing glow lavender instead of vanishing on the dark page.
 */
export async function sampleCutout(spec: CutoutSpec, rows = 300): Promise<CloudData> {
  const gh = rows;
  const gw = Math.round(rows * spec.aspect);
  const [px, dp] = await Promise.all([pixels(spec.src, gw, gh), pixels(spec.depth, gw, gh)]);
  const rnd = seeded(7);
  const t: number[] = [];
  const n: number[] = [];
  const col: number[] = [];
  const sz: number[] = [];
  const dl: number[] = [];
  const gr: number[] = [];
  const { face } = spec;

  for (let j = 0; j < gh; j++) {
    for (let i = 0; i < gw; i++) {
      const k = (j * gw + i) * 4;
      const alpha = px[k + 3] / 255;
      if (alpha < 0.5) continue;
      const fx = i / (gw - 1);
      const fy = j / (gh - 1);
      const fd = Math.hypot((fx - face.x) / face.rx, (fy - face.y) / face.ry);
      const inFace = fd < 1;
      // full density on the face, lighter elsewhere, fading out below the chest
      const bottomFade = 1 - Math.min(1, Math.max(0, (fy - 0.72) / 0.16));
      if (!inFace && rnd() > 0.5 * bottomFade) continue;

      const r = px[k] / 255;
      const g = px[k + 1] / 255;
      const b = px[k + 2] / 255;
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const depth = dp[k] / 255;

      const u = (fx - 0.5) * 2 * spec.aspect;
      const v = (0.5 - fy) * 2;
      const faceLift = Math.exp(-fd * fd * 1.6) * 0.22;
      const z = depth * 0.5 + faceLift + (lum - 0.4) * 0.05 + (rnd() - 0.5) * 0.015;
      t.push(u, v, z);
      n.push(gaussian(rnd) * 0.9, gaussian(rnd) * 0.9, gaussian(rnd) * 0.9);

      // Halftone: on the face, tone drives point size and brightness, so eyes,
      // brows and lips read as gaps. Elsewhere, dark hair and clothes are lifted
      // toward a dim lavender so they still show on the dark page.
      const tone = Math.min(1, Math.max(0, (lum - 0.22) / 0.5));
      const dark = inFace ? 0 : Math.max(0, (0.32 - lum) / 0.32);
      const gain = inFace ? 0.45 + tone * 0.85 : 1.0;
      col.push(
        Math.min(1, (r * (1 - dark) + 0.42 * dark) * gain),
        Math.min(1, (g * (1 - dark) + 0.36 * dark) * gain),
        Math.min(1, (b * (1 - dark) + 0.68 * dark) * gain),
      );
      sz.push(inFace ? 0.18 + tone * 1.05 : 0.75 + rnd() * 0.4);
      dl.push(Math.min(1, Math.hypot(fx - face.x, fy - face.y) * 1.3 + rnd() * 0.2));
      gr.push(lum);
    }
  }
  const order = gr.map((l, i) => [l, i]).sort((a, b) => a[0] - b[0]);
  order.forEach(([, i], rank) => (gr[i] = Math.min(3, Math.floor((rank / order.length) * 4))));
  return pack(t, n, col, sz, dl, gr);
}

/** Sample text into a cloud (used for the closing "Say Hello."). */
export function sampleText(text: string, font: string, width = 900, height = 260): CloudData {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#fff";
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);
  const px = ctx.getImageData(0, 0, width, height).data;
  const rnd = seeded(5);
  const t: number[] = [];
  const n: number[] = [];
  const col: number[] = [];
  const sz: number[] = [];
  const dl: number[] = [];
  const gr: number[] = [];
  const step = 3;
  const scale = 4 / width;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (px[(y * width + x) * 4 + 3] < 128) continue;
      t.push((x - width / 2) * scale, -(y - height / 2) * scale, (rnd() - 0.5) * 0.06);
      n.push(gaussian(rnd) * 1.4, gaussian(rnd) * 0.8, gaussian(rnd) * 0.8);
      const w = rnd();
      col.push(0.62 + 0.3 * w, 0.55 + 0.25 * w, 1);
      sz.push(0.7 + rnd() * 0.6);
      dl.push(rnd() * 0.6 + ((x / width) * 0.4));
      gr.push(0);
    }
  }
  return pack(t, n, col, sz, dl, gr);
}

function pack(t: number[], n: number[], col: number[], sz: number[], dl: number[], gr: number[]): CloudData {
  return {
    target: new Float32Array(t),
    noise: new Float32Array(n),
    color: new Float32Array(col),
    size: new Float32Array(sz),
    delay: new Float32Array(dl),
    group: new Float32Array(gr),
    count: sz.length,
  };
}

// ─── Shaders ─────────────────────────────────────────────────────────────────

const VERT = /* glsl */ `
attribute vec3 aNoise;
attribute vec3 aColor;
attribute float aSize;
attribute float aDelay;
attribute float aGroup;

uniform float uProgress;   // 0 = pure noise, 1 = image
uniform float uScatter;    // scroll-driven re-noising
uniform float uExplode;    // factor layers pulled apart
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
uniform vec3 uPointer;     // xy in cloud space, z = strength

varying vec3 vColor;
varying float vAlpha;

void main() {
  float p = smoothstep(0.0, 1.0, clamp((uProgress * 1.6 - aDelay * 0.6), 0.0, 1.0));
  vec3 pos = mix(aNoise, position, p);

  // breathing, so the cloud never looks frozen
  float ph = aDelay * 40.0;
  pos += vec3(sin(uTime * 0.7 + ph), cos(uTime * 0.6 + ph * 1.3), sin(uTime * 0.5 + ph * 0.7)) * 0.006;

  // scroll pulls it back toward noise, drifting up and outward
  vec3 away = aNoise * 1.6 + vec3(0.0, 0.6, 0.0);
  pos = mix(pos, away, uScatter * uScatter);

  // exploded view: one layer per imaging factor
  pos.z += (aGroup - 1.5) * 0.55 * uExplode;
  pos.x += (aGroup - 1.5) * 0.12 * uExplode;

  // the pointer pushes points aside
  vec2 d = pos.xy - uPointer.xy;
  float f = exp(-dot(d, d) / 0.045) * uPointer.z;
  pos.xy += normalize(d + 1e-5) * f * 0.22;
  pos.z += f * 0.18;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * aSize * uPixelRatio * (1.0 + f * 0.8) / -mv.z;

  vColor = aColor;
  vAlpha = mix(0.55, 1.0, p) * (1.0 - uScatter * 0.6);
}
`;

const FRAG = /* glsl */ `
uniform float uAdditive;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.1, d) * vAlpha;
  gl_FragColor = vec4(vColor * mix(1.0, a, uAdditive), a);
}
`;

// ─── Scene ───────────────────────────────────────────────────────────────────

export interface CloudOptions {
  /** where the cloud sits horizontally, in world units (positive = right) */
  offsetX?: () => number;
  offsetY?: () => number;
  pointSize?: number;
  /** additive glow (text) or normal blending (portraits keep their contrast) */
  additive?: boolean;
  /** let the visitor drag to rotate */
  draggable?: boolean;
  /** resting angle (radians) */
  restYaw?: number;
  restPitch?: number;
  introSeconds?: number;
  reducedMotion?: boolean;
  /** called every frame with the denoising progress 0..1 */
  onProgress?: (p: number) => void;
  /** called every frame with layer centres in CSS pixels (exploded view) */
  onLayers?: (pts: { x: number; y: number }[]) => void;
}

export class PointCloud {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  private points: THREE.Points;
  private material: THREE.ShaderMaterial;
  private group = new THREE.Group();
  private raf = 0;
  private last = performance.now();
  private visible = true;
  private disposed = false;
  private start = performance.now();
  private ro: ResizeObserver;
  private io: IntersectionObserver;

  readonly yaw: ReturnType<typeof spring>;
  readonly pitch: ReturnType<typeof spring>;
  /** targets the page can drive */
  scatter = 0;
  explode = spring(0, 1, 0.8);
  private pointer = new THREE.Vector3(0, 0, 0);
  private pointerTarget = 0;
  private drag: { id: number; x: number; y: number; yaw: number; pitch: number } | null = null;
  private tracker = new VelocityTracker();
  private hover = { x: 0, y: 0 };
  private paused = false;

  constructor(
    private canvas: HTMLCanvasElement,
    data: CloudData,
    private opts: CloudOptions = {},
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
    this.renderer.setClearColor(0x000000, 0);
    this.camera.position.set(0, 0, 4.6);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(data.target, 3));
    geo.setAttribute("aNoise", new THREE.BufferAttribute(data.noise, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(data.color, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(data.size, 1));
    geo.setAttribute("aDelay", new THREE.BufferAttribute(data.delay, 1));
    geo.setAttribute("aGroup", new THREE.BufferAttribute(data.group, 1));

    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: opts.additive === false ? THREE.NormalBlending : THREE.AdditiveBlending,
      uniforms: {
        uProgress: { value: opts.reducedMotion ? 1 : 0 },
        uScatter: { value: 0 },
        uExplode: { value: 0 },
        uTime: { value: 0 },
        uSize: { value: opts.pointSize ?? 22 },
        uPixelRatio: { value: 1 },
        uPointer: { value: this.pointer },
        uAdditive: { value: opts.additive === false ? 0 : 1 },
      },
    });
    this.points = new THREE.Points(geo, this.material);
    this.points.frustumCulled = false;
    this.group.add(this.points);
    this.scene.add(this.group);

    this.yaw = spring(opts.restYaw ?? 0, 0.8, 0.9);
    this.pitch = spring(opts.restPitch ?? 0, 0.8, 0.9);

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    this.io = new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      this.kick();
    });
    this.io.observe(canvas);
    document.addEventListener("visibilitychange", this.onVisibility);

    canvas.addEventListener("pointermove", this.onMove);
    canvas.addEventListener("pointerleave", this.onLeave);
    if (opts.draggable) {
      canvas.addEventListener("pointerdown", this.onDown);
      canvas.addEventListener("pointerup", this.onUp);
      canvas.addEventListener("pointercancel", this.onUp);
    }
    this.resize();
    this.kick();
  }

  private onVisibility = () => {
    this.visible = document.visibilityState === "visible";
    this.kick();
  };

  private resize() {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    if (!w || !h) return;
    const pr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(pr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // keep the cloud in frame on tall, narrow screens
    this.camera.position.z = w / h < 0.8 ? 5.6 : 4.6;
    this.camera.updateProjectionMatrix();
    this.material.uniforms.uPixelRatio.value = pr * Math.min(1.2, Math.max(0.85, h / 900));
    this.kick();
  }

  /** Pointer position on the cloud's z=0 plane, in cloud space. */
  private toCloud(clientX: number, clientY: number) {
    const r = this.canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    const ray = new THREE.Raycaster();
    ray.setFromCamera(ndc, this.camera);
    const inv = new THREE.Matrix4().copy(this.group.matrixWorld).invert();
    const o = ray.ray.origin.clone().applyMatrix4(inv);
    const d = ray.ray.direction.clone().transformDirection(inv);
    if (Math.abs(d.z) < 1e-4) return null;
    const t = -o.z / d.z;
    return o.add(d.multiplyScalar(t));
  }

  private onMove = (e: PointerEvent) => {
    const r = this.canvas.getBoundingClientRect();
    this.hover.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    this.hover.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    if (this.drag && e.pointerId === this.drag.id) {
      this.tracker.add(e.clientX, e.clientY);
      // 1:1 rotation while held; rubber-band past a comfortable range
      this.yaw.x = this.yaw.target = rubberClamp(this.drag.yaw + (e.clientX - this.drag.x) * 0.006, -1.3, 1.3, 1);
      this.pitch.x = this.pitch.target = rubberClamp(this.drag.pitch + (e.clientY - this.drag.y) * 0.004, -0.5, 0.5, 0.6);
      this.yaw.v = this.pitch.v = 0;
    } else if (e.pointerType !== "touch") {
      const p = this.toCloud(e.clientX, e.clientY);
      if (p) {
        this.pointer.x = p.x;
        this.pointer.y = p.y;
        this.pointerTarget = 1;
      }
    }
    this.kick();
  };

  private onLeave = () => {
    this.pointerTarget = 0;
    this.hover.x = this.hover.y = 0;
    this.kick();
  };

  private onDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    this.canvas.setPointerCapture(e.pointerId);
    this.drag = { id: e.pointerId, x: e.clientX, y: e.clientY, yaw: this.yaw.x, pitch: this.pitch.x };
    this.tracker.reset();
    this.tracker.add(e.clientX, e.clientY);
    this.canvas.dataset.dragging = "true";
  };

  private onUp = (e: PointerEvent) => {
    if (!this.drag || e.pointerId !== this.drag.id) return;
    this.drag = null;
    delete this.canvas.dataset.dragging;
    // Hand the flick's velocity to a spring that swings back to rest.
    const v = this.tracker.velocity();
    Object.assign(this.yaw, { v: v.x * 0.006, target: this.opts.restYaw ?? 0, damping: 0.75, response: 1.1 });
    Object.assign(this.pitch, { v: v.y * 0.004, target: this.opts.restPitch ?? 0, damping: 0.8, response: 1 });
    this.kick();
  };

  /** Stop the ambient breathing; springs still settle and drags still work. */
  setPaused(p: boolean) {
    this.paused = p;
    this.kick();
  }

  /** Keyboard alternative to dragging: a push that springs back to rest. */
  nudge(yaw: number, pitch: number) {
    this.yaw.v += yaw;
    this.pitch.v += pitch;
    this.kick();
  }

  kick() {
    if (!this.raf && this.visible && !this.disposed && document.visibilityState === "visible") {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    }
  }

  private frame = (now: number) => {
    this.raf = 0;
    if (this.disposed) return;
    const dt = Math.min((now - this.last) / 1000, 1 / 30);
    this.last = now;
    const u = this.material.uniforms;
    const reduce = !!this.opts.reducedMotion;

    // intro: noise to image over a few seconds, eased like a sampler schedule
    const intro = this.opts.introSeconds ?? 3.2;
    const raw = reduce ? 1 : Math.min(1, (now - this.start) / 1000 / intro);
    const progress = 1 - Math.pow(1 - raw, 3);
    u.uProgress.value = progress;
    this.opts.onProgress?.(progress);

    if (!reduce && !this.paused) u.uTime.value += dt;
    u.uScatter.value += (this.scatter - u.uScatter.value) * (1 - Math.exp(-dt * 10));
    this.pointer.z += (this.pointerTarget - this.pointer.z) * (1 - Math.exp(-dt * 6));

    // idle parallax toward the pointer when nobody is dragging
    if (!this.drag) {
      this.yaw.target = (this.opts.restYaw ?? 0) + this.hover.x * 0.22;
      this.pitch.target = (this.opts.restPitch ?? 0) + this.hover.y * 0.1;
    }
    let moving = false;
    if (!this.drag) {
      moving = stepSpring(this.yaw, dt) || moving;
      moving = stepSpring(this.pitch, dt) || moving;
    }
    moving = stepSpring(this.explode, dt) || moving;
    u.uExplode.value = this.explode.x;

    this.group.rotation.set(this.pitch.x, this.yaw.x, 0);
    this.group.position.x = this.opts.offsetX?.() ?? 0;
    this.group.position.y = this.opts.offsetY?.() ?? 0;
    this.group.updateMatrixWorld();
    this.renderer.render(this.scene, this.camera);

    if (this.opts.onLayers) {
      const w = this.canvas.clientWidth;
      const h = this.canvas.clientHeight;
      const pts = [0, 1, 2, 3].map((g) => {
        const v = new THREE.Vector3((g - 1.5) * 0.12 * this.explode.x - 0.8, 0.9, (g - 1.5) * 0.55 * this.explode.x);
        v.applyMatrix4(this.group.matrixWorld).project(this.camera);
        return { x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h };
      });
      this.opts.onLayers(pts);
    }

    const settling = raw < 1 || moving || Math.abs(this.scatter - u.uScatter.value) > 0.001 || this.pointer.z > 0.01;
    const alive = (!reduce && !this.paused) || settling || !!this.drag;
    if (this.visible && alive) this.raf = requestAnimationFrame(this.frame);
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.io.disconnect();
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.canvas.removeEventListener("pointermove", this.onMove);
    this.canvas.removeEventListener("pointerleave", this.onLeave);
    this.canvas.removeEventListener("pointerdown", this.onDown);
    this.canvas.removeEventListener("pointerup", this.onUp);
    this.canvas.removeEventListener("pointercancel", this.onUp);
    this.points.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
  }
}
