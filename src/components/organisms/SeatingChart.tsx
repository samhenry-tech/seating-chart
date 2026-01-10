import { useSearch } from "@/contexts/SearchContext";
import { tablesWithSeats } from "@/data/tablesWithSeats";
import type { TableWithSeats } from "@/models/Table";
import { getMatchingSeatCoordinates } from "@/utils/searchHelpers";
import { useEffect, useRef } from "react";
import { TransformComponent, TransformWrapper, type ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { SearchBox } from "../molecule/SearchBox";
import { TableComponent } from "./TableComponent";

export const SeatingChart = () => {
  const { search, setSearch } = useSearch();
  const transformWrapperRef = useRef<ReactZoomPanPinchRef>(null);

  useEffect(() => {
    const matches = getMatchingSeatCoordinates(tablesWithSeats, search);
    if (matches.length === 1 && matches[0]) {
      const [match] = matches;
      const { centerX, centerY } = match;
      transformWrapperRef.current?.setTransform(0, -45, 3, 1000, "easeOutCubic");
      console.log("match", match, centerX, centerY);
    }
  }, [search]);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (e.target.value.length === 0) {
      transformWrapperRef.current?.resetTransform(1000, "easeOutCubic");
    }
  };

  return (
    <>
      <section className="w-full overflow-hidden">
        <TransformWrapper
          zoomAnimation={{ animationTime: 5000, animationType: "easeInOutCubic" }}
          velocityAnimation={{ animationTime: 5000, animationType: "easeInOutCubic" }}
          alignmentAnimation={{ animationTime: 5000, animationType: "easeInOutCubic" }}
          ref={transformWrapperRef}
          centerZoomedOut={true}
          initialScale={1.3}
          doubleClick={{ disabled: true }}
          wheel={{ step: 10 }}
        >
          <TransformComponent wrapperClass="!w-full !h-full" contentClass="!origin-top">
            <svg
              viewBox={getViewBox(tablesWithSeats)}
              width="100%"
              height="100%"
              className="px-[15vw] py-[15vh]"
            >
              <g>
                {tablesWithSeats.map((table, i) => (
                  <TableComponent key={i} table={table} />
                ))}
              </g>
            </svg>
          </TransformComponent>
        </TransformWrapper>
      </section>
      <SearchBox
        className="fixed bottom-5 left-1/2 w-[calc(100%-2.5rem)] max-w-md -translate-x-1/2"
        value={search}
        onChange={onSearchChange}
      />
    </>
  );
};

const seatOffset = 10;
const seatRadius = 10;
const seatExtension = seatOffset + seatRadius;
const textBuffer = 60; // Buffer for text labels extending beyond seats

const getViewBox = (tables: TableWithSeats[]) => {
  if (tables.length === 0) return "0 0 1200 1300";

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  tables.forEach((table) => {
    // Calculate table bounds
    const tableLeft = table.x;
    const tableRight = table.x + table.tableWidth;
    const tableTop = table.y;
    const tableBottom = table.y + table.tableHeight;

    // Extend bounds based on which sides have seats (including text buffer)
    const leftExtend = table.seats.left.length > 0 ? seatExtension + textBuffer : 0;
    const rightExtend = table.seats.right.length > 0 ? seatExtension + textBuffer : 0;
    const topExtend = table.seats.top.length > 0 ? seatExtension + textBuffer : 0;
    const bottomExtend = table.seats.bottom.length > 0 ? seatExtension + textBuffer : 0;

    minX = Math.min(minX, tableLeft - leftExtend);
    maxX = Math.max(maxX, tableRight + rightExtend);
    minY = Math.min(minY, tableTop - topExtend);
    maxY = Math.max(maxY, tableBottom + bottomExtend);
  });

  const width = maxX - minX;
  const height = maxY - minY;

  return `0 0 ${width} ${height}`;
};
