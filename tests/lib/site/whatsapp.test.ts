import { describe, expect, it } from "vitest";
import { generalPack } from "@/content/packs/general";
import { buildWhatsAppUrl } from "@/lib/site/whatsapp";

const DEMO_WHATSAPP_URL =
  "https://wa.me/62895326422692?text=Halo%2C%20saya%20ingin%20konsultasi%20pembuatan%20website.%20Paket%20mana%20yang%20cocok%20untuk%20usaha%20saya%3F";

describe("buildWhatsAppUrl", () => {
  it("builds the exact demo url", () => {
    expect(
      buildWhatsAppUrl(
        "62895326422692",
        "Halo, saya ingin konsultasi pembuatan website. Paket mana yang cocok untuk usaha saya?",
      ),
    ).toBe(DEMO_WHATSAPP_URL);
  });

  it("builds the demo url from the general pack settings", () => {
    const { whatsappNumber, whatsappMessage } = generalPack.settings;
    expect(buildWhatsAppUrl(whatsappNumber, whatsappMessage)).toBe(DEMO_WHATSAPP_URL);
  });

  it("encodes ampersands, hashes, and line breaks", () => {
    const url = buildWhatsAppUrl("6281234567890", "Paket A & B #1\nTerima kasih");
    expect(url).toBe("https://wa.me/6281234567890?text=Paket%20A%20%26%20B%20%231%0ATerima%20kasih");
    expect(url).not.toContain("&");
    expect(url).not.toContain("#");
    expect(url).not.toContain("\n");
  });
});
