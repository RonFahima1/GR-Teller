'use client';

import { useEffect, useRef } from 'react';

export function useScreenReader() {
  const liveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const liveElement = liveRef.current;
    if (liveElement) {
      liveElement.innerHTML = '';
    }
  }, []);

  const announce = (message: string) => {
    const liveElement = liveRef.current;
    if (liveElement) {
      liveElement.innerHTML = message;
    }
  };

  return { announce };
}
