import { ArticleCard } from "@/components/site/sections/article-card";
import { PageHero } from "@/components/site/sections/page-hero";
import { Pagination } from "@/components/site/sections/pagination";
import { Container } from "@/components/ui/container";
import { ContentSection } from "@/components/site/sections/content-section";
import { isFirstRowCard } from "@/lib/ui/card-grid";
import type { ArticlesIndexModel } from "@/server/site/models/articles";

type ArticlesIndexViewProps = {
  model: ArticlesIndexModel;
};

const LIST_TITLE = "Semua artikel";

export function ArticlesIndexView({ model }: ArticlesIndexViewProps) {
  const { intro, items, page, pageCount, pageHrefs } = model;

  return (
    <div className="page-enter">
      <PageHero eyebrow={intro.eyebrow} title={intro.title} description={intro.description} />
      {items.length > 0 ? (
        <ContentSection id="daftar-artikel" title={LIST_TITLE}>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <li key={item.article.id}>
                <ArticleCard item={item} eager={isFirstRowCard(index)} />
              </li>
            ))}
          </ul>
        </ContentSection>
      ) : null}
      {pageCount > 1 ? (
        <Container className="pb-12 md:pb-16">
          <Pagination page={page} pageCount={pageCount} pageHrefs={pageHrefs} />
        </Container>
      ) : null}
    </div>
  );
}
