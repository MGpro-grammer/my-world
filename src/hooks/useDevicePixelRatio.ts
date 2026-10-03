import { useEffect, useState } from "react";

/**
 * Returns the ratio between device pixels and CSS pixels of the screen
 * showing the page. The value updates live when the window moves to a screen
 * with another scaling, or when the visitor zooms in or out.
 *
 * Observer: watches a media query that only matches the current ratio, and
 * watches again with the new ratio each time it changes.
 * @returns The current `window.devicePixelRatio`.
 */
export function useDevicePixelRatio(): number {
  const [pixelRatio, setPixelRatio] = useState<number>(() => window.devicePixelRatio);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(resolution: ${pixelRatio}dppx)`);
    const handleChange = () => {
      setPixelRatio(window.devicePixelRatio);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [pixelRatio]);

  return pixelRatio;
}
