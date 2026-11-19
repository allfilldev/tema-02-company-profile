import type { MediaSizes } from "@/core/domain/shared/media-asset";
import { MarkdownContent } from "@/components/site/contract/markdown-content";
import { PageHero } from "@/components/site/sections/page-hero";
import { Container } from "@/components/ui/container";
import type { LegalPage } from "@/core/domain/page/legal-page";
import { formatIndonesianDate } from "@/lib/text/format-date";
import type { LegalPageModel } from "@/server/site/models/legal";

type LegalViewProps = {
  model: LegalPageModel;
};

const UPDATED_LABEL = "Diperbarui terakhir";

export function LegalDocument({ page, mediaSizes }: { page: LegalPage; mediaSizes?: MediaSizes }) {
  return (
    <div className="page-enter">
      <PageHero title={page.title} description={page.intro} />
      <Container className="py-10 md:py-14">
        <div className="max-w-3xl rounded-2xl border border-border bg-surface p-6 md:p-10">
          <p className="inline-flex rounded-full bg-primary-soft px-4 py-1.5 text-sm font-medium text-foreground">
            {`${UPDATED_LABEL}: `}
            <time dateTime={page.updatedAt}>{formatIndonesianDate(page.updatedAt)}</time>
          </p>
          <div className="mt-8 space-y-10">
            {page.sections.map((section, index) => {
              const headingId = `bagian-${index + 1}`;
              return (
                <section key={headingId} aria-labelledby={headingId}>
                  <h2 id={headingId} className="flex items-center gap-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-highlight" />
                    {section.heading}
                  </h2>
                  <MarkdownContent source={section.bodyMd} className="mt-4" mediaSizes={mediaSizes} />
                </section>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}

export function LegalView({ model }: LegalViewProps) {
  return <LegalDocument page={model.page} mediaSizes={model.mediaSizes} />;
}
