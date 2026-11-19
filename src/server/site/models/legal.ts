import type { SiteQueries } from "@/core/application/site/site-queries";
import type { MediaSizes } from "@/core/domain/shared/media-asset";
import { LEGAL_SLUGS, type LegalPage, type LegalSlug } from "@/core/domain/page/legal-page";
import type { SiteContext } from "@/server/site/site-context";
import { buildPageSeo, HOME_BREADCRUMB, type PageSeoResult } from "@/server/site/models/page-seo";

export type LegalPageModel = {
  seo: PageSeoResult;
  page: LegalPage;
  mediaSizes: MediaSizes;
};

function isLegalSlug(slug: string): slug is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(slug);
}

export async function getLegalPageModel(
  queries: SiteQueries,
  context: SiteContext,
  slug: string,
): Promise<LegalPageModel | null> {
  if (!isLegalSlug(slug)) {
    return null;
  }

  const [page, mediaSizes] = await Promise.all([queries.getLegalPage(slug), queries.getMediaSizes()]);
  if (!page) {
    return null;
  }

  const path = `/${page.slug}`;

  return {
    seo: buildPageSeo(context, {
      path,
      title: page.title,
      description: page.metaDescription,
      ogImagePath: null,
      breadcrumbs: [HOME_BREADCRUMB, { name: page.title, path }],
      jsonLd: [],
    }),
    page,
    mediaSizes,
  };
}
