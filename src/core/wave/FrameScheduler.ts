/**
 * Plans work for the next screen refresh.
 *
 * The wave scene depends on this interface instead of calling
 * `requestAnimationFrame` directly, so tests can drive frames one by one.
 */
export interface FrameScheduler {
  /**
   * Asks for a callback before the next screen refresh.
   * @param callback - Function to run, given the frame time in milliseconds.
   * @returns An identifier that {@link cancel} accepts.
   */
  request(callback: (time: number) => void): number;

  /**
   * Cancels a callback that has not run yet.
   * @param id - Identifier returned by {@link request}.
   */
  cancel(id: number): void;
}

/** {@link FrameScheduler} backed by the browser's `requestAnimationFrame`. */
export class AnimationFrameScheduler implements FrameScheduler {
  request(callback: (time: number) => void): number {
    return window.requestAnimationFrame(callback);
  }

  cancel(id: number): void {
    window.cancelAnimationFrame(id);
  }
}
