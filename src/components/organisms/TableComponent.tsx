import type { TableWithSeats } from "~/models/Table";
import { textFontSize } from "~/utils/seatingConstants";
import { SeatComponent } from "./SeatComponent";

export const TableComponent = ({ table }: { table: TableWithSeats }) => {
  return (
    <g stroke="#000" strokeWidth="1" fill="none">
      <rect x={table.x} y={table.y} width={table.tableWidth} height={table.tableHeight} />
      <g
        transform={`translate(${table.x + table.tableWidth / 2}, ${table.y + table.tableHeight / 2}) rotate(${table.rotate ? 90 : 0})`}
      >
        <text x={0} y={0} textAnchor="middle" dominantBaseline="middle" fontSize={textFontSize} fill="#000">
          {table.name}
        </text>
      </g>
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
