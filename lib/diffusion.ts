// The diffusion brush: her portrait buried in noise, the way an image generator
// sees it at a high timestep. The pointer is the denoiser. Each pixel shows
//   x = sqrt(1 - s^2) * image + s * noise
// where s (the noise level) comes from a reveal mask the pointer paints into.
// The mask spreads like ink and slowly decays, so the noise creeps back.
// Loaded with a dynamic import so three.js never blocks first paint.

import * as THREE from "three";

export interface DiffusionOptions {
  src: string;
  /** face centre in image uv (0..1, y down) */
  face: { x: number; y: number };
  reducedMotion?: boolean;
  /** called with the timestep 0..1000 whenever it changes */
  onStep?: (t: number) => void;
  /** called once when the visitor has denoised most of her */
  onSampled?: () => void;
}

const QUAD_VERT = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

// Reveal mask update: spread, decay toward a face-shaped floor, add the brush.
const MASK_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uPrev;
uniform vec2 uTexel;
uniform float uDt;
uniform float uTime;
uniform vec2 uA;        // brush segment start (canvas uv)
uniform vec2 uB;        // brush segment end
uniform float uRadius;  // in canvas-height units
uniform float uStrength;
uniform float uAspect;
uniform vec4 uRect;     // image rect in canvas uv: x, y, w, h (y up)
uniform vec2 uFace;     // face centre in image uv (y down)
uniform float uFloor;
varying vec2 vUv;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  // drift the mask a little so edges bleed like ink, not a hard stamp
  vec2 drift = vec2(hash(floor(vUv * 64.0) + uTime) - 0.5, hash(floor(vUv * 64.0) - uTime) - 0.5) * uTexel * 1.5;
  vec2 uv = vUv + drift;
  float m = texture2D(uPrev, uv).r * 0.5
          + (texture2D(uPrev, uv + vec2(uTexel.x, 0.0)).r
          +  texture2D(uPrev, uv - vec2(uTexel.x, 0.0)).r
          +  texture2D(uPrev, uv + vec2(0.0, uTexel.y)).r
          +  texture2D(uPrev, uv - vec2(0.0, uTexel.y)).r) * 0.125;

  // the face keeps a little clarity even when nobody touches it
  vec2 iuv = vec2((vUv.x - uRect.x) / uRect.z, 1.0 - (vUv.y - uRect.y) / uRect.w);
  vec2 fd = (iuv - uFace) * vec2(1.0, 0.85);
  float floorV = uFloor * exp(-dot(fd, fd) / 0.035);

  // relax toward the floor: noise creeps back over a few seconds
  m = m > floorV ? floorV + (m - floorV) * exp(-uDt * 0.32) : m + (floorV - m) * (1.0 - exp(-uDt * 0.9));

  // brush: distance to the pointer's path this frame
  vec2 p = vec2(vUv.x * uAspect, vUv.y);
  vec2 a = vec2(uA.x * uAspect, uA.y);
  vec2 b = vec2(uB.x * uAspect, uB.y);
  vec2 ab = b - a;
  float h = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0);
  float d = length(p - a - ab * h);
  m += uStrength * exp(-(d * d) / (uRadius * uRadius));

  gl_FragColor = vec4(clamp(m, 0.0, 1.0), 0.0, 0.0, 1.0);
}
`;

// Display: forward diffusion of the composited portrait.
const VIEW_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uImage;
uniform sampler2D uMask;
uniform vec4 uRect;
uniform float uTime;
uniform float uGlobal;   // 1 = fully denoised (the "sampled" moment)
uniform float uAspect;
uniform vec3 uBg;
uniform vec3 uLavender;
varying vec2 vUv;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
// approximately Gaussian: sum of uniforms
float gauss(vec2 p) {
  return (hash(p) + hash(p + 17.31) + hash(p + 41.7) + hash(p + 73.1)) * 0.5 - 1.0;
}

void main() {
  vec2 iuv = vec2((vUv.x - uRect.x) / uRect.z, 1.0 - (vUv.y - uRect.y) / uRect.w);
  bool inside = iuv.x >= 0.0 && iuv.x <= 1.0 && iuv.y >= 0.0 && iuv.y <= 1.0;
  vec4 img = inside ? texture2D(uImage, iuv) : vec4(0.0);
  // feather where the photo's frame cuts through her arms and hands
  img.a *= smoothstep(0.0, 0.1, iuv.x) * smoothstep(1.0, 0.9, iuv.x) * smoothstep(1.0, 0.78, iuv.y);

  // soft lavender light behind her, so the cutout sits in the scene
  vec2 c = (vUv - vec2(uRect.x + uRect.z * 0.5, uRect.y + uRect.w * 0.62)) * vec2(uAspect, 1.0);
  vec3 bg = uBg + uLavender * 0.16 * exp(-dot(c, c) / (uRect.w * uRect.w * 0.22));
  vec3 x0 = mix(bg, img.rgb, img.a);

  // where noise lives: a soft cloud around her, never a hard rectangle
  vec2 q = (iuv - vec2(0.5, 0.55)) * vec2(1.25, 1.0);
  float field = (1.0 - smoothstep(0.32, 0.62, length(q))) * (inside ? 1.0 : 0.0);
  field = max(field, img.a);

  float reveal = max(texture2D(uMask, vUv).r, uGlobal);
  float s = (1.0 - smoothstep(0.0, 0.92, reveal)) * field;   // noise level sigma

  // per-pixel noise, re-drawn at a filmic 24 steps per second
  vec2 cell = floor(gl_FragCoord.xy / 1.5);
  float tick = floor(uTime * 24.0);
  vec3 eps = vec3(gauss(cell + tick), gauss(cell + tick + 3.7), gauss(cell + tick + 9.1));
  vec3 noise = 0.5 + eps * 0.32;
  noise = mix(noise, vec3(dot(noise, vec3(0.33))) * uLavender * 1.25, 0.4);

  vec3 col = sqrt(max(1.0 - s * s, 0.0)) * x0 + s * noise;

  // rim of lavender where the noise is just clearing
  float edge = smoothstep(0.15, 0.5, reveal) * (1.0 - smoothstep(0.5, 0.85, reveal)) * field;
  col += uLavender * edge * 0.12;

  // fine grain over everything (dither, keeps gradients from banding)
  col += (hash(gl_FragCoord.xy + fract(uTime) * 91.0) - 0.5) * 0.03;
  gl_FragColor = vec4(col, 1.0);
}
`;

