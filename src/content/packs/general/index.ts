import type { ContentPack } from "@/core/domain/content-pack/content-pack";
import { generalAbout } from "@/content/packs/general/about";
import { caraMenyusunSopUmkmArticle } from "@/content/packs/general/articles/cara-menyusun-sop-umkm";
import { langkahAwalTransformasiDigitalArticle } from "@/content/packs/general/articles/langkah-awal-transformasi-digital";
import { menentukanKpiOperasionalArticle } from "@/content/packs/general/articles/menentukan-kpi-operasional";
import { generalContentBlocks } from "@/content/packs/general/content-blocks";
import { generalHome } from "@/content/packs/general/home";
import { generalLegalPages } from "@/content/packs/general/legal-pages";
import { generalPartners } from "@/content/packs/general/partners";
import { generalPortfolio } from "@/content/packs/general/portfolio";
import { generalSectionIntros } from "@/content/packs/general/section-intros";
import { generalServices } from "@/content/packs/general/services";
import { generalSettings } from "@/content/packs/general/settings";
import { generalStats } from "@/content/packs/general/stats";
import { generalTeam } from "@/content/packs/general/team";
import { generalTestimonials } from "@/content/packs/general/testimonials";
import { generalVision } from "@/content/packs/general/vision";

export const generalPack: ContentPack = {
  settings: generalSettings,
  home: generalHome,
  sectionIntros: generalSectionIntros,
  about: generalAbout,
  vision: generalVision,
  services: generalServices,
  portfolio: generalPortfolio,
  team: generalTeam,
  stats: generalStats,
  testimonials: generalTestimonials,
  partners: generalPartners,
  articles: [caraMenyusunSopUmkmArticle, langkahAwalTransformasiDigitalArticle, menentukanKpiOperasionalArticle],
  contentBlocks: generalContentBlocks,
  legalPages: generalLegalPages,
};
