import type { Seat } from "./Seat";

export interface Table<T> {
  x: number;
  y: number;
  tableWidth: number;
  tableHeight: number;
  seats: {
    top: (T | null)[];
    right: (T | null)[];
    bottom: (T | null)[];
    left: (T | null)[];
  };
}

export type TableWithSeats = Table<Seat>;
