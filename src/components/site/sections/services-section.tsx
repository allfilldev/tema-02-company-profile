import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SiteImage } from "@/components/ui/site-image";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { Service } from "@/core/domain/service/service";

type ServicesSectionProps = {
  services: Service[];
  intro?: SectionIntro;
};

const IMAGE_SIZES = "(min-width: 1024px) 352px, (min-width: 768px) 50vw, 100vw";
const LINK_CLASS_NAME =
  "inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4 hover:text-primary-hover";
const MORE_LABEL = "Selengkapnya";
const ALL_LABEL = "Lihat semua layanan";

type ServiceCardProps = {
  service: Service;
  eager?: boolean;
};

export function ServiceCard({ service, eager = false }: ServiceCardProps) {
  return (
    <Card className="flex h-full flex-col gap-4">
      {service.cover ? (
        <div className="aspect-video overflow-hidden rounded-md">
          <SiteImage media={service.cover} eager={eager} sizes={IMAGE_SIZES} className="w-full" />
        </div>
      ) : null}
      <h3 className="text-xl font-semibold text-foreground">{service.title}</h3>
      <p className="flex-1 text-base text-muted-foreground">{service.summary}</p>
      <div>
        <Link href={`/layanan/${service.slug}`} className={LINK_CLASS_NAME}>
          {MORE_LABEL}
          <span className="sr-only">{` tentang ${service.title}`}</span>
        </Link>
      </div>
    </Card>
  );
}

export function ServicesSection({ services, intro }: ServicesSectionProps) {
  if (services.length === 0 || !intro) {
    return null;
  }

  return (
    <Section id="layanan" eyebrow={intro.eyebrow} title={intro.title} description={intro.description}>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <Reveal key={service.id} as="li" stagger={index}>
            <ServiceCard service={service} />
          </Reveal>
        ))}
      </ul>
      <p className="mt-8">
        <Link href="/layanan" className={LINK_CLASS_NAME}>
          {ALL_LABEL}
        </Link>
      </p>
    </Section>
  );
}
