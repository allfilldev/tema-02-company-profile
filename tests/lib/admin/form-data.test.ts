import { describe, expect, it } from "vitest";
import { readCollectionForm, readSettingsForm } from "@/lib/admin/form-data";

function formWith(entries: [string, string][]): FormData {
  const formData = new FormData();
  entries.forEach(([name, value]) => formData.append(name, value));
  return formData;
}

describe("readCollectionForm", () => {
  it("reads a service: empty optional text becomes null, faq entries keep their order, media comes back as ids", () => {
    const result = readCollectionForm(
      "services",
      formWith([
        ["slug", " penyusunan-sop "],
        ["title", "Penyusunan SOP"],
        ["summary", "   "],
        ["bodyMd", "## Isi\r\n\r\nTeks"],
        ["metaTitle", ""],
        ["metaDescription", ""],
        ["cover", "m1"],
        ["faq[0][question]", "Apa itu SOP?"],
        ["faq[0][answer]", "Panduan kerja."],
        ["faq[1][question]", "Siapa yang menulis?"],
        ["faq[1][answer]", "Pelaku proses."],
        ["faq[2][question]", ""],
        ["faq[2][answer]", ""],
        ["intent", "draft"],
      ]),
    );

    expect(result.values).toEqual({
      slug: "penyusunan-sop",
      title: "Penyusunan SOP",
      summary: null,
      bodyMd: "## Isi\n\nTeks",
      metaTitle: null,
      metaDescription: null,
      faq: [
        { question: "Apa itu SOP?", answer: "Panduan kerja." },
        { question: "Siapa yang menulis?", answer: "Pelaku proses." },
      ],
    });
    expect(result.mediaIds).toEqual({ cover: "m1" });
    expect(result.publish).toBe(false);
  });

  it("marks publish only when the publish button was pressed", () => {
    expect(readCollectionForm("partners", formWith([["name", "Mitra"], ["intent", "publish"]])).publish).toBe(true);
    expect(readCollectionForm("partners", formWith([["name", "Mitra"]])).publish).toBe(false);
  });

  it("reads numbers, lines, dates, and a gallery", () => {
    const team = readCollectionForm("team", formWith([["name", "Rina"], ["yearsExperience", "8"], ["profiles", "https://a.id\n\n  https://b.id  \n"], ["photo", ""]]));
    const portfolio = readCollectionForm("portfolio", formWith([["slug", "p"], ["title", "P"], ["completedOn", "2026-03-27"], ["cover", "m1"], ["gallery", "m2"], ["gallery", "m3"]]));
    const stat = readCollectionForm("stats", formWith([["key", "completed_projects"], ["label", "Proyek"], ["value", ""]]));

    expect(team.values).toMatchObject({ name: "Rina", yearsExperience: 8, profiles: ["https://a.id", "https://b.id"] });
    expect(team.mediaIds).toEqual({ photo: null });
    expect(portfolio.values).toMatchObject({ completedOn: "2026-03-27" });
    expect(portfolio.mediaIds).toEqual({ cover: "m1", gallery: ["m2", "m3"] });
    expect(stat.values.value).toBeUndefined();
  });

  it("leaves an unparsable number out so validation reports it", () => {
    expect(readCollectionForm("team", formWith([["name", "Rina"], ["yearsExperience", "abc"]])).values.yearsExperience).toBeUndefined();
  });
});

describe("readSettingsForm", () => {
  it("reads the address, social links, and media ids", () => {
    const result = readSettingsForm(
      formWith([
        ["siteName", "Nusa Karya"],
        ["tagline", "Konsultan"],
        ["email", "halo@nusa.id"],
        ["phone", "+62 21 5000"],
        ["whatsappNumber", "6281234567890"],
        ["whatsappMessage", "Halo"],
        ["addressStreet", "Jl. A"],
        ["addressCity", "Jakarta"],
        ["addressRegion", "DKI"],
        ["postalCode", "12160"],
        ["addressCountry", "ID"],
        ["mapsEmbedUrl", ""],
        ["openingHours", "Senin–Jumat"],
        ["social[0][platform]", "Instagram"],
        ["social[0][url]", "https://instagram.com/nusa"],
        ["social[1][platform]", ""],
        ["social[1][url]", ""],
        ["schemaType", "LocalBusiness"],
        ["foundedYear", "2017"],
        ["googleSiteVerification", ""],
        ["gaMeasurementId", "G-ABC123"],
        ["logo", "m1"],
        ["defaultOgImage", ""],
      ]),
    );

    expect(result.values).toEqual({
      siteName: "Nusa Karya",
      tagline: "Konsultan",
      email: "halo@nusa.id",
      phone: "+62 21 5000",
      whatsappNumber: "6281234567890",
      whatsappMessage: "Halo",
      address: { street: "Jl. A", city: "Jakarta", region: "DKI", postalCode: "12160", country: "ID" },
      mapsEmbedUrl: null,
      openingHours: "Senin–Jumat",
      socialLinks: [{ platform: "Instagram", url: "https://instagram.com/nusa" }],
      schemaType: "LocalBusiness",
      foundedYear: 2017,
      googleSiteVerification: null,
      gaMeasurementId: "G-ABC123",
    });
    expect(result.mediaIds).toEqual({ logo: "m1", defaultOgImage: null });
  });
});
