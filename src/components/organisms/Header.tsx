import { loadDelay, loadDuration, loadTransitionDuration } from "~/utils/timingConstants";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { ProgressBar } from "../molecule/ProgressBar";

export const Header = () => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isTransitionFinished, setIsTransitionFinished] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, loadDelay);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitionFinished(true);
    }, loadDelay + loadTransitionDuration);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {!isTransitionFinished && (
        <div
          className={clsx(
            "pointer-events-none fixed inset-0 z-50 bg-white transition-opacity ease-in-out",
            loadDuration,
            isInitialLoad ? "opacity-100" : "opacity-0"
          )}
        />
      )}

      <header
        className={clsx(
          "transition-height fixed inset-0 z-60 flex w-full items-center justify-center p-4 ease-in-out",
          loadDuration,
          isInitialLoad ? "h-full" : "h-18",
          isTransitionFinished && "bg-white"
        )}
      >
        <div className="z-70">
          <h1
            className={clsx(
              "text-wedding-red font-heading transition-text z-100 font-semibold ease-in-out",
              loadDuration,
              isInitialLoad ? "text-5xl md:text-7xl" : "text-2xl"
            )}
          >
            Find Your Seat
          </h1>
          <ProgressBar
            className={clsx(
              "text-wedding-red",
              "[transition:all_3000ms_ease-in-out,opacity_200ms_ease-in-out]",
              isInitialLoad ? "h-13 pt-10 opacity-100" : "h-0 pt-0 opacity-0"
            )}
            duration={loadDelay - 100}
          />
        </div>
        <section className="absolute top-0 h-18 w-full bg-white" />
      </header>
    </>
  );
};
