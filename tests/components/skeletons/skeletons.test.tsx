import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RouteSkeleton } from "@/components/skeletons/route-skeleton";
import { SKELETON_HEIGHTS } from "@/components/skeletons/skeleton-blocks";
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
  height: /^(h|size)-/,
  "min-height": /^min-h-/,
  width: /^(w|size)-/,
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

type TopLevelSection = { classes: string[]; blocks: string[] };

function topLevelSections(markup: string): TopLevelSection[] {
  const body = markup.replace(/^<div[^>]*><span class="sr-only">Memuat halaman<\/span>/, "");
  const sections: TopLevelSection[] = [];
  let depth = 0;

  for (const match of body.matchAll(/<(\/?)div\b([^>]*)>/g)) {
    if (match[1] === "/") {
      depth -= 1;
      continue;
    }
    if (depth === 0) {
      sections.push({ classes: (match[2].match(/class="([^"]*)"/)?.[1] ?? "").split(" ").filter(Boolean), blocks: [] });
    }
    const block = match[2].match(/data-skeleton="([^"]*)"/)?.[1];
    if (block) {
      sections[sections.length - 1].blocks.push(block);
    }
    depth += 1;
  }

  return sections;
}

function sectionClassesContaining(markup: string, block: string): string[] | undefined {
  return topLevelSections(markup).find((section) => section.blocks.includes(block))?.classes;
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
    expect(findConflicts(["min-h-40", "min-h-96"])).toHaveLength(1);
    expect(findConflicts(["lg:min-h-90", "lg:min-h-120"])).toHaveLength(1);
    expect(findConflicts(["h-4", "size-16"])).toHaveLength(1);
    expect(findConflicts(["w-full", "w-1/2"])).toHaveLength(1);
  });

  it("allows different breakpoints and different families", () => {
    expect(findConflicts(["py-12", "md:py-16", "lg:py-20", "px-4", "rounded-md", "bg-border", "border-border"])).toEqual([]);
    expect(findConflicts(["h-9", "md:h-10", "w-3/4", "lg:min-h-90"])).toEqual([]);
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

  it.each([
    ["home", SKELETON_HEIGHTS.homeStats],
    ["about", SKELETON_HEIGHTS.aboutStats],
  ] as const)("gives the stats block on %s the same padding as Section", (kind, height) => {
    const classes = sectionClassesContaining(render(kind), "stats");

    expect(classes).toEqual(["py-16", "md:py-24", height]);
  });

  it.each(SKELETON_KINDS)("puts the hero of %s on the inverse surface with its own hero padding", (kind) => {
    const hero = classLists(render(kind)).find((classes) => classes.includes("bg-surface-inverse"));

    expect(hero).toEqual(["bg-surface-inverse"]);
    expect(render(kind)).toContain("bg-surface-inverse-foreground/10");
    expect(render(kind)).toContain("pt-32 pb-16 md:pt-40 md:pb-24");
  });

  it("gives the home partners strip a compact single-row logo grid", () => {
    const markup = render("home");

    expect(markup).toContain("grid-cols-2 md:grid-cols-3 lg:grid-cols-6");
    expect(minHeightClasses(markup)).toContain(SKELETON_HEIGHTS.partners);
    expect(markup).toContain(`py-12 md:py-16 ${SKELETON_HEIGHTS.partners}`);
  });

  it("gives the avatar placeholder only a full radius", () => {
    const avatars = classesOfElementWith(render("article-detail"), "size-16");

    expect(avatars).toHaveLength(1);
    expect(radiusClasses(avatars[0])).toEqual(["rounded-full"]);
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

function minHeightClasses(markup: string): string[] {
  return classLists(markup).flatMap((classes) => classes.filter((token) => /(^|:)min-h-/.test(token)));
}

const INNER_BLOCKS = ["line", "heading", "card", "field"];

function blockSequence(markup: string): string[] {
  return topLevelSections(markup).map((section) => section.blocks.find((block) => !INNER_BLOCKS.includes(block)) ?? "section");
}

const EXPECTED_SEQUENCES: Record<SkeletonKind, string[]> = {
  home: ["hero", "grid", "split", "grid", "stats", "grid", "grid", "grid", "grid", "grid", "grid", "grid", "faq", "banner"],
  about: ["breadcrumbs", "hero", "split", "grid", "grid", "stats"],
  "services-index": ["breadcrumbs", "hero", "grid"],
  "service-detail": ["breadcrumbs", "hero", "article-body", "faq", "grid"],
  "portfolio-index": ["breadcrumbs", "hero", "grid"],
  "portfolio-detail": ["breadcrumbs", "hero", "article-body", "grid", "grid"],
  "articles-index": ["breadcrumbs", "hero", "grid"],
  "article-detail": ["breadcrumbs", "hero", "article-body", "grid"],
  contact: ["breadcrumbs", "hero", "form"],
  legal: ["breadcrumbs", "hero", "legal-text"],
};

describe("RouteSkeleton calibration structure", () => {
  it("reads the block sequence of a known markup", () => {
    expect(blockSequence('<div role="status"><span class="sr-only">Memuat halaman</span><div data-skeleton="hero"><div data-skeleton="line"></div></div><div class="x"><div data-skeleton="grid"></div></div><div></div></div>')).toEqual([
      "hero",
      "grid",
      "section",
    ]);
  });

  it.each(SKELETON_KINDS)("mirrors the real section sequence for %s", (kind) => {
    expect(blockSequence(render(kind))).toEqual(EXPECTED_SEQUENCES[kind]);
  });

  it("represents every home section instead of one tall block", () => {
    expect(EXPECTED_SEQUENCES.home).toHaveLength(14);
    expect(minHeightClasses(render("home"))).toHaveLength(14);
  });

  it("keeps every height as one class from SKELETON_HEIGHTS", () => {
    const allowed: string[] = Object.values(SKELETON_HEIGHTS);

    for (const value of allowed) {
      expect(value.split(" ")).toHaveLength(1);
    }
    for (const kind of SKELETON_KINDS) {
      const used = minHeightClasses(render(kind));

      expect(used.length).toBeGreaterThan(1);
      expect(used.filter((token) => !allowed.includes(token))).toEqual([]);
    }
  });

  it("gives every page except home a breadcrumb row as tall as the real one", () => {
    for (const kind of SKELETON_KINDS) {
      expect(render(kind).includes('data-skeleton="breadcrumbs"')).toBe(kind !== "home");
    }
    expect(render("about")).toContain(`class="flex items-center ${SKELETON_HEIGHTS.breadcrumbRow}"`);
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
