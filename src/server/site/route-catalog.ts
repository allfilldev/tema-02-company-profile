import type { SiteQueries } from "@/core/application/site/site-queries";
import type { ThemeConfig } from "@/core/domain/theme/theme-config";
import type { SiteRouteCatalog } from "@/lib/site/route-availability";
import { listArticleSlugs } from "@/server/site/models/articles";
import { listPortfolioSlugs } from "@/server/site/models/portfolio";
import { listServiceSlugs } from "@/server/site/models/services";

const SINGLE_PAGE_COUNT = 1;

export async function getSiteRouteCatalog(queries: SiteQueries, theme: ThemeConfig): Promise<SiteRouteCatalog> {
  const [serviceSlugs, portfolioSlugs, articleSlugs, firstArticlePage] = await Promise.all([
    listServiceSlugs(queries),
    listPortfolioSlugs(queries),
    listArticleSlugs(queries),
    queries.listArticles(1),
  ]);

  return {
    enabledModules: theme.enabledModules,
    serviceSlugs,
    portfolioSlugs,
    articleSlugs,
    articlePageCount: firstArticlePage?.pageCount ?? SINGLE_PAGE_COUNT,
  };
}
