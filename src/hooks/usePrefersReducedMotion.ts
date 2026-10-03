import { useEffect, useState } from "react";

/** Media query matching visitors who asked their system to reduce animations. */
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Tells whether the visitor asked their operating system to reduce animations.
 * The value updates live if the setting changes while the page is open.
 *
 * Observer: subscribes to the media query on mount and unsubscribes on unmount.
 * @returns `true` when animations should be reduced or disabled.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}
