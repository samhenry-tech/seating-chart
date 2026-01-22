import { seatOffset, seatRadius, textHeight, textWidth } from "~/constants";
import type { TableWithSeats } from "~/models/Table";

const seatMeasurement = seatOffset + seatRadius;

export const getSize = (tables: TableWithSeats[]) => {
  if (tables.length === 0) throw new Error("No tables provided");

  const minAndMax = tables.reduce(
    (minAndMax, table) => {
      const tableMinX = table.x - table.seats.left.length * seatMeasurement - textWidth;
      const tableMaxX = table.x + table.tableWidth + table.seats.right.length * seatMeasurement + textWidth;
      const tableMinY = table.y - table.seats.top.length * seatMeasurement - textHeight;
      const tableMaxY = table.y + table.tableHeight + table.seats.bottom.length * seatMeasurement + textHeight;

      return {
        minX: Math.min(minAndMax.minX, tableMinX),
        maxX: Math.max(minAndMax.maxX, tableMaxX),
        minY: Math.min(minAndMax.minY, tableMinY),
        maxY: Math.max(minAndMax.maxY, tableMaxY),
      };
    },
    { minX: 0, maxX: 0, minY: 0, maxY: 0 }
  );

  const width = minAndMax.maxX - minAndMax.minX;
  const height = minAndMax.maxY - minAndMax.minY;

  return { width, height };
};
