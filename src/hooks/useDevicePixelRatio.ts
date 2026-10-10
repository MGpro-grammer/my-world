import { useSyncExternalStore } from "react";

/**
 * Returns the ratio between device pixels and CSS pixels of the screen
 * showing the page. The value updates live when the window moves to a screen
 * with another scaling, or when the visitor zooms in or out.
 *
 * Observer: watches a media query that only matches the current ratio, and
 * watches again with the new ratio each time it changes.
 * @returns The current `window.devicePixelRatio`; `1` while the page is
 *   prerendered, as there is no screen yet.
 */
export function useDevicePixelRatio(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Calls `onChange` each time the ratio changes.
 * @param onChange - Given by React.
 * @returns A function that stops listening.
 */
function subscribe(onChange: () => void): () => void {
  let mediaQuery = watchCurrentRatio();

  function handleChange() {
    mediaQuery.removeEventListener("change", handleChange);
    mediaQuery = watchCurrentRatio();
    onChange();
  }

  function watchCurrentRatio(): MediaQueryList {
    const query = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    query.addEventListener("change", handleChange);
    return query;
  }

  return () => mediaQuery.removeEventListener("change", handleChange);
}

/** @returns The current ratio in the browser. */
function getSnapshot(): number {
  return window.devicePixelRatio;
}

/** @returns The value used while prerendering. */
function getServerSnapshot(): number {
  return 1;
}
