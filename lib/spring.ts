// Apple-style motion primitives (WWDC 2018, "Designing Fluid Interfaces").
// Springs are described by damping ratio and response instead of
// mass/stiffness/damping, are always interruptible (they continue from the
// current value and velocity), and accept the gesture's release velocity.

export interface Spring {
  x: number;
  v: number;
  target: number;
  /** 1 = critically damped (no overshoot); ~0.8 after a flick */
  damping: number;
  /** seconds; lower is snappier. Not a duration. */
  response: number;
}

export function spring(x: number, damping = 1, response = 0.35): Spring {
  return { x, v: 0, target: x, damping, response };
}

/** Advance a spring by dt seconds. Returns true while it is still moving. */
export function stepSpring(s: Spring, dt: number): boolean {
  const k = Math.pow((2 * Math.PI) / s.response, 2);
  const c = (4 * Math.PI * s.damping) / s.response;
  const n = Math.max(1, Math.ceil(dt / (1 / 240)));
  const h = dt / n;
  for (let i = 0; i < n; i++) {
    const a = -k * (s.x - s.target) - c * s.v;
    s.v += a * h;
    s.x += s.v * h;
  }
  const moving = Math.abs(s.x - s.target) > 1e-4 || Math.abs(s.v) > 1e-3;
  if (!moving) {
    s.x = s.target;
    s.v = 0;
  }
  return moving;
}

/** Where a flick will come to rest, like scroll deceleration (px/s in, px out). */
export function project(velocity: number, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/** Progressive resistance past a boundary instead of a hard stop. */
export function rubberband(overshoot: number, dimension: number, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

/** Clamp with rubber-banding outside [min, max], in the value's own units. */
export function rubberClamp(value: number, min: number, max: number, dimension: number) {
  if (value < min) return min - rubberband(min - value, dimension);
  if (value > max) return max + rubberband(value - max, dimension);
  return value;
}

/** Velocity from a short history of pointer samples (units per second). */
export class VelocityTracker {
  private samples: { t: number; x: number; y: number }[] = [];

  reset() {
    this.samples = [];
  }

  add(x: number, y: number, t = performance.now()) {
    this.samples.push({ t, x, y });
    const cutoff = t - 100;
    while (this.samples.length > 2 && this.samples[0].t < cutoff) this.samples.shift();
  }

  velocity() {
    const s = this.samples;
    if (s.length < 2) return { x: 0, y: 0 };
    const a = s[0];
    const b = s[s.length - 1];
    const dt = Math.max(1, b.t - a.t) / 1000;
    return { x: (b.x - a.x) / dt, y: (b.y - a.y) / dt };
  }
}
