import { seatOffset, seatRadius } from "@/constants";
import type { Table } from "@/models/Table";
import { SeatComponent } from "./SeatComponent";

export const TableComponent = ({ table, search }: { table: Table; search?: string }) => {
  return (
    <g stroke="#000" strokeWidth="1" fill="none">
      <rect x={table.x} y={table.y} width={table.tableWidth} height={table.tableHeight} />
      {getTopSeats(table)}
      {getRightSeats(table)}
      {getBottomSeats(table)}
      {getLeftSeats(table)}
    </g>
  );
};

const getTopSeats = (table: Table) => {
  const numSeats = table.seats.top.length;
  if (numSeats === 0) return null;

  const centerY = table.y - (seatOffset + seatRadius);

  return table.seats.top.map((seat, i) => {
    // Space-around: half spacing before first, full spacing between, half spacing after last
    const spacing = table.tableWidth / numSeats;
    const centerX = table.x + spacing / 2 + spacing * i;
    return (
      <SeatComponent key={`top-${i}`} centerX={centerX} centerY={centerY} seat={seat} textPosition="top" />
    );
  });
};

const getRightSeats = (table: Table) => {
  const numSeats = table.seats.right.length;
  if (numSeats === 0) return null;

  const centerX = table.x + table.tableWidth + (seatOffset + seatRadius);

  return table.seats.right.map((seat, i) => {
    // Space-around: half spacing before first, full spacing between, half spacing after last
    const spacing = table.tableHeight / numSeats;
    const centerY = table.y + spacing / 2 + spacing * i;
    return (
      <SeatComponent
        key={`right-${i}`}
        centerX={centerX}
        centerY={centerY}
        seat={seat}
        textPosition="right"
      />
    );
  });
};

const getBottomSeats = (table: Table) => {
  const numSeats = table.seats.bottom.length;
  if (numSeats === 0) return null;

  const centerY = table.y + table.tableHeight + (seatOffset + seatRadius);

  return table.seats.bottom.map((seat, i) => {
    // Space-around: half spacing before first, full spacing between, half spacing after last
    const spacing = table.tableWidth / numSeats;
    const centerX = table.x + spacing / 2 + spacing * i;
    return (
      <SeatComponent
        key={`bottom-${i}`}
        centerX={centerX}
        centerY={centerY}
        seat={seat}
        textPosition="bottom"
      />
    );
  });
};

const getLeftSeats = (table: Table) => {
  const numSeats = table.seats.left.length;
  if (numSeats === 0) return null;

  const centerX = table.x - (seatOffset + seatRadius);

  return table.seats.left.map((seat, i) => {
    // Space-around: half spacing before first, full spacing between, half spacing after last
    const spacing = table.tableHeight / numSeats;
    const centerY = table.y + spacing / 2 + spacing * i;
    return (
      <SeatComponent key={`left-${i}`} centerX={centerX} centerY={centerY} seat={seat} textPosition="left" />
    );
  });
};
