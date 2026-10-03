import type { WaveField } from "./WaveField.ts";

/** Settings of a {@link WaveSimulation}, fixed for its whole lifetime. */
export interface WaveSimulationOptions {
  /** Distance, in CSS pixels, between two neighboring dots. Must be positive. */
  readonly spacing: number;
  /** Fraction of the wave energy kept at each step, strictly between 0 and 1. */
  readonly damping: number;
  /** Radius, in grid cells, of the area lifted by {@link WaveSimulation.disturb}. */
  readonly brushRadius: number;
}

/**
 * Wave physics on a grid of dots, independent of React and of any drawing API.
 *
 * Uses the classic two-buffer ripple algorithm: each step computes the next
 * height of every dot from its four neighbors and its previous height, then
 * swaps the buffers. The outer border is fixed at 0, so waves bounce off the
 * edges of the screen and fade out through damping.
 */
export class WaveSimulation implements WaveField {
  readonly spacing: number;
  private readonly damping: number;
  private readonly brushRadius: number;
  private columnCount = 0;
  private rowCount = 0;
  private current = new Float32Array(0);
  private previous = new Float32Array(0);

  /**
   * @param options - Grid spacing, damping and brush size.
   * @throws {RangeError} If an option is outside its allowed range.
   */
  constructor(options: WaveSimulationOptions) {
    if (!(options.spacing > 0)) {
      throw new RangeError("spacing must be a positive number");
    }
    if (!(options.damping > 0 && options.damping < 1)) {
      throw new RangeError("damping must be strictly between 0 and 1");
    }
    if (!Number.isInteger(options.brushRadius) || options.brushRadius < 0) {
      throw new RangeError("brushRadius must be a non-negative integer");
    }
    this.spacing = options.spacing;
    this.damping = options.damping;
    this.brushRadius = options.brushRadius;
  }

  /** Number of dots on each row. */
  get columns(): number {
    return this.columnCount;
  }

  /** Number of rows of dots. */
  get rows(): number {
    return this.rowCount;
  }

  /** Current height of every dot, row by row. */
  get heights(): Float32Array {
    return this.current;
  }

  /**
   * Adapts the grid to a new area. The grid covers the whole area, edges
   * included. Waves in progress are cleared only when the grid size changes.
   * @param width - Width of the area, in CSS pixels.
   * @param height - Height of the area, in CSS pixels.
   */
  resize(width: number, height: number): void {
    const columns = Math.max(0, Math.ceil(width / this.spacing) + 1);
    const rows = Math.max(0, Math.ceil(height / this.spacing) + 1);
    if (columns === this.columnCount && rows === this.rowCount) {
      return;
    }
    this.columnCount = columns;
    this.rowCount = rows;
    this.current = new Float32Array(columns * rows);
    this.previous = new Float32Array(columns * rows);
  }

  /**
   * Lifts the dots around a point, with a height that decreases away from it.
   * Points outside the grid and non-finite values are ignored.
   * @param x - Horizontal position, in CSS pixels.
   * @param y - Vertical position, in CSS pixels.
   * @param strength - Height added at the center of the disturbance.
   */
  disturb(x: number, y: number, strength: number): void {
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(strength)) {
      return;
    }
    const centerColumn = Math.round(x / this.spacing);
    const centerRow = Math.round(y / this.spacing);
    const radius = this.brushRadius;

    for (let row = centerRow - radius; row <= centerRow + radius; row++) {
      if (row <= 0 || row >= this.rowCount - 1) {
        continue;
      }
      for (let column = centerColumn - radius; column <= centerColumn + radius; column++) {
        if (column <= 0 || column >= this.columnCount - 1) {
          continue;
        }
        const distance = Math.hypot(column - centerColumn, row - centerRow);
        if (distance > radius) {
          continue;
        }
        const falloff = 1 - distance / (radius + 1);
        this.current[row * this.columnCount + column] += strength * falloff;
      }
    }
  }

  /** Advances the simulation by one frame. */
  step(): void {
    const columns = this.columnCount;
    const rows = this.rowCount;
    const current = this.current;
    const next = this.previous;

    for (let row = 1; row < rows - 1; row++) {
      const rowStart = row * columns;
      for (let column = 1; column < columns - 1; column++) {
        const index = rowStart + column;
        const neighbors =
          current[index - 1] +
          current[index + 1] +
          current[index - columns] +
          current[index + columns];
        next[index] = (neighbors / 2 - next[index]) * this.damping;
      }
    }

    this.previous = current;
    this.current = next;
  }
}
