import { PageHero } from "@/components/site/sections/page-hero";
import { PortfolioCard } from "@/components/site/sections/portfolio-section";
import { Section } from "@/components/ui/section";
import type { PortfolioIndexModel } from "@/server/site/models/portfolio";

type PortfolioIndexViewProps = {
  model: PortfolioIndexModel;
};

const LIST_TITLE = "Semua proyek";

export function PortfolioIndexView({ model }: PortfolioIndexViewProps) {
  const { intro, items } = model;

  return (
    <>
      <PageHero eyebrow={intro.eyebrow} title={intro.title} description={intro.description} />
      {items.length > 0 ? (
        <Section id="daftar-portofolio" title={LIST_TITLE}>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item.id}>
                <PortfolioCard item={item} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}
