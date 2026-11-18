import { use, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import ArticlePagesTemplate from "@/app/(site)/artikel/halaman/template";
import ArticlesTemplate from "@/app/(site)/artikel/template";
import ServicesTemplate from "@/app/(site)/layanan/template";
import PortfolioTemplate from "@/app/(site)/portofolio/template";
import SiteTemplate from "@/app/(site)/template";
import { RouteGuard, RouteShellGuard } from "@/components/site/layout/route-guard";
import { RouteSkeleton } from "@/components/skeletons/route-skeleton";

const navigation = vi.hoisted(() => ({ pathname: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => ({ push: () => undefined, replace: () => undefined, prefetch: () => undefined }),
}));

const NEVER_SETTLES = new Promise<never>(() => undefined);

function SuspendedRoute(): ReactElement {
  return use(NEVER_SETTLES);
}

const PAGE_MARKUP = '<article data-marker="halaman"><h1>Judul halaman</h1><a href="/kontak">Hubungi kami</a></article>';

function pageContent(): ReactElement {
  return (
    <article data-marker="halaman">
      <h1>Judul halaman</h1>
      <a href="/kontak">Hubungi kami</a>
    </article>
  );
}

describe("RouteSkeleton positive control", () => {
  it("renders the busy status markers that the guard must not render on the server", () => {
    const markup = renderToStaticMarkup(<RouteSkeleton kind="home" />);

    expect(markup).toContain('role="status"');
    expect(markup).toContain('aria-busy="true"');
  });
});

describe("RouteGuard suspense fallback", () => {
  afterEach(() => {
    navigation.pathname = "/";
  });

  it("needs a boundary: suspended content without RouteGuard cannot render", () => {
    expect(() => renderToStaticMarkup(<SuspendedRoute />)).toThrow();
  });

  it.each([
    ["/kontak", "contact"],
    ["/layanan/penyusunan-sop", "service-detail"],
    ["/artikel/halaman/2", "articles-index"],
    ["/", "home"],
  ] as const)("shows the skeleton of %s while its route content suspends", (pathname, kind) => {
    navigation.pathname = pathname;
    const markup = renderToStaticMarkup(<RouteGuard><SuspendedRoute /></RouteGuard>);

    expect(markup).toBe(renderToStaticMarkup(<RouteSkeleton kind={kind} />));
    expect(markup).toContain(`data-skeleton-kind="${kind}"`);
    expect(markup).toContain('aria-busy="true"');
    expect(markup).not.toMatch(/<h1\b/);
  });
});

describe("RouteShellGuard server render", () => {
  it("renders the children exactly as given without a wrapper or skeleton", () => {
    const markup = renderToStaticMarkup(<RouteShellGuard>{pageContent()}</RouteShellGuard>);

    expect(markup).toBe(PAGE_MARKUP);
    expect(markup).not.toContain('aria-busy="true"');
  });

  it("adds no suspense boundary, so suspended content still needs one above it", () => {
    expect(() => renderToStaticMarkup(<RouteShellGuard><SuspendedRoute /></RouteShellGuard>)).toThrow();
  });
});

describe("RouteGuard server render", () => {
  it("renders the children exactly as given without a wrapper or skeleton", () => {
    const markup = renderToStaticMarkup(<RouteGuard>{pageContent()}</RouteGuard>);

    expect(markup).toBe(PAGE_MARKUP);
    expect(markup).not.toContain('role="status"');
    expect(markup).not.toContain('aria-busy="true"');
  });

  it("renders nested guards as their children only", () => {
    const markup = renderToStaticMarkup(
      <RouteGuard>
        <RouteGuard>{pageContent()}</RouteGuard>
      </RouteGuard>,
    );

    expect(markup).toBe(PAGE_MARKUP);
    expect(markup).not.toContain('aria-busy="true"');
  });
});

const TEMPLATES: Array<[string, (props: { children: ReactNode }) => ReactElement]> = [
  ["src/app/(site)/template.tsx", SiteTemplate],
  ["src/app/(site)/artikel/template.tsx", ArticlesTemplate],
  ["src/app/(site)/artikel/halaman/template.tsx", ArticlePagesTemplate],
  ["src/app/(site)/layanan/template.tsx", ServicesTemplate],
  ["src/app/(site)/portofolio/template.tsx", PortfolioTemplate],
];

describe("route templates", () => {
  it.each(TEMPLATES)("%s wraps its children in RouteGuard", (_file, Template) => {
    const child = pageContent();
    const element = Template({ children: child });

    expect(element.type).toBe(RouteGuard);
    expect((element.props as { children: ReactNode }).children).toBe(child);
  });

  it.each(TEMPLATES)("%s renders the page markup on the server without a skeleton", (_file, Template) => {
    const markup = renderToStaticMarkup(<Template>{pageContent()}</Template>);

    expect(markup).toBe(PAGE_MARKUP);
    expect(markup).not.toContain('aria-busy="true"');
  });
});
