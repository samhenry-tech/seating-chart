import { seatRadius } from "@/constants";
import { useSearch } from "@/contexts/SearchContext";

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
  const textFontSize = 12;
  const textFill = "#000";

  // Highlight matching text
  const renderHighlightedText = (text: string, searchTerm: string) => {
    if (!searchTerm) {
      return <tspan>{text}</tspan>;
    }

    const lowerText = text.toLowerCase();
    const lowerSearch = searchTerm.toLowerCase();
    const index = lowerText.indexOf(lowerSearch);

    if (index === -1) {
      return <tspan>{text}</tspan>;
    }

    const before = text.substring(0, index);
    const match = text.substring(index, index + searchTerm.length);
    const after = text.substring(index + searchTerm.length);

    return (
      <>
        {before && <tspan>{before}</tspan>}
        <tspan fill="#1c8f7a" fontWeight="bold">
          {match}
        </tspan>
        {after && <tspan>{after}</tspan>}
      </>
    );
  };

  return (
    <g key={key}>
      <circle cx={centerX} cy={centerY} r={seatRadius} stroke="#000" strokeWidth="1" fill="none" />
      {seat && (
        <text x={textX} y={textY} textAnchor={textAnchor} fontSize={textFontSize} fill={textFill}>
          {renderHighlightedText(seat, search)}
        </text>
      )}
    </g>
  );
};
