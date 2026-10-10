import { describe, expect, it } from "vitest";
import type { FrameScheduler } from "./FrameScheduler.ts";
import type { WaveField } from "./WaveField.ts";
import type { WaveRenderer } from "./WaveRenderer.ts";
import { WaveScene } from "./WaveScene.ts";
import { WaveSimulation } from "./WaveSimulation.ts";

/** Frame scheduler driven by the test: frames happen only when {@link runFrame} is called. */
class FakeScheduler implements FrameScheduler {
  private callback: ((time: number) => void) | null = null;
  private nextId = 1;

  /** `true` while a frame is planned. */
  get hasPendingFrame(): boolean {
    return this.callback !== null;
  }

  request(callback: (time: number) => void): number {
    this.callback = callback;
    return this.nextId++;
  }

  cancel(): void {
    this.callback = null;
  }

  /** Runs the planned frame, if any, at the given time in milliseconds. */
  runFrame(time: number): void {
    const callback = this.callback;
    this.callback = null;
    callback?.(time);
  }
}

/** Renderer that only counts what it is asked to do. */
class CountingRenderer implements WaveRenderer {
  renders = 0;
  disposed = false;

  resize(): void {}

  render(field: WaveField): void {
    expect(field.heights.length).toBe(field.columns * field.rows);
    this.renders++;
  }

  dispose(): void {
    this.disposed = true;
  }
}

/** Real simulation whose steps are counted. */
class CountingSimulation extends WaveSimulation {
  steps = 0;

  override step(): void {
    this.steps++;
    super.step();
  }
}

/** Builds a started scene on an 800 × 600 area, with its fakes. */
function createScene(damping = 0.999) {
  const scheduler = new FakeScheduler();
  const renderer = new CountingRenderer();
  const simulation = new CountingSimulation({ spacing: 20, damping, brushRadius: 2 });
  const scene = new WaveScene({ simulation, renderer, scheduler });
  scene.resize(800, 600, 1);
  renderer.renders = 0;
  scene.start();
  return { scene, scheduler, renderer, simulation };
}

/**
 * Runs frames at a fixed interval for some time, disturbing the surface
 * twice a second so that the loop never falls asleep.
 */
function runFor(seconds: number, frameMs: number) {
  const setup = createScene();
  const { scene, scheduler } = setup;
  scene.disturb(400, 300, 50);
  for (let time = frameMs; time <= seconds * 1000; time += frameMs) {
    if (Math.floor(time / 500) !== Math.floor((time - frameMs) / 500)) {
      scene.disturb(400, 300, 50);
    }
    scheduler.runFrame(time);
  }
  return setup;
}

describe("WaveScene", () => {
  it("draws right away when resized, even before it starts", () => {
    const renderer = new CountingRenderer();
    const scene = new WaveScene({
      simulation: new WaveSimulation({ spacing: 20, damping: 0.99, brushRadius: 2 }),
      renderer,
      scheduler: new FakeScheduler(),
    });
    scene.resize(400, 300, 2);
    expect(renderer.renders).toBe(1);
    expect(scene.running).toBe(false);
  });

  it("sleeps on a flat surface and wakes up at the next disturbance", () => {
    const { scene, scheduler } = createScene(0.9);
    scene.disturb(400, 300, 10);
    let time = 0;
    while (scheduler.hasPendingFrame && time < 60_000) {
      time += 1000 / 60;
      scheduler.runFrame(time);
    }
    expect(scene.animating).toBe(false);
    expect(scene.running).toBe(true);

    scene.disturb(100, 100, 10);
    expect(scene.animating).toBe(true);
  });

  it("plans nothing after stop and disposes of the renderer", () => {
    const { scene, scheduler, renderer } = createScene();
    scene.disturb(400, 300, 10);
    scene.stop();
    expect(scheduler.hasPendingFrame).toBe(false);
    scene.disturb(400, 300, 10);
    expect(scheduler.hasPendingFrame).toBe(false);

    scene.dispose();
    expect(renderer.disposed).toBe(true);
  });

  it.each([
    { screen: "60 Hz", frameMs: 1000 / 60, renders: 60 },
    { screen: "120 Hz", frameMs: 1000 / 120, renders: 60 },
    { screen: "144 Hz", frameMs: 1000 / 144, renders: 60 },
    { screen: "30 Hz", frameMs: 1000 / 30, renders: 30 },
  ])("advances 60 steps per second on a $screen screen", ({ frameMs, renders }) => {
    const { simulation, renderer } = runFor(5, frameMs);
    expect(simulation.steps / 5).toBeCloseTo(60, 0);
    expect(renderer.renders / 5).toBeCloseTo(renders, 0);
  });

  it("takes one step on the first frame after waking up, then at most 4 after a pause", () => {
    const { scene, scheduler, simulation } = createScene();
    scene.disturb(400, 300, 50);
    scheduler.runFrame(1000);
    expect(simulation.steps).toBe(1);

    scheduler.runFrame(6000);
    expect(simulation.steps).toBe(5);
  });
});
