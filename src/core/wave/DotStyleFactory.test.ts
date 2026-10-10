import { describe, expect, it } from "vitest";
import { DotStyleFactory } from "./DotStyleFactory.ts";

describe("DotStyleFactory", () => {
  it("rounds intensities to the nearest level and clamps them", () => {
    const factory = new DotStyleFactory({ levels: 32 });
    expect(factory.levelOf(0)).toBe(0);
    expect(factory.levelOf(1)).toBe(31);
    expect(factory.levelOf(0.5)).toBe(16);
    expect(factory.levelOf(-3)).toBe(0);
    expect(factory.levelOf(7)).toBe(31);
    expect(factory.levelOf(Number.NaN)).toBe(0);
  });

  it("shares one style per level (flyweight)", () => {
    const factory = new DotStyleFactory({ levels: 32 });
    expect(factory.styleAt(5)).toBe(factory.styleAt(5));
    expect(factory.styleAt(5)).not.toBe(factory.styleAt(6));
    expect(factory.styleCount).toBe(2);
  });

  it("grows the dots from rest to crest", () => {
    const factory = new DotStyleFactory({ levels: 32 });
    expect(factory.styleAt(0).radius).toBeCloseTo(1.2);
    expect(factory.styleAt(31).radius).toBeCloseTo(2.6);
  });

  it("gives the same color as CSS and as numbers", () => {
    const factory = new DotStyleFactory({ levels: 32 });
    const rest = factory.styleAt(0);
    expect(rest.color).toBe("hsl(218 60% 40% / 0.6)");
    // hsl(218 60% 40%) is rgb(40.8, 85.68, 163.2) by the formula of the CSS Color specification.
    const [red, green, blue, alpha] = rest.rgba;
    expect(red * 255).toBeCloseTo(40.8, 1);
    expect(green * 255).toBeCloseTo(85.68, 1);
    expect(blue * 255).toBeCloseTo(163.2, 1);
    expect(alpha).toBe(0.6);
  });

  it("rejects invalid levels", () => {
    expect(() => new DotStyleFactory({ levels: 1 })).toThrow(RangeError);
    expect(() => new DotStyleFactory({ levels: 257 })).toThrow(RangeError);
    expect(() => new DotStyleFactory({ levels: 32 }).styleAt(32)).toThrow(RangeError);
  });
});
