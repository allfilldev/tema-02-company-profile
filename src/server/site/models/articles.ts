import type { SiteQueries } from "@/core/application/site/site-queries";
import type { Article, ArticleWithAuthor } from "@/core/domain/article/article";
import type { MediaSizes } from "@/core/domain/shared/media-asset";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { TeamMember } from "@/core/domain/team/team-member";
import { buildArticleJsonLd, buildFaqJsonLd, type JsonLd } from "@/lib/seo/json-ld";
import { paginatedDescription } from "@/lib/seo/description";
import { fitPageTitle } from "@/lib/seo/title";
import { articlePageHref } from "@/lib/site/article-pages";
import { isReservedArticleSlug } from "@/lib/text/slug";
import type { SiteContext } from "@/server/site/site-context";
import {
  buildPageSeo,
  HOME_BREADCRUMB,
  requireSectionIntro,
  type PageSeoResult,
} from "@/server/site/models/page-seo";
import { SITE_ROUTES } from "@/lib/site/routes";

const ARTICLES_PATH = SITE_ROUTES.articles;
const ARTICLES_BREADCRUMB = { name: "Artikel", path: ARTICLES_PATH };

export type ArticleCardData = {
  article: Article;
  author: TeamMember;
};

export type AuthorFacts = {
  completedProjects: number | null;
};

export type ArticlesIndexModel = {
  seo: PageSeoResult;
  intro: SectionIntro;
  page: number;
  pageCount: number;
  items: ArticleCardData[];
  pageHrefs: string[];
};

export type ArticleDetailModel = {
  seo: PageSeoResult;
  article: ArticleWithAuthor;
  authorFacts: AuthorFacts;
  related: Article[];
  mediaSizes: MediaSizes;
};

async function resolveCard(queries: SiteQueries, article: Article): Promise<ArticleCardData> {
  const author = await queries.getAuthor(article.authorId);
  if (!author) {
    throw new Error(`Author ${article.authorId} of article ${article.slug} was not found in team data`);
  }
  return { article, author };
}

export async function getArticlesIndexModel(
  queries: SiteQueries,
  context: SiteContext,
  page: number,
): Promise<ArticlesIndexModel | null> {
  if (!queries.isModuleEnabled("articles")) {
    return null;
  }

  const articlePage = await queries.listArticles(page);
  if (!articlePage) {
    return null;
  }

  const [intro, items] = await Promise.all([
    requireSectionIntro(queries, "articles"),
    Promise.all(articlePage.items.map((article) => resolveCard(queries, article))),
  ]);
  const isFirstPage = articlePage.page === 1;
  const pageLabel = `Halaman ${articlePage.page}`;
  const title = isFirstPage
    ? intro.metaTitle
    : fitPageTitle(intro.metaTitle, ` - ${pageLabel}`, context.seoSite.siteName);
  const path = articlePageHref(articlePage.page);

  return {
    seo: buildPageSeo(context, {
      path,
      title,
      description: paginatedDescription(intro.metaDescription, articlePage.page),
      ogImagePath: null,
      breadcrumbs: isFirstPage
        ? [HOME_BREADCRUMB, ARTICLES_BREADCRUMB]
        : [HOME_BREADCRUMB, ARTICLES_BREADCRUMB, { name: pageLabel, path }],
      jsonLd: [],
    }),
    intro,
    page: articlePage.page,
    pageCount: articlePage.pageCount,
    items,
    pageHrefs: Array.from({ length: articlePage.pageCount }, (_, index) => articlePageHref(index + 1)),
  };
}

export async function getArticleDetailModel(
  queries: SiteQueries,
  context: SiteContext,
  slug: string,
): Promise<ArticleDetailModel | null> {
  const article = await queries.getArticle(slug);
  if (!article) {
    return null;
  }

  const [related, completedProjectsStat, mediaSizes] = await Promise.all([
    queries.listRelatedArticles(article.slug),
    queries.getStatByKey("completed_projects"),
    queries.getMediaSizes(),
  ]);
  const path = `${ARTICLES_PATH}/${article.slug}`;
  const faqJsonLd = buildFaqJsonLd(article.faq);
  const jsonLd: JsonLd[] = [
    buildArticleJsonLd(article, context.settings, context.env.siteUrl),
    ...(faqJsonLd ? [faqJsonLd] : []),
  ];

  return {
    seo: buildPageSeo(context, {
      path,
      title: article.metaTitle,
      description: article.metaDescription,
      ogImagePath: `${path}/opengraph-image`,
      breadcrumbs: [HOME_BREADCRUMB, ARTICLES_BREADCRUMB, { name: article.title, path }],
      jsonLd,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authorNames: [article.author.name],
    }),
    article,
    authorFacts: {
      completedProjects: completedProjectsStat?.value ?? null,
    },
    related,
    mediaSizes,
  };
}

export async function listArticleSlugs(queries: SiteQueries): Promise<string[]> {
  const articles = await queries.listAllArticles();
  return articles.map((article) => article.slug).filter((slug) => !isReservedArticleSlug(slug));
}
