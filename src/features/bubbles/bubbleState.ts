/** Identifier of a bubble of the field: a project identifier, or `"contact"`. */
export type BubbleId = string;

/**
 * State of the bubble field, as drawn in the Phase 3 state diagram.
 *
 * State pattern, in its React form: a union of states and a reducer that
 * gives the next state for each action. At most one bubble is open at a time.
 */
export type BubbleState =
  | { readonly status: "idle" }
  | { readonly status: "expanded"; readonly bubbleId: BubbleId }
  | { readonly status: "navigating"; readonly bubbleId: BubbleId };

/** Something that happened to the bubbles. */
export type BubbleAction =
  /** Hover, keyboard focus or first tap on a bubble. */
  | { readonly type: "expand"; readonly bubbleId: BubbleId }
  /** Pointer left, focus lost or Escape on a bubble. */
  | { readonly type: "collapse"; readonly bubbleId: BubbleId }
  /** Tap outside every bubble. */
  | { readonly type: "collapseAll" }
  /** Click, Enter or second tap: the page of the bubble opens. */
  | { readonly type: "navigate"; readonly bubbleId: BubbleId };

/** State of the field when the page opens. */
export const INITIAL_BUBBLE_STATE: BubbleState = { status: "idle" };

/**
 * Gives the next state of the bubble field. Pure function: easy to test.
 * @param state - Current state.
 * @param action - What just happened.
 * @returns The new state, or the same object when nothing changes.
 */
export function bubbleReducer(state: BubbleState, action: BubbleAction): BubbleState {
  switch (action.type) {
    case "expand":
      return state.status !== "idle" && state.bubbleId === action.bubbleId
        ? state
        : { status: "expanded", bubbleId: action.bubbleId };
    case "collapse":
      return state.status === "expanded" && state.bubbleId === action.bubbleId
        ? INITIAL_BUBBLE_STATE
        : state;
    case "collapseAll":
      return state.status === "expanded" ? INITIAL_BUBBLE_STATE : state;
    case "navigate":
      return { status: "navigating", bubbleId: action.bubbleId };
  }
}

/**
 * Tells whether a bubble shows its panel in a given state.
 * @param state - Current state of the field.
 * @param bubbleId - Bubble to check.
 */
export function isExpanded(state: BubbleState, bubbleId: BubbleId): boolean {
  return state.status !== "idle" && state.bubbleId === bubbleId;
}