const GRID_W = 24;
const GRID_H = 32;

export class DiffusionBrush {
  private renderer: THREE.WebGLRenderer;
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private quad: THREE.Mesh;
  private maskScene = new THREE.Scene();
  private viewScene = new THREE.Scene();
  private maskMat: THREE.ShaderMaterial;
  private viewMat: THREE.ShaderMaterial;
  private targets: [THREE.WebGLRenderTarget, THREE.WebGLRenderTarget];
  private flip = 0;
  private texture: THREE.Texture;
  private raf = 0;
  private last = performance.now();
  private time = 0;
  private visible = true;
  private disposed = false;
  private ro: ResizeObserver;
  private io: IntersectionObserver;

  private rect = new THREE.Vector4(0.5, 0, 0.4, 1);
  private aspect = 1;
  private pointer: { x: number; y: number } | null = null;
  private prevPointer: { x: number; y: number } | null = null;
  private speed = 0;
  private lastInput = 0;
  private autoUntil = 0;
  private global = 0;
  private globalTarget = 0;
  private sampledAt = -1;
  private paused = false;
  // wall-clock ms until which the loop keeps running while paused (input, sweeps)
  private busyUntil = 0;

  // CPU mirror of the mask over the image rect, for the timestep readout
  private grid = new Float32Array(GRID_W * GRID_H);
  private weight = new Float32Array(GRID_W * GRID_H);
  private lastStep = -1;

