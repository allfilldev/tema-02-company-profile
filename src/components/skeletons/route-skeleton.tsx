import type { SkeletonKind } from "@/lib/site/skeleton-kind";
import {
  SkeletonArticleBody,
  SkeletonFaq,
  SkeletonForm,
  SkeletonGrid,
  SkeletonHero,
  SkeletonLegalText,
  SkeletonPagination,
  SkeletonStats,
} from "./skeleton-blocks";

function SkeletonLayout({ kind }: { kind: SkeletonKind }) {
  switch (kind) {
    case "home":
      return (
        <>
          <SkeletonHero tall />
          <SkeletonStats />
          <SkeletonGrid count={6} />
          <SkeletonGrid count={3} />
          <SkeletonGrid count={3} />
        </>
      );
    case "about":
      return (
        <>
          <SkeletonHero />
          <SkeletonArticleBody />
          <SkeletonStats />
          <SkeletonGrid count={4} columns={4} />
        </>
      );
    case "services-index":
      return (
        <>
          <SkeletonHero />
          <SkeletonGrid count={6} withHeading={false} />
        </>
      );
    case "portfolio-index":
      return (
        <>
          <SkeletonHero />
          <SkeletonGrid count={6} columns={2} withHeading={false} />
        </>
      );
    case "articles-index":
      return (
        <>
          <SkeletonHero />
          <SkeletonGrid count={6} withHeading={false} />
          <SkeletonPagination />
        </>
      );
    case "service-detail":
      return (
        <>
          <SkeletonHero />
          <SkeletonArticleBody />
          <SkeletonFaq />
          <SkeletonGrid count={3} />
        </>
      );
    case "portfolio-detail":
      return (
        <>
          <SkeletonHero />
          <SkeletonArticleBody />
          <SkeletonGrid count={3} />
        </>
      );
    case "article-detail":
      return (
        <>
          <SkeletonHero />
          <SkeletonArticleBody withSidebar />
          <SkeletonGrid count={3} />
        </>
      );
    case "contact":
      return (
        <>
          <SkeletonHero />
          <SkeletonForm />
        </>
      );
    case "legal":
      return (
        <>
          <SkeletonHero />
          <SkeletonLegalText />
        </>
      );
  }
}

export function RouteSkeleton({ kind }: { kind: SkeletonKind }) {
  return (
    <div role="status" aria-busy="true" data-skeleton-kind={kind}>
      <span className="sr-only">Memuat halaman</span>
      <SkeletonLayout kind={kind} />
    </div>
  );
}
