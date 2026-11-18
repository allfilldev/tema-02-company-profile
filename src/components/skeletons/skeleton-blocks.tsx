import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { joinClassNames } from "@/lib/ui/class-names";

export const SKELETON_HEIGHTS = {
  breadcrumbRow: "h-11",
  homeHero: "lg:min-h-120",
  aboutHero: "lg:min-h-62",
  contactHero: "lg:min-h-62",
  legalHero: "lg:min-h-71",
  servicesIndexHero: "lg:min-h-81",
  portfolioIndexHero: "lg:min-h-69",
  articlesIndexHero: "lg:min-h-81",
  serviceDetailHero: "lg:min-h-119",
  portfolioDetailHero: "lg:min-h-119",
  articleDetailHero: "lg:min-h-156",
  stats: "lg:min-h-90",
  homeServices: "lg:min-h-338",
  homeSteps: "lg:min-h-153",
  homePortfolio: "lg:min-h-233",
  homeAdvantages: "lg:min-h-152",
  homeAbout: "lg:min-h-159",
  vision: "lg:min-h-209",
  team: "lg:min-h-207",
  testimonials: "lg:min-h-200",
  partners: "lg:min-h-106",
  homeArticles: "lg:min-h-223",
  homeFaq: "lg:min-h-169",
  homeCta: "lg:min-h-115",
  aboutProfile: "lg:min-h-271",
  servicesList: "lg:min-h-286",
  serviceBody: "lg:min-h-309",
  serviceFaq: "lg:min-h-122",
  portfolioList: "lg:min-h-332",
  portfolioBody: "lg:min-h-323",
  gallery: "lg:min-h-145",
  others: "lg:min-h-109",
  articlesList: "lg:min-h-166",
  articleBody: "lg:min-h-1242",
  related: "lg:min-h-103",
  contactForm: "lg:min-h-189",
  legalText: "lg:min-h-356",
} as const;

export type SkeletonHeight = (typeof SKELETON_HEIGHTS)[keyof typeof SKELETON_HEIGHTS];

type SkeletonLineWidth = "full" | "wide" | "half" | "short";

const LINE_WIDTHS: Record<SkeletonLineWidth, string> = {
  full: "w-full",
  wide: "w-5/6",
  half: "w-1/2",
  short: "w-1/3",
};

const GRID_LAYOUTS = {
  two: "md:grid-cols-2",
  three: "md:grid-cols-2 lg:grid-cols-3",
  four: "sm:grid-cols-2 lg:grid-cols-4",
  logos: "grid-cols-2 md:grid-cols-4",
} as const;

type SkeletonGridLayout = keyof typeof GRID_LAYOUTS;

const SECTION_PADDINGS = {
  default: "py-12 md:py-16",
  hero: "py-10 md:py-16",
} as const;

type SkeletonSectionPadding = keyof typeof SECTION_PADDINGS;

const BLOCK_RADII = {
  none: "rounded-none",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
} as const;

const BLOCK_TONES = {
  border: "bg-border",
  muted: "bg-surface-muted",
  secondary: "bg-secondary",
} as const;

type SkeletonBlockRadius = keyof typeof BLOCK_RADII;
type SkeletonBlockTone = keyof typeof BLOCK_TONES;

const CARD_FRAME = "rounded-lg border border-border bg-surface";

type SkeletonSectionProps = {
  height: SkeletonHeight;
  padding?: SkeletonSectionPadding;
  children?: ReactNode;
};

export function SkeletonSection({ height, padding = "default", children }: SkeletonSectionProps) {
  return (
    <div className={joinClassNames(SECTION_PADDINGS[padding], height)}>
      <Container>{children}</Container>
    </div>
  );
}

type SkeletonBlockProps = {
  rounded?: SkeletonBlockRadius;
  tone?: SkeletonBlockTone;
  className?: string;
};

export function SkeletonBlock({ rounded = "md", tone = "border", className }: SkeletonBlockProps) {
  return (
    <div
      className={joinClassNames("animate-pulse motion-reduce:animate-none", BLOCK_RADII[rounded], BLOCK_TONES[tone], className)}
    />
  );
}

type SkeletonLinesProps = {
  count: number;
  width?: SkeletonLineWidth;
  className?: string;
};

