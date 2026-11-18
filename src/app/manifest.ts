import type { MetadataRoute } from "next";
import { buildManifest } from "@/lib/seo/manifest";
import { getSiteQueries } from "@/server/container";
import { ogTheme } from "@/styles/tokens";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteQueries().getSettings();
  return buildManifest(settings, { themeColor: ogTheme.primary, backgroundColor: ogTheme.background });
}
