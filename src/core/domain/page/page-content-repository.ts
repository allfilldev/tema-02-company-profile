import type { AboutContent } from "@/core/domain/page/about-content";
import type { CompanyVision } from "@/core/domain/page/company-vision";
import type { HomeContent } from "@/core/domain/page/home-content";
import type { LegalPage, LegalSlug } from "@/core/domain/page/legal-page";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { SectionKey } from "@/core/domain/shared/section-key";

export interface PageContentRepository {
  getHome(): Promise<HomeContent>;
  getAbout(): Promise<AboutContent>;
  getVision(): Promise<CompanyVision>;
  findSectionIntro(key: SectionKey): Promise<SectionIntro | null>;
  findLegalPage(slug: LegalSlug): Promise<LegalPage | null>;
}
