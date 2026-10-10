/** A full circle, in radians. */
const FULL_TURN = Math.PI * 2;

/** Color as red, green, blue and opacity, each from 0 to 1, for APIs that take numbers (WebGL). */
export type RgbaColor = readonly [red: number, green: number, blue: number, alpha: number];

/**
 * Look shared by every dot that has the same intensity: size and color.
 *
 * Flyweight: the look (intrinsic state) is computed once and never changes,
 * while the position of each dot (extrinsic state) is given at each call to
 * {@link trace}. Thousands of dots share a few dozen styles.
 */
export class DotStyle {
  /** Radius of the dot, in CSS pixels. */
  readonly radius: number;
  /** CSS color used to fill the dot. */
  readonly color: string;
  /** The same color as numbers, for renderers that do not read CSS colors. */
  readonly rgba: RgbaColor;

  /**
   * @param radius - Radius of the dot, in CSS pixels.
   * @param color - CSS color used to fill the dot.
   * @param rgba - The same color as numbers from 0 to 1.
   */
  constructor(radius: number, color: string, rgba: RgbaColor) {
    this.radius = radius;
    this.color = color;
    this.rgba = rgba;
  }

  /**
   * Adds a dot centered on a point to the current path of the context.
   * Nothing is painted until {@link fill} is called, so that all the dots of
   * the same style are painted in a single operation.
   * @param context - Destination context, scaled so that 1 unit = 1 CSS pixel.
   * @param x - Horizontal position of the center, in CSS pixels.
   * @param y - Vertical position of the center, in CSS pixels.
   */
  trace(context: CanvasRenderingContext2D, x: number, y: number): void {
    context.moveTo(x + this.radius, y);
    context.arc(x, y, this.radius, 0, FULL_TURN);
  }

  /**
   * Paints every dot traced since the last `beginPath()` with this style's color.
   * @param context - Context the dots were traced on.
   */
  fill(context: CanvasRenderingContext2D): void {
    context.fillStyle = this.color;
    context.fill();
  }
}
