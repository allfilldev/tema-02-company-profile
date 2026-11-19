import { BlobImage } from "@/components/ui/blob-image";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { TeamMember } from "@/core/domain/team/team-member";
import { ContentSection, type ContentSectionTone } from "./content-section";

type TeamSectionProps = {
  team: TeamMember[];
  intro?: SectionIntro;
  id?: string;
  tone?: ContentSectionTone;
};

const AVATAR_SIZES = "160px";

export function TeamSection({ team, intro, tone, id = "tim" }: TeamSectionProps) {
  if (team.length === 0 || !intro) {
    return null;
  }

  return (
    <ContentSection id={id} tone={tone} eyebrow={intro.eyebrow} title={intro.title} description={intro.description}>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((member, index) => (
          <Reveal key={member.id} as="li" stagger={index}>
            <Card className="flex h-full flex-col items-center gap-4 text-center">
              {member.photo ? (
                <div className="relative">
                  <BlobImage src={member.photo.url} alt={member.photo.alt} sizes={AVATAR_SIZES} className="size-36" />
                  <span aria-hidden="true" className="absolute -right-1 top-3 size-3 rounded-full bg-highlight" />
                  <span aria-hidden="true" className="absolute -left-2 bottom-5 size-2 rounded-full bg-primary" />
                </div>
              ) : null}
              <div>
                <h3 className="text-xl font-bold tracking-tight text-foreground">{member.name}</h3>
                <p className="text-sm font-semibold text-primary">{member.jobTitle}</p>
                {member.yearsExperience !== null ? (
                  <p className="mt-2 inline-flex rounded-full bg-highlight-soft px-3 py-1 text-sm font-medium text-foreground">{`${member.yearsExperience} tahun pengalaman`}</p>
                ) : null}
              </div>
              <p className="text-base text-muted-foreground">{member.bio}</p>
            </Card>
          </Reveal>
        ))}
      </ul>
    </ContentSection>
  );
}
