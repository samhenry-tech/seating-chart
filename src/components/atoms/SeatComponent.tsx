import { Circle } from "react-konva";

export const SEAT_RADIUS = 8;
export const SEAT_STROKE_WIDTH = 2;

interface SeatComponentProps {
  x: number;
  y: number;
  tableId: string;
  seatIndex: number;
  edge: "top" | "right" | "bottom" | "left";
  onSeatClick?: (
    tableId: string,
    seatIndex: number,
    edge: "top" | "right" | "bottom" | "left"
  ) => void;
}

export const SeatComponent = ({
  x,
  y,
  tableId,
  seatIndex,
  edge,
  onSeatClick,
}: SeatComponentProps) => (
  <Circle
    x={x}
    y={y}
    radius={SEAT_RADIUS - SEAT_STROKE_WIDTH}
    fill="#FFFFFF"
    stroke="#1F2937"
    strokeWidth={SEAT_STROKE_WIDTH}
    onClick={() => onSeatClick?.(tableId, seatIndex, edge)}
    onTap={() => onSeatClick?.(tableId, seatIndex, edge)}
  />
);
