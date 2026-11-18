import type { SkeletonKind } from "@/lib/site/skeleton-kind";
import {
  SKELETON_HEIGHTS,
  SkeletonArticleBody,
  SkeletonBanner,
  SkeletonBreadcrumbs,
  SkeletonFaq,
  SkeletonForm,
  SkeletonGrid,
  SkeletonHero,
  SkeletonLegalText,
  SkeletonSplit,
  SkeletonStats,
} from "./skeleton-blocks";

function SkeletonLayout({ kind }: { kind: SkeletonKind }) {
  switch (kind) {
    case "home":
      return (
        <>
          <SkeletonHero height={SKELETON_HEIGHTS.homeHero} media actions />
          <SkeletonStats height={SKELETON_HEIGHTS.stats} />
          <SkeletonGrid height={SKELETON_HEIGHTS.homeServices} count={6} />
          <SkeletonGrid height={SKELETON_HEIGHTS.homeSteps} count={4} layout="four" card="text" />
          <SkeletonGrid height={SKELETON_HEIGHTS.homePortfolio} count={3} />
          <SkeletonGrid height={SKELETON_HEIGHTS.homeAdvantages} count={4} layout="two" card="text" />
          <SkeletonSplit height={SKELETON_HEIGHTS.homeAbout} />
          <SkeletonGrid height={SKELETON_HEIGHTS.vision} count={2} layout="two" card="text" />
          <SkeletonGrid height={SKELETON_HEIGHTS.team} count={4} layout="four" card="profile" />
          <SkeletonGrid height={SKELETON_HEIGHTS.testimonials} count={5} card="text" />
          <SkeletonGrid height={SKELETON_HEIGHTS.partners} count={8} layout="logos" card="logo" />
          <SkeletonGrid height={SKELETON_HEIGHTS.homeArticles} count={3} />
          <SkeletonFaq height={SKELETON_HEIGHTS.homeFaq} count={4} withHeading />
          <SkeletonBanner height={SKELETON_HEIGHTS.homeCta} />
        </>
      );
    case "about":
      return (
        <>
          <SkeletonBreadcrumbs />
          <SkeletonHero height={SKELETON_HEIGHTS.aboutHero} eyebrow={false} />
          <SkeletonSplit height={SKELETON_HEIGHTS.aboutProfile} withHeading={false} />
          <SkeletonGrid height={SKELETON_HEIGHTS.vision} count={2} layout="two" card="text" />
          <SkeletonGrid height={SKELETON_HEIGHTS.team} count={4} layout="four" card="profile" />
          <SkeletonStats height={SKELETON_HEIGHTS.stats} />
        </>
      );
    case "services-index":
      return (
        <>
          <SkeletonBreadcrumbs />
          <SkeletonHero height={SKELETON_HEIGHTS.servicesIndexHero} />
          <SkeletonGrid height={SKELETON_HEIGHTS.servicesList} count={6} />
        </>
      );
    case "portfolio-index":
      return (
        <>
          <SkeletonBreadcrumbs />
          <SkeletonHero height={SKELETON_HEIGHTS.portfolioIndexHero} />
          <SkeletonGrid height={SKELETON_HEIGHTS.portfolioList} count={6} />
        </>
      );
    case "articles-index":
      return (
        <>
          <SkeletonBreadcrumbs />
          <SkeletonHero height={SKELETON_HEIGHTS.articlesIndexHero} />
          <SkeletonGrid height={SKELETON_HEIGHTS.articlesList} count={3} />
        </>
      );
    case "service-detail":
      return (
        <>
          <SkeletonBreadcrumbs />
          <SkeletonHero height={SKELETON_HEIGHTS.serviceDetailHero} eyebrow={false} media />
          <SkeletonArticleBody height={SKELETON_HEIGHTS.serviceBody} />
          <SkeletonFaq height={SKELETON_HEIGHTS.serviceFaq} count={3} />
          <SkeletonGrid height={SKELETON_HEIGHTS.others} count={3} card="text" />
        </>
      );
    case "portfolio-detail":
      return (
        <>
          <SkeletonBreadcrumbs />
          <SkeletonHero height={SKELETON_HEIGHTS.portfolioDetailHero} media />
          <SkeletonArticleBody height={SKELETON_HEIGHTS.portfolioBody} withFacts />
          <SkeletonGrid height={SKELETON_HEIGHTS.gallery} count={2} layout="two" card="image" />
          <SkeletonGrid height={SKELETON_HEIGHTS.others} count={3} card="text" />
        </>
      );
    case "article-detail":
      return (
        <>
          <SkeletonBreadcrumbs />
          <SkeletonHero height={SKELETON_HEIGHTS.articleDetailHero} eyebrow={false} media />
          <SkeletonArticleBody height={SKELETON_HEIGHTS.articleBody} withSidebar />
          <SkeletonGrid height={SKELETON_HEIGHTS.related} count={3} card="text" />
        </>
      );
    case "contact":
      return (
        <>
          <SkeletonBreadcrumbs />
          <SkeletonHero height={SKELETON_HEIGHTS.contactHero} eyebrow={false} />
          <SkeletonForm height={SKELETON_HEIGHTS.contactForm} />
        </>
      );
    case "legal":
      return (
        <>
          <SkeletonBreadcrumbs />
          <SkeletonHero height={SKELETON_HEIGHTS.legalHero} eyebrow={false} />
          <SkeletonLegalText height={SKELETON_HEIGHTS.legalText} />
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
