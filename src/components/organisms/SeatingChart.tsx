import { useSearch } from "@/contexts/SearchContext";
import { tables } from "@/data/seatingData";
import type { Table } from "@/models/Table";
import { SearchBox } from "../molecule/SearchBox";
import { TableComponent } from "./TableComponent";

export const SeatingChart = () => {
  const { search, setSearch } = useSearch();

  return (
    <>
      <svg viewBox={getViewBox(tables)} className="m-5 mt-0 w-fit scroll-auto border border-red-500">
        {tables.map((table, i) => (
          <TableComponent key={i} table={table} />
        ))}
      </svg>
      <SearchBox
        className="fixed bottom-5 left-1/2 w-[calc(100%-2.5rem)] max-w-md -translate-x-1/2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </>
  );
};

const seatOffset = 10;
const seatRadius = 10;
const seatExtension = seatOffset + seatRadius;
const textBuffer = 60; // Buffer for text labels extending beyond seats

const getViewBox = (tables: Table[]) => {
  if (tables.length === 0) return "0 0 1200 1300";

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  tables.forEach((table) => {
    // Calculate table bounds
    const tableLeft = table.x;
    const tableRight = table.x + table.tableWidth;
    const tableTop = table.y;
    const tableBottom = table.y + table.tableHeight;

    // Extend bounds based on which sides have seats (including text buffer)
    const leftExtend = table.seats.left.length > 0 ? seatExtension + textBuffer : 0;
    const rightExtend = table.seats.right.length > 0 ? seatExtension + textBuffer : 0;
    const topExtend = table.seats.top.length > 0 ? seatExtension + textBuffer : 0;
    const bottomExtend = table.seats.bottom.length > 0 ? seatExtension + textBuffer : 0;

    minX = Math.min(minX, tableLeft - leftExtend);
    maxX = Math.max(maxX, tableRight + rightExtend);
    minY = Math.min(minY, tableTop - topExtend);
    maxY = Math.max(maxY, tableBottom + bottomExtend);
  });

  const width = maxX - minX;
  const height = maxY - minY;

  return `0 0 ${width} ${height}`;
};
