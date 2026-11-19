import { ArticleDates } from "@/components/site/contract/article-dates";
import { AuthorBox } from "@/components/site/contract/author-box";
import { AuthorByline } from "@/components/site/contract/author-byline";
import { FaqList } from "@/components/site/contract/faq-list";
import { MarkdownContent } from "@/components/site/contract/markdown-content";
import { PageHero } from "@/components/site/sections/page-hero";
import { ContentSection } from "@/components/site/sections/content-section";
import { RelatedCard } from "@/components/site/sections/related-card";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { Article } from "@/core/domain/article/article";
import type { ArticleDetailModel } from "@/server/site/models/articles";

type ArticleDetailViewProps = {
  model: ArticleDetailModel;
};

const RELATED_TITLE = "Artikel terkait";
const RELATED_EYEBROW = "Bacaan lanjutan";

function RelatedArticles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <ContentSection id="artikel-terkait" tone="surface-muted" eyebrow={RELATED_EYEBROW} title={RELATED_TITLE}>
      <div data-nosnippet>
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <li key={article.id}>
              <RelatedCard href={`/artikel/${article.slug}`} title={article.title} summary={article.lead} featured={index === 0} />
            </li>
          ))}
        </ul>
      </div>
    </ContentSection>
  );
}

export function ArticleDetailView({ model }: ArticleDetailViewProps) {
  const { article, authorFacts, related, mediaSizes } = model;

  return (
    <div className="page-enter">
      <PageHero title={article.title} description={article.lead} image={article.cover}>
        <div className="mt-6 space-y-2">
          <AuthorByline authorName={article.author.name} />
          <ArticleDates publishedAt={article.publishedAt} updatedAt={article.updatedAt} />
        </div>
      </PageHero>
      <Container className="py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-3 lg:items-start lg:gap-12">
          <article className="min-w-0 space-y-12 lg:col-span-2">
            <MarkdownContent source={article.bodyMd} mediaSizes={mediaSizes} />
            <FaqList items={article.faq} />
          </article>
          <div className="lg:sticky lg:top-24 lg:col-span-1">
            <AuthorBox author={article.author} facts={authorFacts} />
          </div>
        </div>
      </Container>
      <Reveal>
        <RelatedArticles articles={related} />
      </Reveal>
    </div>
  );
}
