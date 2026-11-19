import Link from "next/link";
import { ArticleDates } from "@/components/site/contract/article-dates";
import { AuthorBox } from "@/components/site/contract/author-box";
import { AuthorByline } from "@/components/site/contract/author-byline";
import { FaqList } from "@/components/site/contract/faq-list";
import { MarkdownContent } from "@/components/site/contract/markdown-content";
import { PageHero } from "@/components/site/sections/page-hero";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import type { Article } from "@/core/domain/article/article";
import type { ArticleDetailModel } from "@/server/site/models/articles";

type ArticleDetailViewProps = {
  model: ArticleDetailModel;
};

const RELATED_TITLE = "Artikel terkait";

function RelatedArticles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <Section id="artikel-terkait" title={RELATED_TITLE} className="border-t border-border bg-surface">
      <div data-nosnippet>
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <li key={article.id}>
              <Card className="h-full">
                <h3 className="text-xl font-semibold text-foreground">
                  <Link href={`/artikel/${article.slug}`} className="inline-flex min-h-11 items-center hover:text-primary">
                    {article.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-3 text-base text-muted-foreground">{article.lead}</p>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </Section>
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
