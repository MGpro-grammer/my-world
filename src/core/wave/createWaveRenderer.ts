import { AnimatedWaveRenderer } from "./AnimatedWaveRenderer.ts";
import { StaticWaveRenderer } from "./StaticWaveRenderer.ts";
import type { WaveRenderer } from "./WaveRenderer.ts";

/** Visitor settings that decide how the waves are drawn. */
export interface WaveRenderEnvironment {
  /** `true` when the visitor asked their system to reduce animations. */
  readonly prefersReducedMotion: boolean;
}

/**
 * Chooses and creates the renderer that fits the visitor.
 *
 * The only place that knows the concrete renderers: the rest of the code
 * depends on the {@link WaveRenderer} interface.
 * @param canvas - Canvas to draw on.
 * @param environment - Visitor settings.
 * @throws {Error} If the browser cannot provide a 2D context.
 */
export function createWaveRenderer(
  canvas: HTMLCanvasElement,
  environment: WaveRenderEnvironment,
): WaveRenderer {
  const context = canvas.getContext("2d");
  if (context === null) {
    throw new Error("2D canvas context is not available");
  }
  return environment.prefersReducedMotion
    ? new StaticWaveRenderer(context)
    : new AnimatedWaveRenderer(context);
}
