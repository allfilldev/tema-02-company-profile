import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import type { ContentBlock, ContentBlockItem } from "@/core/domain/content-block/content-block";
import type { CallToAction } from "@/core/domain/shared/call-to-action";
import { ToneSection, type SectionTone } from "./tone-section";

type BlockProps = {
  block?: ContentBlock;
  tone?: SectionTone;
};

type CallToActionLinkProps = {
  cta: CallToAction;
  variant?: "primary" | "secondary" | "inverse";
  className?: string;
};

const EXTERNAL_HREF_PATTERN = /^https?:\/\//i;
const ICON_BADGE_CLASS_NAME = "flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground";
const STEP_LABEL = "Langkah";

function titledItems(block: ContentBlock | undefined): ContentBlockItem[] {
  return block ? block.items.filter((item) => Boolean(item.title)) : [];
}

function IconBadge({ icon }: { icon: string }) {
  return (
    <span className={ICON_BADGE_CLASS_NAME}>
      <Icon name={icon} className="size-6 shrink-0" />
    </span>
  );
}

export function CallToActionLink({ cta, variant = "primary", className }: CallToActionLinkProps) {
  return (
    <ButtonLink href={cta.href} external={EXTERNAL_HREF_PATTERN.test(cta.href)} variant={variant} size="lg" className={className}>
      {cta.label}
    </ButtonLink>
  );
}

export function HowWeWork({ block, tone }: BlockProps) {
  const items = titledItems(block);
  if (!block || items.length === 0) {
    return null;
  }

  return (
    <ToneSection id="cara-kerja" tone={tone} eyebrow={block.eyebrow} title={block.title} description={block.description}>
      <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <li key={item.title}>
            <Card className="flex h-full flex-col gap-3">
              <div className="flex items-center gap-3">
                {item.icon ? <IconBadge icon={item.icon} /> : null}
                <p className="text-sm font-bold uppercase tracking-widest text-primary">{`${STEP_LABEL} ${index + 1}`}</p>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">{item.title}</h3>
              {item.description ? <p className="text-base text-muted-foreground">{item.description}</p> : null}
            </Card>
          </li>
        ))}
      </ol>
    </ToneSection>
  );
}

export function WhyChooseUs({ block, tone }: BlockProps) {
  const items = titledItems(block);
  if (!block || items.length === 0) {
    return null;
  }

  return (
    <ToneSection id="keunggulan" tone={tone} eyebrow={block.eyebrow} title={block.title} description={block.description}>
      <ul className="grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <li key={item.title}>
            <Card className="flex h-full gap-4">
              {item.icon ? <IconBadge icon={item.icon} /> : null}
              <div>
                <h3 className="text-xl font-bold tracking-tight text-foreground">{item.title}</h3>
                {item.description ? <p className="mt-2 text-base text-muted-foreground">{item.description}</p> : null}
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </ToneSection>
  );
}

export function HomeFaq({ block, tone }: BlockProps) {
  const items = titledItems(block).filter((item) => Boolean(item.description));
  if (!block || items.length === 0) {
    return null;
  }

  return (
    <ToneSection id="faq" tone={tone} eyebrow={block.eyebrow} title={block.title} description={block.description}>
      <div className="max-w-3xl space-y-4">
        {items.map((item) => (
          <Card key={item.title}>
            <h3 className="text-lg font-bold tracking-tight text-foreground">{item.title}</h3>
            <p className="mt-2 text-base text-muted-foreground">{item.description}</p>
          </Card>
        ))}
      </div>
    </ToneSection>
  );
}

export function CtaBanner({ block }: BlockProps) {
  const links = block ? block.items.flatMap((item) => (item.link ? [item.link] : [])) : [];
  if (!block || links.length === 0) {
    return null;
  }

  return (
    <section id="ajakan" aria-labelledby="ajakan-title" className="py-12 md:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-2xl bg-surface-inverse px-6 py-12 text-center shadow-soft md:px-12 md:py-16">
          <div aria-hidden="true" className="shape-blob absolute -right-16 -top-16 size-56 bg-primary/40 md:size-80" />
          <div aria-hidden="true" className="shape-blob absolute -bottom-20 -left-12 size-48 bg-accent/20 md:size-64" />
          <div className="relative">
            {block.eyebrow ? <p className="text-sm font-bold uppercase tracking-widest text-accent">{block.eyebrow}</p> : null}
            <h2 id="ajakan-title" className="mt-3 text-3xl font-extrabold tracking-tighter text-surface-inverse-foreground md:text-5xl">
              {block.title}
            </h2>
            {block.description ? (
              <p className="mx-auto mt-4 max-w-2xl text-lg text-surface-inverse-foreground/80">{block.description}</p>
            ) : null}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {links.map((link, index) => (
                <CallToActionLink key={link.href} cta={link} variant={index === 0 ? "inverse" : "secondary"} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
