import Link from "next/link";
import { FaqList } from "@/components/site/contract/faq-list";
import { MarkdownContent } from "@/components/site/contract/markdown-content";
import { PageHero } from "@/components/site/sections/page-hero";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import type { Service } from "@/core/domain/service/service";
import type { ServiceDetailModel } from "@/server/site/models/services";

type ServiceDetailViewProps = {
  model: ServiceDetailModel;
};

const OTHERS_TITLE = "Layanan lainnya";

function OtherServices({ services }: { services: Service[] }) {
  if (services.length === 0) {
    return null;
  }

  return (
    <Section id="layanan-lainnya" title={OTHERS_TITLE} className="border-t border-border bg-surface">
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <li key={service.id}>
            <Card className="h-full">
              <h3 className="text-xl font-semibold text-foreground">
                <Link href={`/layanan/${service.slug}`} className="inline-flex min-h-11 items-center hover:text-primary">
                  {service.title}
                </Link>
              </h3>
              <p className="mt-2 text-base text-muted-foreground">{service.summary}</p>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function ServiceDetailView({ model }: ServiceDetailViewProps) {
  const { service, others, mediaSizes } = model;

  return (
    <>
      <PageHero title={service.title} description={service.summary} image={service.cover} />
      <Section id="isi-layanan">
        <div className="max-w-3xl">
          <MarkdownContent source={service.bodyMd} mediaSizes={mediaSizes} />
        </div>
      </Section>
      {service.faq.length > 0 ? (
        <Section id="faq-layanan" className="border-t border-border">
          <div className="max-w-3xl">
            <FaqList items={service.faq} />
          </div>
        </Section>
      ) : null}
      <OtherServices services={others} />
    </>
  );
}
