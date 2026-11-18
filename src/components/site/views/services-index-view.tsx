import { PageHero } from "@/components/site/sections/page-hero";
import { ServiceCard } from "@/components/site/sections/services-section";
import { Section } from "@/components/ui/section";
import type { ServicesIndexModel } from "@/server/site/models/services";

type ServicesIndexViewProps = {
  model: ServicesIndexModel;
};

const LIST_TITLE = "Semua layanan";

export function ServicesIndexView({ model }: ServicesIndexViewProps) {
  const { intro, services } = model;

  return (
    <>
      <PageHero eyebrow={intro.eyebrow} title={intro.title} description={intro.description} />
      {services.length > 0 ? (
        <Section id="daftar-layanan" title={LIST_TITLE}>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <li key={service.id}>
                <ServiceCard service={service} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}
