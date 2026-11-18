import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { SiteImage } from "@/components/ui/site-image";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { PortfolioItem } from "@/core/domain/portfolio/portfolio-item";

type PortfolioSectionProps = {
  items: PortfolioItem[];
  intro?: SectionIntro;
};

const IMAGE_SIZES = "(min-width: 1024px) 352px, (min-width: 768px) 50vw, 100vw";
const LINK_CLASS_NAME =
  "inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4 hover:text-primary-hover";
const MORE_LABEL = "Lihat studi kasus";
const ALL_LABEL = "Lihat semua portofolio";
const CLIENT_LABEL = "Klien";

export function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <Card className="flex h-full flex-col gap-4">
      {item.cover ? (
        <div className="aspect-video overflow-hidden rounded-md">
          <SiteImage media={item.cover} sizes={IMAGE_SIZES} className="w-full" />
        </div>
      ) : null}
      <div>
        <Badge>{item.category}</Badge>
      </div>
      <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
      <p className="text-sm text-muted-foreground">{`${CLIENT_LABEL}: ${item.clientName}`}</p>
      <p className="flex-1 text-base text-muted-foreground">{item.summary}</p>
      <div>
        <Link href={`/portofolio/${item.slug}`} className={LINK_CLASS_NAME}>
          {MORE_LABEL}
          <span className="sr-only">{` ${item.title}`}</span>
        </Link>
      </div>
    </Card>
  );
}

export function PortfolioSection({ items, intro }: PortfolioSectionProps) {
  if (items.length === 0 || !intro) {
    return null;
  }

  return (
    <Section id="portofolio" eyebrow={intro.eyebrow} title={intro.title} description={intro.description}>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id}>
            <PortfolioCard item={item} />
          </li>
        ))}
      </ul>
      <p className="mt-8">
        <Link href="/portofolio" className={LINK_CLASS_NAME}>
          {ALL_LABEL}
        </Link>
      </p>
    </Section>
  );
}
