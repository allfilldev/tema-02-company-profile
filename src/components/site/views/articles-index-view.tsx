import { ArticleCard } from "@/components/site/sections/article-card";
import { PageHero } from "@/components/site/sections/page-hero";
import { Pagination } from "@/components/site/sections/pagination";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import type { ArticlesIndexModel } from "@/server/site/models/articles";

type ArticlesIndexViewProps = {
  model: ArticlesIndexModel;
};

const LIST_TITLE = "Semua artikel";

export function ArticlesIndexView({ model }: ArticlesIndexViewProps) {
  const { intro, items, page, pageCount, pageHrefs } = model;

  return (
    <>
      <PageHero eyebrow={intro.eyebrow} title={intro.title} description={intro.description} />
      {items.length > 0 ? (
        <Section id="daftar-artikel" title={LIST_TITLE}>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item.article.id}>
                <ArticleCard item={item} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
      {pageCount > 1 ? (
        <Container className="pb-12 md:pb-16">
          <Pagination page={page} pageCount={pageCount} pageHrefs={pageHrefs} />
        </Container>
      ) : null}
    </>
  );
}
