import { MarkdownContent } from "@/components/site/contract/markdown-content";
import { PageHero } from "@/components/site/sections/page-hero";
import { ContentSection } from "@/components/site/sections/content-section";
import { RelatedCard } from "@/components/site/sections/related-card";
import { Reveal } from "@/components/ui/reveal";
import { SiteImage } from "@/components/ui/site-image";
import type { PortfolioItem } from "@/core/domain/portfolio/portfolio-item";
import { formatIndonesianDate } from "@/lib/text/format-date";
import type { PortfolioDetailModel } from "@/server/site/models/portfolio";

type PortfolioDetailViewProps = {
  model: PortfolioDetailModel;
};

const FACT_CLASS_NAME = "rounded-xl bg-primary-soft p-4";
const GALLERY_TITLE = "Galeri proyek";
const OTHERS_TITLE = "Portofolio lainnya";
const GALLERY_EYEBROW = "Hasil kerja";
const OTHERS_EYEBROW = "Proyek lain";
const GALLERY_IMAGE_SIZES = "(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw";

function ProjectFacts({ item }: { item: PortfolioItem }) {
  return (
    <dl className="grid gap-4 rounded-2xl border border-border bg-surface p-6 shadow-soft sm:grid-cols-3">
      <div className={FACT_CLASS_NAME}>
        <dt className="text-sm text-muted-foreground">Klien</dt>
        <dd className="font-semibold text-foreground">{item.clientName}</dd>
      </div>
      <div className={FACT_CLASS_NAME}>
        <dt className="text-sm text-muted-foreground">Kategori</dt>
        <dd className="font-semibold text-foreground">{item.category}</dd>
      </div>
      {item.completedOn ? (
        <div className={FACT_CLASS_NAME}>
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
    <ContentSection id="galeri-proyek" tone="surface-muted" eyebrow={GALLERY_EYEBROW} title={GALLERY_TITLE}>
      <ul className="grid gap-6 md:grid-cols-2">
        {item.gallery.map((media) => (
          <li key={media.id}>
            <figure className="overflow-hidden rounded-2xl border border-border bg-surface p-2 shadow-soft">
              <SiteImage media={media} sizes={GALLERY_IMAGE_SIZES} className="w-full" />
            </figure>
          </li>
        ))}
      </ul>
    </ContentSection>
  );
}

function OtherItems({ items }: { items: PortfolioItem[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ContentSection id="portofolio-lainnya" eyebrow={OTHERS_EYEBROW} title={OTHERS_TITLE}>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <li key={item.id}>
            <RelatedCard href={`/portofolio/${item.slug}`} title={item.title} summary={item.summary} featured={index === 0} />
          </li>
        ))}
      </ul>
    </ContentSection>
  );
}

export function PortfolioDetailView({ model }: PortfolioDetailViewProps) {
  const { item, others, mediaSizes } = model;

  return (
    <div className="page-enter">
      <PageHero title={item.title} description={item.summary} image={item.cover} />
      <ContentSection id="studi-kasus">
        <div className="max-w-3xl space-y-8">
          <ProjectFacts item={item} />
          <MarkdownContent source={item.bodyMd} mediaSizes={mediaSizes} />
        </div>
      </ContentSection>
      <Reveal>
        <ProjectGallery item={item} />
      </Reveal>
      <Reveal>
        <OtherItems items={others} />
      </Reveal>
    </div>
  );
}
