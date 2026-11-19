import { PageHero } from "@/components/site/sections/page-hero";
import { StatsSection } from "@/components/site/sections/stats-section";
import { TeamSection } from "@/components/site/sections/team-section";
import { VisionSection } from "@/components/site/sections/vision-section";
import { MarkdownContent } from "@/components/site/contract/markdown-content";
import { Reveal } from "@/components/ui/reveal";
import { BlobImage } from "@/components/ui/blob-image";
import { ContentSection } from "@/components/site/sections/content-section";
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
    <div className="page-enter">
      <PageHero eyebrow={intro?.eyebrow} title={intro?.title ?? about.metaTitle} description={intro?.description ?? about.summary} />
      {hasProfile ? (
        <ContentSection id="profil">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {about.image ? (
              <div className="relative mx-auto w-full max-w-md lg:order-first">
                <BlobImage src={about.image.url} alt={about.image.alt} priority sizes={PROFILE_IMAGE_SIZES} />
                <span aria-hidden="true" className="absolute left-2 top-6 size-3 rounded-full bg-highlight" />
                <span aria-hidden="true" className="absolute bottom-10 right-0 size-4 rounded-full bg-primary" />
              </div>
            ) : null}
            <MarkdownContent source={about.bodyMd} mediaSizes={model.mediaSizes} />
          </div>
        </ContentSection>
      ) : null}
      <Reveal variant="fade">
        <VisionSection vision={model.vision} intro={intros.vision} />
      </Reveal>
      <Reveal variant="fade">
        <TeamSection team={model.team} intro={intros.team} tone="surface-muted" />
      </Reveal>
      <Reveal>
        <StatsSection stats={model.stats} intro={intros.stats} />
      </Reveal>
    </div>
  );
}
