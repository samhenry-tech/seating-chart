import type { Table } from "~/models/Table";
import {
  chartPadding,
  horisontalSeatAndText,
  seatOffset,
  seatRadius,
  tableLength,
  tableMargin,
  tableWidth,
  textHeight,
} from "~/utils/seatingConstants";

const tableSpacing = tableWidth + 2 * (horisontalSeatAndText + tableMargin);

const bridalTableStartX =
  chartPadding +
  horisontalSeatAndText +
  tableSpacing +
  tableWidth +
  horisontalSeatAndText +
  tableMargin -
  tableLength;

const bridalTableY = chartPadding + textHeight + seatOffset + seatRadius * 2;

const bridalTables = [
  {
    name: "Bridal",
    x: bridalTableStartX - 20,
    y: bridalTableY,
    tableWidth: tableLength + 20,
    tableHeight: tableWidth,
    seats: {
      top: ["Tom F", "Carter", "Dan", "Sam"],
      right: [],
      bottom: [],
      left: [],
    },
  },
  {
    name: "Table",
    x: bridalTableStartX + tableLength,
    y: bridalTableY,
    tableWidth: tableLength + 20,
    tableHeight: tableWidth,
    seats: {
      top: ["Soph", "Emily W", "Jess H", "Yaz"],
      right: [],
      bottom: [],
      left: [],
    },
  },
];

const firstColumnX = chartPadding + horisontalSeatAndText;
const secondColumnX = firstColumnX + tableSpacing;
const thirdColumnX = secondColumnX + tableSpacing;
const fourthColumnX = thirdColumnX + tableSpacing;

const firstTableY = chartPadding + 200;
const secondTableY = firstTableY + tableLength;
const thirdTableY = secondTableY + tableLength;
const fourthTableY = thirdTableY + tableLength;

export const tables: Table<string>[] = [
  ...bridalTables,
  // First
  {
    name: "Table 1.1",
    rotate: true,
    x: firstColumnX,
    y: firstTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["Lachie", "Sean M", "Andy B", "Elissa"],
      bottom: [],
      left: ["Zahlia", "Beth M", "Rob", "Nat"],
    },
  },
  {
    name: "Table 1.2",
    rotate: true,
    x: firstColumnX,
    y: secondTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["Matilda", "Brayden", "Tim", "Jake"],
      bottom: [],
      left: ["Mary", "Beth C", "Nick", "Sean W"],
    },
  },
  {
    name: "Table 1.3",
    rotate: true,
    x: firstColumnX,
    y: thirdTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["Matt", "Emma", "Kaz", "Lucy"],
      bottom: [],
      left: ["Lauren", "Disney", "Ollie", "Kat"],
    },
  },
  // Second
  {
    name: "Table 2.1",
    rotate: true,
    x: secondColumnX,
    y: firstTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["Xave", "Sarah", "Ty", "Steve H"],
      bottom: [],
      left: ["Eli", "Sammi", "Lucy", "Paul"],
    },
  },
  {
    name: "Table 2.2",
    rotate: true,
    x: secondColumnX,
    y: secondTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["Cathy H", "Kath H", "Phil", "Sue"],
      bottom: [],
      left: ["Chris", "Ruth", "Mandy", "Dave G"],
    },
  },
  {
    name: "Table 2.3",
    rotate: true,
    x: secondColumnX,
    y: thirdTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["David B", "Libby", "Jen P", "Martin"],
      bottom: [],
      left: ["Jonathan", "Michelle B", "Cath C", "Alan"],
    },
  },
  {
    name: "Table 2.4",
    rotate: true,
    x: secondColumnX,
    y: fourthTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["Bec", "Tod", "Michael", "Ashleigh"],
      bottom: [],
      left: ["Alex S", "Emily", "Christina", "Jackson"],
    },
  },
  // Third
  {
    name: "Table 3.1",
    rotate: true,
    x: thirdColumnX,
    y: firstTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["Phillip", "Ann", "Caryn", "David L"],
      bottom: [],
      left: ["Peter", "Tine", "Graham", "Robyn"],
    },
  },
  {
    name: "Table 3.2",
    rotate: true,
    x: thirdColumnX,
    y: secondTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["Linda", "Steve B", "Jon B", "Jen B"],
      bottom: [],
      left: ["Lynn V", "David V", "Andy V", "Kathryn"],
    },
  },
  {
    name: "Table 3.3",
    rotate: true,
    x: thirdColumnX,
    y: thirdTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["Tash Y", "Hannah", "Rohan"],
      bottom: [],
      left: ["Jac D", "Carien", "Jason"],
    },
  },
  {
    name: "Table 3.4",
    rotate: true,
    x: thirdColumnX,
    y: fourthTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["Claire", "Anna", "Kate"],
      bottom: [],
      left: ["Josh", "Loz", "Erin F"],
    },
  },
  // Fourth
  {
    name: "Table 4.1",
    rotate: true,
    x: fourthColumnX,
    y: firstTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["Michelle W", "Bernie", "Dale", "Ben"],
      bottom: [],
      left: ["Bek R", "Kirsty", "Simon", "Sandy"],
    },
  },
  {
    name: "Table 4.2",
    rotate: true,
    x: fourthColumnX,
    y: secondTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["Taren", "Charlie", "Jess B", "Beth P"],
      bottom: [],
      left: ["Amanda", "Courtney", "Alex W", "Jordan"],
    },
  },
  {
    name: "Table 4.3",
    rotate: true,
    x: fourthColumnX,
    y: thirdTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["Sara", "Daniel T", "Blake", "Tahlia"],
      bottom: [],
      left: ["Arkie", "Tara", "Maddie", "Richard"],
    },
  },
];
