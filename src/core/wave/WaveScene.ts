import type { FrameScheduler } from "./FrameScheduler.ts";
import type { WaveRenderer } from "./WaveRenderer.ts";
import type { WaveSimulation } from "./WaveSimulation.ts";

/** Below this wave height everywhere, the surface looks flat and the loop sleeps. */
const REST_THRESHOLD = 0.05;

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
 *
 * Once started, the loop sleeps as soon as the surface is flat, so an idle
 * page costs no CPU, and wakes up at the next disturbance.
 */
export class WaveScene {
  private readonly simulation: WaveSimulation;
  private readonly renderer: WaveRenderer;
  private readonly scheduler: FrameScheduler;
  private started = false;
  private frameId: number | null = null;

  /** @param dependencies - Simulation, renderer and frame scheduler to use. */
  constructor(dependencies: WaveSceneDependencies) {
    this.simulation = dependencies.simulation;
    this.renderer = dependencies.renderer;
    this.scheduler = dependencies.scheduler;
  }

  /** `true` between {@link start} and {@link stop}, even while the loop sleeps. */
  get running(): boolean {
    return this.started;
  }

  /** `true` while a frame is planned; `false` when stopped or asleep on a flat surface. */
  get animating(): boolean {
    return this.frameId !== null;
  }

  /** Starts the animation loop. Does nothing if it is already started. */
  start(): void {
    if (this.started) {
      return;
    }
    this.started = true;
    this.wake();
  }

  /** Stops the animation loop. Does nothing if it is not started. */
  stop(): void {
    this.started = false;
    if (this.frameId !== null) {
      this.scheduler.cancel(this.frameId);
      this.frameId = null;
    }
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
   * Creates a wave around a point, for example under the mouse, and wakes the
   * loop up if it was asleep.
   * @param x - Horizontal position, in CSS pixels.
   * @param y - Vertical position, in CSS pixels.
   * @param strength - Height added at the center of the wave.
   */
  disturb(x: number, y: number, strength: number): void {
    this.simulation.disturb(x, y, strength);
    this.wake();
  }

  /** Stops the loop and clears the drawing. The scene must not be used afterwards. */
  dispose(): void {
    this.stop();
    this.renderer.dispose();
  }

  /** Plans the next frame if the scene is started and no frame is planned yet. */
  private wake(): void {
    if (this.started && this.frameId === null) {
      this.frameId = this.scheduler.request(this.tick);
    }
  }

  /**
   * One frame of the loop: advance the physics, draw, then plan the next
   * frame only while waves are still visible.
   * Arrow function, so that `this` stays bound when the scheduler calls it.
   */
  private readonly tick = (): void => {
    this.frameId = null;
    this.simulation.step();
    this.renderer.render(this.simulation);
    if (this.simulation.peakHeight >= REST_THRESHOLD) {
      this.wake();
    }
  };
}
