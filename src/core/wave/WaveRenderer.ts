import type { WaveField } from "./WaveField.ts";

/**
 * Draws a {@link WaveField} on a surface.
 *
 * Strategy: the wave scene only knows this interface, so the way the dots are
 * drawn (animated, static, ...) can change without touching the scene.
 */
export interface WaveRenderer {
  /**
   * Adapts the drawing surface to a new area.
   * @param width - Width of the area, in CSS pixels.
   * @param height - Height of the area, in CSS pixels.
   * @param pixelRatio - Ratio between device pixels and CSS pixels.
   */
  resize(width: number, height: number, pixelRatio: number): void;

  /**
   * Draws the current state of the field.
   * @param field - Grid of dots to draw; read only.
   */
  render(field: WaveField): void;

  /** Clears the surface and releases what the renderer holds. */
  dispose(): void;
}
