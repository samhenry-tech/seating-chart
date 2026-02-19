import { useSearch } from "~/contexts/SearchContext";
import { tablesWithSeats } from "~/data/tablesWithSeats";
import { getMatchingSeatCoordinates } from "~/utils/searchHelpers";
import { showHelpers } from "~/utils/seatingConstants";
import { getSize } from "~/utils/sizingUtils";
import clsx from "clsx";
import { useEffect, useMemo, useRef } from "react";
// import { useWindowSize } from "react-use";
// import { useViewportSize } from "react-window-size-listener";
// import { TransformComponent, TransformWrapper, type ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { CenteredPinchZoom, type CenteredPinchZoomHandle } from "../CenteredPinchZoom/CenteredPinchZoom";
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

  const centeredPinchZoomRef = useRef<CenteredPinchZoomHandle>(null);
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
      const seatOffset = getSeatOffset(centerX, centerY, chartSize.width, chartSize.height);
      centeredPinchZoomRef.current?.setPosition({
        x: -seatOffset.x * maxScale,
        y: -seatOffset.y * maxScale,
        scale: maxScale,
      });
      // blurActiveElement();
    }
  }, [height, marginX, marginY, search, width]);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (e.target.value.length === 0) {
      centeredPinchZoomRef.current?.resetPosition();
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
        <CenteredPinchZoom
          ref={centeredPinchZoomRef}
          className="h-full w-full"
          initialZoom={intialScale}
          maxZoom={maxScale}
          minZoom={0.00001}
          animationDuration={1000}
          animationEasing="ease-in-out"
        >
          <svg
            className={clsx(showHelpers && "border border-red-400")}
            viewBox={viewBox}
            width={chartSize.width}
            height={chartSize.height}
          >
            <g>
              {showHelpers && <line x1={0} y1={0} x2={0} y2={10000} stroke="black" strokeWidth={1} />}
              {tablesWithSeats.map((table, i) => (
                <TableComponent key={i} table={table} />
              ))}
            </g>
          </svg>
        </CenteredPinchZoom>
      </section>
      <SearchBox
        className="absolute bottom-5 left-1/2 z-100 w-[calc(100%-2.5rem)] max-w-md -translate-x-1/2"
        value={search}
        onChange={onSearchChange}
      />
    </>
  );
};

const getSeatOffset = (seatX: number, seatY: number, chartWidth: number, chartHeight: number) => {
  return {
    x: seatX - chartWidth / 2,
    y: seatY - chartHeight / 2,
  };
};
