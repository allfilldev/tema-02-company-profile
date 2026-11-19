import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config";

describe("next.config", () => {
  it("limits server action bodies to 4mb so a downscaled upload fits under the Vercel request limit", () => {
    expect(nextConfig.experimental?.serverActions?.bodySizeLimit).toBe("4mb");
  });

  it("declares image remote patterns as an array", () => {
    expect(Array.isArray(nextConfig.images?.remotePatterns)).toBe(true);
  });
});
