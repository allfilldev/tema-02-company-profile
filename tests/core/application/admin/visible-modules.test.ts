import { describe, expect, it } from "vitest";
import { visibleAdminModules } from "@/core/application/admin/visible-modules";

describe("visibleAdminModules", () => {
  it("lists the modules in menu order", () => {
    expect(visibleAdminModules(["services", "portfolio", "articles", "team", "stats", "testimonials", "partners", "vision"])).toEqual([
      "services",
      "portfolio",
      "team",
      "stats",
      "testimonials",
      "partners",
      "articles",
    ]);
  });

  it("hides modules the theme turned off", () => {
    expect(visibleAdminModules(["services"])).toEqual(["services"]);
  });

  it("keeps the team menu when articles are on even if the team module is off, and hides it otherwise", () => {
    expect(visibleAdminModules(["articles"])).toEqual(["team", "articles"]);
    expect(visibleAdminModules(["services", "stats"])).toEqual(["services", "stats"]);
  });
});
