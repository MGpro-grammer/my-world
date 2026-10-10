import { describe, expect, it } from "vitest";
import {
  INTRO_APPEAR_MS,
  INTRO_DURATION_MS,
  introReducer,
  type IntroAction,
  type IntroStatus,
} from "./introState.ts";

describe("introReducer", () => {
  it.each<[IntroStatus, IntroAction, IntroStatus]>([
    ["intro", "skip", "revealing"],
    ["intro", "timeout", "revealing"],
    ["intro", "fadeEnd", "intro"],
    ["revealing", "skip", "revealing"],
    ["revealing", "timeout", "revealing"],
    ["revealing", "fadeEnd", "ready"],
    ["ready", "skip", "ready"],
    ["ready", "timeout", "ready"],
    ["ready", "fadeEnd", "ready"],
    ["intro", "alreadySeen", "ready"],
    ["revealing", "alreadySeen", "revealing"],
    ["ready", "alreadySeen", "ready"],
  ])("goes from %s on %s to %s", (status, action, expected) => {
    expect(introReducer(status, action)).toBe(expected);
  });

  it("lets the welcome text appear fully before it starts to fade", () => {
    expect(INTRO_APPEAR_MS).toBeLessThan(INTRO_DURATION_MS);
  });
});
