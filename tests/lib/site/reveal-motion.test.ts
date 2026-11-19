import { describe, expect, it } from "vitest";
import { MAX_STAGGER_STEPS, staggerDelayMs } from "@/lib/site/reveal-motion";

describe("staggerDelayMs", () => {
  it("returns zero for the first item", () => {
    expect(staggerDelayMs(0)).toBe(0);
  });

  it("multiplies the index by the default step", () => {
    expect(staggerDelayMs(3)).toBe(240);
  });

  it("caps long lists", () => {
    expect(staggerDelayMs(12)).toBe(MAX_STAGGER_STEPS * 80);
    expect(staggerDelayMs(12)).toBe(480);
  });

  it("accepts a custom step", () => {
    expect(staggerDelayMs(2, 100)).toBe(200);
  });

  it("treats negative indexes as zero", () => {
    expect(staggerDelayMs(-1)).toBe(0);
  });

  it("floors fractional indexes", () => {
    expect(staggerDelayMs(1.7)).toBe(80);
  });
});
