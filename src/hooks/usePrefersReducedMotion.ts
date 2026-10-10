import { useSyncExternalStore } from "react";

/** Media query matching visitors who asked their system to reduce animations. */
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Tells whether the visitor asked their operating system to reduce animations.
 * The value updates live if the setting changes while the page is open.
 *
 * Observer: React subscribes to the media query while a component uses the
 * hook, and unsubscribes when none does.
 * @returns `true` when animations should be reduced or disabled; always
 *   `false` while the page is prerendered, as there is no visitor yet.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Calls `onChange` each time the setting changes.
 * @param onChange - Given by React.
 * @returns A function that stops listening.
 */
function subscribe(onChange: () => void): () => void {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

/** @returns The current setting in the browser. */
function getSnapshot(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** @returns The value used while prerendering: full motion. */
function getServerSnapshot(): boolean {
  return false;
}
