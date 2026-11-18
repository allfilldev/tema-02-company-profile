import type { ContentBlock } from "@/core/domain/content-block/content-block";
import type { Repositories } from "@/core/domain/repositories";
import type { AboutContent } from "@/core/domain/page/about-content";
import type { CompanyVision } from "@/core/domain/page/company-vision";
import type { HomeContent } from "@/core/domain/page/home-content";
import type { LegalPage, LegalSlug } from "@/core/domain/page/legal-page";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { SiteSettings } from "@/core/domain/settings/site-settings";
import type { SectionKey } from "@/core/domain/shared/section-key";
import type { ThemeConfig } from "@/core/domain/theme/theme-config";
import { isModuleEnabled, isModuleKey } from "@/core/application/site/module-guard";

export type PageQueries = {
  getSettings(): Promise<SiteSettings>;
  getHome(): Promise<HomeContent>;
  getAbout(): Promise<AboutContent>;
  getVision(): Promise<CompanyVision | null>;
  getSectionIntro(key: SectionKey): Promise<SectionIntro | null>;
  getLegalPage(slug: LegalSlug): Promise<LegalPage | null>;
  getContentBlock(key: string): Promise<ContentBlock | null>;
};

export function createPageQueries(repositories: Repositories, theme: ThemeConfig): PageQueries {
  return {
    getSettings: () => repositories.siteSettings.get(),
    getHome: () => repositories.pageContent.getHome(),
    getAbout: () => repositories.pageContent.getAbout(),
    async getVision() {
      if (!isModuleEnabled(theme, "vision")) {
        return null;
      }
      return repositories.pageContent.getVision();
    },
    async getSectionIntro(key) {
      if (isModuleKey(key) && !isModuleEnabled(theme, key)) {
        return null;
      }
      return repositories.pageContent.findSectionIntro(key);
    },
    getLegalPage: (slug) => repositories.pageContent.findLegalPage(slug),
    async getContentBlock(key) {
      const isDeclared = theme.contentBlocks.some((definition) => definition.key === key);
      if (!isDeclared) {
        return null;
      }
      return repositories.contentBlocks.findPublishedByKey(key);
    },
  };
}
