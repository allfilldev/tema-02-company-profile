import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { SiteImage } from "@/components/ui/site-image";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { PortfolioItem } from "@/core/domain/portfolio/portfolio-item";
import { ToneSection, type SectionTone } from "./tone-section";

type PortfolioSectionProps = {
  items: PortfolioItem[];
  intro?: SectionIntro;
  tone?: SectionTone;
};

const IMAGE_SIZES = "(min-width: 1024px) 352px, (min-width: 768px) 50vw, 100vw";
const LINK_CLASS_NAME =
  "inline-flex min-h-11 items-center gap-2 font-semibold text-primary hover:text-primary-hover";
const MORE_LABEL = "Lihat studi kasus";
const ALL_LABEL = "Lihat semua portofolio";
const CLIENT_LABEL = "Klien";

type PortfolioCardProps = {
  item: PortfolioItem;
  eager?: boolean;
};

export function PortfolioCard({ item, eager = false }: PortfolioCardProps) {
  return (
    <Card className="flex h-full flex-col gap-4">
      {item.cover ? (
        <div className="aspect-video overflow-hidden rounded-xl">
          <SiteImage media={item.cover} eager={eager} sizes={IMAGE_SIZES} className="w-full" />
        </div>
      ) : null}
      <div>
        <Badge>{item.category}</Badge>
      </div>
      <h3 className="text-xl font-bold tracking-tight text-foreground">{item.title}</h3>
      <p className="text-sm text-muted-foreground">{`${CLIENT_LABEL}: ${item.clientName}`}</p>
      <p className="flex-1 text-base text-muted-foreground">{item.summary}</p>
      <div>
        <Link href={`/portofolio/${item.slug}`} className={LINK_CLASS_NAME}>
          {MORE_LABEL}
          <Icon name="arrow-right" className="size-4 shrink-0" />
          <span className="sr-only">{` ${item.title}`}</span>
        </Link>
      </div>
    </Card>
  );
}

export function PortfolioSection({ items, intro, tone }: PortfolioSectionProps) {
  if (items.length === 0 || !intro) {
    return null;
  }

  return (
    <ToneSection id="portofolio" tone={tone} eyebrow={intro.eyebrow} title={intro.title} description={intro.description}>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <Reveal key={item.id} as="li" stagger={index}>
            <PortfolioCard item={item} />
          </Reveal>
        ))}
      </ul>
      <p className="mt-10">
        <Link href="/portofolio" className={LINK_CLASS_NAME}>
          {ALL_LABEL}
          <Icon name="arrow-right" className="size-4 shrink-0" />
        </Link>
      </p>
    </ToneSection>
  );
}
