import { describe, expect, it } from "vitest";
import {
  bubbleReducer,
  INITIAL_BUBBLE_STATE,
  isExpanded,
  type BubbleState,
} from "./bubbleState.ts";

const expandedWordeul: BubbleState = { status: "expanded", bubbleId: "wordeul" };

describe("bubbleReducer", () => {
  it("opens a bubble on hover, focus or first tap", () => {
    expect(bubbleReducer(INITIAL_BUBBLE_STATE, { type: "expand", bubbleId: "wordeul" })).toEqual(
      expandedWordeul,
    );
  });

  it("keeps the same object when the open bubble is expanded again", () => {
    expect(bubbleReducer(expandedWordeul, { type: "expand", bubbleId: "wordeul" })).toBe(
      expandedWordeul,
    );
  });

  it("switches to another bubble: at most one is open", () => {
    expect(bubbleReducer(expandedWordeul, { type: "expand", bubbleId: "contact" })).toEqual({
      status: "expanded",
      bubbleId: "contact",
    });
  });

  it("closes the open bubble when the pointer or the focus leaves it", () => {
    expect(bubbleReducer(expandedWordeul, { type: "collapse", bubbleId: "wordeul" })).toBe(
      INITIAL_BUBBLE_STATE,
    );
  });

  it("ignores the collapse of a bubble that is not the open one", () => {
    expect(bubbleReducer(expandedWordeul, { type: "collapse", bubbleId: "contact" })).toBe(
      expandedWordeul,
    );
  });

  it("closes everything on a tap outside the bubbles", () => {
    expect(bubbleReducer(expandedWordeul, { type: "collapseAll" })).toBe(INITIAL_BUBBLE_STATE);
    expect(bubbleReducer(INITIAL_BUBBLE_STATE, { type: "collapseAll" })).toBe(INITIAL_BUBBLE_STATE);
  });

  it("goes to navigating on a click, Enter or second tap, and stays there", () => {
    const navigating = bubbleReducer(expandedWordeul, { type: "navigate", bubbleId: "wordeul" });
    expect(navigating).toEqual({ status: "navigating", bubbleId: "wordeul" });
    expect(bubbleReducer(navigating, { type: "collapse", bubbleId: "wordeul" })).toBe(navigating);
    expect(bubbleReducer(navigating, { type: "collapseAll" })).toBe(navigating);
  });
});

describe("isExpanded", () => {
  it("shows the panel of the open or navigating bubble only", () => {
    expect(isExpanded(expandedWordeul, "wordeul")).toBe(true);
    expect(isExpanded(expandedWordeul, "contact")).toBe(false);
    expect(isExpanded({ status: "navigating", bubbleId: "wordeul" }, "wordeul")).toBe(true);
    expect(isExpanded(INITIAL_BUBBLE_STATE, "wordeul")).toBe(false);
  });
});
