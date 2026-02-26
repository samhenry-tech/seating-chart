import clsx from "clsx";
import { HiArrowRight, HiXMark } from "react-icons/hi2";
import { clamp } from "../CenteredPinchZoom/centeredPinchZoomUtils";

export const SearchBox = ({
  className,
  value,
  onChange,
  current,
  totalCount,
  onNext,
}: {
  className?: string;
  current: number;
  totalCount: number | null;
  onNext: () => void;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const handleClear = () => {
    if (onChange) {
      const syntheticEvent = {
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  const clampedCurrent = clamp(current + 1, 0, totalCount ?? 0);

  return (
    <div className={clsx("flex h-15 gap-3", className)}>
      <div
        className={clsx(
          "ring-wedding-green-light focus:ring-wedding-green-light flex h-full grow items-center gap-1 rounded-full bg-white shadow-xl ring-1 transition-all hover:shadow-xl focus:border-transparent focus:ring-2 focus:outline-none"
        )}
      >
        <input
          type="text"
          name="search"
          placeholder="Enter your name"
          className="ml-4 grow border-0 focus:border-0 focus:ring-0 focus:outline-none"
          value={value}
          onChange={onChange}
        />
        <span
          className={clsx(
            "text-wedding-green text-sm transition-opacity",
            totalCount != null ? "opacity-100" : "opacity-0"
          )}
        >
          {clampedCurrent}/{totalCount ?? 0}
        </span>
        {
          <button
            type="button"
            onClick={onNext}
            className="flex aspect-square h-full grow-0 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100"
            aria-label="Clear search"
          >
            <HiArrowRight className="aspect-square h-[40%] w-auto" />
          </button>
        }
      </div>
      <button
        type="button"
        onClick={handleClear}
        className="ring-wedding-green-light flex aspect-square h-full grow-0 items-center justify-center rounded-full bg-white text-gray-600 ring-1 transition-colors hover:bg-gray-100"
        aria-label="Clear search"
      >
        <HiXMark className="aspect-square h-[40%] w-auto" />
      </button>
    </div>
  );
};
