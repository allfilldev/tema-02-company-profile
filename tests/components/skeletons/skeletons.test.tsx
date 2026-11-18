import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RouteSkeleton } from "@/components/skeletons/route-skeleton";
import { SKELETON_KINDS, type SkeletonKind } from "@/lib/site/skeleton-kind";

function render(kind: SkeletonKind): string {
  return renderToStaticMarkup(<RouteSkeleton kind={kind} />);
}

function count(markup: string, pattern: RegExp): number {
  return markup.match(pattern)?.length ?? 0;
}

describe("RouteSkeleton", () => {
  it.each(SKELETON_KINDS)("renders a busy status region for %s", (kind) => {
    const markup = render(kind);

    expect(markup.startsWith("<div")).toBe(true);
    expect(markup).toMatch(/^<div[^>]*\brole="status"/);
    expect(markup).toMatch(/^<div[^>]*\baria-busy="true"/);
    expect(count(markup, /role="status"/g)).toBe(1);
    expect(markup).toMatch(/<span class="sr-only">Memuat halaman<\/span>/);
    expect(count(markup, /<div\b/g)).toBeGreaterThan(10);
    expect(markup).toMatch(/data-skeleton="hero"/);
  });

  it.each(SKELETON_KINDS)("renders no headings, images, links or controls for %s", (kind) => {
    const markup = render(kind);

    expect(markup).toMatch(/<div\b/);
    expect(markup).toContain("Memuat halaman");
    expect(markup).not.toMatch(/<h[1-6]\b/);
    expect(markup).not.toMatch(/<img\b/);
    expect(markup).not.toMatch(/<a\b/);
    expect(markup).not.toMatch(/<(button|input|textarea|select|form|nav|header|footer|main)\b/);
  });

  it("renders a different layout for every kind", () => {
    const markups = SKELETON_KINDS.map(render);

    expect(new Set(markups).size).toBe(SKELETON_KINDS.length);
  });

  it("is deterministic for the same kind", () => {
    expect(render("home")).toBe(render("home"));
  });

  it.each(["services-index", "portfolio-index", "articles-index"] as const)("renders a grid of cards for %s", (kind) => {
    const markup = render(kind);

    expect(markup).toMatch(/data-skeleton="grid"/);
    expect(count(markup, /data-skeleton="card"/g)).toBeGreaterThanOrEqual(3);
  });

  it("renders a narrow article column and a sidebar block for article-detail", () => {
    const markup = render("article-detail");

    expect(markup).toMatch(/data-skeleton="article-body"/);
    expect(markup).toMatch(/data-skeleton="sidebar"/);
  });

  it.each(["home", "about", "services-index", "service-detail", "portfolio-index", "portfolio-detail", "articles-index", "contact", "legal"] as const)(
    "has no sidebar block for %s",
    (kind) => {
      expect(render(kind)).not.toMatch(/data-skeleton="sidebar"/);
    },
  );

  it("renders a form block on contact", () => {
    const markup = render("contact");

    expect(markup).toMatch(/data-skeleton="form"/);
    expect(count(markup, /data-skeleton="field"/g)).toBeGreaterThanOrEqual(3);
    expect(markup).not.toMatch(/<(form|input|textarea|button|label)\b/);
  });

  it("renders a long text block on legal", () => {
    const markup = render("legal");

    expect(markup).toMatch(/data-skeleton="legal-text"/);
    expect(count(markup, /data-skeleton="line"/g)).toBeGreaterThanOrEqual(10);
  });

  it("renders the body block on both detail kinds", () => {
    expect(render("service-detail")).toMatch(/data-skeleton="article-body"/);
    expect(render("portfolio-detail")).toMatch(/data-skeleton="article-body"/);
  });

  it("renders a hero and several grids on the home skeleton", () => {
    const markup = render("home");

    expect(markup).toMatch(/data-skeleton="hero"/);
    expect(count(markup, /data-skeleton="grid"/g)).toBeGreaterThanOrEqual(2);
  });
});
