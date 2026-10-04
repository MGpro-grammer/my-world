/** Axis-aligned rectangle, in CSS pixels, that bubbles must stay away from. */
export interface Rect {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
}

/** Where a bubble sits and on which side its panel opens, so it stays on screen. */
export interface BubblePlacement {
  /** Horizontal position of the bubble's center, in CSS pixels. */
  readonly x: number;
  /** Vertical position of the bubble's center, in CSS pixels. */
  readonly y: number;
  /** Side towards which the panel opens: towards the middle of the area. */
  readonly expandX: "left" | "right";
  /** Direction in which the panel grows: upwards near the bottom of the area. */
  readonly expandY: "down" | "up";
}

/** Settings of {@link placeBubbles}. */
export interface BubbleLayoutOptions {
  /** Width of the area, in CSS pixels. */
  readonly width: number;
  /** Height of the area, in CSS pixels. */
  readonly height: number;
  /** Number of bubbles to place. */
  readonly count: number;
  /** Radius of a bubble at rest, in CSS pixels. */
  readonly radius: number;
  /** Smallest distance between a bubble and the edges of the area, in CSS pixels. */
  readonly margin: number;
  /** Rectangles the bubbles must avoid, such as the middle of a large screen. */
  readonly exclusions: readonly Rect[];
  /** Seed of the random draw: the same seed and size always give the same layout. */
  readonly seed: number;
}

/** Candidate positions tried for each bubble; more gives a more even spread. */
const CANDIDATES_PER_BUBBLE = 60;

/** Below this share of the height, a panel opens downwards; above it, upwards. */
const EXPAND_UP_THRESHOLD = 0.6;

/**
 * Places bubbles at random, but evenly spread and without overlap.
 *
 * Uses best-candidate sampling: for each bubble, many random positions are
 * tried and the one farthest from the bubbles already placed and from the
 * excluded rectangles is kept. Pure function: no React, no DOM.
 * @param options - Size of the area, bubbles and constraints.
 * @returns One placement per bubble, in the same order.
 */
export function placeBubbles(options: BubbleLayoutOptions): BubblePlacement[] {
  const { width, height, count, radius, margin, exclusions } = options;
  const random = createRandom(options.seed);
  const minX = margin + radius;
  const maxX = Math.max(minX, width - margin - radius);
  const minY = margin + radius;
  const maxY = Math.max(minY, height - margin - radius);
  const centers: { x: number; y: number }[] = [];

  const clearance = (x: number, y: number): number => {
    let smallest = Number.POSITIVE_INFINITY;
    for (const center of centers) {
      smallest = Math.min(smallest, Math.hypot(x - center.x, y - center.y) - 2 * radius);
    }
    for (const rect of exclusions) {
      smallest = Math.min(smallest, distanceToRect(x, y, rect) - radius);
    }
    return smallest;
  };

  for (let bubble = 0; bubble < count; bubble++) {
    let bestX = minX;
    let bestY = minY;
    let bestClearance = Number.NEGATIVE_INFINITY;
    for (let candidate = 0; candidate < CANDIDATES_PER_BUBBLE; candidate++) {
      const x = minX + random() * (maxX - minX);
      const y = minY + random() * (maxY - minY);
      const candidateClearance = clearance(x, y);
      if (candidateClearance > bestClearance) {
        bestX = x;
        bestY = y;
        bestClearance = candidateClearance;
      }
    }
    centers.push({ x: bestX, y: bestY });
  }

  return centers.map(({ x, y }) => ({
    x,
    y,
    expandX: x < width / 2 ? "right" : "left",
    expandY: y < height * EXPAND_UP_THRESHOLD ? "down" : "up",
  }));
}

/**
 * Distance from a point to the nearest point of a rectangle; 0 inside it.
 * @param x - Horizontal position of the point.
 * @param y - Vertical position of the point.
 * @param rect - Rectangle to measure to.
 */
function distanceToRect(x: number, y: number, rect: Rect): number {
  const dx = Math.max(rect.left - x, 0, x - rect.right);
  const dy = Math.max(rect.top - y, 0, y - rect.bottom);
  return Math.hypot(dx, dy);
}

/**
 * Creates a small seeded random generator (mulberry32, public domain), so
 * that a layout can be reproduced exactly; `Math.random` cannot be seeded.
 * @param seed - Any integer.
 * @returns A function giving numbers from 0 (included) to 1 (excluded).
 */
function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
