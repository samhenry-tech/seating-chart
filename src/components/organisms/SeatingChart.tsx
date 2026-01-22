import { showHelpers } from "~/constants";
import { useSearch } from "~/contexts/SearchContext";
import { tablesWithSeats } from "~/data/tablesWithSeats";
import { getMatchingSeatCoordinates } from "~/utils/searchHelpers";
import { getSize } from "~/utils/sizingUtils";
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

  const { width, height } = getSize(tablesWithSeats);
  const viewBox = `-${width / 2} 0 ${width} ${height}`;

  return (
    <>
      <section className="w-full overflow-hidden">
        <TransformWrapper
          zoomAnimation={{ animationTime: 5000, animationType: "easeInOutCubic" }}
          velocityAnimation={{ animationTime: 5000, animationType: "easeInOutCubic" }}
          alignmentAnimation={{ animationTime: 5000, animationType: "easeInOutCubic" }}
          ref={transformWrapperRef}
          initialScale={1}
          doubleClick={{ disabled: true }}
          wheel={{ step: 10 }}
        >
          <TransformComponent
            wrapperClass="!w-full !h-full border border-blue-300"
            contentClass="border border-red-300"
          >
            <svg
              viewBox={viewBox}
              width={width}
              height={height}
              className="mx-[15vw] my-[15vh] border border-green-300"
            >
              <g>
                {showHelpers && <line x1={0} y1={0} x2={0} y2={10000} stroke="black" strokeWidth={1} />}
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
