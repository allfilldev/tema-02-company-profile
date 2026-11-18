import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ArticleDetailLoading from "@/app/(site)/artikel/[slug]/loading";
import ArticlePagesLoading from "@/app/(site)/artikel/halaman/[n]/loading";
import ArticlesLoading from "@/app/(site)/artikel/loading";
import EditorialPolicyLoading from "@/app/(site)/kebijakan-editorial/loading";
import ContactLoading from "@/app/(site)/kontak/loading";
import ServiceDetailLoading from "@/app/(site)/layanan/[slug]/loading";
import ServicesLoading from "@/app/(site)/layanan/loading";
import HomeLoading from "@/app/(site)/loading";
import PortfolioDetailLoading from "@/app/(site)/portofolio/[slug]/loading";
import PortfolioLoading from "@/app/(site)/portofolio/loading";
import PrivacyLoading from "@/app/(site)/privasi/loading";
import TermsLoading from "@/app/(site)/syarat-ketentuan/loading";
import AboutLoading from "@/app/(site)/tentang/loading";
import { RouteSkeleton } from "@/components/skeletons/route-skeleton";
import { SKELETON_KINDS, skeletonKindForPath, type SkeletonKind } from "@/lib/site/skeleton-kind";

type RouteLoading = {
  folder: string;
  samplePath: string;
  kind: SkeletonKind;
  Loading: () => ReactElement;
};

const SITE_DIR = fileURLToPath(new URL("../../../src/app/(site)", import.meta.url));

const ROUTES: RouteLoading[] = [
  { folder: "", samplePath: "/", kind: "home", Loading: HomeLoading },
  { folder: "tentang", samplePath: "/tentang", kind: "about", Loading: AboutLoading },
  { folder: "kontak", samplePath: "/kontak", kind: "contact", Loading: ContactLoading },
  { folder: "privasi", samplePath: "/privasi", kind: "legal", Loading: PrivacyLoading },
  { folder: "syarat-ketentuan", samplePath: "/syarat-ketentuan", kind: "legal", Loading: TermsLoading },
  { folder: "kebijakan-editorial", samplePath: "/kebijakan-editorial", kind: "legal", Loading: EditorialPolicyLoading },
  { folder: "layanan", samplePath: "/layanan", kind: "services-index", Loading: ServicesLoading },
  { folder: "layanan/[slug]", samplePath: "/layanan/contoh", kind: "service-detail", Loading: ServiceDetailLoading },
  { folder: "portofolio", samplePath: "/portofolio", kind: "portfolio-index", Loading: PortfolioLoading },
  { folder: "portofolio/[slug]", samplePath: "/portofolio/contoh", kind: "portfolio-detail", Loading: PortfolioDetailLoading },
  { folder: "artikel", samplePath: "/artikel", kind: "articles-index", Loading: ArticlesLoading },
  { folder: "artikel/halaman/[n]", samplePath: "/artikel/halaman/2", kind: "articles-index", Loading: ArticlePagesLoading },
  { folder: "artikel/[slug]", samplePath: "/artikel/contoh", kind: "article-detail", Loading: ArticleDetailLoading },
];

const BUSY_ROOT = /^<div[^>]*\baria-busy="true"/;
const STATUS_ROOT = /^<div[^>]*\brole="status"/;

function renderSkeleton(kind: SkeletonKind): string {
  return renderToStaticMarkup(<RouteSkeleton kind={kind} />);
}

function rootKind(markup: string): string | null {
  return markup.match(/^<div[^>]*\bdata-skeleton-kind="([^"]*)"/)?.[1] ?? null;
}

function foldersContaining(root: string, fileName: string): string[] {
  const found: string[] = [];

  function walk(directory: string) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(path);
      } else if (entry.name === fileName) {
        found.push(relative(root, dirname(path)).split("\\").join("/"));
      }
    }
  }

  walk(root);
  return found.sort();
}

function withTemporaryTree(files: string[], check: (root: string) => void) {
  const root = mkdtempSync(join(tmpdir(), "loading-scan-"));
  try {
    for (const file of files) {
      mkdirSync(dirname(join(root, file)), { recursive: true });
      writeFileSync(join(root, file), "");
    }
    check(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

describe("loading.tsx positive controls", () => {
  it("tells a busy skeleton root apart from other markup", () => {
    expect(renderSkeleton("home")).toMatch(BUSY_ROOT);
    expect(renderToStaticMarkup(<div role="status" />)).not.toMatch(BUSY_ROOT);
    expect(renderToStaticMarkup(<div aria-busy="false" role="status" />)).not.toMatch(BUSY_ROOT);
    expect(renderToStaticMarkup(<section aria-busy="true" />)).not.toMatch(BUSY_ROOT);
  });

  it("renders a distinct root kind and markup for every skeleton kind", () => {
    const markups = SKELETON_KINDS.map(renderSkeleton);

    expect(markups.map(rootKind)).toEqual([...SKELETON_KINDS]);
    expect(new Set(markups).size).toBe(SKELETON_KINDS.length);
  });

  it("detects a folder that has a page but no loading file", () => {
    withTemporaryTree(["a/page.tsx", "a/loading.tsx", "b/c/page.tsx", "page.tsx", "loading.tsx"], (root) => {
      expect(foldersContaining(root, "page.tsx")).toEqual(["", "a", "b/c"]);
      expect(foldersContaining(root, "loading.tsx")).toEqual(["", "a"]);
      expect(foldersContaining(root, "loading.tsx")).not.toEqual(foldersContaining(root, "page.tsx"));
    });
  });
});

describe("loading.tsx per route", () => {
  it.each(ROUTES)("$folder returns a RouteSkeleton element of kind $kind", ({ Loading, kind }) => {
    const element = Loading();

    expect(element.type).toBe(RouteSkeleton);
    expect((element.props as { kind: SkeletonKind }).kind).toBe(kind);
  });

  it.each(ROUTES)("$folder renders a busy status skeleton of kind $kind", ({ Loading, kind }) => {
    const markup = renderToStaticMarkup(<Loading />);

    expect(markup).toMatch(BUSY_ROOT);
    expect(markup).toMatch(STATUS_ROOT);
    expect(rootKind(markup)).toBe(kind);
    expect(markup).toBe(renderSkeleton(kind));
    for (const other of SKELETON_KINDS.filter((candidate) => candidate !== kind)) {
      expect(markup).not.toBe(renderSkeleton(other));
    }
  });

  it.each(ROUTES)("$folder uses the kind that RouteGuard picks for $samplePath", ({ samplePath, kind }) => {
    expect(skeletonKindForPath(samplePath)).toBe(kind);
  });
});

describe("loading.tsx coverage", () => {
  it("finds the known route folders", () => {
    const pages = foldersContaining(SITE_DIR, "page.tsx");

    expect(pages).toContain("");
    expect(pages).toContain("artikel/halaman/[n]");
    expect(pages).toContain("layanan/[slug]");
  });

  it("has a loading.tsx in every folder under src/app/(site) that has a page.tsx", () => {
    expect(foldersContaining(SITE_DIR, "loading.tsx")).toEqual(foldersContaining(SITE_DIR, "page.tsx"));
  });

  it("lists every page folder in the route table", () => {
    expect(ROUTES.map((route) => route.folder).sort()).toEqual(foldersContaining(SITE_DIR, "page.tsx"));
  });
});
