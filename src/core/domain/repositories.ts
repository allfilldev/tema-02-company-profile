import type { ArticleRepository } from "@/core/domain/article/article-repository";
import type { ContentBlockRepository } from "@/core/domain/content-block/content-block-repository";
import type { PageContentRepository } from "@/core/domain/page/page-content-repository";
import type { PartnerRepository } from "@/core/domain/partner/partner-repository";
import type { PortfolioRepository } from "@/core/domain/portfolio/portfolio-repository";
import type { ServiceRepository } from "@/core/domain/service/service-repository";
import type { SiteSettingsRepository } from "@/core/domain/settings/site-settings-repository";
import type { StatRepository } from "@/core/domain/stat/stat-repository";
import type { TeamRepository } from "@/core/domain/team/team-repository";
import type { TestimonialRepository } from "@/core/domain/testimonial/testimonial-repository";

export type Repositories = {
  siteSettings: SiteSettingsRepository;
  pageContent: PageContentRepository;
  services: ServiceRepository;
  portfolio: PortfolioRepository;
  team: TeamRepository;
  stats: StatRepository;
  testimonials: TestimonialRepository;
  partners: PartnerRepository;
  articles: ArticleRepository;
  contentBlocks: ContentBlockRepository;
};
