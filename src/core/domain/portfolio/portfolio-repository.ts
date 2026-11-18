import type { PortfolioItem } from "@/core/domain/portfolio/portfolio-item";

export interface PortfolioRepository {
  listPublished(): Promise<PortfolioItem[]>;
  findPublishedBySlug(slug: string): Promise<PortfolioItem | null>;
}
