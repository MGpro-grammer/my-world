import type { FrameScheduler } from "./FrameScheduler.ts";
import type { WaveRenderer } from "./WaveRenderer.ts";
import type { WaveSimulation } from "./WaveSimulation.ts";

/** Below this wave height everywhere, the surface looks flat and the loop sleeps. */
const REST_THRESHOLD = 0.05;

/** Time covered by one simulation step: the waves advance 60 steps per second on every screen. */
const STEP_DURATION_MS = 1000 / 60;

/**
 * Most steps taken in one frame. After a long pause (a busy page, a tab
 * brought back), the waves resume instead of racing to catch up.
 */
const MAX_STEPS_PER_FRAME = 4;

/**
 * Fraction of a step by which a frame may come early and still take that
 * step. Frame times jitter by a fraction of a millisecond: without this
 * margin, a 60 Hz screen would sometimes take no step then two, a visible stutter.
 */
const EARLY_FRAME_TOLERANCE = 0.25;

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
 *
 * The simulation advances at a fixed rate of 60 steps per second, whatever
 * the refresh rate of the screen: the waves move at the same speed on a
 * 60 Hz and on a 144 Hz screen, and a frame without a new step is not drawn.
 */
export class WaveScene {
  private readonly simulation: WaveSimulation;
  private readonly renderer: WaveRenderer;
  private readonly scheduler: FrameScheduler;
  private started = false;
  private frameId: number | null = null;
  /** Time of the previous frame, in milliseconds; `null` when the loop has just (re)started. */
  private lastFrameTime: number | null = null;
  /** Time not yet turned into steps, in milliseconds; slightly negative after an early frame. */
  private pendingTime = 0;

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
    this.lastFrameTime = null;
    this.pendingTime = 0;
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
   * One frame of the loop: advance the physics by as many fixed steps as the
   * elapsed time allows, draw if anything changed, then plan the next frame
   * only while waves are still visible.
   * Arrow function, so that `this` stays bound when the scheduler calls it.
   * @param time - Time of the frame, in milliseconds, given by the scheduler.
   */
  private readonly tick = (time: number): void => {
    this.frameId = null;
    const steps = this.stepsFor(time);
    for (let step = 0; step < steps; step++) {
      this.simulation.step();
    }
    if (steps > 0) {
      this.renderer.render(this.simulation);
    }
    if (this.simulation.peakHeight >= REST_THRESHOLD) {
      this.wake();
    } else {
      // Asleep: the next wake-up starts counting time afresh.
      this.lastFrameTime = null;
      this.pendingTime = 0;
    }
  };

  /**
   * Turns the time elapsed since the previous frame into a number of steps.
   * The first frame after a (re)start always takes one step, so that a
   * disturbance shows at once.
   * @param time - Time of the current frame, in milliseconds.
   * @returns From 0 to {@link MAX_STEPS_PER_FRAME}.
   */
  private stepsFor(time: number): number {
    const lastFrameTime = this.lastFrameTime;
    this.lastFrameTime = time;
    if (lastFrameTime === null) {
      this.pendingTime = 0;
      return 1;
    }
    this.pendingTime += Math.max(0, time - lastFrameTime);
    const steps = Math.floor(this.pendingTime / STEP_DURATION_MS + EARLY_FRAME_TOLERANCE);
    if (steps > MAX_STEPS_PER_FRAME) {
      // Too far behind: drop the lost time rather than run a burst of steps.
      this.pendingTime = 0;
      return MAX_STEPS_PER_FRAME;
    }
    this.pendingTime -= steps * STEP_DURATION_MS;
    return steps;
  }
}
