import { AnimatedWaveRenderer } from "./AnimatedWaveRenderer.ts";
import { StaticWaveRenderer } from "./StaticWaveRenderer.ts";
import type { WaveRenderer } from "./WaveRenderer.ts";
import { WebGLWaveRenderer } from "./WebGLWaveRenderer.ts";

/** Visitor settings that decide how the waves are drawn. */
export interface WaveRenderEnvironment {
  /** `true` when the visitor asked their system to reduce animations. */
  readonly prefersReducedMotion: boolean;
}

/**
 * Chooses and creates the renderer that fits the visitor: the still dots when
 * they asked for reduced motion; otherwise the waves drawn by the graphics
 * card (WebGL 2) when the browser allows it, else by the 2D canvas.
 *
 * The only place that knows the concrete renderers: the rest of the code
 * depends on the {@link WaveRenderer} interface.
 * @param canvas - Canvas to draw on. A canvas keeps the first kind of context
 * it gives, so a new canvas is needed to change between WebGL and 2D.
 * @param environment - Visitor settings.
 * @throws {Error} If the browser can provide neither WebGL 2 nor a 2D context.
 */
export function createWaveRenderer(
  canvas: HTMLCanvasElement,
  environment: WaveRenderEnvironment,
): WaveRenderer {
  if (!environment.prefersReducedMotion) {
    const webGLRenderer = WebGLWaveRenderer.create(canvas);
    if (webGLRenderer !== null) {
      return webGLRenderer;
    }
  }
  const context = canvas.getContext("2d");
  if (context === null) {
    throw new Error("2D canvas context is not available");
  }
  return environment.prefersReducedMotion
    ? new StaticWaveRenderer(context)
    : new AnimatedWaveRenderer(context);
}
