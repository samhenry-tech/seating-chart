import { useSearch } from "~/contexts/SearchContext";
import { tablesWithSeats } from "~/data/tablesWithSeats";
import { getMatchingSeatCoordinates } from "~/utils/searchHelpers";
import { showHelpers } from "~/utils/seatingConstants";
import { getSize } from "~/utils/sizingUtils";
import { useEffect, useMemo, useRef } from "react";
// import { useWindowSize } from "react-use";
// import { useViewportSize } from "react-window-size-listener";
import { TransformComponent, TransformWrapper, type ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { SearchBox } from "../molecule/SearchBox";
import { TableComponent } from "./TableComponent";

const chartMargin = 50;

const maxScale = 1;

const chartSize = getSize(tablesWithSeats);
const viewBox = `0 0 ${chartSize.width} ${chartSize.height}`;

const width = window.innerWidth;
const height = document.documentElement.clientHeight;

export const SeatingChart = () => {
  // const { height: viewportHeight } = useViewportSize();
  const marginX = width * (chartMargin / 100);
  const marginY = height * (chartMargin / 100);

  const transformWrapperRef = useRef<ReactZoomPanPinchRef>(null);
  const { search, setSearch } = useSearch();

  const intialScale = useMemo(
    () => Math.min(width / chartSize.width, (height - 72 - 65) / chartSize.height),
    [width, height]
  );

  useEffect(() => {
    const matches = getMatchingSeatCoordinates(tablesWithSeats, search);
    if (matches.length === 1 && matches[0]) {
      const [match] = matches;
      const { centerX, centerY, seat } = match;
      // setSearch(seat);
      transformWrapperRef.current?.setTransform(
        -centerX - marginX + width / 2,
        -centerY - marginY + height / 2,
        maxScale,
        1000,
        "easeInOutCubic"
      );
      // blurActiveElement();
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
      {showHelpers && (
        <>
          <div className="absolute left-1/2 z-200 box-border h-full w-px border" />
          <div className="absolute top-1/2 z-200 box-border h-px w-full border" />
        </>
      )}
      <section className="w-full overflow-hidden">
        <TransformWrapper
          zoomAnimation={{ animationTime: 5000, animationType: "easeInOutCubic" }}
          velocityAnimation={{ animationTime: 5000, animationType: "easeInOutCubic" }}
          alignmentAnimation={{ animationTime: 5000, animationType: "easeInOutCubic" }}
          ref={transformWrapperRef}
          initialScale={intialScale}
          centerOnInit={true}
          maxScale={maxScale}
          minScale={0.00001}
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
        className="absolute bottom-5 left-1/2 z-200 w-[calc(100%-2.5rem)] max-w-md -translate-x-1/2"
        value={search}
        onChange={onSearchChange}
      />
    </>
  );
};

const blurActiveElement = () =>
  document.activeElement instanceof HTMLElement && document.activeElement.blur();
