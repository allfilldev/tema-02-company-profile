import type { Metadata } from "next";
import { buildPageTitle } from "@/lib/seo/title";
import { absoluteAssetUrl, absoluteUrl } from "@/lib/seo/site-url";

export type SeoSite = {
  siteName: string;
  siteUrl: string;
  indexingEnabled: boolean;
  defaultOgImagePath: string;
  defaultOgImageAlt: string;
};

export type PageSeoInput = {
  path: string;
  title: string;
  description: string;
  ogImagePath: string | null;
  ogImageAlt: string | null;
  type: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authorNames?: string[];
  forceNoIndex?: boolean;
};

type OpenGraphMetadata = NonNullable<Metadata["openGraph"]>;

const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

export function buildMetadata(input: PageSeoInput, site: SeoSite): Metadata {
  const fullTitle = buildPageTitle(input.title, site.siteName);
  const canonical = absoluteUrl(site.siteUrl, input.path);
  const useDefaultImage = input.ogImagePath === null;
  const imageUrl = absoluteAssetUrl(site.siteUrl, input.ogImagePath ?? site.defaultOgImagePath);
  const imageAlt = useDefaultImage ? site.defaultOgImageAlt : (input.ogImageAlt ?? input.title);
  const indexable = site.indexingEnabled && !input.forceNoIndex;

  const openGraphBase = {
    title: fullTitle,
    description: input.description,
    url: canonical,
    siteName: site.siteName,
    locale: "id_ID",
    images: [{ url: imageUrl, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, alt: imageAlt }],
  };

  const openGraph: OpenGraphMetadata =
    input.type === "article"
      ? {
          ...openGraphBase,
          type: "article",
          ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
          ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
          ...(input.authorNames && input.authorNames.length > 0 ? { authors: input.authorNames } : {}),
        }
      : { ...openGraphBase, type: "website" };

  return {
    title: { absolute: fullTitle },
    description: input.description,
    alternates: { canonical },
    robots: { index: indexable, follow: indexable },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: input.description,
      images: [imageUrl],
    },
  };
}
