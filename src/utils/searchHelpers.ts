import type { TableWithSeats } from "~/models/Table";

export interface SeatMatch {
  name: string;
  centerX: number;
  centerY: number;
}

export const getMatchingSeatCoordinates = (tables: TableWithSeats[], search: string): SeatMatch[] => {
  if (!search) return [];

  const lowerSearch = search.toLowerCase();
  const matches: SeatMatch[] = [];

  tables.forEach((table) => {
    const { left, right, top, bottom } = table.seats;

    [...left, ...top, ...bottom, ...right].forEach((seat) => {
      if (seat?.name.toLowerCase().startsWith(lowerSearch)) {
        matches.push(seat);
      }
    });
  });

  return matches;
};
