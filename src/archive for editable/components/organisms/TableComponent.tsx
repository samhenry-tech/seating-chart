import { useSeatingChart } from "~/contexts/SeatingChartContext";
import type { Table } from "~/models/Table";
import type { KonvaEventObject } from "konva/lib/Node";
import { useRef, useState } from "react";
import { Group, Rect } from "react-konva";
import { SEAT_RADIUS, SeatComponent } from "../atoms/SeatComponent";

export const SEAT_OFFSET = 20;
const SELECTOR_STROKE_WIDTH = 1;
const MIN_TABLE_SIZE = 50;

export const TableComponent = ({
  table,
  onDragEnd,
  onSeatClick,
  onTableClick,
  isSelected = false,
  draggable = true,
}: TableProps) => {
  const { updateTableSize } = useSeatingChart();
  const selectorPosition = getSelectorPosition(table);
  const [resizingCorner, setResizingCorner] = useState<string | null>(null);
  const resizeStartRef = useRef<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const handleCornerDragStart =
    (corner: string) => (e: KonvaEventObject<DragEvent>) => {
      e.cancelBubble = true;
      setResizingCorner(corner);
      resizeStartRef.current = {
        x: table.x,
        y: table.y,
        width: table.width,
        height: table.height,
      };
    };

  const handleCornerDragMove =
    (corner: string) => (e: KonvaEventObject<DragEvent>) => {
      if (!resizeStartRef.current) return;

      const node = e.target;
      const stage = node.getStage();
      if (!stage) return;

      const pointerPos = stage.getPointerPosition();
      if (!pointerPos) return;

      // Get the group (parent) to access its position
      const group = node.getParent();
      if (!group) return;

      // Get the group's absolute position
      const groupAbsPos = group.absolutePosition();

      // Calculate pointer position relative to the group's origin
      const localX = pointerPos.x - groupAbsPos.x;
      const localY = pointerPos.y - groupAbsPos.y;

      let newWidth = resizeStartRef.current.width;
      let newHeight = resizeStartRef.current.height;
      let newX = resizeStartRef.current.x;
      let newY = resizeStartRef.current.y;

      // Calculate new dimensions based on corner
      // selectorPosition is relative to group origin
      switch (corner) {
        case "top-left": {
          const startX = selectorPosition.x - SELECTOR_STROKE_WIDTH / 2;
          const startY = selectorPosition.y - SELECTOR_STROKE_WIDTH / 2;
          const deltaX = localX - startX;
          const deltaY = localY - startY;
          newWidth = Math.max(
            MIN_TABLE_SIZE,
            resizeStartRef.current.width - deltaX
          );
          newHeight = Math.max(
            MIN_TABLE_SIZE,
            resizeStartRef.current.height - deltaY
          );
          newX =
            resizeStartRef.current.x +
            (resizeStartRef.current.width - newWidth);
          newY =
            resizeStartRef.current.y +
            (resizeStartRef.current.height - newHeight);
          break;
        }
        case "top-right": {
          const startX =
            selectorPosition.x +
            selectorPosition.width -
            SELECTOR_STROKE_WIDTH / 2;
          const startY = selectorPosition.y - SELECTOR_STROKE_WIDTH / 2;
          const deltaX = localX - startX;
          const deltaY = localY - startY;
          newWidth = Math.max(
            MIN_TABLE_SIZE,
            resizeStartRef.current.width + deltaX
          );
          newHeight = Math.max(
            MIN_TABLE_SIZE,
            resizeStartRef.current.height - deltaY
          );
          newY =
            resizeStartRef.current.y +
            (resizeStartRef.current.height - newHeight);
          break;
        }
        case "bottom-left": {
          const startX = selectorPosition.x - SELECTOR_STROKE_WIDTH / 2;
          const startY =
            selectorPosition.y +
            selectorPosition.height -
            SELECTOR_STROKE_WIDTH / 2;
          const deltaX = localX - startX;
          const deltaY = localY - startY;
          newWidth = Math.max(
            MIN_TABLE_SIZE,
            resizeStartRef.current.width - deltaX
          );
          newHeight = Math.max(
            MIN_TABLE_SIZE,
            resizeStartRef.current.height + deltaY
          );
          newX =
            resizeStartRef.current.x +
            (resizeStartRef.current.width - newWidth);
          break;
        }
        case "bottom-right": {
          const startX =
            selectorPosition.x +
            selectorPosition.width -
            SELECTOR_STROKE_WIDTH / 2;
          const startY =
            selectorPosition.y +
            selectorPosition.height -
            SELECTOR_STROKE_WIDTH / 2;
          const deltaX = localX - startX;
          const deltaY = localY - startY;
          newWidth = Math.max(
            MIN_TABLE_SIZE,
            resizeStartRef.current.width + deltaX
          );
          newHeight = Math.max(
            MIN_TABLE_SIZE,
            resizeStartRef.current.height + deltaY
          );
          break;
        }
      }

      // Update table size
      updateTableSize(table.id, newWidth, newHeight);

      // Update group position if needed (for corners that move the origin)
      if (newX !== group.x() || newY !== group.y()) {
        const groupX = group.x();
        const groupY = group.y();
        if (typeof groupX === "number" && typeof groupY === "number") {
          group.position({ x: newX, y: newY });
        }
      }
    };

  const handleCornerDragEnd = (e: KonvaEventObject<DragEvent>) => {
    setResizingCorner(null);
    // Update final position if it changed during resize
    const group = e.target.getParent();
    if (group) {
      onDragEnd?.({
        target: group,
        evt: e.evt,
      } as KonvaEventObject<DragEvent>);
    }
    resizeStartRef.current = null;
  };

  return (
    <Group
      x={table.x}
      y={table.y}
      draggable={draggable && !resizingCorner}
      name="table-group"
      onDragEnd={onDragEnd}
      onClick={onTableClick}
      onTap={onTableClick}
      onDragStart={(e) => {
        const stage = e.target.getStage();
        if (stage) {
          stage.container().style.cursor = "grabbing";
        }
      }}
    >
      <Rect
        className="cursor-grab"
        width={table.width}
        height={table.height}
        fill="rgba(0,0,0,0)"
        stroke="#9CA3AF"
        strokeWidth={2}
        cornerRadius={4}
        onMouseEnter={(e) => {
          if (!resizingCorner) {
            const stage = e.target.getStage();
            if (stage) {
              stage.container().style.cursor = "grab";
            }
          }
        }}
        onMouseLeave={(e) => {
          if (!resizingCorner) {
            const stage = e.target.getStage();
            if (stage) {
              stage.container().style.cursor = "default";
            }
          }
        }}
      />
      {renderSeats(table, "top", onSeatClick)}
      {renderSeats(table, "right", onSeatClick)}
      {renderSeats(table, "bottom", onSeatClick)}
      {renderSeats(table, "left", onSeatClick)}

      {isSelected && (
        <>
          <Rect
            name="selection-indicator"
            x={selectorPosition.x}
            y={selectorPosition.y}
            width={selectorPosition.width}
            height={selectorPosition.height}
            fill="rgba(0,0,0,0)"
            stroke="#3B82F6"
            strokeWidth={SELECTOR_STROKE_WIDTH}
            dash={[5, 5]}
          />
          {getSelectorCorners(
            selectorPosition,
            handleCornerDragStart,
            handleCornerDragMove,
            handleCornerDragEnd
          )}
        </>
      )}
    </Group>
  );
};

