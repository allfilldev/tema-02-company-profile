import Link from "next/link";
import { MarkdownContent } from "@/components/site/contract/markdown-content";
import { PageHero } from "@/components/site/sections/page-hero";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { SiteImage } from "@/components/ui/site-image";
import type { PortfolioItem } from "@/core/domain/portfolio/portfolio-item";
import { formatIndonesianDate } from "@/lib/text/format-date";
import type { PortfolioDetailModel } from "@/server/site/models/portfolio";

type PortfolioDetailViewProps = {
  model: PortfolioDetailModel;
};

const GALLERY_TITLE = "Galeri proyek";
const OTHERS_TITLE = "Portofolio lainnya";
const GALLERY_IMAGE_SIZES = "(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw";

function ProjectFacts({ item }: { item: PortfolioItem }) {
  return (
    <dl className="grid gap-4 rounded-lg border border-border bg-surface p-6 shadow-card sm:grid-cols-3">
      <div>
        <dt className="text-sm text-muted-foreground">Klien</dt>
        <dd className="font-semibold text-foreground">{item.clientName}</dd>
      </div>
      <div>
        <dt className="text-sm text-muted-foreground">Kategori</dt>
        <dd className="font-semibold text-foreground">{item.category}</dd>
      </div>
      {item.completedOn ? (
        <div>
          <dt className="text-sm text-muted-foreground">Selesai</dt>
          <dd className="font-semibold text-foreground">
            <time dateTime={item.completedOn}>{formatIndonesianDate(item.completedOn)}</time>
          </dd>
        </div>
      ) : null}
    </dl>
  );
}

function ProjectGallery({ item }: { item: PortfolioItem }) {
  if (item.gallery.length === 0) {
    return null;
  }

  return (
    <Section id="galeri-proyek" title={GALLERY_TITLE} className="border-t border-border">
      <ul className="grid gap-6 md:grid-cols-2">
        {item.gallery.map((media) => (
          <li key={media.id}>
            <figure className="overflow-hidden rounded-xl border border-border shadow-card">
              <SiteImage media={media} sizes={GALLERY_IMAGE_SIZES} className="w-full" />
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function OtherItems({ items }: { items: PortfolioItem[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Section id="portofolio-lainnya" title={OTHERS_TITLE} className="border-t border-border bg-surface">
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id}>
            <Card className="h-full">
              <h3 className="text-xl font-semibold text-foreground">
                <Link href={`/portofolio/${item.slug}`} className="inline-flex min-h-11 items-center hover:text-primary">
                  {item.title}
                </Link>
              </h3>
              <p className="mt-2 text-base text-muted-foreground">{item.summary}</p>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function PortfolioDetailView({ model }: PortfolioDetailViewProps) {
  const { item, others, mediaSizes } = model;

  return (
    <>
      <PageHero title={item.title} description={item.summary} image={item.cover} />
      <Section id="studi-kasus">
        <div className="max-w-3xl space-y-8">
          <ProjectFacts item={item} />
          <MarkdownContent source={item.bodyMd} mediaSizes={mediaSizes} />
        </div>
      </Section>
      <ProjectGallery item={item} />
      <OtherItems items={others} />
    </>
  );
}
