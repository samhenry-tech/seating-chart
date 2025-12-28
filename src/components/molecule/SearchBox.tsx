import clsx from "clsx";

export const SearchBox = ({
  className,
  value,
  onChange,
}: {
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <input
      type="text"
      name="search"
      placeholder="Enter your name"
      className={clsx(
        className,
        "focus:ring-sam-green rounded-full border border-gray-200 bg-white px-6 py-3 shadow-lg transition-all hover:shadow-xl focus:border-transparent focus:ring-2 focus:outline-none"
      )}
      value={value}
      onChange={onChange}
    />
  );
};
