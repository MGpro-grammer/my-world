import { describe, expect, it } from "vitest";
import { placeBubbles, type BubbleLayoutOptions, type Rect } from "./placeBubbles.ts";

/** Same settings as the home page: 64 px bubbles, 24 px margin, seed 2026. */
function layout(width: number, height: number, count: number, exclusions: Rect[] = []) {
  const options: BubbleLayoutOptions = {
    width,
    height,
    count,
    radius: 32,
    margin: 24,
    exclusions,
    seed: 2026,
  };
  return { options, placements: placeBubbles(options) };
}

describe("placeBubbles", () => {
  it.each([
    [360, 640],
    [768, 1024],
    [1280, 720],
    [1536, 864],
  ])("keeps 8 bubbles inside a %i × %i area, without overlap", (width, height) => {
    const { placements } = layout(width, height, 8);
    expect(placements).toHaveLength(8);
    for (const [index, bubble] of placements.entries()) {
      expect(bubble.x).toBeGreaterThanOrEqual(24 + 32);
      expect(bubble.x).toBeLessThanOrEqual(width - 24 - 32);
      expect(bubble.y).toBeGreaterThanOrEqual(24 + 32);
      expect(bubble.y).toBeLessThanOrEqual(height - 24 - 32);
      for (const other of placements.slice(index + 1)) {
        expect(Math.hypot(bubble.x - other.x, bubble.y - other.y)).toBeGreaterThanOrEqual(64);
      }
    }
  });

  it("keeps the bubbles out of an excluded rectangle", () => {
    const middle: Rect = { left: 400, top: 200, right: 880, bottom: 520 };
    const { placements } = layout(1280, 720, 8, [middle]);
    for (const { x, y } of placements) {
      const inside = x > middle.left && x < middle.right && y > middle.top && y < middle.bottom;
      expect(inside).toBe(false);
    }
  });

  it("gives the same layout for the same seed and size", () => {
    expect(layout(1280, 720, 8).placements).toEqual(layout(1280, 720, 8).placements);
  });

  it("opens each panel towards the middle of the area", () => {
    const { placements } = layout(1280, 720, 8);
    for (const { x, y, expandX, expandY } of placements) {
      expect(expandX).toBe(x < 640 ? "right" : "left");
      expect(expandY).toBe(y < 720 * 0.6 ? "down" : "up");
    }
  });
});
