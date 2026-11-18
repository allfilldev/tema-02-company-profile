import type { FaqItem } from "@/core/domain/shared/faq-item";
import type { MediaAsset } from "@/core/domain/shared/media-asset";
import type { TeamMember } from "@/core/domain/team/team-member";

export type Article = {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  lead: string;
  bodyMd: string;
  cover: MediaAsset | null;
  authorId: string;
  faq: FaqItem[];
  publishedAt: string;
  updatedAt: string;
};

export type ArticleWithAuthor = Article & { author: TeamMember };

export type ArticlePage = {
  items: Article[];
  page: number;
  pageCount: number;
  total: number;
};
