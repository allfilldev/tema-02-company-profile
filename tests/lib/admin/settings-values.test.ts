import { describe, expect, it } from "vitest";
import { flattenSettingsValues } from "@/lib/admin/settings-values";

describe("flattenSettingsValues", () => {
  it("moves the nested address into the flat field names the form posts and keeps everything else", () => {
    const flat = flattenSettingsValues({
      siteName: "Nusa Karya",
      address: { street: "Jl. Melati 1", city: "Bandung", region: "Jawa Barat", postalCode: "40111", country: "ID" },
      socialLinks: [{ platform: "instagram", url: "https://instagram.com/nusakarya" }],
    });

    expect(flat).toEqual({
      siteName: "Nusa Karya",
      socialLinks: [{ platform: "instagram", url: "https://instagram.com/nusakarya" }],
      addressStreet: "Jl. Melati 1",
      addressCity: "Bandung",
      addressRegion: "Jawa Barat",
      postalCode: "40111",
      addressCountry: "ID",
    });
  });

  it("returns the values unchanged when there is no address", () => {
    expect(flattenSettingsValues({ siteName: "Nusa Karya" })).toEqual({ siteName: "Nusa Karya" });
  });
});
