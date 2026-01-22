import { seatOffset, seatRadius } from "~/constants";
import type { Table, TableWithSeats } from "~/models/Table";
import { SeatComponent } from "./SeatComponent";

export const TableComponent = ({ table }: { table: TableWithSeats }) => {
  return (
    <g stroke="#000" strokeWidth="1" fill="none">
      <rect x={table.x} y={table.y} width={table.tableWidth} height={table.tableHeight} />
      {table.seats.top.map(
        (seat, i) =>
          seat && (
            <SeatComponent
              key={`top-${i}`}
              centerX={seat.centerX}
              centerY={seat.centerY}
              seat={seat.name}
              textPosition="top"
            />
          )
      )}
      {table.seats.right.map(
        (seat, i) =>
          seat && (
            <SeatComponent
              key={`right-${i}`}
              centerX={seat.centerX}
              centerY={seat.centerY}
              seat={seat.name}
              textPosition="right"
            />
          )
      )}
      {table.seats.bottom.map(
        (seat, i) =>
          seat && (
            <SeatComponent
              key={`bottom-${i}`}
              centerX={seat.centerX}
              centerY={seat.centerY}
              seat={seat.name}
              textPosition="bottom"
            />
          )
      )}
      {table.seats.left.map(
        (seat, i) =>
          seat && (
            <SeatComponent
              key={`left-${i}`}
              centerX={seat.centerX}
              centerY={seat.centerY}
              seat={seat.name}
              textPosition="left"
            />
          )
      )}
    </g>
  );
};
