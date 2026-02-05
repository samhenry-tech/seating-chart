import { forwardRef, useEffect, useRef, type PropsWithChildren } from "react";
import { getTouchCenter, getTouchDistance } from "./centeredPinchZoomUtils";
import type { Position } from "./types";

const ZOOM_SENSITIVITY = 0.002;
const INERTIA_FRICTION = 0.92;
const INERTIA_PAN_THRESHOLD = 0.5;
const INERTIA_SCALE_THRESHOLD = 0.001;

export const CenteredPinchZoomFrame = forwardRef<HTMLDivElement, Props>(
  ({ className, children, onPositionChange }, ref) => {
    const panStart = useRef<{ clientX: number; clientY: number } | null>(null);
    const singleTouchStart = useRef<{ clientX: number; clientY: number } | null>(null);
    const pinchStart = useRef<{
      distance: number;
      center: { x: number; y: number };
    } | null>(null);

    const lastPanVelocity = useRef<{ vx: number; vy: number } | null>(null);
    const lastScaleVelocity = useRef<number>(1);
    const inertiaRaf = useRef<number | null>(null);

    const runInertia = (initialVx: number, initialVy: number, initialScaleVel: number) => {
      if (inertiaRaf.current !== null) cancelAnimationFrame(inertiaRaf.current);
      let vx = initialVx;
      let vy = initialVy;
      let scaleVel = initialScaleVel;

      const tick = () => {
        onPositionChange((prev) => ({
          x: prev.x + vx,
          y: prev.y + vy,
          scale: prev.scale * scaleVel,
        }));
        vx *= INERTIA_FRICTION;
        vy *= INERTIA_FRICTION;
        scaleVel = scaleVel * INERTIA_FRICTION + (1 - INERTIA_FRICTION);

        const panDone = Math.abs(vx) < INERTIA_PAN_THRESHOLD && Math.abs(vy) < INERTIA_PAN_THRESHOLD;
        const scaleDone = Math.abs(scaleVel - 1) < INERTIA_SCALE_THRESHOLD;
        if (panDone && scaleDone) {
          inertiaRaf.current = null;
          return;
        }
        inertiaRaf.current = requestAnimationFrame(tick);
      };
      inertiaRaf.current = requestAnimationFrame(tick);
    };

    useEffect(
      () => () => {
        if (inertiaRaf.current !== null) cancelAnimationFrame(inertiaRaf.current);
      },
      []
    );

    const stopInertia = () => {
      if (inertiaRaf.current !== null) {
        cancelAnimationFrame(inertiaRaf.current);
        inertiaRaf.current = null;
      }
    };

    const handlePointerDown = (e: React.PointerEvent) => {
      if (e.pointerType === "touch" || e.button !== 0) return;
      stopInertia();
      panStart.current = { clientX: e.clientX, clientY: e.clientY };
      lastPanVelocity.current = null;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      if (!panStart.current) return;
      const dx = e.clientX - panStart.current.clientX;
      const dy = e.clientY - panStart.current.clientY;
      onPositionChange((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      lastPanVelocity.current = { vx: dx, vy: dy };
      panStart.current = { clientX: e.clientX, clientY: e.clientY };
    };

    const handlePointerUp = (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      const vel = lastPanVelocity.current;
      panStart.current = null;
      lastPanVelocity.current = null;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      if (vel && (Math.abs(vel.vx) > 0.5 || Math.abs(vel.vy) > 0.5)) {
        runInertia(vel.vx, vel.vy, 1);
      }
    };

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      stopInertia();
      const rect = e.currentTarget.getBoundingClientRect();
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
      stopInertia();
      lastPanVelocity.current = null;
      lastScaleVelocity.current = 1;
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
        lastPanVelocity.current = { vx: dx, vy: dy };
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
        lastPanVelocity.current = { vx: panDx, vy: panDy };
        lastScaleVelocity.current = scaleChange;
        onPositionChange((prev) => ({
          x: prev.x + panDx,
          y: prev.y + panDy,
          scale: prev.scale * scaleChange,
        }));
        pinchStart.current = { distance: d, center: { x: centerX, y: centerY } };
      }
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length === 0) {
        const vel = lastPanVelocity.current;
        const scaleVel = lastScaleVelocity.current;
        singleTouchStart.current = null;
        pinchStart.current = null;
        lastPanVelocity.current = null;
        lastScaleVelocity.current = 1;
        const hasPan =
          vel && (Math.abs(vel.vx) > INERTIA_PAN_THRESHOLD || Math.abs(vel.vy) > INERTIA_PAN_THRESHOLD);
        const hasScale = Math.abs(scaleVel - 1) > INERTIA_SCALE_THRESHOLD;
        if (hasPan || hasScale) {
          runInertia(vel?.vx ?? 0, vel?.vy ?? 0, scaleVel);
        }
      } else if (e.touches.length === 1) {
        const vel = lastPanVelocity.current;
        const scaleVel = lastScaleVelocity.current;
        pinchStart.current = null;
        lastPanVelocity.current = null;
        lastScaleVelocity.current = 1;
        const hasPan =
          vel && (Math.abs(vel.vx) > INERTIA_PAN_THRESHOLD || Math.abs(vel.vy) > INERTIA_PAN_THRESHOLD);
        const hasScale = Math.abs(scaleVel - 1) > INERTIA_SCALE_THRESHOLD;
        if (hasPan || hasScale) {
          runInertia(vel?.vx ?? 0, vel?.vy ?? 0, scaleVel);
        }
        const t = e.touches[0]!;
        singleTouchStart.current = { clientX: t.clientX, clientY: t.clientY };
      } else if (e.touches.length < 2) {
        pinchStart.current = null;
      }
    };

    return (
      <div
        ref={ref}
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
  }
);

CenteredPinchZoomFrame.displayName = "CenteredPinchZoomFrame";

interface Props extends PropsWithChildren {
  className?: string;
  onPositionChange: (update: (prev: Position) => Position) => void;
}
