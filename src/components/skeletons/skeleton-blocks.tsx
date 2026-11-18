import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { joinClassNames } from "@/lib/ui/class-names";

export const SKELETON_HEIGHTS = {
  homeHero: "min-h-128 lg:min-h-144",
  pageHero: "min-h-72 lg:min-h-80",
  stats: "min-h-40",
  grid: "min-h-128",
  articleBody: "min-h-192",
  form: "min-h-160",
  legalText: "min-h-256",
  faq: "min-h-96",
  pagination: "min-h-24",
} as const;

type SkeletonLineWidth = "full" | "wide" | "half" | "short";

const LINE_WIDTHS: Record<SkeletonLineWidth, string> = {
  full: "w-full",
  wide: "w-5/6",
  half: "w-1/2",
  short: "w-1/3",
};

const GRID_COLUMNS = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

type SkeletonGridColumns = keyof typeof GRID_COLUMNS;

const SECTION_PADDINGS = {
  default: "py-12 md:py-16",
  hero: "py-12 md:py-16 lg:py-20",
  compact: "py-6",
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

type SkeletonSectionProps = {
  height: string;
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

export function SkeletonHero({ tall = false }: { tall?: boolean }) {
  return (
    <div data-skeleton="hero" className="bg-surface-muted">
      <SkeletonSection height={tall ? SKELETON_HEIGHTS.homeHero : SKELETON_HEIGHTS.pageHero} padding="hero">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-12 w-full md:h-14" />
            <SkeletonBlock className="h-12 w-2/3 md:h-14" />
            <SkeletonLines count={tall ? 3 : 2} />
            {tall ? (
              <div className="flex gap-4 pt-2">
                <SkeletonBlock rounded="lg" className="h-12 w-40" />
                <SkeletonBlock rounded="lg" className="h-12 w-40" />
              </div>
            ) : null}
          </div>
          <SkeletonBlock rounded="xl" tone="secondary" className={joinClassNames("hidden w-full lg:block", tall ? "h-80" : "h-48")} />
        </div>
      </SkeletonSection>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div data-skeleton="card" className="overflow-hidden rounded-lg border border-border bg-surface">
      <SkeletonBlock rounded="none" tone="muted" className="h-40 w-full" />
      <div className="space-y-4 p-5">
        <SkeletonBlock className="h-6 w-3/4" />
        <SkeletonLines count={2} />
      </div>
    </div>
  );
}

type SkeletonGridProps = {
  count?: number;
  columns?: SkeletonGridColumns;
  withHeading?: boolean;
};

export function SkeletonGrid({ count = 6, columns = 3, withHeading = true }: SkeletonGridProps) {
  return (
    <SkeletonSection height={SKELETON_HEIGHTS.grid}>
      {withHeading ? <SkeletonHeading className="mb-8 md:mb-12" /> : null}
      <div data-skeleton="grid" className={joinClassNames("grid gap-6", GRID_COLUMNS[columns])}>
        {Array.from({ length: count }, (_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </SkeletonSection>
  );
}

export function SkeletonStats() {
  return (
    <SkeletonSection height={SKELETON_HEIGHTS.stats} padding="compact">
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

export function SkeletonArticleBody({ withSidebar = false }: { withSidebar?: boolean }) {
  return (
    <SkeletonSection height={SKELETON_HEIGHTS.articleBody}>
      <div className={joinClassNames("gap-12", withSidebar && "lg:grid lg:grid-cols-12")}>
        <div data-skeleton="article-body" className={joinClassNames("max-w-3xl space-y-8", withSidebar && "lg:col-span-8")}>
          <SkeletonBlock rounded="lg" tone="muted" className="h-64 w-full" />
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
    <div className="hidden lg:col-span-4 lg:block">
      <div data-skeleton="sidebar" className="sticky top-24 space-y-5 rounded-lg border border-border bg-surface p-6">
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

export function SkeletonForm() {
  return (
    <SkeletonSection height={SKELETON_HEIGHTS.form}>
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <SkeletonHeading />
          <SkeletonLines count={4} />
        </div>
        <div data-skeleton="form" className="space-y-6 rounded-lg border border-border bg-surface p-6 md:p-8">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} data-skeleton="field" className="space-y-2">
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock tone="muted" className="h-11 w-full" />
            </div>
          ))}
          <div data-skeleton="field" className="space-y-2">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock tone="muted" className="h-32 w-full" />
          </div>
          <SkeletonBlock rounded="lg" className="h-12 w-40" />
        </div>
      </div>
    </SkeletonSection>
  );
}

export function SkeletonLegalText() {
  return (
    <SkeletonSection height={SKELETON_HEIGHTS.legalText}>
      <div data-skeleton="legal-text" className="max-w-3xl space-y-10">
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

export function SkeletonFaq() {
  return (
    <SkeletonSection height={SKELETON_HEIGHTS.faq}>
      <div data-skeleton="faq" className="max-w-3xl space-y-4">
        <SkeletonBlock className="mb-8 h-9 w-1/2" />
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="rounded-lg border border-border bg-surface p-5">
            <SkeletonBlock className="h-5 w-3/4" />
          </div>
        ))}
      </div>
    </SkeletonSection>
  );
}

export function SkeletonPagination() {
  return (
    <SkeletonSection height={SKELETON_HEIGHTS.pagination} padding="compact">
      <div data-skeleton="pagination" className="flex justify-center gap-3">
        {Array.from({ length: 3 }, (_, index) => (
          <SkeletonBlock key={index} rounded="lg" className="size-11" />
        ))}
      </div>
    </SkeletonSection>
  );
}
