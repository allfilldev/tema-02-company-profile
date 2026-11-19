import { PageHero } from "@/components/site/sections/page-hero";
import { PortfolioCard } from "@/components/site/sections/portfolio-section";
import { ContentSection } from "@/components/site/sections/content-section";
import { isFirstRowCard } from "@/lib/ui/card-grid";
import type { PortfolioIndexModel } from "@/server/site/models/portfolio";

type PortfolioIndexViewProps = {
  model: PortfolioIndexModel;
};

const LIST_TITLE = "Semua proyek";

export function PortfolioIndexView({ model }: PortfolioIndexViewProps) {
  const { intro, items } = model;

  return (
    <div className="page-enter">
      <PageHero eyebrow={intro.eyebrow} title={intro.title} description={intro.description} />
      {items.length > 0 ? (
        <ContentSection id="daftar-portofolio" title={LIST_TITLE}>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <li key={item.id}>
                <PortfolioCard item={item} eager={isFirstRowCard(index)} />
              </li>
            ))}
          </ul>
        </ContentSection>
      ) : null}
    </div>
  );
}