export function SkeletonLines({ count, width = "full", className }: SkeletonLinesProps) {
  return (
    <div className={joinClassNames("space-y-3", className)}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} data-skeleton="line">
          <SkeletonBlock className={joinClassNames("h-4", index === count - 1 ? LINE_WIDTHS.half : LINE_WIDTHS[width])} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonHeading({ className }: { className?: string }) {
  return (
    <div data-skeleton="heading" className={joinClassNames("max-w-3xl space-y-4", className)}>
      <SkeletonBlock className="h-4 w-24" />
      <SkeletonBlock className="h-9 w-3/4 md:h-10" />
      <SkeletonBlock className="h-5 w-full" />
    </div>
  );
}

export function SkeletonBreadcrumbs() {
  return (
    <Container className="pt-4">
      <div data-skeleton="breadcrumbs" className={joinClassNames("flex items-center", SKELETON_HEIGHTS.breadcrumbRow)}>
        <SkeletonBlock className="h-4 w-56" />
      </div>
    </Container>
  );
}

type SkeletonHeroProps = {
  height: SkeletonHeight;
  eyebrow?: boolean;
  media?: boolean;
  actions?: boolean;
};

export function SkeletonHero({ height, eyebrow = true, media = false, actions = false }: SkeletonHeroProps) {
  return (
    <div data-skeleton="hero" className="border-b border-border bg-surface">
      <SkeletonSection height={height} padding="hero">
        <div className={media ? "grid items-center gap-8 lg:grid-cols-2 lg:gap-12" : "max-w-3xl"}>
          <div className="space-y-4">
            {eyebrow ? <SkeletonBlock className="h-4 w-32" /> : null}
            <SkeletonBlock className="h-12 w-full" />
            <SkeletonLines count={2} />
            {actions ? (
              <div className="flex gap-3 pt-4">
                <SkeletonBlock rounded="lg" className="h-12 w-40" />
                <SkeletonBlock rounded="lg" className="h-12 w-40" />
              </div>
            ) : null}
          </div>
          {media ? <SkeletonBlock rounded="xl" tone="secondary" className="hidden h-80 w-full lg:block" /> : null}
        </div>
      </SkeletonSection>
    </div>
  );
}

type SkeletonCardVariant = "media" | "text" | "profile" | "logo" | "image";

export function SkeletonCard({ variant = "media" }: { variant?: SkeletonCardVariant }) {
  switch (variant) {
    case "media":
      return (
        <div data-skeleton="card" className={joinClassNames("overflow-hidden", CARD_FRAME)}>
          <SkeletonBlock rounded="none" tone="muted" className="h-40 w-full" />
          <div className="space-y-4 p-5">
            <SkeletonBlock className="h-6 w-3/4" />
            <SkeletonLines count={2} />
          </div>
        </div>
      );
    case "text":
      return (
        <div data-skeleton="card" className={joinClassNames("space-y-3 p-5", CARD_FRAME)}>
          <SkeletonBlock className="h-5 w-2/3" />
          <SkeletonLines count={2} />
        </div>
      );
    case "profile":
      return (
        <div data-skeleton="card" className={joinClassNames("space-y-4 p-6", CARD_FRAME)}>
          <SkeletonBlock rounded="full" tone="muted" className="mx-auto size-32" />
          <SkeletonLines count={2} />
        </div>
      );
    case "logo":
      return (
        <div data-skeleton="card">
          <SkeletonBlock rounded="lg" tone="muted" className="h-12 w-full" />
        </div>
      );
    case "image":
      return (
        <div data-skeleton="card">
          <SkeletonBlock rounded="lg" tone="muted" className="h-64 w-full" />
        </div>
      );
  }
}

type SkeletonGridProps = {
  height: SkeletonHeight;
  count: number;
  layout?: SkeletonGridLayout;
  card?: SkeletonCardVariant;
  withHeading?: boolean;
};

export function SkeletonGrid({ height, count, layout = "three", card = "media", withHeading = true }: SkeletonGridProps) {
  return (
    <SkeletonSection height={height}>
      {withHeading ? <SkeletonHeading className="mb-8 md:mb-12" /> : null}
      <div data-skeleton="grid" className={joinClassNames("grid gap-6", GRID_LAYOUTS[layout])}>
        {Array.from({ length: count }, (_, index) => (
          <SkeletonCard key={index} variant={card} />
        ))}
      </div>
    </SkeletonSection>
  );
}

export function SkeletonStats({ height }: { height: SkeletonHeight }) {
  return (
    <SkeletonSection height={height}>
      <SkeletonHeading className="mb-8 md:mb-12" />
      <div data-skeleton="stats" className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="space-y-3">
            <SkeletonBlock className="h-10 w-24" />
            <SkeletonBlock className="h-4 w-32" />
          </div>
        ))}
      </div>
    </SkeletonSection>
  );
}

