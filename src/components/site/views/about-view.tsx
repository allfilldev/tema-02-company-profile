import { PageHero } from "@/components/site/sections/page-hero";
import { StatsSection } from "@/components/site/sections/stats-section";
import { TeamSection } from "@/components/site/sections/team-section";
import { VisionSection } from "@/components/site/sections/vision-section";
import { MarkdownContent } from "@/components/site/contract/markdown-content";
import { Section } from "@/components/ui/section";
import { SiteImage } from "@/components/ui/site-image";
import type { AboutPageModel } from "@/server/site/models/about";

type AboutViewProps = {
  model: AboutPageModel;
};

const PROFILE_IMAGE_SIZES = "(min-width: 1024px) 560px, 100vw";

export function AboutView({ model }: AboutViewProps) {
  const { about, intros } = model;
  const intro = intros.about;
  const hasProfile = about.bodyMd.trim().length > 0 || about.image !== null;

  return (
    <>
      <PageHero eyebrow={intro?.eyebrow} title={intro?.title ?? about.metaTitle} description={intro?.description ?? about.summary} />
      {hasProfile ? (
        <Section id="profil">
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
            <MarkdownContent source={about.bodyMd} />
            {about.image ? (
              <div className="overflow-hidden rounded-xl border border-border shadow-card">
                <SiteImage media={about.image} sizes={PROFILE_IMAGE_SIZES} className="w-full" />
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}
      <VisionSection vision={model.vision} intro={intros.vision} />
      <TeamSection team={model.team} intro={intros.team} />
      <StatsSection stats={model.stats} intro={intros.stats} />
    </>
  );
}