TableComponent.displayName = "TableComponent";

interface TableProps {
  table: Table;
  onDragEnd?: (e: KonvaEventObject<DragEvent>) => void;
  onSeatClick?: (
    tableId: string,
    seatIndex: number,
    edge: "top" | "right" | "bottom" | "left"
  ) => void;
  onTableClick?: (e: KonvaEventObject<MouseEvent>) => void;
  isSelected?: boolean;
  draggable?: boolean;
}

const renderSeats = (
  table: Table,
  edge: "top" | "right" | "bottom" | "left",
  onSeatClick?: (
    tableId: string,
    seatIndex: number,
    edge: "top" | "right" | "bottom" | "left"
  ) => void
) => {
  const positions = calculateSeatPositions(
    table,
    edge,
    table.seats[edge].length
  );
  return positions.map((pos, index) => {
    const seating = table.seats[edge][index];
    if (seating?.hidden) return null;

    return (
      <SeatComponent
        key={`${edge}-${index}`}
        x={pos.x}
        y={pos.y}
        tableId={table.id}
        seatIndex={index}
        edge={edge}
        onSeatClick={
          onSeatClick
            ? (tableId, seatIndex, edge) =>
                onSeatClick(tableId, seatIndex, edge)
            : undefined
        }
      />
    );
  });
};

