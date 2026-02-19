export interface Position {
  x: number;
  y: number;
  scale: number;
}

export type EasingType = "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out";

export interface SetPositionOptions {
  duration: number;
  easing?: EasingType;
}