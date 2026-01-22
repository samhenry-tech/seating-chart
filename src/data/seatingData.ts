import {
  seatOffset,
  seatRadius,
  tableLength,
  tableMargin,
  tableWidth,
  textHeight,
  textOffset,
  textWidth,
} from "~/constants";
import type { Table } from "~/models/Table";

const bridalTableStartX = -tableLength;
const bridalTableY = textHeight + seatOffset + seatRadius * 2;

const bridalTables = [
  {
    x: bridalTableStartX,
    y: bridalTableY,
    tableWidth: tableLength,
    tableHeight: tableWidth,
    seats: {
      top: ["Tom", "Carter", "Dan", "Sam"],
      right: [],
      bottom: [],
      left: [],
    },
  },
  {
    x: 0,
    y: bridalTableY,
    tableWidth: tableLength,
    tableHeight: tableWidth,
    seats: {
      top: ["Soph", "Emily", "Jess", "Yaz"],
      right: [],
      bottom: [],
      left: [],
    },
  },
];

const seatSpacing = seatOffset + 2 * seatRadius + textOffset + textWidth;
const tableSpacing = tableWidth + 2 * (seatSpacing + tableMargin);
const secondColumnX = -tableMargin - seatSpacing - tableWidth;
const firstColumnX = secondColumnX - tableSpacing;
const thirdColumnX = secondColumnX + tableSpacing;
const fourthColumnX = thirdColumnX + tableSpacing;

const firstTableY = 200;
const secondTableY = firstTableY + tableLength;
const thirdTableY = secondTableY + tableLength;
const fourthTableY = thirdTableY + tableLength;

export const tables: Table<string>[] = [
  ...bridalTables,
  // First
  {
    x: firstColumnX,
    y: firstTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["right1", "right2", "right3", "right4"],
      bottom: [],
      left: ["left1", "left2", "left3", "left4"],
    },
  },
  {
    x: firstColumnX,
    y: secondTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["right1", "right2", "right3", "right4"],
      bottom: [],
      left: ["left1", "left2", "left3", "left4"],
    },
  },
  {
    x: firstColumnX,
    y: thirdTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["right1", "right2", "right3", "right4"],
      bottom: [],
      left: ["left1", "left2", "left3", "left4"],
    },
  },
  // Second
  {
    x: secondColumnX,
    y: firstTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["right1", "right2", "right3", "right4"],
      bottom: [],
      left: ["left1", "left2", "left3", "left4"],
    },
  },
  {
    x: secondColumnX,
    y: secondTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["right1", "right2", "right3", "right4"],
      bottom: [],
      left: ["left1", "left2", "left3", "left4"],
    },
  },
  {
    x: secondColumnX,
    y: thirdTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["right1", "right2", "right3", "right4"],
      bottom: [],
      left: ["left1", "left2", "left3", "left4"],
    },
  },
  {
    x: secondColumnX,
    y: fourthTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["right1", "right2", "right3", "right4"],
      bottom: [],
      left: ["left1", "left2", "left3", "left4"],
    },
  },
  // Third
  {
    x: thirdColumnX,
    y: firstTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["right1", "right2", "right3", "right4"],
      bottom: [],
      left: ["left1", "left2", "left3", "left4"],
    },
  },
  {
    x: thirdColumnX,
    y: secondTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["right1", "right2", "right3", "right4"],
      bottom: [],
      left: ["left1", "left2", "left3", "left4"],
    },
  },
  {
    x: thirdColumnX,
    y: thirdTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["right1", "right2", "right3", "right4"],
      bottom: [],
      left: ["left1", "left2", "left3", "left4"],
    },
  },
  {
    x: thirdColumnX,
    y: fourthTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["right1", "right2", "right3", "right4"],
      bottom: [],
      left: ["left1", "left2", "left3", "left4"],
    },
  },
  // Fourth
  {
    x: fourthColumnX,
    y: firstTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["right1", "right2", "right3", "right4"],
      bottom: [],
      left: ["left1", "left2", "left3", "left4"],
    },
  },
  {
    x: fourthColumnX,
    y: secondTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["right1", "right2", "right3", "right4"],
      bottom: [],
      left: ["left1", "left2", "left3", "left4"],
    },
  },
  {
    x: fourthColumnX,
    y: thirdTableY,
    tableWidth: tableWidth,
    tableHeight: tableLength,
    seats: {
      top: [],
      right: ["right1", "right2", "right3", "right4"],
      bottom: [],
      left: ["left1", "left2", "left3", "left4"],
    },
  },
];
