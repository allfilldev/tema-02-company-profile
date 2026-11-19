import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { SiteImage } from "@/components/ui/site-image";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { Service } from "@/core/domain/service/service";
import { joinClassNames } from "@/lib/ui/class-names";
import { SectionHeading } from "./section-heading";
import type { SectionTone } from "./tone-section";
import { WaveEdge } from "./wave-edge";

type ServicesSectionProps = {
  services: Service[];
  intro?: SectionIntro;
  tone?: SectionTone;
  /** True when the next section is also dark, so the bottom wave is omitted. */
  joinsDarkSection?: boolean;
};

const IMAGE_SIZES = "(min-width: 1024px) 352px, (min-width: 768px) 50vw, 100vw";
const LINK_CLASS_NAME =
  "inline-flex min-h-11 items-center gap-2 font-semibold text-primary hover:text-primary-hover";
const MORE_LABEL = "Selengkapnya";
const ALL_LABEL = "Lihat semua layanan";
const SERVICE_ICONS = ["layers", "target", "lightbulb", "rocket", "shield-check", "zap"];
const TILE_CLASS_NAMES = ["bg-primary-soft text-primary", "bg-highlight-soft text-highlight-hover"];
const CARD_CLASS_NAME =
  "motion-press group flex h-full w-full flex-col items-center gap-4 rounded-2xl border border-surface-inverse-foreground/10 bg-surface-inverse-foreground/5 px-5 py-8 text-center transition-colors hover:border-surface-inverse-foreground/30 hover:bg-surface-inverse-foreground/10";
const WIDE_COLUMN_COUNTS = [3, 6, 9];

function itemWidthClassName(count: number): string {
  return WIDE_COLUMN_COUNTS.includes(count) ? "w-1/2 md:w-1/3" : "w-1/2 md:w-1/3 lg:w-1/4";
}

type ServiceCardProps = {
  service: Service;
  eager?: boolean;
};

export function ServiceCard({ service, eager = false }: ServiceCardProps) {
  return (
    <Card interactive className="flex h-full flex-col gap-4">
      {service.cover ? (
        <div className="aspect-video overflow-hidden rounded-xl">
          <SiteImage media={service.cover} eager={eager} sizes={IMAGE_SIZES} className="w-full" />
        </div>
      ) : null}
      <h3 className="text-xl font-bold tracking-tight text-foreground">{service.title}</h3>
      <p className="flex-1 text-base text-muted-foreground">{service.summary}</p>
      <div>
        <Link href={`/layanan/${service.slug}`} className={LINK_CLASS_NAME}>
          {MORE_LABEL}
          <Icon name="arrow-right" className="size-4 shrink-0" />
          <span className="sr-only">{` tentang ${service.title}`}</span>
        </Link>
      </div>
    </Card>
  );
}

function ServiceTile({ service, index }: { service: Service; index: number }) {
  return (
    <Link href={`/layanan/${service.slug}`} className={CARD_CLASS_NAME}>
      <span
        aria-hidden="true"
        className={joinClassNames("flex size-14 items-center justify-center rounded-xl", TILE_CLASS_NAMES[index % TILE_CLASS_NAMES.length])}
      >
        <Icon name={SERVICE_ICONS[index % SERVICE_ICONS.length]} className="size-7 shrink-0" />
      </span>
      <h3 className="text-base font-bold tracking-tight text-surface-inverse-foreground md:text-lg">{service.title}</h3>
      <span aria-hidden="true" className="mt-auto flex gap-1.5">
        <span className="size-1.5 rounded-full bg-primary" />
        <span className="size-1.5 rounded-full bg-highlight" />
        <span className="size-1.5 rounded-full bg-surface-inverse-foreground/30 transition-colors group-hover:bg-success" />
      </span>
    </Link>
  );
}

export function ServicesSection({ services, intro, joinsDarkSection = false }: ServicesSectionProps) {
  if (services.length === 0 || !intro) {
    return null;
  }

  return (
    <section
      id="layanan"
      aria-labelledby="layanan-title"
      className={joinClassNames(
        "relative z-10 bg-surface-inverse pt-20 text-surface-inverse-foreground md:pt-28",
        joinsDarkSection ? "pb-12 md:pb-16" : "pb-20 md:pb-28",
      )}
    >
      <WaveEdge edge="top" tone="inverse" />
      <Container>
        <SectionHeading id="layanan-title" eyebrow={intro.eyebrow} title={intro.title} description={intro.description} tone="dark" align="center" />
        <ul className="-mx-2 flex flex-wrap justify-center">
          {services.map((service, index) => (
            <Reveal key={service.id} as="li" stagger={index} className={joinClassNames("flex p-2", itemWidthClassName(services.length))}>
              <ServiceTile service={service} index={index} />
            </Reveal>
          ))}
        </ul>
        <p className="mt-8 text-center md:mt-10">
          <ButtonLink href="/layanan" variant="highlight">
            {ALL_LABEL}
          </ButtonLink>
        </p>
      </Container>
      {joinsDarkSection ? null : <WaveEdge edge="bottom" tone="inverse" />}
    </section>
  );
}
