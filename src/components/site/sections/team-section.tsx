import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { SiteImage } from "@/components/ui/site-image";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { TeamMember } from "@/core/domain/team/team-member";
import { ToneSection, type SectionTone } from "./tone-section";

type TeamSectionProps = {
  team: TeamMember[];
  intro?: SectionIntro;
  id?: string;
  tone?: SectionTone;
};

const AVATAR_SIZES = "128px";

export function TeamSection({ team, intro, tone, id = "tim" }: TeamSectionProps) {
  if (team.length === 0 || !intro) {
    return null;
  }

  return (
    <ToneSection id={id} tone={tone} eyebrow={intro.eyebrow} title={intro.title} description={intro.description}>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((member, index) => (
          <Reveal key={member.id} as="li" stagger={index}>
            <Card className="flex h-full flex-col gap-4">
              {member.photo ? (
                <div className="size-32 overflow-hidden rounded-full border-2 border-accent">
                  <SiteImage media={member.photo} sizes={AVATAR_SIZES} className="w-full" />
                </div>
              ) : null}
              <div>
                <h3 className="text-xl font-bold tracking-tight text-foreground">{member.name}</h3>
                <p className="text-sm font-medium text-primary">{member.jobTitle}</p>
                {member.yearsExperience !== null ? (
                  <p className="text-sm text-muted-foreground">{`${member.yearsExperience} tahun pengalaman`}</p>
                ) : null}
              </div>
              <p className="text-base text-muted-foreground">{member.bio}</p>
            </Card>
          </Reveal>
        ))}
      </ul>
    </ToneSection>
  );
}
