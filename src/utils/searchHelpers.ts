import { seatOffset, seatRadius } from "@/constants";
import type { Table, TableWithSeats } from "@/models/Table";

export interface SeatMatch {
  seat: string;
  centerX: number;
  centerY: number;
}

export const getMatchingSeatCoordinates = (tables: TableWithSeats[], search: string): SeatMatch[] => {
  if (!search) return [];

  const lowerSearch = search.toLowerCase();
  const matches: SeatMatch[] = [];

  tables.forEach((table) => {
    // Check top seats
    table.seats.top.forEach((seat, i) => {
      if (seat?.name.toLowerCase().includes(lowerSearch)) {
        const numSeats = table.seats.top.length;
        const spacing = table.tableWidth / numSeats;
        const centerX = table.x + spacing / 2 + spacing * i;
        const centerY = table.y - (seatOffset + seatRadius);
        matches.push({ seat: seat.name, centerX, centerY });
      }
    });

    // Check right seats
    table.seats.right.forEach((seat, i) => {
      if (seat?.name.toLowerCase().includes(lowerSearch)) {
        const numSeats = table.seats.right.length;
        const spacing = table.tableHeight / numSeats;
        const centerX = table.x + table.tableWidth + (seatOffset + seatRadius);
        const centerY = table.y + spacing / 2 + spacing * i;
        matches.push({ seat: seat.name, centerX, centerY });
      }
    });

    // Check bottom seats
    table.seats.bottom.forEach((seat, i) => {
      if (seat?.name.toLowerCase().includes(lowerSearch)) {
        const numSeats = table.seats.bottom.length;
        const spacing = table.tableWidth / numSeats;
        const centerX = table.x + spacing / 2 + spacing * i;
        const centerY = table.y + table.tableHeight + (seatOffset + seatRadius);
        matches.push({ seat: seat.name, centerX, centerY });
      }
    });

    // Check left seats
    table.seats.left.forEach((seat, i) => {
      if (seat?.name.toLowerCase().includes(lowerSearch)) {
        const numSeats = table.seats.left.length;
        const spacing = table.tableHeight / numSeats;
        const centerX = table.x - (seatOffset + seatRadius);
        const centerY = table.y + spacing / 2 + spacing * i;
        matches.push({ seat: seat.name, centerX, centerY });
      }
    });
  });

  return matches;
};
