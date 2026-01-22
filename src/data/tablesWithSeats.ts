import type { Seat } from "~/models/Seat";
import type { Table, TableWithSeats } from "~/models/Table";
import { seatOffset, seatRadius } from "~/utils/seatingConstants";
import { tables } from "./seatingData";

type Side = keyof Table<string>["seats"];

const getFixedCoordinate = (table: Table<string>, side: Side): number => {
  if (side === "top") return table.y - (seatOffset + seatRadius);
  if (side === "right") return table.x + table.tableWidth + (seatOffset + seatRadius);
  if (side === "bottom") return table.y + table.tableHeight + (seatOffset + seatRadius);
  return table.x - (seatOffset + seatRadius);
};

const getVariableCoordinate = (table: Table<string>, side: Side, spacing: number, index: number): number => {
  if (side === "top" || side === "bottom") {
    return table.x + spacing / 2 + spacing * index;
  }
  return table.y + spacing / 2 + spacing * index;
};

const getSeatsForSide = (table: Table<string>, side: Side): (Seat | null)[] => {
  const seats = table.seats[side];
  if (seats.length === 0) return [];

  const isHorizontal = side === "top" || side === "bottom";
  const lengthOfSide = isHorizontal ? table.tableWidth : table.tableHeight;
  const spacing = lengthOfSide / seats.length;

  const fixedCoord = getFixedCoordinate(table, side);

  return seats.map((seat, i) =>
    seat
      ? {
          name: seat,
          centerX: isHorizontal ? getVariableCoordinate(table, side, spacing, i) : fixedCoord,
          centerY: isHorizontal ? fixedCoord : getVariableCoordinate(table, side, spacing, i),
        }
      : null
  );
};

export const tablesWithSeats = tables.map<TableWithSeats>((table) => {
  return {
    ...table,
    seats: {
      top: getSeatsForSide(table, "top"),
      right: getSeatsForSide(table, "right"),
      bottom: getSeatsForSide(table, "bottom"),
      left: getSeatsForSide(table, "left"),
    },
  };
});
