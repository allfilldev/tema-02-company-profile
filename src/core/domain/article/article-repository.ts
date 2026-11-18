import type { Article } from "@/core/domain/article/article";

export interface ArticleRepository {
  listPublished(range: { offset: number; limit: number }): Promise<{ items: Article[]; total: number }>;
  findPublishedBySlug(slug: string): Promise<Article | null>;
}
