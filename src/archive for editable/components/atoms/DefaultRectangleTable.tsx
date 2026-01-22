import { defaultRectangleTable } from "~/data/rectangleTable";
import { useMemo } from "react";
import { Group, Layer, Stage } from "react-konva";
import { SEAT_OFFSET, TableComponent } from "../organisms/TableComponent";
import { SEAT_RADIUS, SEAT_STROKE_WIDTH } from "./SeatComponent";

const STAGE_WIDTH = 100;
const STAGE_HEIGHT = 100;
const padding = 10;

export const DefaultRectangleTable = ({
  onDragStart,
  onDragEnd,
}: DefaultRectangleTableProps) => {
  const table = { ...defaultRectangleTable, id: "preview", x: 0, y: 0 };

  const contentWidth =
    table.width +
    SEAT_OFFSET * 2 +
    SEAT_RADIUS * 2 +
    SEAT_STROKE_WIDTH * 2 +
    padding * 2;
  const contentHeight =
    table.height +
    SEAT_OFFSET * 2 +
    SEAT_RADIUS * 2 +
    SEAT_STROKE_WIDTH * 2 +
    padding * 2;

  const scale = useMemo(() => {
    const scaleX = STAGE_WIDTH / contentWidth;
    const scaleY = STAGE_HEIGHT / contentHeight;
    return Math.min(scaleX, scaleY);
  }, [contentWidth, contentHeight]);

  // Calculate offset to center the scaled content
  // Content extends from -SEAT_OFFSET to table.width + SEAT_OFFSET
  // The center of the content is at (table.width / 2, table.height / 2)
  // We want this center to be at (STAGE_WIDTH / 2, STAGE_HEIGHT / 2) after scaling
  const contentCenterX = table.width / 2;
  const contentCenterY = table.height / 2;
  const offsetX = STAGE_WIDTH / 2 - contentCenterX * scale;
  const offsetY = STAGE_HEIGHT / 2 - contentCenterY * scale;

  return (
    <article
      className="box-content h-25 w-25 cursor-grab rounded border-2 border-gray-300 bg-gray-50 active:cursor-grabbing"
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <Stage width={STAGE_WIDTH} height={STAGE_HEIGHT}>
        <Layer>
          <Group x={offsetX} y={offsetY} scaleX={scale} scaleY={scale}>
            <TableComponent
              table={table}
              isSelected={false}
              draggable={false}
            />
          </Group>
        </Layer>
      </Stage>
    </article>
  );
};

interface DefaultRectangleTableProps {
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}
