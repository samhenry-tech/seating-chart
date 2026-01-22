import { useEffect, useState } from "react";

export const useTimedProgress = (duration: number) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const ratio = (Date.now() - start) / duration;
      setProgress(Math.min(ratio * 100, 100));
      if (ratio >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [duration]);

  return progress;
};
