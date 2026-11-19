import type { SiteQueries } from "@/core/application/site/site-queries";
import type { ArticleWithAuthor } from "@/core/domain/article/article";
import { newestIsoDate } from "@/lib/seo/dates";
import { buildLlmsTxt } from "@/lib/seo/llms";
import { buildRssXml } from "@/lib/seo/rss";
import type { SitemapPage } from "@/lib/seo/sitemap";
import { articlePageHref } from "@/lib/site/article-pages";
import { LEGAL_LINKS } from "@/server/site/navigation";
import type { SiteContext } from "@/server/site/site-context";
import { SITE_ROUTES } from "@/lib/site/routes";

function toIso(isoDate: string): string {
  return new Date(isoDate).toISOString();
}

async function getLegalPages(queries: SiteQueries): Promise<SitemapPage[]> {
  const legalPages = await Promise.all(LEGAL_LINKS.map((link) => queries.getLegalPage(link.slug)));

  return legalPages.flatMap((page, index) =>
    page ? [{ path: LEGAL_LINKS[index].href, lastModified: toIso(page.updatedAt) }] : [],
  );
}

async function getServicePages(queries: SiteQueries, fallbackDate: string): Promise<SitemapPage[]> {
  if (!queries.isModuleEnabled("services")) {
    return [];
  }

  const services = await queries.listServices();
  return [
    { path: SITE_ROUTES.services, lastModified: newestIsoDate(services.map((service) => service.updatedAt), fallbackDate) },
    ...services.map((service) => ({ path: `${SITE_ROUTES.services}/${service.slug}`, lastModified: toIso(service.updatedAt) })),
  ];
}

async function getPortfolioPages(queries: SiteQueries, fallbackDate: string): Promise<SitemapPage[]> {
  if (!queries.isModuleEnabled("portfolio")) {
    return [];
  }

  const items = await queries.listPortfolio();
  return [
    { path: SITE_ROUTES.portfolio, lastModified: newestIsoDate(items.map((item) => item.updatedAt), fallbackDate) },
    ...items.map((item) => ({ path: `${SITE_ROUTES.portfolio}/${item.slug}`, lastModified: toIso(item.updatedAt) })),
  ];
}

async function getArticlePages(queries: SiteQueries, fallbackDate: string): Promise<SitemapPage[]> {
  const firstPage = await queries.listArticles(1);
  if (!firstPage) {
    return [];
  }

  const laterPageNumbers = Array.from({ length: firstPage.pageCount - 1 }, (_, index) => index + 2);
  const [laterPages, articles] = await Promise.all([
    Promise.all(laterPageNumbers.map((page) => queries.listArticles(page))),
    queries.listAllArticles(),
  ]);

  const listPages = [firstPage, ...laterPages].flatMap((articlePage) =>
    articlePage
      ? [
          {
            path: articlePageHref(articlePage.page),
            lastModified: newestIsoDate(
              articlePage.items.map((article) => article.updatedAt),
              fallbackDate,
            ),
          },
        ]
      : [],
  );

  return [
    ...listPages,
    ...articles.map((article) => ({ path: `${SITE_ROUTES.articles}/${article.slug}`, lastModified: toIso(article.updatedAt) })),
  ];
}

export async function getSitemapPages(queries: SiteQueries, context: SiteContext): Promise<SitemapPage[]> {
  const { settings } = context;
  const [home, about] = await Promise.all([queries.getHome(), queries.getAbout()]);
  const fallbackDate = toIso(settings.updatedAt);

  const [legalPages, servicePages, portfolioPages, articlePages] = await Promise.all([
    getLegalPages(queries),
    getServicePages(queries, fallbackDate),
    getPortfolioPages(queries, fallbackDate),
    getArticlePages(queries, fallbackDate),
  ]);

  return [
    { path: "/", lastModified: newestIsoDate([settings.updatedAt, home.updatedAt], settings.updatedAt) },
    { path: SITE_ROUTES.about, lastModified: toIso(about.updatedAt) },
    { path: SITE_ROUTES.contact, lastModified: fallbackDate },
    ...legalPages,
    ...servicePages,
    ...portfolioPages,
    ...articlePages,
  ];
}

async function listArticlesWithAuthors(queries: SiteQueries): Promise<ArticleWithAuthor[]> {
  const articles = await queries.listAllArticles();
  const authorIds = [...new Set(articles.map((article) => article.authorId))];
  const authors = await Promise.all(authorIds.map((id) => queries.getAuthor(id)));
  const authorsById = new Map(
    authorIds.map((id, index) => {
      const author = authors[index];
      if (!author) {
        throw new Error(`Author ${id} was not found in team data`);
      }
      return [id, author] as const;
    }),
  );

  return articles.map((article) => {
    const author = authorsById.get(article.authorId);
    if (!author) {
      throw new Error(`Author ${article.authorId} was not found in team data`);
    }
    return { ...article, author };
  });
}

export async function getRssXml(queries: SiteQueries, context: SiteContext): Promise<string | null> {
  if (!queries.isModuleEnabled("articles")) {
    return null;
  }

  const articles = await listArticlesWithAuthors(queries);
  return buildRssXml({ siteUrl: context.env.siteUrl, settings: context.settings, articles });
}

export async function getLlmsTxt(queries: SiteQueries, context: SiteContext): Promise<string> {
  const [services, articles] = await Promise.all([queries.listServices(), queries.listAllArticles()]);

  return buildLlmsTxt({
    siteUrl: context.env.siteUrl,
    settings: context.settings,
    navigation: context.navigation,
    services,
    articles,
  });
}
