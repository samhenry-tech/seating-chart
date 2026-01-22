import { showHelpers } from "~/constants";
import { useSearch } from "~/contexts/SearchContext";
import { tablesWithSeats } from "~/data/tablesWithSeats";
import { getMatchingSeatCoordinates } from "~/utils/searchHelpers";
import { getSize } from "~/utils/sizingUtils";
import { useEffect, useMemo, useRef } from "react";
import { useWindowSize } from "react-use";
import { TransformComponent, TransformWrapper, type ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { SearchBox } from "../molecule/SearchBox";
import { TableComponent } from "./TableComponent";

const chartMargin = 50;

const chartSize = getSize(tablesWithSeats);
const viewBox = `0 0 ${chartSize.width} ${chartSize.height}`;

export const SeatingChart = () => {
  const { width, height } = useWindowSize();
  const marginX = width * (chartMargin / 100);
  const marginY = height * (chartMargin / 100);

  const transformWrapperRef = useRef<ReactZoomPanPinchRef>(null);
  const { search, setSearch } = useSearch();

  const intialScale = useMemo(
    () => Math.min(width / chartSize.width, height / chartSize.height),
    [width, height]
  );

  useEffect(() => {
    const matches = getMatchingSeatCoordinates(tablesWithSeats, search);
    if (matches.length === 1 && matches[0]) {
      const [match] = matches;
      const { centerX, centerY } = match;
      transformWrapperRef.current?.setTransform(
        -centerX - marginX + width / 2,
        -centerY - marginY + height / 2,
        1,
        1000,
        "easeInOutCubic"
      );
      console.log("match", match, centerX, centerY);
    }
  }, [height, marginX, marginY, search, width]);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (e.target.value.length === 0) {
      transformWrapperRef.current?.centerView(intialScale, 1000, "easeInOutCubic");
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
          initialScale={intialScale}
          centerOnInit={true}
          maxScale={1}
          centerZoomedOut={true}
          doubleClick={{ disabled: true }}
          wheel={{ step: 10 }}
        >
          <TransformComponent wrapperClass="!w-full !h-full">
            <svg
              viewBox={viewBox}
              width={chartSize.width}
              height={chartSize.height}
              style={{
                margin: `${marginY}px ${marginX}px`,
              }}
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
