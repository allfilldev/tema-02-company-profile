import { describe, expect, it } from "vitest";
import { imageFadeState } from "@/lib/site/image-fade";

describe("imageFadeState", () => {
  it("keeps an already loaded image visible", () => {
    expect(imageFadeState(true)).toBe("visible");
  });

  it("marks an image that is still loading as pending", () => {
    expect(imageFadeState(false)).toBe("pending");
  });
});
