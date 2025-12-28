export interface Table {
  x: number;
  y: number;
  tableWidth: number;
  tableHeight: number;
  seats: {
    top: (string | null)[];
    right: (string | null)[];
    bottom: (string | null)[];
    left: (string | null)[];
  };
}
