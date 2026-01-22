import type { TableWithSeats } from "~/models/Table";
import { chartPadding, horisontalSeatAndText, verticalSeatAndText } from "~/utils/seatingConstants";

export const getSize = (tables: TableWithSeats[]) => {
  if (tables.length === 0) throw new Error("No tables provided");

  const minAndMax = tables.reduce(
    (minAndMax, table) => {
      const tableMinX = table.x - (table.seats.left.length ? horisontalSeatAndText : 0);

      const tableMaxX = table.x + table.tableWidth + (table.seats.right.length ? horisontalSeatAndText : 0);
      const tableMinY = table.y - (table.seats.top.length ? verticalSeatAndText : 0);
      const tableMaxY = table.y + table.tableHeight + (table.seats.bottom.length ? verticalSeatAndText : 0);

      return {
        minX: Math.min(minAndMax.minX, tableMinX),
        maxX: Math.max(minAndMax.maxX, tableMaxX),
        minY: Math.min(minAndMax.minY, tableMinY),
        maxY: Math.max(minAndMax.maxY, tableMaxY),
      };
    },
    { minX: 0, maxX: 0, minY: 0, maxY: 0 }
  );

  const width = minAndMax.maxX - minAndMax.minX + chartPadding * 2;
  const height = minAndMax.maxY - minAndMax.minY + chartPadding * 2;

  return { width, height };
};
