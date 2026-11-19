import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { SiteImage } from "@/components/ui/site-image";
import type { Article } from "@/core/domain/article/article";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import { formatIndonesianDate } from "@/lib/text/format-date";
import { ArrowLink, PillArrowLink } from "./arrow-link";
import { ContentSection, type ContentSectionTone } from "./content-section";

type ArticlesSectionProps = {
  articles: Article[];
  intro?: SectionIntro;
  tone?: ContentSectionTone;
};

const IMAGE_SIZES = "(min-width: 1024px) 352px, (min-width: 768px) 50vw, 100vw";
const MORE_LABEL = "Baca artikel";
const ALL_LABEL = "Lihat semua artikel";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Card interactive className="flex h-full flex-col gap-4 p-3">
      {article.cover ? (
        <div className="aspect-video overflow-hidden rounded-xl">
          <SiteImage media={article.cover} sizes={IMAGE_SIZES} className="w-full" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-3 px-3 pb-3">
        <p className="text-sm font-medium text-primary">
          <time dateTime={article.publishedAt}>{formatIndonesianDate(article.publishedAt)}</time>
        </p>
        <h3 className="text-xl font-bold tracking-tight text-foreground">{article.title}</h3>
        <p className="line-clamp-3 flex-1 text-base text-muted-foreground">{article.lead}</p>
        <div>
          <ArrowLink href={`/artikel/${article.slug}`}>
            {MORE_LABEL}
            <span className="sr-only">{`: ${article.title}`}</span>
          </ArrowLink>
        </div>
      </div>
    </Card>
  );
}

export function ArticlesSection({ articles, intro, tone }: ArticlesSectionProps) {
  if (articles.length === 0 || !intro) {
    return null;
  }

  return (
    <ContentSection id="artikel" tone={tone} eyebrow={intro.eyebrow} title={intro.title} description={intro.description}>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <Reveal key={article.id} as="li" stagger={index}>
            <ArticleCard article={article} />
          </Reveal>
        ))}
      </ul>
      <p className="mt-10">
        <PillArrowLink href="/artikel">{ALL_LABEL}</PillArrowLink>
      </p>
    </ContentSection>
  );
}
