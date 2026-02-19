import clsx from "clsx";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { CenteredPinchZoomFrame } from "./CenteredPinchZoomFrame";
import { applyEasing, clampPosition, lerpPosition } from "./centeredPinchZoomUtils";
import type { EasingType, Position } from "./types";

export type { EasingType };

const DEFAULT_MIN_ZOOM = 0.1;
const DEFAULT_MAX_ZOOM = 5;
const DEFAULT_ANIMATION_EASING: EasingType = "ease";

export const CenteredPinchZoom = forwardRef<CenteredPinchZoomHandle, Props>(function CenteredPinchZoom(
  {
    className,
    children,
    initialZoom = 1,
    minZoom = DEFAULT_MIN_ZOOM,
    maxZoom = DEFAULT_MAX_ZOOM,
    animationDuration = 0,
    animationEasing = DEFAULT_ANIMATION_EASING,
  },
  ref
) {
  const [position, setPositionState] = useState<Position>({ x: 0, y: 0, scale: initialZoom });
  const positionRef = useRef(position);
  const animationRafRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerSizeRef = useRef({ width: 0, height: 0 });
  const contentSizeRef = useRef({ width: 0, height: 0 });

  positionRef.current = position;

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

  useEffect(
    () => () => {
      if (animationRafRef.current !== null) cancelAnimationFrame(animationRafRef.current);
    },
    []
  );

  const setPosition = useCallback(
    (next: Position) => {
      const target = clampPosition(next, minZoom, maxZoom, containerSizeRef.current, contentSizeRef.current);
      const duration = animationDuration;
      const easing = animationEasing;

      if (duration <= 0) {
        setPositionState(target);
        return;
      }

      if (animationRafRef.current !== null) cancelAnimationFrame(animationRafRef.current);
      const start = { ...positionRef.current };
      let startTime: number | null = null;

      const tick = (now: number) => {
        startTime ??= now;
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const easedT = applyEasing(t, easing);
        const interpolated = lerpPosition(start, target, easedT);
        setPositionState(
          clampPosition(interpolated, minZoom, maxZoom, containerSizeRef.current, contentSizeRef.current)
        );
        if (t < 1) {
          animationRafRef.current = requestAnimationFrame(tick);
        } else {
          animationRafRef.current = null;
        }
      };
      animationRafRef.current = requestAnimationFrame(tick);
    },
    [animationDuration, animationEasing, minZoom, maxZoom, setPositionState]
  );

  useImperativeHandle(
    ref,
    () => ({
      setPosition,
      resetPosition: () => setPosition({ x: 0, y: 0, scale: initialZoom }),
    }),
    [initialZoom, setPosition]
  );

  const onPositionChange = (update: (prev: Position) => Position) => {
    setPositionState((prev) => {
      const next = update(prev);
      const clamped = clampPosition(next, minZoom, maxZoom, containerSizeRef.current, contentSizeRef.current);
      // console.log("clamped", clamped.scale);
      return clamped;
    });
  };

  return (
    <CenteredPinchZoomFrame
      ref={containerRef}
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
  );
});

interface Props extends PropsWithChildren {
  className?: string;
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  /** Duration in ms for setPosition animation; 0 = instant. */
  animationDuration?: number;
  /** Easing for setPosition animation. */
  animationEasing?: EasingType;
}

export interface CenteredPinchZoomHandle {
  setPosition: (position: Position) => void;
  resetPosition: () => void;
}
