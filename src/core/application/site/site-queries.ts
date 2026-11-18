import type { Repositories } from "@/core/domain/repositories";
import type { ModuleKey } from "@/core/domain/shared/module-key";
import type { ThemeConfig } from "@/core/domain/theme/theme-config";
import { createArticleQueries, type ArticleQueries } from "@/core/application/site/article-queries";
import { createCatalogQueries, type CatalogQueries } from "@/core/application/site/catalog-queries";
import { isModuleEnabled } from "@/core/application/site/module-guard";
import { createPageQueries, type PageQueries } from "@/core/application/site/page-queries";

export { ARTICLES_PER_PAGE } from "@/core/application/site/article-queries";
export { isModuleEnabled } from "@/core/application/site/module-guard";

export type SiteQueries = PageQueries &
  CatalogQueries &
  ArticleQueries & {
    isModuleEnabled(key: ModuleKey): boolean;
  };

export function createSiteQueries(repositories: Repositories, theme: ThemeConfig): SiteQueries {
  return {
    isModuleEnabled: (key) => isModuleEnabled(theme, key),
    ...createPageQueries(repositories, theme),
    ...createCatalogQueries(repositories, theme),
    ...createArticleQueries(repositories, theme),
  };
}
