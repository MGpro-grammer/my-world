/**
 * State of the welcome screen, as drawn in the Phase 3 state diagram.
 *
 * State pattern, in its React form: a union of states and a reducer.
 * - `intro`: the welcome text covers the whole screen;
 * - `revealing`: it fades out and uncovers the dots and the bubbles;
 * - `ready`: it is gone, the home page is usable.
 */
export type IntroStatus = "intro" | "revealing" | "ready";

/** What can happen to the welcome screen. */
export type IntroAction =
  /** The visitor clicked, tapped or pressed a key. */
  | "skip"
  /** The welcome text has been shown long enough. */
  | "timeout"
  /** The fade-out is over. */
  | "fadeEnd";

/** Duration of the fade-in of the welcome text, in milliseconds. */
export const INTRO_APPEAR_MS = 1400;

/** Time before the fade-out starts, counted from the opening of the page, in milliseconds. */
export const INTRO_DURATION_MS = 4500;

/** Duration of the fade-out, in milliseconds. */
export const INTRO_FADE_MS = 1600;

/**
 * Gives the next state of the welcome screen. Pure function: easy to test.
 * @param status - Current state.
 * @param action - What just happened.
 * @returns The new state; unchanged when the action does not apply.
 */
export function introReducer(status: IntroStatus, action: IntroAction): IntroStatus {
  switch (action) {
    case "skip":
    case "timeout":
      return status === "intro" ? "revealing" : status;
    case "fadeEnd":
      return status === "revealing" ? "ready" : status;
  }
}
