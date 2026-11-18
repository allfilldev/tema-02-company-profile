import type { ReactElement, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ArticlePagesTemplate from "@/app/(site)/artikel/halaman/template";
import ArticlesTemplate from "@/app/(site)/artikel/template";
import ServicesTemplate from "@/app/(site)/layanan/template";
import PortfolioTemplate from "@/app/(site)/portofolio/template";
import SiteTemplate from "@/app/(site)/template";
import { RouteGuard } from "@/components/site/layout/route-guard";
import { RouteSkeleton } from "@/components/skeletons/route-skeleton";

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
