import { describe, expect, it } from "vitest";
import { resolveThemePaths } from "../../../scripts/theme/theme-paths";

describe("resolveThemePaths", () => {
  it("places the theme under themes/<site-type>/<name>", () => {
    const paths = resolveThemePaths("/work/template-builder/boilerplates/company-profile", "arunika");

    expect(paths).toEqual({
      siteType: "company-profile",
      boilerplateDir: "/work/template-builder/boilerplates/company-profile",
      targetDir: "/work/template-builder/themes/company-profile/arunika",
    });
  });

  it.each([
    "/work/template-builder/themes/company-profile/arunika",
    "/tmp/acak",
  ])("throws when %s is not inside boilerplates/", (directory) => {
    expect(() => resolveThemePaths(directory, "x")).toThrow(/boilerplates/);
  });
});
