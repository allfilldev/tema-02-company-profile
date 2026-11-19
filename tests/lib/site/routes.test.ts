import { describe, expect, it } from "vitest";
import { ADMIN_MODULE_PATHS, ADMIN_ROUTES, isUnderRoute, SITE_ROUTES } from "@/lib/site/routes";

describe("route constants", () => {
  it("lists the public routes", () => {
    expect(SITE_ROUTES).toEqual({
      home: "/",
      about: "/tentang",
      services: "/layanan",
      portfolio: "/portofolio",
      articles: "/artikel",
      articlePages: "/artikel/halaman",
      contact: "/kontak",
    });
  });

  it("lists the admin routes", () => {
    expect(ADMIN_ROUTES).toEqual({
      root: "/admin",
      login: "/admin/login",
      media: "/admin/media",
      messages: "/admin/pesan",
      settings: "/admin/pengaturan",
    });
  });

  it("lists one admin path per module under /admin", () => {
    expect(ADMIN_MODULE_PATHS).toEqual({
      services: "/admin/layanan",
      portfolio: "/admin/portofolio",
      team: "/admin/tim",
      stats: "/admin/statistik",
      testimonials: "/admin/testimoni",
      partners: "/admin/partner",
      articles: "/admin/artikel",
    });
  });
});

describe("isUnderRoute", () => {
  it.each([
    ["/layanan", "/layanan", true],
    ["/layanan/a", "/layanan", true],
    ["/layanan-lain", "/layanan", false],
    ["/admin/login", "/admin", true],
    ["/adminx", "/admin", false],
    ["/", "/layanan", false],
  ])("%s under %s is %s", (pathname, prefix, expected) => {
    expect(isUnderRoute(pathname, prefix)).toBe(expected);
  });
});
