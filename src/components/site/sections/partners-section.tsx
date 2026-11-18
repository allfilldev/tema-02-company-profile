import { Section } from "@/components/ui/section";
import { SiteImage } from "@/components/ui/site-image";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { Partner } from "@/core/domain/partner/partner";

type PartnersSectionProps = {
  partners: Partner[];
  intro?: SectionIntro;
};

const LOGO_SIZES = "144px";
const ITEM_CLASS_NAME = "flex min-h-20 items-center justify-center rounded-md border border-border bg-surface p-4";
const LINK_LABEL = "Kunjungi situs";

function PartnerMark({ partner }: { partner: Partner }) {
  if (partner.logo) {
    return (
      <div className="w-36">
        <SiteImage media={partner.logo} sizes={LOGO_SIZES} className="w-full" />
      </div>
    );
  }
  return <span className="font-semibold text-foreground">{partner.name}</span>;
}

export function PartnersSection({ partners, intro }: PartnersSectionProps) {
  if (partners.length === 0 || !intro) {
    return null;
  }

  return (
    <Section id="mitra" eyebrow={intro.eyebrow} title={intro.title} description={intro.description}>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {partners.map((partner) => (
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
    </Section>
  );
}
