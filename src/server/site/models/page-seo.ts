import type { Metadata } from "next";
import type { SiteQueries } from "@/core/application/site/site-queries";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { SectionKey } from "@/core/domain/shared/section-key";
import { buildBreadcrumbJsonLd, type BreadcrumbItem, type JsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import type { SiteContext } from "@/server/site/site-context";

export type PageSeoResult = {
  metadata: Metadata;
  jsonLd: JsonLd[];
  breadcrumbs: BreadcrumbItem[];
};

type PageSeoParams = {
  path: string;
  title: string;
  description: string;
  ogImagePath: string | null;
  breadcrumbs: BreadcrumbItem[];
  jsonLd: JsonLd[];
};

export const HOME_BREADCRUMB: BreadcrumbItem = { name: "Beranda", path: "/" };

export function buildPageSeo(context: SiteContext, params: PageSeoParams): PageSeoResult {
  const metadata = buildMetadata(
    {
      path: params.path,
      title: params.title,
      description: params.description,
      ogImagePath: params.ogImagePath,
      ogImageAlt: params.title,
      type: "website",
    },
    context.seoSite,
  );
  const breadcrumbJsonLd =
    params.breadcrumbs.length > 1 ? [buildBreadcrumbJsonLd(params.breadcrumbs, context.env.siteUrl)] : [];

  return {
    metadata,
    jsonLd: [...params.jsonLd, ...breadcrumbJsonLd],
    breadcrumbs: params.breadcrumbs,
  };
}

export async function requireSectionIntro(queries: SiteQueries, key: SectionKey): Promise<SectionIntro> {
  const intro = await queries.getSectionIntro(key);
  if (!intro) {
    throw new Error(`Section intro "${key}" is missing from site data`);
  }
  return intro;
}

export async function collectSectionIntros(
  queries: SiteQueries,
  keys: readonly SectionKey[],
): Promise<Partial<Record<SectionKey, SectionIntro>>> {
  const intros: Partial<Record<SectionKey, SectionIntro>> = {};
  for (const key of keys) {
    const intro = await queries.getSectionIntro(key);
    if (intro) {
      intros[key] = intro;
    }
  }
  return intros;
}

export function takeOthers<Item extends { slug: string }>(items: Item[], currentSlug: string, limit: number): Item[] {
  return items.filter((item) => item.slug !== currentSlug).slice(0, limit);
}
