/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { RefObject, useEffect, useMemo, useState } from 'react';

export function useOnScreen(ref: RefObject<HTMLElement>) {
  const [isIntersecting, setIntersecting] = useState(false);

  const observer = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting));
    }
    return undefined;
  }, [ref?.current]);

  useEffect(() => {
    if (observer && ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (observer) observer.disconnect();
    };
  }, [ref?.current]);

  return isIntersecting;
}
