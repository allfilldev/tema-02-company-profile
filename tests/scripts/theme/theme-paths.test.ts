import { describe, expect, it } from "vitest";
import { resolveThemePaths } from "../../../scripts/theme/theme-paths";

describe("resolveThemePaths", () => {
  it("places the theme under themes/<site-type>/<name>", () => {
    const paths = resolveThemePaths("/work/template-builder/boilerplates/company-profile", "contoh");

    expect(paths).toEqual({
      siteType: "company-profile",
      boilerplateDir: "/work/template-builder/boilerplates/company-profile",
      targetDir: "/work/template-builder/themes/company-profile/contoh",
    });
  });

  it.each([
    "/work/template-builder/themes/company-profile/contoh",
    "/tmp/acak",
  ])("throws when %s is not inside boilerplates/", (directory) => {
    expect(() => resolveThemePaths(directory, "x")).toThrow(/boilerplates/);
  });
});
