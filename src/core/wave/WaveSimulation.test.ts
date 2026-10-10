import { describe, expect, it } from "vitest";
import { WaveSimulation } from "./WaveSimulation.ts";

/** Builds a simulation on a 400 × 300 area: 21 columns × 16 rows. */
function createSimulation(damping = 0.985) {
  const simulation = new WaveSimulation({ spacing: 20, damping, brushRadius: 2 });
  simulation.resize(400, 300);
  return simulation;
}

/** Sum of the absolute heights of all the dots. */
function totalHeight(simulation: WaveSimulation): number {
  return simulation.heights.reduce((sum, height) => sum + Math.abs(height), 0);
}

describe("WaveSimulation", () => {
  it("covers the area edges included", () => {
    const simulation = createSimulation();
    expect(simulation.columns).toBe(21);
    expect(simulation.rows).toBe(16);
    expect(simulation.heights).toHaveLength(21 * 16);
    expect(simulation.peakHeight).toBe(0);
  });

  it("rejects invalid settings", () => {
    expect(() => new WaveSimulation({ spacing: 0, damping: 0.9, brushRadius: 2 })).toThrow(
      RangeError,
    );
    expect(() => new WaveSimulation({ spacing: 20, damping: 1, brushRadius: 2 })).toThrow(
      RangeError,
    );
    expect(() => new WaveSimulation({ spacing: 20, damping: 0.9, brushRadius: 1.5 })).toThrow(
      RangeError,
    );
  });

  it("lifts the dots under a disturbance and ignores points outside the grid", () => {
    const simulation = createSimulation();
    simulation.disturb(200, 150, 10);
    expect(simulation.heights[7 * 21 + 10]).toBeGreaterThan(0);

    const before = totalHeight(simulation);
    simulation.disturb(-500, -500, 10);
    simulation.disturb(Number.NaN, 150, 10);
    expect(totalHeight(simulation)).toBe(before);
  });

  it("spreads a wave symmetrically and keeps the border at rest", () => {
    // 21 columns × 17 rows: the disturbed dot (column 10, row 8) is the exact middle.
    const simulation = new WaveSimulation({ spacing: 20, damping: 0.985, brushRadius: 2 });
    simulation.resize(400, 320);
    simulation.disturb(200, 160, 10);
    for (let step = 0; step < 20; step++) {
      simulation.step();
    }
    const { heights, columns, rows } = simulation;
    const center = 8 * columns + 10;
    expect(heights[center - 3]).toBeCloseTo(heights[center + 3], 5);
    expect(heights[center - 3 * columns]).toBeCloseTo(heights[center + 3 * columns], 5);
    for (let column = 0; column < columns; column++) {
      expect(heights[column]).toBe(0);
      expect(heights[(rows - 1) * columns + column]).toBe(0);
    }
  });

  it("loses energy over time until the surface is flat", () => {
    const simulation = createSimulation(0.9);
    simulation.disturb(200, 150, 10);
    simulation.step();
    const early = simulation.peakHeight;
    for (let step = 0; step < 400; step++) {
      simulation.step();
    }
    expect(early).toBeGreaterThan(0);
    expect(simulation.peakHeight).toBeLessThan(0.05);
  });

  it("keeps the waves when resized to the same grid, clears them otherwise", () => {
    const simulation = createSimulation();
    simulation.disturb(200, 150, 10);
    // 390 × 290 still needs 21 × 16 dots.
    simulation.resize(390, 290);
    expect(totalHeight(simulation)).toBeGreaterThan(0);

    simulation.resize(800, 600);
    expect(totalHeight(simulation)).toBe(0);
  });
});
