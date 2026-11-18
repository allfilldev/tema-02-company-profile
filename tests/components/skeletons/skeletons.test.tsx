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

const FAMILIES: Record<string, RegExp> = {
  "padding-x": /^(p|px)-/,
  "padding-y": /^(p|py)-/,
  radius: /^rounded(-(none|sm|md|lg|xl|2xl|3xl|full))?$/,
  background: /^bg-/,
};

function classLists(markup: string): string[][] {
  return [...markup.matchAll(/\sclass="([^"]*)"/g)].map((match) => match[1].split(/\s+/).filter(Boolean));
}

function findConflicts(classes: string[]): string[] {
  const seen = new Map<string, string[]>();

  for (const token of classes) {
    const separator = token.lastIndexOf(":");
    const variant = token.slice(0, separator + 1);
    const utility = token.slice(separator + 1);

    for (const [family, pattern] of Object.entries(FAMILIES)) {
      if (pattern.test(utility)) {
        const key = `${family} ${variant}`;
        seen.set(key, [...(seen.get(key) ?? []), token]);
      }
    }
  }

  return [...seen.entries()].filter(([, tokens]) => tokens.length > 1).map(([key, tokens]) => `${key}: ${tokens.join(" ")}`);
}

function classesOfElementWith(markup: string, token: string): string[][] {
  return classLists(markup).filter((classes) => classes.includes(token));
}

function radiusClasses(classes: string[]): string[] {
  return classes.filter((token) => FAMILIES.radius.test(token));
}

describe("conflicting utility detection", () => {
  it("detects same-family utilities at the same breakpoint", () => {
    expect(findConflicts(["py-12", "py-6"])).toHaveLength(1);
    expect(findConflicts(["p-6", "py-12"])).toHaveLength(1);
    expect(findConflicts(["rounded-md", "rounded-full"])).toHaveLength(1);
    expect(findConflicts(["bg-border", "bg-surface-muted"])).toHaveLength(1);
    expect(findConflicts(["md:py-16", "md:py-8"])).toHaveLength(1);
  });

  it("allows different breakpoints and different families", () => {
    expect(findConflicts(["py-12", "md:py-16", "lg:py-20", "px-4", "rounded-md", "bg-border", "border-border"])).toEqual([]);
  });
});

describe("RouteSkeleton class conflicts", () => {
  it.each(SKELETON_KINDS)("has no conflicting padding, radius or background classes for %s", (kind) => {
    const lists = classLists(render(kind));

    expect(lists.length).toBeGreaterThan(10);
    for (const classes of lists) {
      expect(findConflicts(classes)).toEqual([]);
    }
  });

  it("uses the compact padding variant on the stats block", () => {
    const markup = render("home");
    const match = markup.match(/<div class="([^"]*)"><div class="[^"]*"><div data-skeleton="stats"/);

    expect(match).not.toBeNull();
    expect(match![1].split(" ")).toContain("py-6");
    expect(match![1]).not.toMatch(/\bpy-(12|8)\b|md:py-/);
  });

  it("uses the compact padding variant on the pagination block", () => {
    const markup = render("articles-index");
    const match = markup.match(/<div class="([^"]*)"><div class="[^"]*"><div data-skeleton="pagination"/);

    expect(match).not.toBeNull();
    expect(match![1].split(" ")).toContain("py-6");
    expect(match![1]).not.toMatch(/\bpy-(12|8)\b|md:py-/);
  });

  it("gives the avatar placeholder only a full radius", () => {
    const avatars = classesOfElementWith(render("article-detail"), "size-16");

    expect(avatars).toHaveLength(1);
    expect(radiusClasses(avatars[0])).toEqual(["rounded-full"]);
  });

  it("gives the page number placeholders only a large radius", () => {
    const pages = classesOfElementWith(render("articles-index"), "size-11");

    expect(pages).toHaveLength(3);
    for (const classes of pages) {
      expect(radiusClasses(classes)).toEqual(["rounded-lg"]);
    }
  });

  it.each([
    ["home", 2],
    ["contact", 1],
  ] as const)("gives the button placeholders on %s only a large radius", (kind, expectedCount) => {
    const buttons = classesOfElementWith(render(kind), "w-40");

    expect(buttons).toHaveLength(expectedCount);
    for (const classes of buttons) {
      expect(radiusClasses(classes)).toEqual(["rounded-lg"]);
    }
  });

  it("gives plain bars the default radius and fill exactly once", () => {
    const bars = classLists(render("legal")).filter((classes) => classes.includes("animate-pulse"));

    expect(bars.length).toBeGreaterThan(10);
    for (const classes of bars) {
      expect(classes.filter((token) => FAMILIES.radius.test(token))).toHaveLength(1);
      expect(classes.filter((token) => FAMILIES.background.test(token))).toHaveLength(1);
    }
  });
});

describe("RouteSkeleton", () => {
  it.each(SKELETON_KINDS)("renders a busy status region for %s", (kind) => {
    const markup = render(kind);

    expect(markup.startsWith("<div")).toBe(true);
    expect(markup).toMatch(/^<div[^>]*\brole="status"/);
    expect(markup).toMatch(/^<div[^>]*\baria-busy="true"/);
    expect(markup).toMatch(new RegExp(`^<div[^>]*\\bdata-skeleton-kind="${kind}"`));
    expect(count(markup, /data-skeleton-kind=/g)).toBe(1);
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
