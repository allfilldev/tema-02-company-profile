import type { Metadata } from "next";
import type { SeoSite } from "@/lib/seo/metadata";
import { buildPageTitle } from "@/lib/seo/title";
import { NOT_FOUND_TITLE } from "@/lib/site/not-found";

export function buildNotFoundMetadata(site: SeoSite): Metadata {
  return {
    title: { absolute: buildPageTitle(NOT_FOUND_TITLE, site.siteName) },
    robots: { index: false, follow: false },
  };
}
