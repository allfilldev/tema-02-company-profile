import type { SiteQueries } from "@/core/application/site/site-queries";
import type { AboutContent } from "@/core/domain/page/about-content";
import type { CompanyVision } from "@/core/domain/page/company-vision";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { MediaSizes } from "@/core/domain/shared/media-asset";
import type { SectionKey } from "@/core/domain/shared/section-key";
import type { Stat } from "@/core/domain/stat/stat";
import type { TeamMember } from "@/core/domain/team/team-member";
import { buildPersonJsonLd } from "@/lib/seo/json-ld";
import type { SiteContext } from "@/server/site/site-context";
import { buildPageSeo, collectSectionIntros, HOME_BREADCRUMB, type PageSeoResult } from "@/server/site/models/page-seo";
import { SITE_ROUTES } from "@/lib/site/routes";

const ABOUT_PATH = SITE_ROUTES.about;
const ABOUT_INTRO_KEYS: readonly SectionKey[] = ["about", "vision", "team", "stats"];

export type AboutPageModel = {
  seo: PageSeoResult;
  about: AboutContent;
  vision: CompanyVision | null;
  team: TeamMember[];
  stats: Stat[];
  intros: Partial<Record<SectionKey, SectionIntro>>;
  mediaSizes: MediaSizes;
};

export async function getAboutPageModel(queries: SiteQueries, context: SiteContext): Promise<AboutPageModel> {
  const [about, vision, team, stats, intros, mediaSizes] = await Promise.all([
    queries.getAbout(),
    queries.getVision(),
    queries.listTeam(),
    queries.listStats(),
    collectSectionIntros(queries, ABOUT_INTRO_KEYS),
    queries.getMediaSizes(),
  ]);

  return {
    seo: buildPageSeo(context, {
      path: ABOUT_PATH,
      title: about.metaTitle,
      description: about.metaDescription,
      ogImagePath: null,
      breadcrumbs: [HOME_BREADCRUMB, { name: "Tentang", path: ABOUT_PATH }],
      jsonLd: team.map((member) => buildPersonJsonLd(member, context.settings, context.env.siteUrl)),
    }),
    about,
    vision,
    team,
    stats,
    intros,
    mediaSizes,
  };
}
