import type { EasingType, Position } from "./types";

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const getTouchDistance = (touches: React.TouchList): number => {
  if (touches.length < 2) return 0;
  const a = touches[0]!;
  const b = touches[1]!;
  return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
};

export const getTouchCenter = (touches: React.TouchList): { x: number; y: number } => {
  if (touches.length < 2) return { x: 0, y: 0 };
  const a = touches[0]!;
  const b = touches[1]!;
  return { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 };
};

export const clampPosition = (
  next: Position,
  minZoom: number,
  maxZoom: number,
  containerSize: { width: number; height: number },
  contentSize: { width: number; height: number }
): Position => {
  const scale = clamp(next.scale, minZoom, maxZoom);
  const { width: Wc, height: Hc } = containerSize;
  const { width: W, height: H } = contentSize;
  const paddingX = Wc / 2;
  const paddingY = Hc / 2;
  const ws = W * scale;
  const hs = H * scale;
  const minX = Wc / 2 - ws / 2 - paddingX;
  const maxX = ws / 2 - Wc / 2 + paddingX;
  const minY = Hc / 2 - hs / 2 - paddingY;
  const maxY = hs / 2 - Hc / 2 + paddingY;
  const x = maxX >= minX ? clamp(next.x, minX, maxX) : 0;
  const y = maxY >= minY ? clamp(next.y, minY, maxY) : 0;
  return { x, y, scale };
};

/** Cubic bezier with P0=(0,0), P1=(x1,y1), P2=(x2,y2), P3=(1,1). Returns y for given x (t). */
function cubicBezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
  const sampleX = (s: number) =>
    3 * (1 - s) * (1 - s) * s * x1 + 3 * (1 - s) * s * s * x2 + s * s * s;
  const sampleY = (s: number) =>
    3 * (1 - s) * (1 - s) * s * y1 + 3 * (1 - s) * s * s * y2 + s * s * s;

  return (t: number) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 16; i++) {
      const mid = (lo + hi) / 2;
      const x = sampleX(mid);
      if (x < t) lo = mid;
      else hi = mid;
    }
    const s = (lo + hi) / 2;
    return sampleY(s);
  };
}

const EASINGS: Record<EasingType, (t: number) => number> = {
  linear: cubicBezier(0, 0, 1, 1),
  ease: cubicBezier(0.25, 0.1, 0.25, 1),
  "ease-in": cubicBezier(0.42, 0, 1, 1),
  "ease-out": cubicBezier(0, 0, 0.58, 1),
  "ease-in-out": cubicBezier(0.42, 0, 0.58, 1),
};

export const applyEasing = (t: number, type: EasingType): number => EASINGS[type](t);

export const lerpPosition = (from: Position, to: Position, t: number): Position => ({
  x: from.x + (to.x - from.x) * t,
  y: from.y + (to.y - from.y) * t,
  scale: from.scale + (to.scale - from.scale) * t,
});
