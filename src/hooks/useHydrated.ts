import { useSyncExternalStore } from "react";

/**
 * Tells whether the page is ready to depend on the visitor's address bar.
 *
 * A prerendered page is built from its address without query string (`?…`).
 * While React takes it over, it must draw exactly the same thing, so anything
 * read from the query string has to wait until then.
 * @returns `false` while the page is prerendered and while React takes it
 *   over; `true` right after, and from the start for a page drawn in the
 *   browser.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * The value never changes once in the browser: there is nothing to watch.
 * @returns A function that does nothing.
 */
function subscribe(): () => void {
  return () => {};
}

/** @returns `true`: the page is in the browser. */
function getSnapshot(): boolean {
  return true;
}

/** @returns `false`: the page is being prerendered or taken over. */
function getServerSnapshot(): boolean {
  return false;
}
