import type { Partner } from "@/core/domain/partner/partner";
import type { PortfolioItem } from "@/core/domain/portfolio/portfolio-item";
import type { Repositories } from "@/core/domain/repositories";
import type { Service } from "@/core/domain/service/service";
import type { Stat } from "@/core/domain/stat/stat";
import type { TeamMember } from "@/core/domain/team/team-member";
import type { Testimonial } from "@/core/domain/testimonial/testimonial";
import type { ThemeConfig } from "@/core/domain/theme/theme-config";
import { isModuleEnabled } from "@/core/application/site/module-guard";

export type CatalogQueries = {
  listServices(): Promise<Service[]>;
  getService(slug: string): Promise<Service | null>;
  listPortfolio(): Promise<PortfolioItem[]>;
  getPortfolioItem(slug: string): Promise<PortfolioItem | null>;
  listTeam(): Promise<TeamMember[]>;
  getAuthor(id: string): Promise<TeamMember | null>;
  listStats(): Promise<Stat[]>;
  getStatByKey(key: string): Promise<Stat | null>;
  listTestimonials(): Promise<Testimonial[]>;
  listPartners(): Promise<Partner[]>;
};

export function createCatalogQueries(repositories: Repositories, theme: ThemeConfig): CatalogQueries {
  return {
    async listServices() {
      return isModuleEnabled(theme, "services") ? repositories.services.listPublished() : [];
    },
    async getService(slug) {
      return isModuleEnabled(theme, "services") ? repositories.services.findPublishedBySlug(slug) : null;
    },
    async listPortfolio() {
      return isModuleEnabled(theme, "portfolio") ? repositories.portfolio.listPublished() : [];
    },
    async getPortfolioItem(slug) {
      return isModuleEnabled(theme, "portfolio") ? repositories.portfolio.findPublishedBySlug(slug) : null;
    },
    async listTeam() {
      return isModuleEnabled(theme, "team") ? repositories.team.listPublished() : [];
    },
    getAuthor: (id) => repositories.team.findById(id),
    async listStats() {
      return isModuleEnabled(theme, "stats") ? repositories.stats.list() : [];
    },
    async getStatByKey(key) {
      const stats = await repositories.stats.list();
      return stats.find((stat) => stat.key === key) ?? null;
    },
    async listTestimonials() {
      return isModuleEnabled(theme, "testimonials") ? repositories.testimonials.listPublished() : [];
    },
    async listPartners() {
      return isModuleEnabled(theme, "partners") ? repositories.partners.listPublished() : [];
    },
  };
}
