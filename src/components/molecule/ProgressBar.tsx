import { useTimedProgress } from "~/utils/utils";
import clsx from "clsx";

interface ProgressBarProps {
  duration: number; // in milliseconds
  className?: string;
}

export const ProgressBar = ({ duration, className }: ProgressBarProps) => {
  const progress = useTimedProgress(duration);

  return (
    <section className={clsx("w-full overflow-hidden", className)}>
      <div className="h-px w-full overflow-hidden rounded-full bg-gray-200">
        <span
          className="block h-full bg-current"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </section>
  );
};
