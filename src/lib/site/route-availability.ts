import type { ModuleKey } from "@/core/domain/shared/module-key";
import { parseArticlePageParam } from "./article-pages";

export const NOT_FOUND_REWRITE_PATH = "/_tidak-ditemukan";

export type SiteRouteCatalog = {
  enabledModules: readonly ModuleKey[];
  serviceSlugs: readonly string[];
  portfolioSlugs: readonly string[];
  articleSlugs: readonly string[];
  articlePageCount: number;
};

const ARTICLE_PAGES_SEGMENT = "halaman";

function decodeSegments(pathname: string): string[] | null {
  try {
    return pathname
      .split("/")
      .filter((segment) => segment.length > 0)
      .map((segment) => decodeURIComponent(segment));
  } catch {
    return null;
  }
}

function isCatalogPathAvailable(
  module: ModuleKey,
  slugs: readonly string[],
  rest: string[],
  catalog: SiteRouteCatalog,
): boolean {
  if (!catalog.enabledModules.includes(module)) {
    return false;
  }
  return rest.length === 1 ? slugs.includes(rest[0]) : true;
}

function isArticlePathAvailable(rest: string[], catalog: SiteRouteCatalog): boolean {
  if (!catalog.enabledModules.includes("articles")) {
    return false;
  }

  const [first, second, ...deeper] = rest;

  if (first === undefined) {
    return true;
  }
  if (second === undefined) {
    return catalog.articleSlugs.includes(first);
  }
  if (first !== ARTICLE_PAGES_SEGMENT || deeper.length > 0) {
    return true;
  }

  const page = parseArticlePageParam(second);
  return page !== null && page <= catalog.articlePageCount;
}

export function isSitePathAvailable(pathname: string, catalog: SiteRouteCatalog): boolean {
  const segments = decodeSegments(pathname);

  if (segments === null) {
    return false;
  }

  const [section, ...rest] = segments;

  if (section === "layanan") {
    return isCatalogPathAvailable("services", catalog.serviceSlugs, rest, catalog);
  }
  if (section === "portofolio") {
    return isCatalogPathAvailable("portfolio", catalog.portfolioSlugs, rest, catalog);
  }
  if (section === "artikel") {
    return isArticlePathAvailable(rest, catalog);
  }
  return true;
}
