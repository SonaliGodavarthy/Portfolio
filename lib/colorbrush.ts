// The colour brush: her portrait, always clear, and the pointer trails soft
// colour across it. Each frame the pointer paints the current hue into a
// colour mask (ping-pong render targets); the mask bleeds like ink and fades
// over a second or two, so colours come and go behind the cursor. The mask is
// screen-blended over the photo and the dark ground around her.
// Loaded with a dynamic import so three.js never blocks first paint.

import * as THREE from "three";

export interface ColorBrushOptions {
  src: string;
  /** face centre in image uv (0..1, y down) */
  face: { x: number; y: number };
  /** image uv y where the photo is cut off, so her hands stay out of frame */
  cropBottom: number;
  reducedMotion?: boolean;
}

const QUAD_VERT = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

// Colour mask update: spread, fade, add the brush stroke in the current hue.
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
uniform vec3 uColor;
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
  vec3 m = texture2D(uPrev, uv).rgb * 0.5
         + (texture2D(uPrev, uv + vec2(uTexel.x, 0.0)).rgb
         +  texture2D(uPrev, uv - vec2(uTexel.x, 0.0)).rgb
         +  texture2D(uPrev, uv + vec2(0.0, uTexel.y)).rgb
         +  texture2D(uPrev, uv - vec2(0.0, uTexel.y)).rgb) * 0.125;

  // colours fade out over a second or two
  m *= exp(-uDt * 1.4);

  // brush: distance to the pointer's path this frame
  vec2 p = vec2(vUv.x * uAspect, vUv.y);
  vec2 a = vec2(uA.x * uAspect, uA.y);
  vec2 b = vec2(uB.x * uAspect, uB.y);
  vec2 ab = b - a;
  float h = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0);
  float d = length(p - a - ab * h);
  m += uColor * uStrength * exp(-(d * d) / (uRadius * uRadius));

  gl_FragColor = vec4(clamp(m, 0.0, 1.0), 1.0);
}
`;

// Display: the portrait on its ground, with the colour mask screened over it.
const VIEW_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uImage;
uniform sampler2D uMask;
uniform vec4 uRect;
uniform float uCrop;
uniform float uTime;
uniform float uAspect;
uniform vec3 uBg;
uniform vec3 uLavender;
varying vec2 vUv;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec2 iuv = vec2((vUv.x - uRect.x) / uRect.z, (1.0 - (vUv.y - uRect.y) / uRect.w) * uCrop);
  bool inside = iuv.x >= 0.0 && iuv.x <= 1.0 && iuv.y >= 0.0 && iuv.y <= uCrop;
  vec4 img = inside ? texture2D(uImage, iuv) : vec4(0.0);
  // feather the sides and the cropped bottom edge so she sits in the scene
  img.a *= smoothstep(0.0, 0.1, iuv.x) * smoothstep(1.0, 0.9, iuv.x) * smoothstep(uCrop, uCrop - 0.12, iuv.y);

  // soft lavender light behind her
  vec2 c = (vUv - vec2(uRect.x + uRect.z * 0.5, uRect.y + uRect.w * 0.62)) * vec2(uAspect, 1.0);
  vec3 bg = uBg + uLavender * 0.16 * exp(-dot(c, c) / (uRect.w * uRect.w * 0.22));
  vec3 col = mix(bg, img.rgb, img.a);

  // the colour trail: screen blend, stronger on her than on the ground
  vec3 trail = texture2D(uMask, vUv).rgb * mix(0.5, 0.85, img.a);
  col = 1.0 - (1.0 - col) * (1.0 - trail);

  // fine grain over everything (dither, keeps gradients from banding)
  col += (hash(gl_FragCoord.xy + fract(uTime) * 91.0) - 0.5) * 0.02;
  gl_FragColor = vec4(col, 1.0);
}
`;

/** A pastel hue that drifts around the colour wheel over time. */
function hue(t: number, out: THREE.Vector3) {
  const k = Math.PI * 2;
  return out.set(
    0.62 + 0.38 * Math.cos(k * t),
    0.62 + 0.38 * Math.cos(k * (t + 0.33)),
    0.62 + 0.38 * Math.cos(k * (t + 0.67)),
  );
}

export class ColorBrush {
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
  private hueT = 0;
  private lastInput = 0;
  private autoUntil = 0;
  private paused = false;
  // wall-clock ms until which the loop keeps running while paused (input, fading trail)
  private busyUntil = 0;

