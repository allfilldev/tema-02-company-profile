import { Container } from "@/components/ui/container";
import type { CompanyVision } from "@/core/domain/page/company-vision";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import { joinClassNames } from "@/lib/ui/class-names";
import { SectionHeading } from "./section-heading";
import type { SectionTone } from "./tone-section";
import { ToneSection } from "./tone-section";
import { VisionTabs, type VisionTab } from "./vision-tabs";

type VisionSectionProps = {
  vision: CompanyVision | null;
  intro?: SectionIntro;
  id?: string;
  tone?: SectionTone;
  /** "overlap" lifts the card over the bottom of the dark section above it. */
  variant?: "section" | "overlap";
};

const VISION_LABEL = "Visi";
const MISSION_LABEL = "Misi";
const VALUES_LABEL = "Nilai";
const PANEL_TITLE_CLASS_NAME = "text-xl font-bold tracking-tight text-foreground";

function buildTabs(vision: CompanyVision): VisionTab[] {
  const tabs: VisionTab[] = [
    {
      key: "visi",
      label: VISION_LABEL,
      content: (
        <>
          <h3 className={PANEL_TITLE_CLASS_NAME}>{VISION_LABEL}</h3>
          <p className="mt-3 text-lg text-foreground">{vision.vision}</p>
        </>
      ),
    },
  ];
  if (vision.missions.length > 0) {
    tabs.push({
      key: "misi",
      label: MISSION_LABEL,
      content: (
        <>
          <h3 className={PANEL_TITLE_CLASS_NAME}>{MISSION_LABEL}</h3>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-base text-muted-foreground">
            {vision.missions.map((mission) => (
              <li key={mission}>{mission}</li>
            ))}
          </ol>
        </>
      ),
    });
  }
  if (vision.values.length > 0) {
    tabs.push({
      key: "nilai",
      label: VALUES_LABEL,
      content: (
        <>
          <h3 className={PANEL_TITLE_CLASS_NAME}>{VALUES_LABEL}</h3>
          <dl className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {vision.values.map((value) => (
              <div key={value.title} className="rounded-xl bg-surface-muted p-4">
                <dt className="font-semibold text-foreground">{value.title}</dt>
                <dd className="mt-1 text-base text-muted-foreground">{value.description}</dd>
              </div>
            ))}
          </dl>
        </>
      ),
    });
  }
  return tabs;
}

export function VisionSection({ vision, intro, tone, variant = "section", id = "visi-misi" }: VisionSectionProps) {
  if (!vision || !intro) {
    return null;
  }

  const titleId = `${id}-title`;
  const card = (
    <div className="rounded-2xl border border-border bg-surface p-6 md:p-10">
      <SectionHeading id={titleId} eyebrow={intro.eyebrow} title={intro.title} description={intro.description} />
      <VisionTabs idPrefix={id} tabs={buildTabs(vision)} />
    </div>
  );

  if (variant === "overlap") {
    return (
      <section id={id} aria-labelledby={titleId} className={joinClassNames("relative z-20 -mt-24 pb-16 md:-mt-32 md:pb-24")}>
        <Container>{card}</Container>
      </section>
    );
  }

  return (
    <ToneSection id={id} tone={tone}>
      <div className="mx-auto max-w-4xl">{card}</div>
    </ToneSection>
  );
}
