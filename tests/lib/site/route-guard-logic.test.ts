import { describe, expect, it } from "vitest";
import { isSamePathname, resolveLinkClick, type LinkClick } from "@/lib/site/route-guard-logic";

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

const SERVICES_NAVIGATION = { type: "navigate", kind: "services-index" } as const;
const SAME_PAGE = { type: "same-page" } as const;

function click(overrides: Partial<LinkClick>): LinkClick {
  return { ...PLAIN_CLICK, ...overrides };
}

describe("resolveLinkClick navigation to another path", () => {
  it("returns the destination skeleton for a plain internal link click", () => {
    expect(resolveLinkClick(PLAIN_CLICK, CURRENT_HREF)).toEqual(SERVICES_NAVIGATION);
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
    expect(resolveLinkClick(click({ href }), CURRENT_HREF)).toEqual({ type: "navigate", kind });
  });

  it.each([
    ["an empty target", ""],
    ["the _self target", "_self"],
    ["an uppercase _SELF target", "_SELF"],
  ] as const)("keeps the navigation for %s", (_label, target) => {
    expect(resolveLinkClick(click({ target }), CURRENT_HREF)).toEqual(SERVICES_NAVIGATION);
  });
});

describe("resolveLinkClick navigation to the current path", () => {
  it.each([
    ["a link to the current path", "/tentang"],
    ["a link to the current path with a trailing slash", "/tentang/"],
    ["a link to the current path with another query", "/tentang?tab=visi"],
    ["a link to the current path with another hash", "/tentang#tim"],
    ["a relative link to the current path", "tentang"],
    ["an absolute link to the current path", "http://localhost:3000/tentang"],
    ["a hash only link", "#konten"],
    ["an empty href", ""],
  ] as const)("returns same-page for %s taken over by the router", (_label, href) => {
    expect(resolveLinkClick(click({ href, defaultPrevented: false }), CURRENT_HREF)).toBeNull();
    expect(resolveLinkClick(click({ href }), CURRENT_HREF)).toEqual(SAME_PAGE);
  });

  it("returns same-page for the logo link on the home page", () => {
    const logoClick = click({ href: "/" });

    expect(resolveLinkClick(logoClick, "http://localhost:3000/layanan")).toEqual({ type: "navigate", kind: "home" });
    expect(resolveLinkClick(logoClick, "http://localhost:3000/")).toEqual(SAME_PAGE);
  });

  it.each([
    ["the router did not take over", { defaultPrevented: false }],
    ["the link points to the same path on another origin", { href: "https://example.com/tentang" }],
    ["the link points to the same path on another port", { href: "http://localhost:4000/tentang" }],
    ["the link opens in another tab", { target: "_blank" }],
    ["the link is a download", { download: true }],
    ["a modifier key is held", { metaKey: true }],
    ["a non primary button is used", { button: 1 }],
  ] as const)("returns null for a current path link when %s", (_label, overrides: Partial<LinkClick>) => {
    expect(resolveLinkClick(click({ href: "/tentang" }), CURRENT_HREF)).toEqual(SAME_PAGE);
    expect(resolveLinkClick(click({ href: "/tentang", ...overrides }), CURRENT_HREF)).toBeNull();
  });
});

describe("resolveLinkClick clicks that do not change the skeleton", () => {
  it.each([
    ["an external link", { href: "https://example.com/layanan" }],
    ["a protocol relative external link", { href: "//example.com/layanan" }],
    ["a link to another port", { href: "http://localhost:4000/layanan" }],
    ["a link to another protocol on the same host", { href: "https://localhost:3000/layanan" }],
    ["a mailto link", { href: "mailto:halo@contoh.example" }],
    ["a tel link", { href: "tel:+6281234567890" }],
    ["a javascript link", { href: "javascript:void(0)" }],
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
    expect(resolveLinkClick(PLAIN_CLICK, CURRENT_HREF)).toEqual(SERVICES_NAVIGATION);
    expect(resolveLinkClick(click(overrides), CURRENT_HREF)).toBeNull();
  });

  it("returns null when the current location cannot be parsed", () => {
    expect(resolveLinkClick(PLAIN_CLICK, CURRENT_HREF)).toEqual(SERVICES_NAVIGATION);
    expect(resolveLinkClick(PLAIN_CLICK, "bukan url")).toBeNull();
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
