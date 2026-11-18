import { describe, expect, it } from "vitest";
import { isSamePathname, skeletonKindForClick, type LinkClick } from "@/lib/site/route-guard-logic";

const CURRENT_HREF = "http://localhost:3000/tentang?tab=tim#visi";

const PLAIN_CLICK: LinkClick = {
  href: "/layanan",
  target: null,
  download: false,
  button: 0,
  metaKey: false,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  defaultPrevented: true,
};

function click(overrides: Partial<LinkClick>): LinkClick {
  return { ...PLAIN_CLICK, ...overrides };
}

describe("skeletonKindForClick", () => {
  it("returns the destination skeleton for a plain internal link click", () => {
    expect(skeletonKindForClick(PLAIN_CLICK, CURRENT_HREF)).toBe("services-index");
  });

  it.each([
    ["/", "home"],
    ["/layanan/konsultasi-strategi", "service-detail"],
    ["/portofolio?kategori=ritel#daftar", "portfolio-index"],
    ["/portofolio/transformasi-digital", "portfolio-detail"],
    ["/artikel", "articles-index"],
    ["/artikel/halaman/2", "articles-index"],
    ["/artikel/cara-menyusun-sop-umkm", "article-detail"],
    ["/kontak#formulir", "contact"],
    ["/privasi", "legal"],
    ["kontak", "contact"],
    ["http://localhost:3000/kebijakan-editorial", "legal"],
  ] as const)("maps an internal link to %s onto %s", (href, kind) => {
    expect(skeletonKindForClick(click({ href }), CURRENT_HREF)).toBe(kind);
  });

  it.each([
    ["an empty target", ""],
    ["the _self target", "_self"],
    ["an uppercase _SELF target", "_SELF"],
  ] as const)("keeps the skeleton for %s", (_label, target) => {
    expect(skeletonKindForClick(click({ target }), CURRENT_HREF)).toBe("services-index");
  });

  it.each([
    ["an external link", { href: "https://example.com/layanan" }],
    ["a protocol relative external link", { href: "//example.com/layanan" }],
    ["a link to another port", { href: "http://localhost:4000/layanan" }],
    ["a link to another protocol on the same host", { href: "https://localhost:3000/layanan" }],
    ["a mailto link", { href: "mailto:halo@arunika.example" }],
    ["a tel link", { href: "tel:+6281234567890" }],
    ["a javascript link", { href: "javascript:void(0)" }],
    ["a hash only link", { href: "#konten" }],
    ["a link to the current path", { href: "/tentang" }],
    ["a link to the current path with a trailing slash", { href: "/tentang/" }],
    ["a link to the current path with another query", { href: "/tentang?tab=visi" }],
    ["a link to the current path with another hash", { href: "/tentang#tim" }],
    ["an anchor without href", { href: null }],
    ["a target _blank link", { target: "_blank" }],
    ["a named target link", { target: "jendela-lain" }],
    ["a download link", { download: true }],
    ["a meta click", { metaKey: true }],
    ["a ctrl click", { ctrlKey: true }],
    ["a shift click", { shiftKey: true }],
    ["an alt click", { altKey: true }],
    ["a middle button click", { button: 1 }],
    ["a secondary button click", { button: 2 }],
    ["a click the router did not take over", { defaultPrevented: false }],
  ] as const)("returns null for %s", (_label, overrides: Partial<LinkClick>) => {
    expect(skeletonKindForClick(PLAIN_CLICK, CURRENT_HREF)).toBe("services-index");
    expect(skeletonKindForClick(click(overrides), CURRENT_HREF)).toBeNull();
  });

  it("returns null when the current location cannot be parsed", () => {
    expect(skeletonKindForClick(PLAIN_CLICK, CURRENT_HREF)).toBe("services-index");
    expect(skeletonKindForClick(PLAIN_CLICK, "bukan url")).toBeNull();
  });
});

describe("isSamePathname", () => {
  it.each([
    ["/layanan", "/layanan"],
    ["/layanan/", "/layanan"],
    ["/layanan//", "/layanan/"],
    ["/", "/"],
    ["/", ""],
  ] as const)("treats %s and %s as the same path", (first, second) => {
    expect(isSamePathname(first, second)).toBe(true);
  });

  it.each([
    ["/layanan", "/layanan/konsultasi-strategi"],
    ["/", "/tentang"],
    ["/artikel/halaman/2", "/artikel/halaman/3"],
  ] as const)("treats %s and %s as different paths", (first, second) => {
    expect(isSamePathname(first, second)).toBe(false);
  });
});
