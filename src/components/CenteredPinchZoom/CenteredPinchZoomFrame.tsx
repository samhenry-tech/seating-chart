import { useRef, type PropsWithChildren } from "react";
import { getTouchCenter, getTouchDistance } from "./centeredPinchZoomUtils";
import type { Position } from "./types";

const ZOOM_SENSITIVITY = 0.002;

export const CenteredPinchZoomFrame = ({ className, children, onPositionChange }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const panStart = useRef<{ clientX: number; clientY: number } | null>(null);
  const singleTouchStart = useRef<{ clientX: number; clientY: number } | null>(null);
  const pinchStart = useRef<{
    distance: number;
    center: { x: number; y: number };
  } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch" || e.button !== 0) return;
    panStart.current = { clientX: e.clientX, clientY: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!panStart.current) return;
    const dx = e.clientX - panStart.current.clientX;
    const dy = e.clientY - panStart.current.clientY;
    onPositionChange((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    panStart.current = { clientX: e.clientX, clientY: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    panStart.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleWheel = (e: React.WheelEvent) => {
    console.log("handleWheel", e.deltaY);
    // e.preventDefault();
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    onPositionChange((p) => {
      const scale = p.scale * (1 - -e.deltaY * ZOOM_SENSITIVITY);
      const ratio = 1 - p.scale / scale;
      return { x: p.x + dx * ratio, y: p.y + dy * ratio, scale };
    });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    console.log("handleTouchStart", e.touches.length);
    if (e.touches.length === 1) {
      const t = e.touches[0]!;
      singleTouchStart.current = { clientX: t.clientX, clientY: t.clientY };
      pinchStart.current = null;
    } else if (e.touches.length === 2) {
      singleTouchStart.current = null;
      const rect = e.currentTarget.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const center = getTouchCenter(e.touches);
      pinchStart.current = {
        distance: getTouchDistance(e.touches),
        center: { x: center.x - cx, y: center.y - cy },
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && singleTouchStart.current) {
      const t = e.touches[0]!;
      const last = singleTouchStart.current;
      const dx = t.clientX - last.clientX;
      const dy = t.clientY - last.clientY;
      onPositionChange((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      singleTouchStart.current = { clientX: t.clientX, clientY: t.clientY };
    } else if (e.touches.length === 2 && pinchStart.current) {
      const d = getTouchDistance(e.touches);
      if (d === 0) return;
      const p = pinchStart.current;
      const center = getTouchCenter(e.touches);
      const rect = e.currentTarget.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const centerX = center.x - cx;
      const centerY = center.y - cy;
      const panDx = centerX - p.center.x;
      const panDy = centerY - p.center.y;
      const scaleChange = d / p.distance;
      console.log("scaleChange", scaleChange);
      onPositionChange((prev) => ({
        x: prev.x + panDx,
        y: prev.y + panDy,
        scale: prev.scale * scaleChange,
      }));
      pinchStart.current = { distance: p.distance, center: { x: centerX, y: centerY } };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) {
      singleTouchStart.current = null;
      pinchStart.current = null;
    } else if (e.touches.length === 1) {
      pinchStart.current = null;
      const t = e.touches[0]!;
      singleTouchStart.current = { clientX: t.clientX, clientY: t.clientY };
    } else if (e.touches.length < 2) {
      pinchStart.current = null;
    }
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ touchAction: "none" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {children}
    </div>
  );
};

interface Props extends PropsWithChildren {
  className?: string;
  onPositionChange: (update: (prev: Position) => Position) => void;
}
