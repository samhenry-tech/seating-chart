import clsx from "clsx";
import type { PropsWithChildren } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

export const CenteredPinchZoom = ({
  className,
  children,
  initialZoom = 1,
  minZoom = 0.1,
  maxZoom = 5,
  onPositionChange,
}: Props) => {
  return (
    <div className={clsx(className, "relative h-full w-full")}>
      <TransformWrapper
        initialScale={initialZoom}
        minScale={minZoom}
        maxScale={maxZoom}
        limitToBounds={false}
        onTransformed={(_, state) => {
          onPositionChange?.(state);
        }}
        customTransform={(x, y, scale) => {
          console.log(x, y, scale);
          return `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`;
        }}
      >
        <TransformComponent
          contentStyle={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transformOrigin: "0 0",
          }}
          wrapperStyle={{ width: "100%", height: "100%", position: "relative" }}
        >
          {children}
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

interface Props extends PropsWithChildren {
  className?: string;
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  /** Called with { positionX, positionY, scale } — use for left/top offsets (can be negative). */
  onPositionChange?: (state: { positionX: number; positionY: number; scale: number }) => void;
}
