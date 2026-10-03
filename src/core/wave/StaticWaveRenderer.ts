import { DotStyleFactory } from "./DotStyleFactory.ts";
import { fitCanvasToArea } from "./fitCanvasToArea.ts";
import type { WaveField } from "./WaveField.ts";
import type { WaveRenderer } from "./WaveRenderer.ts";

/** Only the look at rest is used, so two levels are enough (the minimum allowed). */
const STYLE_LEVELS = 2;

/**
 * Renderer for visitors who asked to reduce motion: the dots are always drawn
 * at rest, whatever the waves, and only redrawn after a resize.
 */
export class StaticWaveRenderer implements WaveRenderer {
  private readonly context: CanvasRenderingContext2D;
  private readonly styles = new DotStyleFactory({ levels: STYLE_LEVELS });
  private width = 0;
  private height = 0;
  private needsRedraw = true;

  /** @param context - 2D context of the canvas to draw on. */
  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  resize(width: number, height: number, pixelRatio: number): void {
    this.width = width;
    this.height = height;
    fitCanvasToArea(this.context, width, height, pixelRatio);
    this.needsRedraw = true;
  }

  render(field: WaveField): void {
    if (!this.needsRedraw) {
      return;
    }
    const { columns, rows, spacing } = field;
    const restStyle = this.styles.styleAt(0);

    this.context.clearRect(0, 0, this.width, this.height);
    this.context.beginPath();
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        restStyle.trace(this.context, column * spacing, row * spacing);
      }
    }
    restStyle.fill(this.context);
    this.needsRedraw = false;
  }

  dispose(): void {
    this.context.clearRect(0, 0, this.width, this.height);
    this.needsRedraw = true;
  }
}
