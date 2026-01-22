import { useSearch } from "~/contexts/SearchContext";
import { seatRadius, showHelpers, textFontSize, textOffset, textWidth } from "~/utils/seatingConstants";
import { useMemo } from "react";

const textFill = "#000";

export const SeatComponent = ({
  centerX,
  centerY,
  seat,
  textPosition,
}: {
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
  const { textX, textY, anchor } = getTextCoordinates(textPosition, centerX, centerY);

  if (!seat) return null;

  return (
    <g strokeWidth="0">
      <circle
        cx={centerX}
        cy={centerY}
        r={seatRadius - 1}
        stroke="#000"
        strokeWidth="1"
        fill={hasSearchMatch ? "var(--color-wedding-green-light)" : "none"}
      />
      {seat && (
        <>
          {showHelpers && (
            <rect
              x={anchor === "middle" ? textX - textWidth / 2 : anchor === "end" ? textX - textWidth : textX}
              y={textY - textFontSize / 2}
              width={textWidth}
              height={textFontSize}
              stroke="black"
              strokeWidth="1"
            />
          )}

          <text
            x={textX}
            y={textY}
            textAnchor={anchor}
            dominantBaseline="middle"
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

const getTextCoordinates = (
  textPosition: "top" | "bottom" | "left" | "right",
  centerX: number,
  centerY: number
) => {
  if (textPosition === "top") {
    return {
      textX: centerX,
      textY: centerY - seatRadius - textOffset - textFontSize / 2,
      anchor: "middle" as const,
    };
  }
  if (textPosition === "bottom") {
    return {
      textX: centerX,
      textY: centerY + seatRadius + textOffset + textFontSize / 2,
      anchor: "middle" as const,
    };
  }
  if (textPosition === "left") {
    return {
      textX: centerX - seatRadius - textOffset,
      textY: centerY,
      anchor: "end" as const,
    };
  }
  return {
    textX: centerX + seatRadius + textOffset,
    textY: centerY,
    anchor: "start" as const,
  };
};
