import type { SiteQueries } from "@/core/application/site/site-queries";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { SiteSettings } from "@/core/domain/settings/site-settings";
import type { SiteContext } from "@/server/site/site-context";
import {
  buildPageSeo,
  HOME_BREADCRUMB,
  requireSectionIntro,
  type PageSeoResult,
} from "@/server/site/models/page-seo";

const CONTACT_PATH = "/kontak";

export type ContactPageModel = {
  seo: PageSeoResult;
  intro: SectionIntro;
  settings: SiteSettings;
  whatsappUrl: string;
  isDemo: boolean;
};

export async function getContactPageModel(queries: SiteQueries, context: SiteContext): Promise<ContactPageModel> {
  const intro = await requireSectionIntro(queries, "contact");

  return {
    seo: buildPageSeo(context, {
      path: CONTACT_PATH,
      title: intro.metaTitle,
      description: intro.metaDescription,
      ogImagePath: null,
      breadcrumbs: [HOME_BREADCRUMB, { name: "Kontak", path: CONTACT_PATH }],
      jsonLd: [],
    }),
    intro,
    settings: context.settings,
    whatsappUrl: context.whatsappUrl,
    isDemo: context.env.isDemo,
  };
}
