import clsx from "clsx";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type PropsWithChildren } from "react";
import { CenteredPinchZoomFrame } from "./CenteredPinchZoomFrame";
import { clampPosition } from "./centeredPinchZoomUtils";
import type { Position } from "./types";

const DEFAULT_MIN_ZOOM = 0.1;
const DEFAULT_MAX_ZOOM = 5;

export const CenteredPinchZoom = forwardRef<CenteredPinchZoomHandle, Props>(function CenteredPinchZoom(
  { className, children, initialZoom = 1, minZoom = DEFAULT_MIN_ZOOM, maxZoom = DEFAULT_MAX_ZOOM },
  ref
) {
  const [position, setPositionState] = useState<Position>({ x: 0, y: 0, scale: initialZoom });
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerSizeRef = useRef({ width: 0, height: 0 });
  const contentSizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const c = containerRef.current;
    const cnt = contentRef.current;
    if (!c || !cnt) return;
    const update = () => {
      containerSizeRef.current = { width: c.offsetWidth, height: c.offsetHeight };
      contentSizeRef.current = { width: cnt.offsetWidth, height: cnt.offsetHeight };
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(c);
    ro.observe(cnt);
    return () => ro.disconnect();
  }, []);

  useImperativeHandle(ref, () => ({
    setPosition(next: Position) {
      setPositionState(
        clampPosition(next, minZoom, maxZoom, containerSizeRef.current, contentSizeRef.current)
      );
    },
    resetPosition() {
      const next = { x: 0, y: 0, scale: initialZoom };
      setPositionState(
        clampPosition(next, minZoom, maxZoom, containerSizeRef.current, contentSizeRef.current)
      );
    },
  }));

  const onPositionChange = (update: (prev: Position) => Position) => {
    setPositionState((prev) => {
      const next = update(prev);
      const clamped = clampPosition(next, minZoom, maxZoom, containerSizeRef.current, contentSizeRef.current);
      // console.log("clamped", clamped.scale);
      return clamped;
    });
  };

  return (
    <div ref={containerRef} className={className} style={{ position: "relative", overflow: "hidden" }}>
      <CenteredPinchZoomFrame
        className={clsx(className, "relative touch-none select-none")}
        onPositionChange={onPositionChange}
      >
        <div
          ref={contentRef}
          className="absolute cursor-grab active:cursor-grabbing"
          style={{
            left: `calc(50% + ${position.x}px)`,
            top: `calc(50% + ${position.y}px)`,
            transform: `translate(-50%, -50%) scale(${position.scale})`,
          }}
        >
          {children}
        </div>
      </CenteredPinchZoomFrame>
    </div>
  );
});

interface Props extends PropsWithChildren {
  className?: string;
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
}

export interface CenteredPinchZoomHandle {
  setPosition: (position: Position) => void;
  resetPosition: () => void;
}
