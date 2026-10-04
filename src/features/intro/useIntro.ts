import { useEffect, useReducer } from "react";
import { INTRO_DURATION_MS, INTRO_FADE_MS, introReducer, type IntroStatus } from "./introState.ts";

/** Session storage key remembering that the welcome screen was already shown. */
const SEEN_KEY = "my-world:intro-seen";

/** What the home page needs from the welcome screen. */
export interface Intro {
  /** Current state of the welcome screen. */
  readonly status: IntroStatus;
  /** Ends the welcome screen early (click, tap). */
  readonly skip: () => void;
}

/**
 * Runs the welcome screen: shown once per visit, it fades out by itself after
 * a few seconds, or right away on a click, a tap or any key.
 * @returns Its current state and a way to skip it.
 */
export function useIntro(): Intro {
  const [status, dispatch] = useReducer(introReducer, undefined, () =>
    hasSeenIntro() ? "ready" : "intro",
  );

  useEffect(() => {
    if (status === "intro") {
      const timer = window.setTimeout(() => dispatch("timeout"), INTRO_DURATION_MS);
      const handleKeyDown = () => dispatch("skip");
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.clearTimeout(timer);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
    if (status === "revealing") {
      rememberIntroSeen();
      const timer = window.setTimeout(() => dispatch("fadeEnd"), INTRO_FADE_MS);
      return () => window.clearTimeout(timer);
    }
  }, [status]);

  return { status, skip: () => dispatch("skip") };
}

/** Tells whether the welcome screen was already shown during this visit. */
function hasSeenIntro(): boolean {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === "true";
  } catch {
    // Storage can be blocked (private browsing, strict settings): show the intro.
    return false;
  }
}

/** Remembers, until the tab is closed, that the welcome screen was shown. */
function rememberIntroSeen(): void {
  try {
    window.sessionStorage.setItem(SEEN_KEY, "true");
  } catch {
    // Not remembered: the intro will simply play again on the next visit.
  }
}
