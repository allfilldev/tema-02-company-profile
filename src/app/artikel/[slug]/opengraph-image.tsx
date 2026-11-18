import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { OgCard } from "@/components/site/og/og-card";
import { OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/lib/seo/og";
import { buildSlugStaticParams } from "@/lib/site/static-params";
import { getSiteQueries } from "@/server/container";
import { listArticleSlugs } from "@/server/site/models/articles";

type ArticleImageProps = {
  params: Promise<{ slug: string }>;
};

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export async function generateStaticParams() {
  const slugs = await listArticleSlugs(getSiteQueries());
  return buildSlugStaticParams(slugs);
}

export default async function Image({ params }: ArticleImageProps) {
  const { slug } = await params;
  const queries = getSiteQueries();
  const [article, settings] = await Promise.all([queries.getArticle(slug), queries.getSettings()]);
  if (!article) {
    notFound();
  }

  return new ImageResponse(<OgCard eyebrow="Artikel" title={article.title} footer={settings.siteName} />, {
    ...OG_IMAGE_SIZE,
  });
}
