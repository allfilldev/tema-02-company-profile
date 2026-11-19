import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SiteImage } from "@/components/ui/site-image";
import type { Article } from "@/core/domain/article/article";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import { formatIndonesianDate } from "@/lib/text/format-date";

type ArticlesSectionProps = {
  articles: Article[];
  intro?: SectionIntro;
};

const IMAGE_SIZES = "(min-width: 1024px) 352px, (min-width: 768px) 50vw, 100vw";
const LINK_CLASS_NAME =
  "inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4 hover:text-primary-hover";
const MORE_LABEL = "Baca artikel";
const ALL_LABEL = "Lihat semua artikel";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Card className="flex h-full flex-col gap-4">
      {article.cover ? (
        <div className="aspect-video overflow-hidden rounded-md">
          <SiteImage media={article.cover} sizes={IMAGE_SIZES} className="w-full" />
        </div>
      ) : null}
      <p className="text-sm text-muted-foreground">
        <time dateTime={article.publishedAt}>{formatIndonesianDate(article.publishedAt)}</time>
      </p>
      <h3 className="text-xl font-semibold text-foreground">{article.title}</h3>
      <p className="line-clamp-3 flex-1 text-base text-muted-foreground">{article.lead}</p>
      <div>
        <Link href={`/artikel/${article.slug}`} className={LINK_CLASS_NAME}>
          {MORE_LABEL}
          <span className="sr-only">{`: ${article.title}`}</span>
        </Link>
      </div>
    </Card>
  );
}

export function ArticlesSection({ articles, intro }: ArticlesSectionProps) {
  if (articles.length === 0 || !intro) {
    return null;
  }

  return (
    <Section id="artikel" eyebrow={intro.eyebrow} title={intro.title} description={intro.description}>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <Reveal key={article.id} as="li" stagger={index}>
            <ArticleCard article={article} />
          </Reveal>
        ))}
      </ul>
      <p className="mt-8">
        <Link href="/artikel" className={LINK_CLASS_NAME}>
          {ALL_LABEL}
        </Link>
      </p>
    </Section>
  );
}
