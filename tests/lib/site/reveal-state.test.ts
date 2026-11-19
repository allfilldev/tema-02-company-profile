import { describe, expect, it } from "vitest";
import { resolveRevealState } from "@/lib/site/reveal-state";

describe("resolveRevealState", () => {
  it("is always visible when the user prefers reduced motion", () => {
    expect(resolveRevealState({ reducedMotion: true, intersecting: false, initiallyInViewport: false })).toBe("visible");
  });

  it("is visible when the element is already in the viewport on load", () => {
    expect(resolveRevealState({ reducedMotion: false, intersecting: false, initiallyInViewport: true })).toBe("visible");
  });

  it("is hidden below the fold until it intersects", () => {
    expect(resolveRevealState({ reducedMotion: false, intersecting: false, initiallyInViewport: false })).toBe("hidden");
  });

  it("becomes visible once it intersects", () => {
    expect(resolveRevealState({ reducedMotion: false, intersecting: true, initiallyInViewport: false })).toBe("visible");
  });
});
