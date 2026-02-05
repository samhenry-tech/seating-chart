import type { Position } from "./types";

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
