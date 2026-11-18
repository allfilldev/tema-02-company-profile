import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Section } from "@/components/ui/section";
import type { ContentBlock, ContentBlockItem } from "@/core/domain/content-block/content-block";
import type { CallToAction } from "@/core/domain/shared/call-to-action";

type BlockProps = {
  block?: ContentBlock;
};

type CallToActionLinkProps = {
  cta: CallToAction;
  variant?: "primary" | "secondary";
  className?: string;
};

const EXTERNAL_HREF_PATTERN = /^https?:\/\//i;
const ICON_BADGE_CLASS_NAME = "flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground";
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

export function HowWeWork({ block }: BlockProps) {
  const items = titledItems(block);
  if (!block || items.length === 0) {
    return null;
  }

  return (
    <Section id="cara-kerja" eyebrow={block.eyebrow} title={block.title} description={block.description}>
      <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <li key={item.title}>
            <Card className="flex h-full flex-col gap-3">
              <div className="flex items-center gap-3">
                {item.icon ? <IconBadge icon={item.icon} /> : null}
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">{`${STEP_LABEL} ${index + 1}`}</p>
              </div>
              <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
              {item.description ? <p className="text-base text-muted-foreground">{item.description}</p> : null}
            </Card>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function WhyChooseUs({ block }: BlockProps) {
  const items = titledItems(block);
  if (!block || items.length === 0) {
    return null;
  }

  return (
    <Section id="keunggulan" eyebrow={block.eyebrow} title={block.title} description={block.description} className="bg-surface-muted">
      <ul className="grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <li key={item.title}>
            <Card className="flex h-full gap-4">
              {item.icon ? <IconBadge icon={item.icon} /> : null}
              <div>
                <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                {item.description ? <p className="mt-2 text-base text-muted-foreground">{item.description}</p> : null}
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function HomeFaq({ block }: BlockProps) {
  const items = titledItems(block).filter((item) => Boolean(item.description));
  if (!block || items.length === 0) {
    return null;
  }

  return (
    <Section id="faq" eyebrow={block.eyebrow} title={block.title} description={block.description}>
      <div className="max-w-3xl space-y-6">
        {items.map((item) => (
          <div key={item.title}>
            <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2 text-base text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function CtaBanner({ block }: BlockProps) {
  const links = block ? block.items.flatMap((item) => (item.link ? [item.link] : [])) : [];
  if (!block || links.length === 0) {
    return null;
  }

  return (
    <section id="ajakan" aria-labelledby="ajakan-title" className="py-12 md:py-16">
      <Container>
        <div className="rounded-xl bg-accent px-6 py-10 text-center md:px-12 md:py-14">
          {block.eyebrow ? <p className="text-sm font-semibold uppercase tracking-wide text-accent-foreground">{block.eyebrow}</p> : null}
          <h2 id="ajakan-title" className="mt-2 text-3xl font-bold tracking-tight text-accent-foreground md:text-4xl">
            {block.title}
          </h2>
          {block.description ? <p className="mx-auto mt-4 max-w-2xl text-lg text-accent-foreground">{block.description}</p> : null}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {links.map((link, index) => (
              <CallToActionLink
                key={link.href}
                cta={link}
                variant={index === 0 ? "primary" : "secondary"}
                className={index === 0 ? undefined : "border border-border-strong"}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
