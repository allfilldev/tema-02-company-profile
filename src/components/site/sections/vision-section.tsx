import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import type { CompanyVision } from "@/core/domain/page/company-vision";
import type { SectionIntro } from "@/core/domain/page/section-intro";

type VisionSectionProps = {
  vision: CompanyVision | null;
  intro?: SectionIntro;
  id?: string;
};

const VISION_LABEL = "Visi";
const MISSION_LABEL = "Misi";
const VALUES_LABEL = "Nilai";

export function VisionSection({ vision, intro, id = "visi-misi" }: VisionSectionProps) {
  if (!vision || !intro) {
    return null;
  }

  const hasMissions = vision.missions.length > 0;
  const hasValues = vision.values.length > 0;

  return (
    <Section id={id} eyebrow={intro.eyebrow} title={intro.title} description={intro.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h3 className="text-xl font-semibold text-foreground">{VISION_LABEL}</h3>
          <p className="mt-3 text-lg text-foreground">{vision.vision}</p>
        </Card>
        {hasMissions ? (
          <Card>
            <h3 className="text-xl font-semibold text-foreground">{MISSION_LABEL}</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-base text-muted-foreground">
              {vision.missions.map((mission) => (
                <li key={mission}>{mission}</li>
              ))}
            </ol>
          </Card>
        ) : null}
        {hasValues ? (
          <Card className="md:col-span-2">
            <h3 className="text-xl font-semibold text-foreground">{VALUES_LABEL}</h3>
            <dl className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {vision.values.map((value) => (
                <div key={value.title}>
                  <dt className="font-semibold text-foreground">{value.title}</dt>
                  <dd className="mt-1 text-base text-muted-foreground">{value.description}</dd>
                </div>
              ))}
            </dl>
          </Card>
        ) : null}
      </div>
    </Section>
  );
}
