import type { Article, ArticlePage, ArticleWithAuthor } from "@/core/domain/article/article";
import type { Repositories } from "@/core/domain/repositories";
import type { ThemeConfig } from "@/core/domain/theme/theme-config";
import { isModuleEnabled } from "@/core/application/site/module-guard";

export const ARTICLES_PER_PAGE = 9;

const DEFAULT_RELATED_LIMIT = 3;

export type ArticleQueries = {
  listAllArticles(): Promise<Article[]>;
  listArticles(page: number): Promise<ArticlePage | null>;
  getArticle(slug: string): Promise<ArticleWithAuthor | null>;
  listRelatedArticles(slug: string, limit?: number): Promise<Article[]>;
};

export function createArticleQueries(repositories: Repositories, theme: ThemeConfig): ArticleQueries {
  return {
    async listAllArticles() {
      return isModuleEnabled(theme, "articles") ? repositories.articles.listAllPublished() : [];
    },
    async listArticles(page) {
      if (!isModuleEnabled(theme, "articles") || !Number.isInteger(page) || page < 1) {
        return null;
      }

      const { items, total } = await repositories.articles.listPublished({
        offset: (page - 1) * ARTICLES_PER_PAGE,
        limit: ARTICLES_PER_PAGE,
      });
      const pageCount = Math.max(1, Math.ceil(total / ARTICLES_PER_PAGE));

      if (page > pageCount) {
        return null;
      }

      return { items, page, pageCount, total };
    },
    async getArticle(slug) {
      if (!isModuleEnabled(theme, "articles")) {
        return null;
      }

      const article = await repositories.articles.findPublishedBySlug(slug);
      if (!article) {
        return null;
      }

      const author = await repositories.team.findById(article.authorId);
      if (!author) {
        throw new Error(`Author ${article.authorId} of article ${article.slug} was not found in team data`);
      }

      return { ...article, author };
    },
    async listRelatedArticles(slug, limit = DEFAULT_RELATED_LIMIT) {
      if (!isModuleEnabled(theme, "articles")) {
        return [];
      }

      const { items } = await repositories.articles.listPublished({ offset: 0, limit: limit + 1 });
      return items.filter((article) => article.slug !== slug).slice(0, limit);
    },
  };
}
