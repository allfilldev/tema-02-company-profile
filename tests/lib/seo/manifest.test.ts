import { describe, expect, it } from "vitest";
import { buildManifest } from "@/lib/seo/manifest";
import { buildTestPack } from "../../fixtures/content-pack";

const COLORS = { themeColor: "#0f766e", backgroundColor: "#ffffff" };

describe("buildManifest", () => {
  it("describes the site as a standalone app with the given colors", () => {
    const manifest = buildManifest(buildTestPack().settings, COLORS);

    expect(manifest).toMatchObject({
      name: "Nusa Karya",
      short_name: "Nusa Karya",
      description: "Mitra digital untuk bisnis yang ingin tumbuh",
      start_url: "/",
      display: "standalone",
      theme_color: "#0f766e",
      background_color: "#ffffff",
      lang: "id",
    });
  });

  it("declares the 192 and 512 png icons", () => {
    const manifest = buildManifest(buildTestPack().settings, COLORS);

    expect(manifest.icons).toEqual([
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ]);
  });

  it("shortens a long site name at a word boundary to at most 12 characters", () => {
    const settings = { ...buildTestPack().settings, siteName: "Arunika Solusi Digital" };
    const manifest = buildManifest(settings, COLORS);

    expect(manifest.name).toBe("Arunika Solusi Digital");
    expect(manifest.short_name).toBe("Arunika");
  });

  it("cuts a single long word at 12 characters", () => {
    const settings = { ...buildTestPack().settings, siteName: "Konsultanmanajemen" };

    expect(buildManifest(settings, COLORS).short_name).toBe("Konsultanman");
  });
});
