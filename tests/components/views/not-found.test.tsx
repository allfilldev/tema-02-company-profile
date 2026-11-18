import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import RootNotFound from "@/app/not-found";
import { RouteShellGuard } from "@/components/site/layout/route-guard";
import { SiteShell } from "@/components/site/layout/site-shell";
import { NotFoundView } from "@/components/site/views/not-found-view";
import { anchorTags, countOccurrences, expectValidHeadingOutline, headingsOf, hrefsOf } from "../../fixtures/markup";

const markup = renderToStaticMarkup(<NotFoundView />);

function anchorTo(href: string): string | undefined {
  return anchorTags(markup).find((tag) => tag.includes(`href="${href}"`));
}

describe("NotFoundView", () => {
  it("renders exactly one h1 with the not found title", () => {
    expect(countOccurrences(markup, "<h1")).toBe(1);
    expect(headingsOf(markup)).toEqual([{ level: 1, text: "Halaman tidak ditemukan" }]);
    expectValidHeadingOutline(markup);
  });

  it("detects a second h1 when one is added", () => {
    expect(countOccurrences(`${markup}<h1>Lain</h1>`, "<h1")).toBe(2);
  });

  it("renders exactly one explanatory paragraph", () => {
    const paragraphs = [...markup.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map((match) => match[1]);

    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0].length).toBeGreaterThan(40);
  });

  it("links to the home page and the contact page through href attributes", () => {
    expect(hrefsOf(markup)).toEqual(["/", "/kontak"]);
    expect(anchorTo("/")).toBeDefined();
    expect(anchorTo("/kontak")).toBeDefined();
  });

  it("labels the links with their visible text", () => {
    const texts = [...markup.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)].map((match) => match[1]);

    expect(texts).toEqual(["Kembali ke beranda", "Hubungi kami"]);
  });

  it("does not link anywhere else", () => {
    expect(hrefsOf(markup).filter((href) => href !== "/" && href !== "/kontak")).toEqual([]);
    expect(hrefsOf('<a href="/lain">x</a>').filter((href) => href !== "/" && href !== "/kontak")).toEqual(["/lain"]);
  });
});

function childOf(element: ReactElement): ReactElement {
  return (element.props as { children: ReactElement }).children;
}

describe("root not-found page", () => {
  it("wraps its own site shell in RouteShellGuard so a hidden 404 leaves nothing in the DOM", async () => {
    const page = await RootNotFound();
    const shell = childOf(page);

    expect(page.type).toBe(RouteShellGuard);
    expect(shell.type).toBe(SiteShell);
    expect(childOf(shell).type).toBe(NotFoundView);
  });

  it("renders one h1, header, main, and footer inline without a skeleton", async () => {
    const pageMarkup = renderToStaticMarkup(await RootNotFound());

    expect(countOccurrences(pageMarkup, "<h1")).toBe(1);
    expect(countOccurrences(pageMarkup, "<header")).toBe(1);
    expect(countOccurrences(pageMarkup, "<main")).toBe(1);
    expect(countOccurrences(pageMarkup, "<footer")).toBe(1);
    expect(pageMarkup).not.toContain('aria-busy="true"');
  });
});
