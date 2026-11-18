import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { OgCard } from "@/components/site/og/og-card";
import { OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/lib/seo/og";
import { buildSlugStaticParams } from "@/lib/site/static-params";
import { getSiteQueries } from "@/server/container";
import { listServiceSlugs } from "@/server/site/models/services";

type ServiceImageProps = {
  params: Promise<{ slug: string }>;
};

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export async function generateStaticParams() {
  const slugs = await listServiceSlugs(getSiteQueries());
  return buildSlugStaticParams(slugs);
}

export default async function Image({ params }: ServiceImageProps) {
  const { slug } = await params;
  const queries = getSiteQueries();
  const [service, settings] = await Promise.all([queries.getService(slug), queries.getSettings()]);
  if (!service) {
    notFound();
  }

  return new ImageResponse(<OgCard eyebrow="Layanan" title={service.title} footer={settings.siteName} />, {
    ...OG_IMAGE_SIZE,
  });
}
