import { seatRadius } from "@/constants";
import { useSearch } from "@/contexts/SearchContext";
import { useMemo } from "react";

export const SeatComponent = ({
  key,
  centerX,
  centerY,
  seat,
  textPosition,
}: {
  key: string;
  centerX: number;
  centerY: number;
  seat: string | null;
  textPosition: "top" | "bottom" | "left" | "right";
}) => {
  const { search } = useSearch();
  const hasSearchMatch = useMemo(
    () => search && seat?.toLowerCase().includes(search.toLowerCase()),
    [search, seat]
  );

  if (!seat) return null;

  const textX =
    textPosition === "top"
      ? centerX
      : textPosition === "bottom"
        ? centerX
        : textPosition === "left"
          ? centerX - seatRadius - 5
          : centerX + seatRadius + 5;
  const textY =
    textPosition === "top"
      ? centerY - seatRadius - 5
      : textPosition === "bottom"
        ? centerY + seatRadius + 12
        : textPosition === "left"
          ? centerY + 4
          : centerY + 4;
  const textAnchor =
    textPosition === "top"
      ? "middle"
      : textPosition === "bottom"
        ? "middle"
        : textPosition === "left"
          ? "end"
          : "start";

  const textFontSize = 20;
  const textFill = "#000";

  return (
    <g key={key} strokeWidth="0">
      <circle
        cx={centerX}
        cy={centerY}
        r={seatRadius}
        stroke="#000"
        strokeWidth="1"
        fill={hasSearchMatch ? "var(--color-wedding-green-light)" : "none"}
      />
      {seat && (
        <>


          <text
            x={textX}
            y={textY}
            textAnchor={textAnchor}
            fontSize={textFontSize}
            fill={hasSearchMatch ? "var(--color-wedding-green)" : textFill}
          >
            {seat}
          </text>
        </>
      )}
    </g>
  );
};
