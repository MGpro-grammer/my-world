/**
 * Read-only view of the wave grid, shared between the simulation that writes it
 * and the renderers that draw it.
 *
 * The grid is stored row by row in a flat typed array: the height of the dot at
 * (`column`, `row`) is `heights[row * columns + column]`.
 */
export interface WaveField {
  /** Number of dots on each row. */
  readonly columns: number;
  /** Number of rows of dots. */
  readonly rows: number;
  /** Distance, in CSS pixels, between two neighboring dots. */
  readonly spacing: number;
  /** Current height of every dot; 0 means at rest. Renderers must not modify it. */
  readonly heights: Float32Array;
}
