import { PageHero } from "@/components/site/sections/page-hero";
import { ServiceCard } from "@/components/site/sections/services-section";
import { Section } from "@/components/ui/section";
import { isFirstRowCard } from "@/lib/ui/card-grid";
import type { ServicesIndexModel } from "@/server/site/models/services";

type ServicesIndexViewProps = {
  model: ServicesIndexModel;
};

const LIST_TITLE = "Semua layanan";

export function ServicesIndexView({ model }: ServicesIndexViewProps) {
  const { intro, services } = model;

  return (
    <div className="page-enter">
      <PageHero eyebrow={intro.eyebrow} title={intro.title} description={intro.description} />
      {services.length > 0 ? (
        <Section id="daftar-layanan" title={LIST_TITLE}>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <li key={service.id}>
                <ServiceCard service={service} eager={isFirstRowCard(index)} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </div>
  );
}
