import { ImageResponse } from "next/og";
import { OgCard } from "@/components/site/og/og-card";
import { OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/lib/seo/og";
import { getSiteQueries } from "@/server/container";

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default async function Image() {
  const settings = await getSiteQueries().getSettings();

  return new ImageResponse(<OgCard title={settings.siteName} subtitle={settings.tagline} />, { ...OG_IMAGE_SIZE });
}
