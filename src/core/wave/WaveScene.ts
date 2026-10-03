import type { FrameScheduler } from "./FrameScheduler.ts";
import type { WaveRenderer } from "./WaveRenderer.ts";
import type { WaveSimulation } from "./WaveSimulation.ts";

/** Collaborators of a {@link WaveScene}, created outside and given to it. */
export interface WaveSceneDependencies {
  /** Wave physics. */
  readonly simulation: WaveSimulation;
  /** Drawing strategy (animated, static, ...). */
  readonly renderer: WaveRenderer;
  /** Source of animation frames. */
  readonly scheduler: FrameScheduler;
}

/**
 * Single entry point of the wave background.
 *
 * Facade: callers only start, stop, resize and disturb the scene; the
 * simulation, the renderer and the animation loop stay hidden behind it.
 * Its collaborators are given to the constructor (dependency inversion), so
 * the scene can be tested with fake ones, without a browser.
 */
export class WaveScene {
  private readonly simulation: WaveSimulation;
  private readonly renderer: WaveRenderer;
  private readonly scheduler: FrameScheduler;
  private frameId: number | null = null;

  /** @param dependencies - Simulation, renderer and frame scheduler to use. */
  constructor(dependencies: WaveSceneDependencies) {
    this.simulation = dependencies.simulation;
    this.renderer = dependencies.renderer;
    this.scheduler = dependencies.scheduler;
  }

  /** `true` while the animation loop is running. */
  get running(): boolean {
    return this.frameId !== null;
  }

  /** Starts the animation loop. Does nothing if it is already running. */
  start(): void {
    if (this.frameId !== null) {
      return;
    }
    this.frameId = this.scheduler.request(this.tick);
  }

  /** Stops the animation loop. Does nothing if it is not running. */
  stop(): void {
    if (this.frameId === null) {
      return;
    }
    this.scheduler.cancel(this.frameId);
    this.frameId = null;
  }

  /**
   * Adapts the scene to a new area and draws it right away, so that the
   * screen is never left blank, even while the loop is stopped.
   * @param width - Width of the area, in CSS pixels.
   * @param height - Height of the area, in CSS pixels.
   * @param pixelRatio - Ratio between device pixels and CSS pixels.
   */
  resize(width: number, height: number, pixelRatio: number): void {
    this.simulation.resize(width, height);
    this.renderer.resize(width, height, pixelRatio);
    this.renderer.render(this.simulation);
  }

  /**
   * Creates a wave around a point, for example under the mouse.
   * @param x - Horizontal position, in CSS pixels.
   * @param y - Vertical position, in CSS pixels.
   * @param strength - Height added at the center of the wave.
   */
  disturb(x: number, y: number, strength: number): void {
    this.simulation.disturb(x, y, strength);
  }

  /** Stops the loop and clears the drawing. The scene must not be used afterwards. */
  dispose(): void {
    this.stop();
    this.renderer.dispose();
  }

  /**
   * One frame of the loop: advance the physics, draw, plan the next frame.
   * Arrow function, so that `this` stays bound when the scheduler calls it.
   */
  private readonly tick = (): void => {
    this.simulation.step();
    this.renderer.render(this.simulation);
    this.frameId = this.scheduler.request(this.tick);
  };
}
