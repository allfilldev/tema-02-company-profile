import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { OgCard } from "@/components/site/og/og-card";
import { OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/lib/seo/og";
import { buildSlugStaticParams } from "@/lib/site/static-params";
import { getSiteQueries } from "@/server/container";
import { listPortfolioSlugs } from "@/server/site/models/portfolio";

type PortfolioImageProps = {
  params: Promise<{ slug: string }>;
};

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export async function generateStaticParams() {
  const slugs = await listPortfolioSlugs(getSiteQueries());
  return buildSlugStaticParams(slugs);
}

export default async function Image({ params }: PortfolioImageProps) {
  const { slug } = await params;
  const queries = getSiteQueries();
  const [item, settings] = await Promise.all([queries.getPortfolioItem(slug), queries.getSettings()]);
  if (!item) {
    notFound();
  }

  return new ImageResponse(<OgCard eyebrow="Portofolio" title={item.title} footer={settings.siteName} />, {
    ...OG_IMAGE_SIZE,
  });
}