const calculateSeatPositions = (
  table: Table,
  edge: "top" | "right" | "bottom" | "left",
  count: number
): { x: number; y: number }[] => {
  const positions: { x: number; y: number }[] = [];

  if (count === 0) return positions;

  switch (edge) {
    case "top": {
      const spacing = count > 1 ? table.width / (count + 1) : table.width / 2;
      for (let i = 0; i < count; i++) {
        positions.push({
          x: spacing * (i + 1),
          y: -SEAT_OFFSET,
        });
      }
      break;
    }
    case "right": {
      const spacing = count > 1 ? table.height / (count + 1) : table.height / 2;
      for (let i = 0; i < count; i++) {
        positions.push({
          x: table.width + SEAT_OFFSET,
          y: spacing * (i + 1),
        });
      }
      break;
    }
    case "bottom": {
      const spacing = count > 1 ? table.width / (count + 1) : table.width / 2;
      for (let i = 0; i < count; i++) {
        positions.push({
          x: spacing * (i + 1),
          y: table.height + SEAT_OFFSET,
        });
      }
      break;
    }
    case "left": {
      const spacing = count > 1 ? table.height / (count + 1) : table.height / 2;
      for (let i = 0; i < count; i++) {
        positions.push({
          x: -SEAT_OFFSET,
          y: spacing * (i + 1),
        });
      }
      break;
    }
  }

  return positions;
};

const getSelectorPosition = (table: Table) => {
  const { left, right, top, bottom } = table.seats;
  const seatOffset = SEAT_OFFSET + SEAT_RADIUS - 1.5;

  const widthAdjustment =
    [left.length > 0, right.length > 0].filter(Boolean).length * seatOffset;
  const heightAdjustment =
    [top.length > 0, bottom.length > 0].filter(Boolean).length * seatOffset;
  return {
    x: left.length > 0 ? -seatOffset : 0,
    y: top.length > 0 ? -seatOffset : 0,
    width: table.width + widthAdjustment,
    height: table.height + heightAdjustment,
  };
};

interface SelectorPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

const CORNER_SIZE = 5;

const getSelectorCorners = (
  selectorPosition: SelectorPosition,
  onDragStart: (corner: string) => (e: KonvaEventObject<DragEvent>) => void,
  onDragMove: (corner: string) => (e: KonvaEventObject<DragEvent>) => void,
  onDragEnd: (e: KonvaEventObject<DragEvent>) => void
) => {
  const x = selectorPosition.x - SELECTOR_STROKE_WIDTH / 2;
  const y = selectorPosition.y - SELECTOR_STROKE_WIDTH / 2;
  const width = selectorPosition.width;
  const height = selectorPosition.height;

  const cornerProps = {
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    fill: "#3B82F6",
    draggable: true,
    onDragEnd,
  };

  return (
    <>
      <Rect
        {...cornerProps}
        x={x}
        y={y}
        onDragStart={onDragStart("top-left")}
        onDragMove={onDragMove("top-left")}
        onMouseEnter={(e) => {
          const stage = e.target.getStage();
          if (stage) {
            stage.container().style.cursor = "nwse-resize";
          }
        }}
        onMouseLeave={(e) => {
          const stage = e.target.getStage();
          if (stage) {
            stage.container().style.cursor = "default";
          }
        }}
      />
      <Rect
        {...cornerProps}
        x={x + width - CORNER_SIZE + 1}
        y={y}
        onDragStart={onDragStart("top-right")}
        onDragMove={onDragMove("top-right")}
        onMouseEnter={(e) => {
          const stage = e.target.getStage();
          if (stage) {
            stage.container().style.cursor = "nesw-resize";
          }
        }}
        onMouseLeave={(e) => {
          const stage = e.target.getStage();
          if (stage) {
            stage.container().style.cursor = "default";
          }
        }}
      />
      <Rect
        {...cornerProps}
        x={x}
        y={y + height - CORNER_SIZE + 1}
        onDragStart={onDragStart("bottom-left")}
        onDragMove={onDragMove("bottom-left")}
        onMouseEnter={(e) => {
          const stage = e.target.getStage();
          if (stage) {
            stage.container().style.cursor = "nesw-resize";
          }
        }}
        onMouseLeave={(e) => {
          const stage = e.target.getStage();
          if (stage) {
            stage.container().style.cursor = "default";
          }
        }}
      />
      <Rect
        {...cornerProps}
        x={x + width - CORNER_SIZE + 1}
        y={y + height - CORNER_SIZE + 1}
        onDragStart={onDragStart("bottom-right")}
        onDragMove={onDragMove("bottom-right")}
        onMouseEnter={(e) => {
          const stage = e.target.getStage();
          if (stage) {
            stage.container().style.cursor = "nwse-resize";
          }
        }}
        onMouseLeave={(e) => {
          const stage = e.target.getStage();
          if (stage) {
            stage.container().style.cursor = "default";
          }
        }}
      />
    </>
  );
};
