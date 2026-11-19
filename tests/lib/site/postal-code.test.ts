import { describe, expect, it } from "vitest";
import { formatAddressRegionLine, visiblePostalCode } from "@/lib/site/postal-code";

describe("visiblePostalCode", () => {
  it("returns the trimmed postal code when it holds a real value", () => {
    expect(visiblePostalCode(" 50263 ")).toBe("50263");
  });

  it("returns null for a lone dash, dashes with spaces, or an empty value", () => {
    expect(visiblePostalCode("-")).toBeNull();
    expect(visiblePostalCode(" - ")).toBeNull();
    expect(visiblePostalCode("")).toBeNull();
    expect(visiblePostalCode("   ")).toBeNull();
  });
});

describe("formatAddressRegionLine", () => {
  it("joins city, region, and postal code", () => {
    expect(formatAddressRegionLine({ city: "Semarang", region: "Jawa Tengah", postalCode: "50263" })).toBe(
      "Semarang, Jawa Tengah 50263",
    );
  });

  it("omits the postal code when it is a lone dash", () => {
    expect(formatAddressRegionLine({ city: "Semarang", region: "Jawa Tengah", postalCode: "-" })).toBe(
      "Semarang, Jawa Tengah",
    );
  });
});
