import { describe, expect, it } from "vitest";
import { createFixtureRepositories } from "@/infrastructure/fixtures/fixture-repositories";
import { buildTestPack } from "../../fixtures/content-pack";

describe("fixture media repository", () => {
  it("lists every image of the pack exactly once", async () => {
    const pack = buildTestPack();
    const media = await createFixtureRepositories(pack).media.listAll();
    const ids = media.map((asset) => asset.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(
      expect.arrayContaining([
        "logo",
        "og-default",
        "hero",
        "about",
        "service-website",
        "portfolio-kopi",
        "portfolio-kopi-gallery",
        "team-rina",
        "partner-cloudsa",
        "article-memilih-jasa-website",
      ]),
    );
  });

  it("returns each asset with its url and real dimensions", async () => {
    const pack = buildTestPack();
    pack.articles[0] = { ...pack.articles[0], cover: { ...pack.articles[0].cover!, width: 900, height: 600 } };

    const media = await createFixtureRepositories(pack).media.listAll();

    expect(media.find((asset) => asset.id === "article-memilih-jasa-website")).toMatchObject({
      url: "/demo/nusa-karya/article-memilih-jasa-website.webp",
      width: 900,
      height: 600,
    });
  });
});
