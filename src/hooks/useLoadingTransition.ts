import { useState, useEffect } from 'react';

interface UseLoadingTransitionOptions {
  delay?: number;
  minimumLoadingTime?: number;
}

export function useLoadingTransition(
  isLoading: boolean,
  options: UseLoadingTransitionOptions = {}
) {
  const { delay = 200, minimumLoadingTime = 500 } = options;
  const [showLoading, setShowLoading] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let delayTimeout: NodeJS.Timeout;
    let minimumTimeout: NodeJS.Timeout;

    if (isLoading) {
      setStartTime(Date.now());
      delayTimeout = setTimeout(() => {
        setShowLoading(true);
      }, delay);
    } else {
      const elapsedTime = startTime ? Date.now() - startTime : 0;
      const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);

      if (showLoading) {
        minimumTimeout = setTimeout(() => {
          setShowLoading(false);
          setStartTime(null);
        }, remainingTime);
      }
    }

    return () => {
      clearTimeout(delayTimeout);
      clearTimeout(minimumTimeout);
    };
  }, [isLoading, delay, minimumLoadingTime, startTime]);

  return showLoading;
} 