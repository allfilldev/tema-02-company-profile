import type { SiteQueries } from "@/core/application/site/site-queries";
import type { Article } from "@/core/domain/article/article";
import type { ContentBlock, ContentBlockItem } from "@/core/domain/content-block/content-block";
import type { AboutContent } from "@/core/domain/page/about-content";
import type { CompanyVision } from "@/core/domain/page/company-vision";
import type { HomeContent } from "@/core/domain/page/home-content";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { Partner } from "@/core/domain/partner/partner";
import type { PortfolioItem } from "@/core/domain/portfolio/portfolio-item";
import type { Service } from "@/core/domain/service/service";
import { SECTION_KEYS, type SectionKey } from "@/core/domain/shared/section-key";
import type { Stat } from "@/core/domain/stat/stat";
import type { TeamMember } from "@/core/domain/team/team-member";
import type { Testimonial } from "@/core/domain/testimonial/testimonial";
import type { CallToAction } from "@/core/domain/shared/call-to-action";
import type { ModuleKey } from "@/core/domain/shared/module-key";
import { isHrefAvailable } from "@/lib/site/href-availability";
import type { SiteContext } from "@/server/site/site-context";
import { buildPageSeo, collectSectionIntros, HOME_BREADCRUMB, type PageSeoResult } from "@/server/site/models/page-seo";

const FEATURED_PORTFOLIO_LIMIT = 3;
const LATEST_ARTICLES_LIMIT = 3;

export type HomePageModel = {
  seo: PageSeoResult;
  hero: HomeContent;
  intros: Partial<Record<SectionKey, SectionIntro>>;
  about: AboutContent;
  vision: CompanyVision | null;
  services: Service[];
  featuredPortfolio: PortfolioItem[];
  team: TeamMember[];
  stats: Stat[];
  testimonials: Testimonial[];
  partners: Partner[];
  latestArticles: Article[];
  blocks: Partial<Record<string, ContentBlock>>;
};

function availableCta(cta: CallToAction | null, enabledModules: readonly ModuleKey[]): CallToAction | null {
  return cta && isHrefAvailable(cta.href, enabledModules) ? cta : null;
}

function hasOwnContent(item: ContentBlockItem): boolean {
  return Boolean(item.title || item.description || item.icon || item.media);
}

function keepAvailableItems(items: ContentBlockItem[], enabledModules: readonly ModuleKey[]): ContentBlockItem[] {
  return items.flatMap((item) => {
    if (!item.link || isHrefAvailable(item.link.href, enabledModules)) {
      return [item];
    }
    return hasOwnContent(item) ? [{ ...item, link: null }] : [];
  });
}

async function collectBlocks(queries: SiteQueries, context: SiteContext): Promise<Partial<Record<string, ContentBlock>>> {
  const blocks: Partial<Record<string, ContentBlock>> = {};
  for (const definition of context.theme.contentBlocks) {
    const block = await queries.getContentBlock(definition.key);
    if (!block) {
      continue;
    }
    const items = keepAvailableItems(block.items, context.theme.enabledModules);
    if (items.length > 0) {
      blocks[definition.key] = { ...block, items };
    }
  }
  return blocks;
}

export async function getHomePageModel(queries: SiteQueries, context: SiteContext): Promise<HomePageModel> {
  const [
    homeContent,
    intros,
    about,
    vision,
    services,
    portfolio,
    team,
    stats,
    testimonials,
    partners,
    articles,
    blocks,
  ] = await Promise.all([
    queries.getHome(),
    collectSectionIntros(queries, SECTION_KEYS),
    queries.getAbout(),
    queries.getVision(),
    queries.listServices(),
    queries.listPortfolio(),
    queries.listTeam(),
    queries.listStats(),
    queries.listTestimonials(),
    queries.listPartners(),
    queries.listAllArticles(),
    collectBlocks(queries, context),
  ]);

  const { enabledModules } = context.theme;
  const hero: HomeContent = {
    ...homeContent,
    primaryCta: availableCta(homeContent.primaryCta, enabledModules),
    secondaryCta: availableCta(homeContent.secondaryCta, enabledModules),
  };

  return {
    seo: buildPageSeo(context, {
      path: "/",
      title: hero.metaTitle,
      description: hero.metaDescription,
      ogImagePath: null,
      breadcrumbs: [HOME_BREADCRUMB],
      jsonLd: [],
    }),
    hero,
    intros,
    about,
    vision,
    services,
    featuredPortfolio: portfolio.slice(0, FEATURED_PORTFOLIO_LIMIT),
    team,
    stats,
    testimonials,
    partners,
    latestArticles: articles.slice(0, LATEST_ARTICLES_LIMIT),
    blocks,
  };
}
