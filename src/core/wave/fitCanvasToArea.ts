/**
 * Sizes the pixel buffer of a canvas for an area, then scales its context so
 * that every drawing coordinate is expressed in CSS pixels.
 *
 * Without this, a canvas looks blurry on high-density screens.
 * @param context - Context of the canvas to size.
 * @param width - Width of the area, in CSS pixels.
 * @param height - Height of the area, in CSS pixels.
 * @param pixelRatio - Ratio between device pixels and CSS pixels.
 */
export function fitCanvasToArea(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  pixelRatio: number,
): void {
  const canvas = context.canvas;
  canvas.width = Math.max(1, Math.round(width * pixelRatio));
  canvas.height = Math.max(1, Math.round(height * pixelRatio));
  // Changing the canvas size resets the context, so the scale is set afterwards.
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}