  private constructor(
    private canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    private opts: DiffusionOptions,
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
    this.texture = new THREE.Texture(image);
    this.texture.colorSpace = THREE.NoColorSpace;
    this.texture.flipY = false; // the shaders use top-down image coordinates
    this.texture.minFilter = THREE.LinearMipmapLinearFilter;
    this.texture.generateMipmaps = true;
    this.texture.needsUpdate = true;

    const float = this.renderer.capabilities.isWebGL2 ? THREE.HalfFloatType : THREE.UnsignedByteType;
    const mk = () =>
      new THREE.WebGLRenderTarget(4, 4, { type: float, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false });
    this.targets = [mk(), mk()];

    this.maskMat = new THREE.ShaderMaterial({
      vertexShader: QUAD_VERT,
      fragmentShader: MASK_FRAG,
      uniforms: {
        uPrev: { value: null },
        uTexel: { value: new THREE.Vector2() },
        uDt: { value: 0 },
        uTime: { value: 0 },
        uA: { value: new THREE.Vector2() },
        uB: { value: new THREE.Vector2() },
        uRadius: { value: 0.09 },
        uStrength: { value: 0 },
        uAspect: { value: 1 },
        uRect: { value: this.rect },
        uFace: { value: new THREE.Vector2(opts.face.x, opts.face.y) },
        uFloor: { value: 0.62 },
      },
    });
    this.viewMat = new THREE.ShaderMaterial({
      vertexShader: QUAD_VERT,
      fragmentShader: VIEW_FRAG,
      uniforms: {
        uImage: { value: this.texture },
        uMask: { value: null },
        uRect: { value: this.rect },
        uTime: { value: 0 },
        uGlobal: { value: opts.reducedMotion ? 1 : 0 },
        uAspect: { value: 1 },
        // plain sRGB values: this shader writes straight to the screen
        uBg: { value: new THREE.Vector3(13 / 255, 10 / 255, 24 / 255) },
        uLavender: { value: new THREE.Vector3(185 / 255, 167 / 255, 1) },
      },
    });
    const geo = new THREE.PlaneGeometry(2, 2);
    this.quad = new THREE.Mesh(geo, this.maskMat);
    this.maskScene.add(this.quad);
    this.viewScene.add(new THREE.Mesh(geo, this.viewMat));

    this.buildWeights(image);

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    this.io = new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      this.kick();
    });
    this.io.observe(canvas);
    document.addEventListener("visibilitychange", this.onVisibility);
    canvas.addEventListener("pointermove", this.onMove);
    canvas.addEventListener("pointerdown", this.onMove);
    canvas.addEventListener("pointerleave", this.onLeave);

    this.resize();
    // A short sweep over her face so first-time visitors see her right away.
    if (!opts.reducedMotion) this.autoUntil = 2.6;
    this.kick();
  }

  static async create(canvas: HTMLCanvasElement, opts: DiffusionOptions) {
    const img = new Image();
    img.decoding = "async";
    img.src = opts.src;
    await img.decode();
    return new DiffusionBrush(canvas, img, opts);
  }

  /** Where her silhouette is, so the timestep tracks how much of her is clear. */
  private buildWeights(image: HTMLImageElement) {
    const c = document.createElement("canvas");
    c.width = GRID_W;
    c.height = GRID_H;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(image, 0, 0, GRID_W, GRID_H);
    const d = ctx.getImageData(0, 0, GRID_W, GRID_H).data;
    const ss = (a: number, b: number, x: number) => {
      const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };
    for (let i = 0; i < GRID_W * GRID_H; i++) {
      const u = ((i % GRID_W) + 0.5) / GRID_W;
      const v = (Math.floor(i / GRID_W) + 0.5) / GRID_H;
      const fade = ss(0, 0.1, u) * ss(1, 0.9, u) * ss(1, 0.78, v); // same feather as the shader
      this.weight[i] = (d[i * 4 + 3] / 255) * fade;
    }
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
    this.aspect = w / h;
    this.maskMat.uniforms.uAspect.value = this.aspect;
    this.viewMat.uniforms.uAspect.value = this.aspect;

    // Portrait box: right side on wide screens, top centre on phones.
    const imgAspect = 1200 / 1600;
    if (w >= 900) {
      const bh = h * 0.94;
      const bw = bh * imgAspect;
      const right = Math.max(24, w * 0.05);
      this.rect.set((w - right - bw) / w, 0, bw / w, bh / h);
    } else {
      const bh = h * 0.62;
      const bw = Math.min(w * 0.98, bh * imgAspect);
      const top = 40;
      this.rect.set((w - bw) / 2 / w, (h - top - bh) / h, bw / w, bh / h);
    }

    const mw = Math.max(64, Math.round((w * pr) / 3));
    const mh = Math.max(64, Math.round((h * pr) / 3));
    this.targets.forEach((t) => t.setSize(mw, mh));
    this.maskMat.uniforms.uTexel.value.set(1 / mw, 1 / mh);
    this.maskMat.uniforms.uRadius.value = w < 900 ? 0.075 : 0.085;
    this.kick();
  }

  private toUv(e: PointerEvent) {
    const r = this.canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width, y: 1 - (e.clientY - r.top) / r.height };
  }

  private onMove = (e: PointerEvent) => {
    const p = this.toUv(e);
    if (this.pointer) this.speed = Math.min(1, this.speed + Math.hypot(p.x - this.pointer.x, p.y - this.pointer.y) * 6);
    else this.speed = 0.6;
    this.pointer = p;
    this.lastInput = this.time;
    this.autoUntil = 0;
    this.busyUntil = performance.now() + 1500;
    this.kick();
  };

  private onLeave = () => {
    this.pointer = null;
    this.prevPointer = null;
  };

  /** Freeze the ambient noise. Brushing and sweeps still work while paused. */
  setPaused(p: boolean) {
    this.paused = p;
    this.kick();
  }

  /** The click and keyboard alternative to brushing: one pass over her face. */
  sweep() {
    if (this.opts.reducedMotion) return;
    this.autoUntil = this.time + 2.6;
    this.busyUntil = performance.now() + 2600 + 1500;
    this.kick();
  }

  kick() {
    if (!this.raf && this.visible && !this.disposed && document.visibilityState === "visible") {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    }
  }

  /** Brush position for the opening sweep and the occasional idle pass. */
  private autoBrush() {
    const r = this.rect;
    const f = this.opts.face;
    const k = this.time * 2.1;
    return {
      x: r.x + r.z * (f.x + Math.sin(k) * 0.2),
      y: r.y + r.w * (1 - (f.y + Math.sin(k * 1.7) * 0.16 + 0.05)),
    };
  }

  private splatGrid(a: { x: number; y: number }, b: { x: number; y: number }, strength: number, radius: number) {
    const r = this.rect;
    for (let j = 0; j < GRID_H; j++) {
      for (let i = 0; i < GRID_W; i++) {
        const u = r.x + ((i + 0.5) / GRID_W) * r.z;
        const v = r.y + (1 - (j + 0.5) / GRID_H) * r.w;
        const px = u * this.aspect;
        const ax = a.x * this.aspect;
        const bx = b.x * this.aspect;
        const abx = bx - ax;
        const aby = b.y - a.y;
        const h = Math.min(1, Math.max(0, ((px - ax) * abx + (v - a.y) * aby) / Math.max(abx * abx + aby * aby, 1e-6)));
        const dx = px - ax - abx * h;
        const dy = v - a.y - aby * h;
        const k = j * GRID_W + i;
        this.grid[k] = Math.min(1, this.grid[k] + strength * Math.exp(-(dx * dx + dy * dy) / (radius * radius)));
      }
    }
  }

  private frame = (now: number) => {
    this.raf = 0;
    if (this.disposed) return;
    const dt = Math.min((now - this.last) / 1000, 1 / 30);
    this.last = now;
    const reduce = !!this.opts.reducedMotion;
    const busy = !this.paused || now < this.busyUntil || Math.abs(this.globalTarget - this.global) > 0.01;
    if (!reduce && busy) this.time += dt;

    // Brush input: the visitor, or the automatic sweep.
    let target = this.pointer;
    if (!reduce && this.time < this.autoUntil) target = this.autoBrush();
    // After a long idle spell, a slow pass now and then keeps her surfacing.
    if (!reduce && !this.paused && !this.pointer && this.time - this.lastInput > 9 && this.time % 11 < 2.2) target = this.autoBrush();

    const radius = this.maskMat.uniforms.uRadius.value as number;
    let strength = 0;
    const a = this.prevPointer ?? target;
    if (target && a) {
      strength = (target === this.pointer ? 0.18 + this.speed * 0.5 : 0.22) * Math.min(1, dt * 60);
      this.maskMat.uniforms.uA.value.set(a.x, a.y);
      this.maskMat.uniforms.uB.value.set(target.x, target.y);
      this.splatGrid(a, target, strength, radius);
    }
    this.prevPointer = target ? { ...target } : null;
    this.speed *= Math.exp(-dt * 4);

    // Mask pass (ping-pong).
    const read = this.targets[this.flip];
    const write = this.targets[1 - this.flip];
    this.maskMat.uniforms.uPrev.value = read.texture;
    this.maskMat.uniforms.uDt.value = dt;
    this.maskMat.uniforms.uTime.value = this.time;
    this.maskMat.uniforms.uStrength.value = strength;
    this.renderer.setRenderTarget(write);
    this.renderer.render(this.maskScene, this.camera);
    this.renderer.setRenderTarget(null);
    this.flip = 1 - this.flip;

    // CPU mirror: same decay, then the timestep.
    let sum = 0;
    let wsum = 0;
    for (let k = 0; k < this.grid.length; k++) {
      const i = k % GRID_W;
      const j = Math.floor(k / GRID_W);
      const fx = (i + 0.5) / GRID_W - this.opts.face.x;
      const fy = ((j + 0.5) / GRID_H - this.opts.face.y) * 0.85;
      const floorV = 0.62 * Math.exp(-(fx * fx + fy * fy) / 0.035);
      const m = this.grid[k];
      this.grid[k] = m > floorV ? floorV + (m - floorV) * Math.exp(-dt * 0.32) : m + (floorV - m) * (1 - Math.exp(-dt * 0.9));
      sum += Math.min(1, this.grid[k] / 0.92) * this.weight[k];
      wsum += this.weight[k];
    }
    const clarity = wsum ? sum / wsum : 0;

    // The "sampled" moment: once most of her is clear, finish the job, then let it rest.
    if (!reduce && this.sampledAt < 0 && clarity > 0.8 && this.time > this.autoUntil) {
      this.sampledAt = this.time;
      this.globalTarget = 1;
      this.opts.onSampled?.();
    }
    if (this.sampledAt >= 0 && this.time - this.sampledAt > 4) {
      this.globalTarget = 0;
      if (this.time - this.sampledAt > 14) this.sampledAt = -1; // can happen again later
    }
    this.global += (this.globalTarget - this.global) * (1 - Math.exp(-dt * 3));
    const shown = reduce ? 1 : Math.max(clarity, this.global);
    const step = Math.round((1 - shown) * 1000);
    if (step !== this.lastStep) {
      this.lastStep = step;
      this.opts.onStep?.(step);
    }

    // Display pass.
    this.viewMat.uniforms.uMask.value = write.texture;
    this.viewMat.uniforms.uTime.value = this.time;
    this.viewMat.uniforms.uGlobal.value = reduce ? 1 : this.global;
    this.renderer.render(this.viewScene, this.camera);

    if (this.visible && !reduce && busy) this.raf = requestAnimationFrame(this.frame);
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.io.disconnect();
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.canvas.removeEventListener("pointermove", this.onMove);
    this.canvas.removeEventListener("pointerdown", this.onMove);
    this.canvas.removeEventListener("pointerleave", this.onLeave);
    this.targets.forEach((t) => t.dispose());
    this.texture.dispose();
    this.maskMat.dispose();
    this.viewMat.dispose();
    this.renderer.dispose();
  }
}
