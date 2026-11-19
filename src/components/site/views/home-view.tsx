import { ArticlesSection } from "@/components/site/sections/articles-section";
import { CallToActionLink, CtaBanner, HomeFaq, HowWeWork, WhyChooseUs } from "@/components/site/sections/content-blocks";
import { PageHero } from "@/components/site/sections/page-hero";
import { PartnersSection } from "@/components/site/sections/partners-section";
import { PortfolioSection } from "@/components/site/sections/portfolio-section";
import { ServicesSection } from "@/components/site/sections/services-section";
import { StatsSection } from "@/components/site/sections/stats-section";
import { TeamSection } from "@/components/site/sections/team-section";
import { TestimonialsSection } from "@/components/site/sections/testimonials-section";
import { VisionSection } from "@/components/site/sections/vision-section";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SiteImage } from "@/components/ui/site-image";
import type { AboutContent } from "@/core/domain/page/about-content";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { HomePageModel } from "@/server/site/models/home";

type HomeViewProps = {
  model: HomePageModel;
};

const ABOUT_MORE_LABEL = "Selengkapnya tentang kami";
const ABOUT_IMAGE_SIZES = "(min-width: 1024px) 560px, 100vw";

function AboutTeaser({ about, intro }: { about: AboutContent; intro?: SectionIntro }) {
  if (!intro) {
    return null;
  }

  return (
    <Section id="tentang" eyebrow={intro.eyebrow} title={intro.title} description={intro.description}>
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <p className="text-lg text-foreground">{about.summary}</p>
          <p className="mt-6">
            <ButtonLink href="/tentang" variant="secondary">
              {ABOUT_MORE_LABEL}
            </ButtonLink>
          </p>
        </div>
        {about.image ? (
          <div className="overflow-hidden rounded-xl border border-border shadow-card">
            <SiteImage media={about.image} sizes={ABOUT_IMAGE_SIZES} className="w-full" />
          </div>
        ) : null}
      </div>
    </Section>
  );
}

export function HomeView({ model }: HomeViewProps) {
  const { hero, intros, blocks } = model;
  const hasHeroActions = Boolean(hero.primaryCta || hero.secondaryCta);

  return (
    <>
      <PageHero eyebrow={hero.heroEyebrow} title={hero.heroTitle} description={hero.heroSubtitle} image={hero.heroImage}>
        {hasHeroActions ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {hero.primaryCta ? <CallToActionLink cta={hero.primaryCta} /> : null}
            {hero.secondaryCta ? <CallToActionLink cta={hero.secondaryCta} variant="secondary" /> : null}
          </div>
        ) : null}
      </PageHero>
      <StatsSection stats={model.stats} intro={intros.stats} />
      <Reveal><ServicesSection services={model.services} intro={intros.services} /></Reveal>
      <Reveal><HowWeWork block={blocks["how-we-work"]} /></Reveal>
      <Reveal><PortfolioSection items={model.featuredPortfolio} intro={intros.portfolio} /></Reveal>
      <Reveal><WhyChooseUs block={blocks["why-choose-us"]} /></Reveal>
      <Reveal><AboutTeaser about={model.about} intro={intros.about} /></Reveal>
      <Reveal><VisionSection vision={model.vision} intro={intros.vision} /></Reveal>
      <Reveal><TeamSection team={model.team} intro={intros.team} /></Reveal>
      <Reveal><TestimonialsSection testimonials={model.testimonials} intro={intros.testimonials} /></Reveal>
      <Reveal><PartnersSection partners={model.partners} intro={intros.partners} /></Reveal>
      <Reveal><ArticlesSection articles={model.latestArticles} intro={intros.articles} /></Reveal>
      <Reveal><HomeFaq block={blocks["home-faq"]} /></Reveal>
      <Reveal><CtaBanner block={blocks["cta-banner"]} /></Reveal>
    </>
  );
}
