import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { SiteImage } from "@/components/ui/site-image";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { Service } from "@/core/domain/service/service";
import { ToneSection, type SectionTone } from "./tone-section";

type ServicesSectionProps = {
  services: Service[];
  intro?: SectionIntro;
  tone?: SectionTone;
};

const IMAGE_SIZES = "(min-width: 1024px) 352px, (min-width: 768px) 50vw, 100vw";
const LINK_CLASS_NAME =
  "inline-flex min-h-11 items-center gap-2 font-semibold text-primary hover:text-primary-hover";
const MORE_LABEL = "Selengkapnya";
const ALL_LABEL = "Lihat semua layanan";
const SERVICE_ICONS = ["layers", "target", "lightbulb", "rocket", "shield-check", "zap"];
const ICON_BADGE_CLASS_NAME =
  "flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground";

type ServiceCardProps = {
  service: Service;
  eager?: boolean;
};

function ServiceLink({ service }: { service: Service }) {
  return (
    <Link href={`/layanan/${service.slug}`} className={LINK_CLASS_NAME}>
      {MORE_LABEL}
      <Icon name="arrow-right" className="size-4 shrink-0" />
      <span className="sr-only">{` tentang ${service.title}`}</span>
    </Link>
  );
}

export function ServiceCard({ service, eager = false }: ServiceCardProps) {
  return (
    <Card className="flex h-full flex-col gap-4">
      {service.cover ? (
        <div className="aspect-video overflow-hidden rounded-xl">
          <SiteImage media={service.cover} eager={eager} sizes={IMAGE_SIZES} className="w-full" />
        </div>
      ) : null}
      <h3 className="text-xl font-bold tracking-tight text-foreground">{service.title}</h3>
      <p className="flex-1 text-base text-muted-foreground">{service.summary}</p>
      <div>
        <ServiceLink service={service} />
      </div>
    </Card>
  );
}

function ServiceIconCard({ service, index }: { service: Service; index: number }) {
  return (
    <Card className="flex h-full flex-col gap-4">
      <span className={ICON_BADGE_CLASS_NAME}>
        <Icon name={SERVICE_ICONS[index % SERVICE_ICONS.length]} className="size-7 shrink-0" />
      </span>
      <h3 className="text-xl font-bold tracking-tight text-foreground">{service.title}</h3>
      <p className="flex-1 text-base text-muted-foreground">{service.summary}</p>
      <div>
        <ServiceLink service={service} />
      </div>
    </Card>
  );
}

export function ServicesSection({ services, intro, tone }: ServicesSectionProps) {
  if (services.length === 0 || !intro) {
    return null;
  }

  return (
    <ToneSection id="layanan" tone={tone} eyebrow={intro.eyebrow} title={intro.title} description={intro.description}>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <Reveal key={service.id} as="li" stagger={index}>
            <ServiceIconCard service={service} index={index} />
          </Reveal>
        ))}
      </ul>
      <p className="mt-10">
        <Link href="/layanan" className={LINK_CLASS_NAME}>
          {ALL_LABEL}
          <Icon name="arrow-right" className="size-4 shrink-0" />
        </Link>
      </p>
    </ToneSection>
  );
}