type SkeletonSplitProps = {
  height: SkeletonHeight;
  withHeading?: boolean;
};

export function SkeletonSplit({ height, withHeading = true }: SkeletonSplitProps) {
  return (
    <SkeletonSection height={height}>
      {withHeading ? <SkeletonHeading className="mb-8 md:mb-12" /> : null}
      <div data-skeleton="split" className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-6">
          <SkeletonLines count={5} />
          <SkeletonLines count={4} />
        </div>
        <SkeletonBlock rounded="xl" tone="muted" className="h-64 w-full" />
      </div>
    </SkeletonSection>
  );
}

export function SkeletonBanner({ height }: { height: SkeletonHeight }) {
  return (
    <SkeletonSection height={height}>
      <div data-skeleton="banner">
        <SkeletonBlock rounded="xl" tone="secondary" className="h-64 w-full" />
      </div>
    </SkeletonSection>
  );
}

type SkeletonArticleBodyProps = {
  height: SkeletonHeight;
  withSidebar?: boolean;
  withFacts?: boolean;
};

export function SkeletonArticleBody({ height, withSidebar = false, withFacts = false }: SkeletonArticleBodyProps) {
  return (
    <SkeletonSection height={height}>
      <div className={joinClassNames("gap-12", withSidebar && "lg:grid lg:grid-cols-3")}>
        <div data-skeleton="article-body" className={joinClassNames("max-w-3xl space-y-8", withSidebar && "lg:col-span-2")}>
          {withFacts ? <SkeletonBlock rounded="lg" tone="muted" className="h-24 w-full" /> : null}
          <SkeletonLines count={5} />
          <SkeletonBlock className="h-8 w-1/2" />
          <SkeletonLines count={6} />
          <SkeletonBlock className="h-8 w-2/3" />
          <SkeletonLines count={5} />
        </div>
        {withSidebar ? <SkeletonSidebar /> : null}
      </div>
    </SkeletonSection>
  );
}

export function SkeletonSidebar() {
  return (
    <div className="hidden lg:col-span-1 lg:block">
      <div data-skeleton="sidebar" className={joinClassNames("sticky top-24 space-y-5 p-6", CARD_FRAME)}>
        <SkeletonBlock className="h-5 w-1/2" />
        <div className="flex items-center gap-4">
          <SkeletonBlock rounded="full" className="size-16" />
          <div className="flex-1 space-y-3">
            <SkeletonBlock className="h-4 w-3/4" />
            <SkeletonBlock className="h-4 w-1/2" />
          </div>
        </div>
        <SkeletonLines count={4} />
      </div>
    </div>
  );
}

export function SkeletonForm({ height }: { height: SkeletonHeight }) {
  return (
    <SkeletonSection height={height}>
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SkeletonBlock className="h-8 w-1/2" />
          <div data-skeleton="form" className={joinClassNames("space-y-6 p-6 md:p-8", CARD_FRAME)}>
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} data-skeleton="field" className="space-y-2">
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock tone="muted" className="h-11 w-full" />
              </div>
            ))}
            <div data-skeleton="field" className="space-y-2">
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock tone="muted" className="h-28 w-full" />
            </div>
            <SkeletonBlock rounded="lg" className="h-12 w-40" />
          </div>
        </div>
        <div className="space-y-6">
          <SkeletonBlock className="h-8 w-2/3" />
          <SkeletonLines count={5} />
        </div>
      </div>
    </SkeletonSection>
  );
}

export function SkeletonLegalText({ height }: { height: SkeletonHeight }) {
  return (
    <SkeletonSection height={height}>
      <div data-skeleton="legal-text" className="max-w-3xl space-y-10">
        <SkeletonBlock className="h-4 w-48" />
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="space-y-4">
            <SkeletonBlock className="h-7 w-1/2" />
            <SkeletonLines count={4} />
          </div>
        ))}
      </div>
    </SkeletonSection>
  );
}

type SkeletonFaqProps = {
  height: SkeletonHeight;
  count: number;
  withHeading?: boolean;
};

export function SkeletonFaq({ height, count, withHeading = false }: SkeletonFaqProps) {
  return (
    <SkeletonSection height={height}>
      <div data-skeleton="faq" className="max-w-3xl space-y-4">
        {withHeading ? <SkeletonHeading className="mb-8 md:mb-12" /> : <SkeletonBlock className="mb-8 h-9 w-1/2" />}
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className={joinClassNames("p-5", CARD_FRAME)}>
            <SkeletonBlock className="h-5 w-3/4" />
          </div>
        ))}
      </div>
    </SkeletonSection>
  );
}
