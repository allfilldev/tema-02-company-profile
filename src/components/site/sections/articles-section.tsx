import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { SiteImage } from "@/components/ui/site-image";
import type { Article } from "@/core/domain/article/article";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import { formatIndonesianDate } from "@/lib/text/format-date";
import { ToneSection, type SectionTone } from "./tone-section";

type ArticlesSectionProps = {
  articles: Article[];
  intro?: SectionIntro;
  tone?: SectionTone;
};

const IMAGE_SIZES = "(min-width: 1024px) 352px, (min-width: 768px) 50vw, 100vw";
const LINK_CLASS_NAME =
  "inline-flex min-h-11 items-center gap-2 font-semibold text-primary hover:text-primary-hover";
const MORE_LABEL = "Baca artikel";
const ALL_LABEL = "Lihat semua artikel";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Card className="flex h-full flex-col gap-4">
      {article.cover ? (
        <div className="aspect-video overflow-hidden rounded-xl">
          <SiteImage media={article.cover} sizes={IMAGE_SIZES} className="w-full" />
        </div>
      ) : null}
      <p className="text-sm text-muted-foreground">
        <time dateTime={article.publishedAt}>{formatIndonesianDate(article.publishedAt)}</time>
      </p>
      <h3 className="text-xl font-bold tracking-tight text-foreground">{article.title}</h3>
      <p className="line-clamp-3 flex-1 text-base text-muted-foreground">{article.lead}</p>
      <div>
        <Link href={`/artikel/${article.slug}`} className={LINK_CLASS_NAME}>
          {MORE_LABEL}
          <Icon name="arrow-right" className="size-4 shrink-0" />
          <span className="sr-only">{`: ${article.title}`}</span>
        </Link>
      </div>
    </Card>
  );
}

export function ArticlesSection({ articles, intro, tone }: ArticlesSectionProps) {
  if (articles.length === 0 || !intro) {
    return null;
  }

  return (
    <ToneSection id="artikel" tone={tone} eyebrow={intro.eyebrow} title={intro.title} description={intro.description}>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <Reveal key={article.id} as="li" stagger={index}>
            <ArticleCard article={article} />
          </Reveal>
        ))}
      </ul>
      <p className="mt-10">
        <Link href="/artikel" className={LINK_CLASS_NAME}>
          {ALL_LABEL}
          <Icon name="arrow-right" className="size-4 shrink-0" />
        </Link>
      </p>
    </ToneSection>
  );
}
