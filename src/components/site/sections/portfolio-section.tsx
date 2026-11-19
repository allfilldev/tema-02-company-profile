import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { SiteImage } from "@/components/ui/site-image";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { PortfolioItem } from "@/core/domain/portfolio/portfolio-item";
import { ArrowLink, PillArrowLink } from "./arrow-link";
import { ContentSection, type ContentSectionTone } from "./content-section";

type PortfolioSectionProps = {
  items: PortfolioItem[];
  intro?: SectionIntro;
  tone?: ContentSectionTone;
};

const IMAGE_SIZES = "(min-width: 1024px) 352px, (min-width: 768px) 50vw, 100vw";
const MORE_LABEL = "Lihat studi kasus";
const ALL_LABEL = "Lihat semua portofolio";
const CLIENT_LABEL = "Klien";

type PortfolioCardProps = {
  item: PortfolioItem;
  eager?: boolean;
};

export function PortfolioCard({ item, eager = false }: PortfolioCardProps) {
  return (
    <Card className="flex h-full flex-col gap-4 p-3">
      {item.cover ? (
        <div className="aspect-video overflow-hidden rounded-xl">
          <SiteImage media={item.cover} eager={eager} sizes={IMAGE_SIZES} className="w-full" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-3 px-3 pb-3">
        <div>
          <span className="inline-flex items-center rounded-full bg-highlight-soft px-3.5 py-1 text-sm font-semibold text-foreground">
            {item.category}
          </span>
        </div>
        <h3 className="text-xl font-bold tracking-tight text-foreground">{item.title}</h3>
        <p className="text-sm font-medium text-primary">{`${CLIENT_LABEL}: ${item.clientName}`}</p>
        <p className="flex-1 text-base text-muted-foreground">{item.summary}</p>
        <div>
          <ArrowLink href={`/portofolio/${item.slug}`}>
            {MORE_LABEL}
            <span className="sr-only">{` ${item.title}`}</span>
          </ArrowLink>
        </div>
      </div>
    </Card>
  );
}

export function PortfolioSection({ items, intro, tone }: PortfolioSectionProps) {
  if (items.length === 0 || !intro) {
    return null;
  }

  return (
    <ContentSection id="portofolio" tone={tone} eyebrow={intro.eyebrow} title={intro.title} description={intro.description}>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <Reveal key={item.id} as="li" stagger={index}>
            <PortfolioCard item={item} />
          </Reveal>
        ))}
      </ul>
      <p className="mt-10">
        <PillArrowLink href="/portofolio">{ALL_LABEL}</PillArrowLink>
      </p>
    </ContentSection>
  );
}
