// The colour trail: a thin line of soft colour that follows the pointer
// anywhere on the site and fades away. Each frame the pointer paints the
// current hue into a colour mask (ping-pong render targets) that bleeds a
// little and fades over a second or so. The canvas is a fixed, click-through
// layer screen-blended over the page, so black means "no change".
// Loaded with a dynamic import so three.js never blocks first paint.

import * as THREE from "three";

const QUAD_VERT = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

// Colour mask update: spread a touch, fade, add the stroke in the current hue.
const MASK_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uPrev;
uniform vec2 uTexel;
uniform float uDt;
uniform float uTime;
uniform vec2 uA;        // stroke segment start (canvas uv)
uniform vec2 uB;        // stroke segment end
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
  // a little drift so the line softens like ink as it fades
  vec2 drift = vec2(hash(floor(vUv * 96.0) + uTime) - 0.5, hash(floor(vUv * 96.0) - uTime) - 0.5) * uTexel * 0.75;
  vec2 uv = vUv + drift;
  vec3 m = texture2D(uPrev, uv).rgb * 0.8
         + (texture2D(uPrev, uv + vec2(uTexel.x, 0.0)).rgb
         +  texture2D(uPrev, uv - vec2(uTexel.x, 0.0)).rgb
         +  texture2D(uPrev, uv + vec2(0.0, uTexel.y)).rgb
         +  texture2D(uPrev, uv - vec2(0.0, uTexel.y)).rgb) * 0.05;

  m *= exp(-uDt * 1.8);

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

const VIEW_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uMask;
uniform float uGain;
varying vec2 vUv;
void main() { gl_FragColor = vec4(texture2D(uMask, vUv).rgb * uGain, 1.0); }
`;

/** A pastel hue that drifts around the colour wheel. */
function hue(t: number, out: THREE.Vector3) {
  const k = Math.PI * 2;
  return out.set(
    0.62 + 0.38 * Math.cos(k * t),
    0.62 + 0.38 * Math.cos(k * (t + 0.33)),
    0.62 + 0.38 * Math.cos(k * (t + 0.67)),
  );
}

export class ColorTrail {
  private renderer: THREE.WebGLRenderer;
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private maskScene = new THREE.Scene();
  private viewScene = new THREE.Scene();
  private maskMat: THREE.ShaderMaterial;
  private viewMat: THREE.ShaderMaterial;
  private targets: [THREE.WebGLRenderTarget, THREE.WebGLRenderTarget];
  private flip = 0;
  private raf = 0;
  private last = performance.now();
  private time = 0;
  private disposed = false;
  private enabled = true;

  private aspect = 1;
  private pointer: { x: number; y: number } | null = null;
  private prevPointer: { x: number; y: number } | null = null;
  private speed = 0;
  private hueT = Math.random();
  // wall-clock ms until which the loop runs, long enough for the trail to fade
  private busyUntil = 0;

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "low-power" });
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
        uRadius: { value: 0.012 },
        uStrength: { value: 0 },
        uAspect: { value: 1 },
        uColor: { value: new THREE.Vector3() },
      },
    });
    this.viewMat = new THREE.ShaderMaterial({
      vertexShader: QUAD_VERT,
      fragmentShader: VIEW_FRAG,
      uniforms: { uMask: { value: null }, uGain: { value: 0.6 } },
    });
    const geo = new THREE.PlaneGeometry(2, 2);
    this.maskScene.add(new THREE.Mesh(geo, this.maskMat));
    this.viewScene.add(new THREE.Mesh(geo, this.viewMat));

    window.addEventListener("resize", this.resize);
    window.addEventListener("pointermove", this.onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", this.onLeave);
    document.addEventListener("visibilitychange", this.onLeave);
    this.resize();
    this.setVisible(false);
  }

  private resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    // The trail is soft, so a 1x canvas is plenty even on retina screens.
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(w, h, false);
    this.aspect = w / h;
    this.maskMat.uniforms.uAspect.value = this.aspect;
    const mw = Math.max(64, Math.round(w / 2));
    const mh = Math.max(64, Math.round(h / 2));
    this.targets.forEach((t) => t.setSize(mw, mh));
    this.maskMat.uniforms.uTexel.value.set(1 / mw, 1 / mh);
    this.prevPointer = null;
  };

  private setVisible(v: boolean) {
    // An idle, all-black layer still costs a blend on every scroll; hide it.
    this.canvas.style.visibility = v ? "visible" : "hidden";
  }

  private onMove = (e: PointerEvent) => {
    if (!this.enabled || e.pointerType !== "mouse") return;
    const p = { x: e.clientX / window.innerWidth, y: 1 - e.clientY / window.innerHeight };
    if (this.pointer) this.speed = Math.min(1, this.speed + Math.hypot(p.x - this.pointer.x, p.y - this.pointer.y) * 6);
    this.pointer = p;
    this.busyUntil = performance.now() + 2500;
    this.kick();
  };

  private onLeave = () => {
    this.pointer = null;
    this.prevPointer = null;
  };

  /** Turn the trail off (the shared pause switch). */
  setEnabled(on: boolean) {
    this.enabled = on;
    if (!on) this.onLeave();
  }

  private kick() {
    if (!this.raf && !this.disposed && document.visibilityState === "visible") {
      this.last = performance.now();
      this.setVisible(true);
      this.raf = requestAnimationFrame(this.frame);
    }
  }

  private frame = (now: number) => {
    this.raf = 0;
    if (this.disposed) return;
    const dt = Math.min((now - this.last) / 1000, 1 / 30);
    this.last = now;
    this.time += dt;

    // The hue drifts slowly, and faster with pointer speed, so a quick stroke
    // leaves a little rainbow behind it.
    this.hueT += dt * (0.1 + this.speed * 0.8);
    hue(this.hueT, this.maskMat.uniforms.uColor.value);

    const target = this.pointer;
    const a = this.prevPointer ?? target;
    let strength = 0;
    if (target && a) {
      strength = (0.08 + this.speed * 0.25) * Math.min(1, dt * 60);
      this.maskMat.uniforms.uA.value.set(a.x, a.y);
      this.maskMat.uniforms.uB.value.set(target.x, target.y);
    }
    this.prevPointer = target ? { ...target } : null;
    this.speed *= Math.exp(-dt * 4);

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

    this.viewMat.uniforms.uMask.value = write.texture;
    this.renderer.render(this.viewScene, this.camera);

    if (now < this.busyUntil && document.visibilityState === "visible") this.raf = requestAnimationFrame(this.frame);
    else this.setVisible(false);
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("pointermove", this.onMove);
    document.documentElement.removeEventListener("pointerleave", this.onLeave);
    document.removeEventListener("visibilitychange", this.onLeave);
    this.targets.forEach((t) => t.dispose());
    this.maskMat.dispose();
    this.viewMat.dispose();
    this.renderer.dispose();
  }
}
