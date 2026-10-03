import { DotStyle } from "./DotStyle.ts";

/** Settings of a {@link DotStyleFactory}, fixed for its whole lifetime. */
export interface DotStyleFactoryOptions {
  /** Number of distinct intensities, from 2 to 256. Intensities are rounded to the nearest one. */
  readonly levels: number;
}

/** Look of a dot, interpolated between rest and crest. */
interface DotLook {
  readonly hue: number;
  readonly saturation: number;
  readonly lightness: number;
  readonly alpha: number;
  /** Radius of the dot, in CSS pixels. */
  readonly radius: number;
}

/** Dot at rest (intensity 0): small, dim, deep blue. */
const REST_LOOK: DotLook = { hue: 218, saturation: 60, lightness: 40, alpha: 0.6, radius: 1.2 };

/** Dot on a wave crest (intensity 1): larger, bright, light sea blue. */
const CREST_LOOK: DotLook = { hue: 196, saturation: 100, lightness: 72, alpha: 1, radius: 2.6 };

/** Highest number of levels, so that a level always fits in a `Uint8Array`. */
const MAX_LEVELS = 256;

/**
 * Creates and shares the {@link DotStyle} objects of the wave background.
 *
 * Flyweight factory: intensities are rounded to `levels` steps, each step has
 * exactly one style, created on first use then kept in a cache.
 */
export class DotStyleFactory {
  /** Number of distinct intensities. */
  readonly levels: number;
  private readonly cache = new Map<number, DotStyle>();

  /**
   * @param options - Number of intensity levels.
   * @throws {RangeError} If `levels` is not an integer from 2 to 256.
   */
  constructor(options: DotStyleFactoryOptions) {
    if (!Number.isInteger(options.levels) || options.levels < 2 || options.levels > MAX_LEVELS) {
      throw new RangeError("levels must be an integer from 2 to 256");
    }
    this.levels = options.levels;
  }

  /** Number of styles created so far, never more than `levels`. */
  get styleCount(): number {
    return this.cache.size;
  }

  /**
   * Converts an intensity into the index of the nearest level.
   * @param intensity - From 0 (at rest) to 1 (crest); values outside are clamped.
   * @returns An integer from 0 to `levels - 1`.
   */
  levelOf(intensity: number): number {
    const clamped = Number.isFinite(intensity) ? Math.min(1, Math.max(0, intensity)) : 0;
    return Math.round(clamped * (this.levels - 1));
  }

  /**
   * Returns the shared style of a level, creating it on first use.
   * @param level - Integer from 0 to `levels - 1`, as returned by {@link levelOf}.
   * @throws {RangeError} If the level does not exist.
   */
  styleAt(level: number): DotStyle {
    if (!Number.isInteger(level) || level < 0 || level >= this.levels) {
      throw new RangeError(`level must be an integer from 0 to ${this.levels - 1}`);
    }
    let style = this.cache.get(level);
    if (style === undefined) {
      style = this.createStyle(level / (this.levels - 1));
      this.cache.set(level, style);
    }
    return style;
  }

  /**
   * Computes the look of a level by mixing the rest and crest looks.
   * @param ratio - Position between rest (0) and crest (1).
   */
  private createStyle(ratio: number): DotStyle {
    const mix = (from: number, to: number): number => from + (to - from) * ratio;
    const hue = mix(REST_LOOK.hue, CREST_LOOK.hue);
    const saturation = mix(REST_LOOK.saturation, CREST_LOOK.saturation);
    const lightness = mix(REST_LOOK.lightness, CREST_LOOK.lightness);
    const alpha = mix(REST_LOOK.alpha, CREST_LOOK.alpha);
    const radius = mix(REST_LOOK.radius, CREST_LOOK.radius);
    return new DotStyle(radius, `hsl(${hue} ${saturation}% ${lightness}% / ${alpha})`);
  }
}
