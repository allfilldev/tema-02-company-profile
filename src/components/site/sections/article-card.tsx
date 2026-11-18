import Link from "next/link";
import { Card } from "@/components/ui/card";
import { SiteImage } from "@/components/ui/site-image";
import { formatIndonesianDate } from "@/lib/text/format-date";
import type { ArticleCardData } from "@/server/site/models/articles";

type ArticleCardProps = {
  item: ArticleCardData;
  eager?: boolean;
};

const IMAGE_SIZES = "(min-width: 1024px) 352px, (min-width: 768px) 50vw, 100vw";

export function ArticleCard({ item, eager = false }: ArticleCardProps) {
  const { article, author } = item;

  return (
    <Card className="flex h-full flex-col gap-4">
      {article.cover ? (
        <div className="aspect-video overflow-hidden rounded-md">
          <SiteImage media={article.cover} eager={eager} sizes={IMAGE_SIZES} className="w-full" />
        </div>
      ) : null}
      <h3 className="text-xl font-semibold text-foreground">
        <Link href={`/artikel/${article.slug}`} className="inline-flex min-h-11 items-center hover:text-primary">
          {article.title}
        </Link>
      </h3>
      <p className="line-clamp-3 flex-1 text-base text-muted-foreground">{article.lead}</p>
      <p className="text-sm text-muted-foreground">
        {author.name}
        {" · "}
        <time dateTime={article.publishedAt}>{formatIndonesianDate(article.publishedAt)}</time>
      </p>
    </Card>
  );
}
