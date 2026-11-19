import { ArticlesSection } from "@/components/site/sections/articles-section";
import { CallToActionLink, CtaBanner, HomeFaq, HowWeWork, WhyChooseUs } from "@/components/site/sections/content-blocks";
import { HomeHero } from "@/components/site/sections/home-hero";
import { PartnersSection } from "@/components/site/sections/partners-section";
import { PortfolioSection } from "@/components/site/sections/portfolio-section";
import { ServicesSection } from "@/components/site/sections/services-section";
import { StatsSection } from "@/components/site/sections/stats-section";
import { TeamSection } from "@/components/site/sections/team-section";
import { TestimonialsSection } from "@/components/site/sections/testimonials-section";
import { VisionSection } from "@/components/site/sections/vision-section";
import { PillArrowLink } from "@/components/site/sections/arrow-link";
import { Container } from "@/components/ui/container";
import { SiteImage } from "@/components/ui/site-image";
import { Reveal } from "@/components/ui/reveal";
import type { AboutContent } from "@/core/domain/page/about-content";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { HomePageModel } from "@/server/site/models/home";

type HomeViewProps = {
  model: HomePageModel;
};

const ABOUT_MORE_LABEL = "Selengkapnya tentang kami";
const ABOUT_IMAGE_SIZES = "(min-width: 1024px) 480px, 100vw";

function AboutTeaser({ about, intro }: { about: AboutContent; intro?: SectionIntro }) {
  if (!intro) {
    return null;
  }

  const words = intro.title.trim().split(/\s+/);
  const cut = words.length < 2 ? words.length : Math.ceil(words.length / 2);
  const lead = words.slice(0, cut).join(" ");
  const tail = words.slice(cut).join(" ");

  const text = (
    <div className="min-w-0">
      {intro.eyebrow ? (
        <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground">
          <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-highlight" />
          {intro.eyebrow}
        </p>
      ) : null}
      <h2 id="tentang-title" className="mt-3 text-3xl font-extrabold tracking-tighter text-foreground md:text-5xl">
        {lead}
        {tail ? <span className="text-primary">{` ${tail}`}</span> : null}
      </h2>
      <p className="mt-5 text-lg text-muted-foreground">{about.summary}</p>
      {intro.description ? <p className="mt-4 text-base text-muted-foreground">{intro.description}</p> : null}
      <p className="mt-8">
        <PillArrowLink href="/tentang">{ABOUT_MORE_LABEL}</PillArrowLink>
      </p>
    </div>
  );

  return (
    <section id="tentang" aria-labelledby="tentang-title" className="py-16 md:py-24">
      <Container>
        {about.image ? (
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div aria-hidden="true" className="shape-blob absolute -inset-3 -rotate-12 border-2 border-highlight" />
              <span aria-hidden="true" className="absolute -left-4 top-6 size-3 rounded-full bg-highlight" />
              <span aria-hidden="true" className="absolute -right-2 bottom-10 size-4 rounded-full bg-primary" />
              <div className="shape-blob relative aspect-square overflow-hidden bg-secondary shadow-soft">
                <SiteImage media={about.image} sizes={ABOUT_IMAGE_SIZES} className="h-full! w-full! object-cover" />
              </div>
            </div>
            {text}
          </div>
        ) : (
          <div className="max-w-3xl">{text}</div>
        )}
      </Container>
    </section>
  );
}

export function HomeView({ model }: HomeViewProps) {
  const { hero, intros, blocks } = model;
  const hasHeroActions = Boolean(hero.primaryCta || hero.secondaryCta);
  const hasServices = model.services.length > 0 && Boolean(intros.services);
  const hasStats = model.stats.length > 0 && Boolean(intros.stats);
  const hasVision = Boolean(model.vision && intros.vision);

  return (
    <div className="page-enter">
      <HomeHero eyebrow={hero.heroEyebrow} title={hero.heroTitle} description={hero.heroSubtitle} image={hero.heroImage}>
        {hasHeroActions ? (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {hero.primaryCta ? <CallToActionLink cta={hero.primaryCta} variant="primary" /> : null}
            {hero.secondaryCta ? <CallToActionLink cta={hero.secondaryCta} variant="highlight" /> : null}
          </div>
        ) : null}
      </HomeHero>
      <Reveal variant="fade"><PartnersSection partners={model.partners} intro={intros.partners} /></Reveal>
      <Reveal variant="fade"><AboutTeaser about={model.about} intro={intros.about} /></Reveal>
      <Reveal variant="fade"><ServicesSection services={model.services} intro={intros.services} joinsDarkSection={hasStats} /></Reveal>
      <Reveal variant="fade"><StatsSection stats={model.stats} intro={intros.stats} edgeTop={!hasServices} overlapped={hasVision} /></Reveal>
      <Reveal variant="fade"><VisionSection vision={model.vision} intro={intros.vision} variant={hasStats ? "overlap" : "section"} /></Reveal>
      <Reveal variant="fade"><HowWeWork block={blocks["how-we-work"]} /></Reveal>
      <Reveal variant="fade"><PortfolioSection items={model.featuredPortfolio} intro={intros.portfolio} tone="surface-muted" /></Reveal>
      <Reveal variant="fade"><WhyChooseUs block={blocks["why-choose-us"]} /></Reveal>
      <Reveal variant="fade"><TeamSection team={model.team} intro={intros.team} tone="surface-muted" /></Reveal>
      <Reveal variant="fade"><TestimonialsSection testimonials={model.testimonials} intro={intros.testimonials} /></Reveal>
      <Reveal variant="fade"><ArticlesSection articles={model.latestArticles} intro={intros.articles} tone="surface-muted" /></Reveal>
      <Reveal variant="fade"><HomeFaq block={blocks["home-faq"]} /></Reveal>
      <Reveal variant="fade"><CtaBanner block={blocks["cta-banner"]} /></Reveal>
    </div>
  );
}
