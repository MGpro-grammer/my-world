import { useEffect, useState, type RefObject } from "react";

/** Width and height of an element, in CSS pixels. */
export interface ElementSize {
  readonly width: number;
  readonly height: number;
}

/**
 * Returns the current size of an element and updates it when it changes.
 *
 * Observer: a `ResizeObserver` watches the element while the component is
 * mounted and is disconnected when it unmounts.
 * @param ref - Reference to the element to measure.
 * @returns Its size; `{ width: 0, height: 0 }` until the first measure.
 */
export function useElementSize(ref: RefObject<Element | null>): ElementSize {
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (element === null) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((previous) =>
        previous.width === width && previous.height === height ? previous : { width, height },
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
