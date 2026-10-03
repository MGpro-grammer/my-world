import { DotStyleFactory } from "./DotStyleFactory.ts";
import { fitCanvasToArea } from "./fitCanvasToArea.ts";
import type { WaveField } from "./WaveField.ts";
import type { WaveRenderer } from "./WaveRenderer.ts";

/** Number of distinct dot looks shared by all the dots. */
const STYLE_LEVELS = 32;

/** Upward shift of a dot, in CSS pixels, per unit of wave height. */
const LIFT_PER_UNIT = 1.2;

/** Wave height at which a dot reaches its brightest look. */
const FULL_INTENSITY_HEIGHT = 6;

/**
 * Default renderer: every frame, each dot is lifted by its wave height and
 * gets brighter and larger as the wave passes.
 *
 * Dots are grouped by style so that each style is painted in one operation:
 * a few dozen paint operations per frame instead of one per dot.
 */
export class AnimatedWaveRenderer implements WaveRenderer {
  private readonly context: CanvasRenderingContext2D;
  private readonly styles = new DotStyleFactory({ levels: STYLE_LEVELS });
  private readonly dotsPerLevel = new Uint32Array(STYLE_LEVELS);
  private dotX = new Float32Array(0);
  private dotY = new Float32Array(0);
  private dotLevel = new Uint8Array(0);
  private width = 0;
  private height = 0;

  /** @param context - 2D context of the canvas to draw on. */
  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  resize(width: number, height: number, pixelRatio: number): void {
    this.width = width;
    this.height = height;
    fitCanvasToArea(this.context, width, height, pixelRatio);
  }

  render(field: WaveField): void {
    const dotCount = field.columns * field.rows;
    this.ensureCapacity(dotCount);
    this.placeDots(field);

    this.context.clearRect(0, 0, this.width, this.height);
    for (let level = 0; level < STYLE_LEVELS; level++) {
      if (this.dotsPerLevel[level] === 0) {
        continue;
      }
      const style = this.styles.styleAt(level);
      this.context.beginPath();
      for (let index = 0; index < dotCount; index++) {
        if (this.dotLevel[index] === level) {
          style.trace(this.context, this.dotX[index], this.dotY[index]);
        }
      }
      style.fill(this.context);
    }
  }

  dispose(): void {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Computes the position and level of every dot, and counts the dots of each level.
   * @param field - Grid of dots to place.
   */
  private placeDots(field: WaveField): void {
    const { columns, rows, spacing, heights } = field;
    this.dotsPerLevel.fill(0);

    for (let row = 0; row < rows; row++) {
      const restY = row * spacing;
      const rowStart = row * columns;
      for (let column = 0; column < columns; column++) {
        const index = rowStart + column;
        const waveHeight = heights[index];
        const level = this.styles.levelOf(Math.abs(waveHeight) / FULL_INTENSITY_HEIGHT);
        this.dotX[index] = column * spacing;
        this.dotY[index] = restY - waveHeight * LIFT_PER_UNIT;
        this.dotLevel[index] = level;
        this.dotsPerLevel[level]++;
      }
    }
  }

  /**
   * Grows the working arrays when the grid has more dots than before.
   * @param dotCount - Number of dots of the grid.
   */
  private ensureCapacity(dotCount: number): void {
    if (this.dotLevel.length >= dotCount) {
      return;
    }
    this.dotX = new Float32Array(dotCount);
    this.dotY = new Float32Array(dotCount);
    this.dotLevel = new Uint8Array(dotCount);
  }
}
