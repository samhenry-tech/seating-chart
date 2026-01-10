import clsx from "clsx";
import { HiXMark } from "react-icons/hi2";

export const SearchBox = ({
  className,
  value,
  onChange,
}: {
  className?: string;
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

  return (
    <div
      className={clsx(
        "ring-wedding-green-light focus:ring-wedding-green-light flex h-15 items-center rounded-full bg-white shadow-xl ring-1 transition-all hover:shadow-xl focus:border-transparent focus:ring-2 focus:outline-none",
        className
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
      {
        <button
          type="button"
          onClick={handleClear}
          className="flex aspect-square h-full grow-0 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-300"
          aria-label="Clear search"
        >
          <HiXMark className="aspect-square h-[40%] w-auto" />
        </button>
      }
    </div>
  );
};
