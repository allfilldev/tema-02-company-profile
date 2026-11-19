import { describe, expect, it } from "vitest";
import { createSiteQueries } from "@/core/application/site/site-queries";
import { themeConfig } from "@/config/theme";
import { createFixtureRepositories } from "@/infrastructure/fixtures/fixture-repositories";
import { getAboutPageModel } from "@/server/site/models/about";
import { getArticleDetailModel } from "@/server/site/models/articles";
import { getLegalPageModel } from "@/server/site/models/legal";
import { getPortfolioDetailModel } from "@/server/site/models/portfolio";
import { getServiceDetailModel } from "@/server/site/models/services";
import { buildTestContext } from "../../../fixtures/site";
import { buildTestPack } from "../../../fixtures/content-pack";

const COVER_URL = "/demo/nusa-karya/article-memilih-jasa-website.webp";

async function buildSubjects() {
  const pack = buildTestPack();
  pack.articles[0] = { ...pack.articles[0], cover: { ...pack.articles[0].cover!, width: 900, height: 600 } };
  const queries = createSiteQueries(createFixtureRepositories(pack), themeConfig);
  return { pack, queries, context: await buildTestContext() };
}

describe("page models carry the media sizes of the library", () => {
  it("the article detail model includes the cover and every other library image", async () => {
    const { pack, queries, context } = await buildSubjects();

    const model = await getArticleDetailModel(queries, context, pack.articles[0].slug);

    expect(model!.mediaSizes[COVER_URL]).toEqual({ width: 900, height: 600 });
    expect(model!.mediaSizes[pack.services[0].cover!.url]).toEqual({ width: 1200, height: 800 });
  });

  it("the service and portfolio detail models include them", async () => {
    const { pack, queries, context } = await buildSubjects();

    const service = await getServiceDetailModel(queries, context, pack.services[0].slug);
    const portfolio = await getPortfolioDetailModel(queries, context, pack.portfolio[0].slug);

    expect(service!.mediaSizes[pack.services[0].cover!.url]).toEqual({ width: 1200, height: 800 });
    expect(portfolio!.mediaSizes[pack.portfolio[0].cover!.url]).toEqual({ width: 1200, height: 800 });
  });

  it("the about and legal models include them", async () => {
    const { queries, context } = await buildSubjects();

    const about = await getAboutPageModel(queries, context);
    const legal = await getLegalPageModel(queries, context, "privasi");

    expect(about.mediaSizes[COVER_URL]).toEqual({ width: 900, height: 600 });
    expect(legal!.mediaSizes[COVER_URL]).toEqual({ width: 900, height: 600 });
  });
});