  private constructor(
    private canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    private opts: ColorBrushOptions,
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
        uColor: { value: new THREE.Vector3() },
      },
    });
    this.viewMat = new THREE.ShaderMaterial({
      vertexShader: QUAD_VERT,
      fragmentShader: VIEW_FRAG,
      uniforms: {
        uImage: { value: this.texture },
        uMask: { value: null },
        uRect: { value: this.rect },
        uCrop: { value: opts.cropBottom },
        uTime: { value: 0 },
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
    // A short pass of colour around her face so first-time visitors see it's alive.
    if (!opts.reducedMotion) this.autoUntil = 2.2;
    this.busyUntil = performance.now() + 4000;
    this.kick();
  }

  static async create(canvas: HTMLCanvasElement, opts: ColorBrushOptions) {
    const img = new Image();
    img.decoding = "async";
    img.src = opts.src;
    await img.decode();
    return new ColorBrush(canvas, img, opts);
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

    // Portrait box (the cropped photo): right side on wide screens, top centre on phones.
    const imgAspect = 1200 / (1600 * this.opts.cropBottom);
    if (w >= 900) {
      const bh = h * 0.82;
      const bw = bh * imgAspect;
      const right = Math.max(24, w * 0.05);
      this.rect.set((w - right - bw) / w, 0, bw / w, bh / h);
    } else {
      const bh = h * 0.54;
      const bw = Math.min(w * 0.98, bh * imgAspect);
      const top = 40;
      this.rect.set((w - bw) / 2 / w, (h - top - bh) / h, bw / w, bh / h);
    }

    const mw = Math.max(64, Math.round((w * pr) / 3));
    const mh = Math.max(64, Math.round((h * pr) / 3));
    this.targets.forEach((t) => t.setSize(mw, mh));
    this.maskMat.uniforms.uTexel.value.set(1 / mw, 1 / mh);
    this.maskMat.uniforms.uRadius.value = w < 900 ? 0.075 : 0.085;
    this.busyUntil = Math.max(this.busyUntil, performance.now() + 100);
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
    this.busyUntil = performance.now() + 3000;
    this.kick();
  };

  private onLeave = () => {
    this.pointer = null;
    this.prevPointer = null;
  };

  /** Stop the ambient colour passes. Pointer trails still work while paused. */
  setPaused(p: boolean) {
    this.paused = p;
    this.kick();
  }

  kick() {
    if (!this.raf && this.visible && !this.disposed && document.visibilityState === "visible") {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    }
  }

  /** Brush position for the opening pass and the occasional idle pass. */
  private autoBrush() {
    const r = this.rect;
    const f = this.opts.face;
    const k = this.time * 2.1;
    return {
      x: r.x + r.z * (f.x + Math.sin(k) * 0.24),
      y: r.y + r.w * (1 - (f.y + Math.sin(k * 1.7) * 0.18 + 0.05) / this.opts.cropBottom),
    };
  }

  private frame = (now: number) => {
    this.raf = 0;
    if (this.disposed) return;
    const dt = Math.min((now - this.last) / 1000, 1 / 30);
    this.last = now;
    const reduce = !!this.opts.reducedMotion;
    const ambient = !reduce && !this.paused;
    const busy = ambient || now < this.busyUntil;
    this.time += dt;

    // Brush input: the visitor, or an automatic pass.
    let target = this.pointer;
    if (!reduce && this.time < this.autoUntil) target = this.autoBrush();
    // After a long idle spell, a slow pass now and then keeps the colours moving.
    if (ambient && !this.pointer && this.time - this.lastInput > 9 && this.time % 11 < 2.2) target = this.autoBrush();

    // The hue drifts with time and faster with pointer speed, so a quick
    // stroke leaves a little rainbow behind it.
    this.hueT += dt * (0.12 + this.speed * 0.9);
    hue(this.hueT, this.maskMat.uniforms.uColor.value);

    let strength = 0;
    const a = this.prevPointer ?? target;
    if (target && a) {
      strength = (target === this.pointer ? 0.1 + this.speed * 0.35 : 0.12) * Math.min(1, dt * 60);
      this.maskMat.uniforms.uA.value.set(a.x, a.y);
      this.maskMat.uniforms.uB.value.set(target.x, target.y);
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

    // Display pass.
    this.viewMat.uniforms.uMask.value = write.texture;
    this.viewMat.uniforms.uTime.value = this.time;
    this.renderer.render(this.viewScene, this.camera);

    if (this.visible && busy) this.raf = requestAnimationFrame(this.frame);
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
