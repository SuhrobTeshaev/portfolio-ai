import { useEffect, useRef, useState } from 'react';

/**
 * Triggers when the target element enters the viewport.
 * Returns a [ref, isVisible] tuple — KISS, zero deps.
 */
export function useLazySection(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // fire once — no memory leak
        }
      },
      { rootMargin: '200px 0px', threshold: 0.01, ...options },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible] as const;
}
