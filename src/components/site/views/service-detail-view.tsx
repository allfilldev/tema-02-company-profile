import { FaqList } from "@/components/site/contract/faq-list";
import { MarkdownContent } from "@/components/site/contract/markdown-content";
import { PageHero } from "@/components/site/sections/page-hero";
import { ContentSection } from "@/components/site/sections/content-section";
import { RelatedCard } from "@/components/site/sections/related-card";
import { Reveal } from "@/components/ui/reveal";
import type { Service } from "@/core/domain/service/service";
import type { ServiceDetailModel } from "@/server/site/models/services";

type ServiceDetailViewProps = {
  model: ServiceDetailModel;
};

const OTHERS_TITLE = "Layanan lainnya";
const OTHERS_EYEBROW = "Jelajahi";
const SERVICE_ICONS = ["layers", "target", "lightbulb", "rocket", "shield-check", "zap"];

function OtherServices({ services }: { services: Service[] }) {
  if (services.length === 0) {
    return null;
  }

  return (
    <ContentSection id="layanan-lainnya" tone="surface-muted" eyebrow={OTHERS_EYEBROW} title={OTHERS_TITLE}>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <li key={service.id}>
            <RelatedCard
              href={`/layanan/${service.slug}`}
              title={service.title}
              summary={service.summary}
              icon={SERVICE_ICONS[index % SERVICE_ICONS.length]}
              featured={index === 0}
            />
          </li>
        ))}
      </ul>
    </ContentSection>
  );
}

export function ServiceDetailView({ model }: ServiceDetailViewProps) {
  const { service, others, mediaSizes } = model;

  return (
    <div className="page-enter">
      <PageHero title={service.title} description={service.summary} image={service.cover} />
      <ContentSection id="isi-layanan">
        <div className="max-w-3xl">
          <MarkdownContent source={service.bodyMd} mediaSizes={mediaSizes} />
        </div>
      </ContentSection>
      {service.faq.length > 0 ? (
        <Reveal>
          <ContentSection id="faq-layanan">
            <div className="max-w-3xl">
              <FaqList items={service.faq} />
            </div>
          </ContentSection>
        </Reveal>
      ) : null}
      <Reveal>
        <OtherServices services={others} />
      </Reveal>
    </div>
  );
}
