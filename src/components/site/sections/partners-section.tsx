import { SiteImage } from "@/components/ui/site-image";
import { Container } from "@/components/ui/container";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { Partner } from "@/core/domain/partner/partner";
import type { SectionTone } from "./tone-section";

type PartnersSectionProps = {
  partners: Partner[];
  intro?: SectionIntro;
  tone?: SectionTone;
};

const LOGO_SIZES = "144px";
const PARTNER_LIMIT = 6;
const ITEM_CLASS_NAME = "flex min-h-11 items-center justify-center px-2 opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0";
const LINK_LABEL = "Kunjungi situs";

function PartnerMark({ partner }: { partner: Partner }) {
  if (partner.logo) {
    return <SiteImage media={partner.logo} sizes={LOGO_SIZES} className="h-8! w-auto object-contain md:h-10!" />;
  }
  return <span className="font-heading font-bold text-foreground">{partner.name}</span>;
}

export function PartnersSection({ partners, intro }: PartnersSectionProps) {
  if (partners.length === 0 || !intro) {
    return null;
  }

  return (
    <section id="mitra" aria-labelledby="mitra-title" className="py-10 md:py-14">
      <Container>
        <h2 id="mitra-title" className="text-center text-sm font-semibold tracking-wide text-muted-foreground">
          {intro.title}
        </h2>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:justify-between">
          {partners.slice(0, PARTNER_LIMIT).map((partner) => (
            <li key={partner.id}>
              {partner.url ? (
                <a href={partner.url} target="_blank" rel="noopener noreferrer" className={ITEM_CLASS_NAME}>
                  <PartnerMark partner={partner} />
                  <span className="sr-only">{`${LINK_LABEL} ${partner.name}`}</span>
                </a>
              ) : (
                <div className={ITEM_CLASS_NAME}>
                  <PartnerMark partner={partner} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
