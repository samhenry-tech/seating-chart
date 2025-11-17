import { defaultRectangleTable } from "@/data/rectangleTable";
import { Layer, Stage } from "react-konva";
import { TableComponent } from "../organisms/TableComponent";

export const DefaultRectangleTable = ({
  onDragStart,
  onDragEnd,
}: DefaultRectangleTableProps) => {
  const table = { ...defaultRectangleTable, id: "preview", x: 0, y: 0 };

  return (
    <article
      className="h-25 w-25 cursor-grab rounded border-2 border-gray-300 bg-gray-50 active:cursor-grabbing"
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <Stage width={100} height={100} viewBox="0 0 100 100">
        <Layer>
          <TableComponent table={table} isSelected={false} draggable={false} />
        </Layer>
      </Stage>
    </article>
  );
};

interface DefaultRectangleTableProps {
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}
