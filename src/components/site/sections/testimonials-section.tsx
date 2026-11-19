import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { SiteImage } from "@/components/ui/site-image";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { Testimonial } from "@/core/domain/testimonial/testimonial";
import { ToneSection, type SectionTone } from "./tone-section";

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
  intro?: SectionIntro;
  tone?: SectionTone;
};

const AVATAR_SIZES = "48px";

export function TestimonialsSection({ testimonials, intro, tone }: TestimonialsSectionProps) {
  if (testimonials.length === 0 || !intro) {
    return null;
  }

  return (
    <ToneSection id="testimoni" tone={tone} eyebrow={intro.eyebrow} title={intro.title} description={intro.description}>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Reveal key={testimonial.id} as="li" stagger={index}>
            <Card className="h-full">
              <figure className="flex h-full flex-col gap-4">
                <blockquote className="flex-1 border-l-4 border-primary pl-4 text-lg text-foreground">
                  <p>{testimonial.quote}</p>
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  {testimonial.photo ? (
                    <div className="size-12 shrink-0 overflow-hidden rounded-full border-2 border-accent">
                      <SiteImage media={testimonial.photo} sizes={AVATAR_SIZES} className="w-full" />
                    </div>
                  ) : null}
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{`${testimonial.jobTitle}, ${testimonial.company}`}</p>
                  </div>
                </figcaption>
              </figure>
            </Card>
          </Reveal>
        ))}
      </ul>
    </ToneSection>
  );
}
