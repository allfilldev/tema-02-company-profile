import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { SiteImage } from "@/components/ui/site-image";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { Testimonial } from "@/core/domain/testimonial/testimonial";
import { ContentSection, type ContentSectionTone } from "./content-section";

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
  intro?: SectionIntro;
  tone?: ContentSectionTone;
};

const AVATAR_SIZES = "48px";

export function TestimonialsSection({ testimonials, intro }: TestimonialsSectionProps) {
  if (testimonials.length === 0 || !intro) {
    return null;
  }

  return (
    <ContentSection id="testimoni" tone="inverse" eyebrow={intro.eyebrow} title={intro.title} description={intro.description}>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Reveal key={testimonial.id} as="li" stagger={index}>
            <figure className="flex h-full flex-col gap-5 rounded-2xl border border-surface-inverse-foreground/15 bg-surface-inverse-foreground/10 p-6">
              <span className="flex size-12 items-center justify-center rounded-full bg-highlight text-highlight-foreground">
                <Icon name="star" className="size-5 shrink-0" />
              </span>
              <blockquote className="flex-1 text-lg text-surface-inverse-foreground">
                <p>{testimonial.quote}</p>
              </blockquote>
              <figcaption className="flex items-center gap-3">
                {testimonial.photo ? (
                  <div className="size-12 shrink-0 overflow-hidden rounded-full border-2 border-highlight">
                    <SiteImage media={testimonial.photo} sizes={AVATAR_SIZES} className="w-full" />
                  </div>
                ) : null}
                <div>
                  <p className="font-semibold text-surface-inverse-foreground">{testimonial.name}</p>
                  <p className="text-sm text-surface-inverse-foreground/75">{`${testimonial.jobTitle}, ${testimonial.company}`}</p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>
    </ContentSection>
  );
}
