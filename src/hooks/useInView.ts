import { useEffect, useState, type RefObject } from "react";

/** Visibility of an element on the screen. */
export interface InViewState {
  /** The element is on the screen (or within the margin) right now. */
  readonly isInView: boolean;
  /** The element has been on the screen at least once; never goes back to `false`. */
  readonly hasBeenInView: boolean;
}

/** Visibility before the first measure. */
const NOT_SEEN: InViewState = { isInView: false, hasBeenInView: false };

/**
 * Tells whether an element is on the screen, and whether it has ever been.
 *
 * Observer: an `IntersectionObserver` watches the element while the component
 * is mounted and is disconnected when it unmounts.
 * @param ref - Reference to the element to watch.
 * @param rootMargin - Margin added around the screen, in CSS syntax (e.g. `"200px"`),
 *   so that the element counts as visible a little before it really is.
 * @returns Its current and past visibility.
 */
export function useInView(ref: RefObject<Element | null>, rootMargin = "0px"): InViewState {
  const [state, setState] = useState<InViewState>(NOT_SEEN);

  useEffect(() => {
    const element = ref.current;
    if (element === null) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isInView = entry.isIntersecting;
        setState((previous) =>
          previous.isInView === isInView
            ? previous
            : { isInView, hasBeenInView: previous.hasBeenInView || isInView },
        );
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return state;
}
