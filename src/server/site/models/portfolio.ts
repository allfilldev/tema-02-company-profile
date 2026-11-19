import type { SiteQueries } from "@/core/application/site/site-queries";
import type { MediaSizes } from "@/core/domain/shared/media-asset";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { PortfolioItem } from "@/core/domain/portfolio/portfolio-item";
import { buildPortfolioJsonLd } from "@/lib/seo/json-ld";
import type { SiteContext } from "@/server/site/site-context";
import {
  buildPageSeo,
  HOME_BREADCRUMB,
  requireSectionIntro,
  takeOthers,
  type PageSeoResult,
} from "@/server/site/models/page-seo";
import { SITE_ROUTES } from "@/lib/site/routes";

const PORTFOLIO_PATH = SITE_ROUTES.portfolio;
const PORTFOLIO_BREADCRUMB = { name: "Portofolio", path: PORTFOLIO_PATH };
const OTHER_ITEMS_LIMIT = 3;

export type PortfolioIndexModel = {
  seo: PageSeoResult;
  intro: SectionIntro;
  items: PortfolioItem[];
};

export type PortfolioDetailModel = {
  seo: PageSeoResult;
  item: PortfolioItem;
  others: PortfolioItem[];
  mediaSizes: MediaSizes;
};

export async function getPortfolioIndexModel(
  queries: SiteQueries,
  context: SiteContext,
): Promise<PortfolioIndexModel | null> {
  if (!queries.isModuleEnabled("portfolio")) {
    return null;
  }

  const [intro, items] = await Promise.all([requireSectionIntro(queries, "portfolio"), queries.listPortfolio()]);

  return {
    seo: buildPageSeo(context, {
      path: PORTFOLIO_PATH,
      title: intro.metaTitle,
      description: intro.metaDescription,
      ogImagePath: null,
      breadcrumbs: [HOME_BREADCRUMB, PORTFOLIO_BREADCRUMB],
      jsonLd: [],
    }),
    intro,
    items,
  };
}

export async function getPortfolioDetailModel(
  queries: SiteQueries,
  context: SiteContext,
  slug: string,
): Promise<PortfolioDetailModel | null> {
  const item = await queries.getPortfolioItem(slug);
  if (!item) {
    return null;
  }

  const [items, mediaSizes] = await Promise.all([queries.listPortfolio(), queries.getMediaSizes()]);
  const path = `${PORTFOLIO_PATH}/${item.slug}`;

  return {
    seo: buildPageSeo(context, {
      path,
      title: item.metaTitle,
      description: item.metaDescription,
      ogImagePath: `${path}/opengraph-image`,
      breadcrumbs: [HOME_BREADCRUMB, PORTFOLIO_BREADCRUMB, { name: item.title, path }],
      jsonLd: [buildPortfolioJsonLd(item, context.settings, context.env.siteUrl)],
    }),
    item,
    others: takeOthers(items, item.slug, OTHER_ITEMS_LIMIT),
    mediaSizes,
  };
}

export async function listPortfolioSlugs(queries: SiteQueries): Promise<string[]> {
  const items = await queries.listPortfolio();
  return items.map((item) => item.slug);
}
