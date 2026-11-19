import type { SettingsAdminRepository } from "@/core/domain/admin/admin-repositories";
import type { SiteSettings } from "@/core/domain/settings/site-settings";
import { SECTION_KEYS, type SectionKey } from "@/core/domain/shared/section-key";
import { failure, success, type AdminResult } from "@/core/application/admin/admin-result";
import { siteSettingsSchema } from "@/core/application/schemas/site-schemas";
import type { SiteQueries } from "@/core/application/site/site-queries";
import { findTitleImpacts, type TitleImpact } from "@/lib/seo/title-impact";

export type SettingsAffected = { kind: "settings" };

const SECTION_LABELS: Record<SectionKey, string> = {
  services: "Layanan",
  portfolio: "Portofolio",
  team: "Tim",
  stats: "Statistik",
  testimonials: "Testimoni",
  partners: "Partner",
  articles: "Artikel",
  vision: "Visi dan misi",
  about: "Tentang",
  contact: "Kontak",
};

const ADDRESS_FIELDS: Record<string, string> = {
  street: "addressStreet",
  city: "addressCity",
  region: "addressRegion",
  postalCode: "postalCode",
  country: "addressCountry",
};

function fieldNameFor(path: readonly PropertyKey[]): string {
  const [first, second] = path;
  if (first === "address" && typeof second === "string" && second in ADDRESS_FIELDS) {
    return ADDRESS_FIELDS[second];
  }
  return String(first ?? "form");
}

export async function updateSiteSettings(
  deps: { repository: SettingsAdminRepository },
  values: unknown,
): Promise<AdminResult<SiteSettings, SettingsAffected>> {
  const current = await deps.repository.get();
  const candidate = { ...(values as object), updatedAt: current.updatedAt };
  const parsed = siteSettingsSchema.safeParse(candidate);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = fieldNameFor(issue.path);
      if (!(field in fieldErrors)) fieldErrors[field] = issue.message;
    }
    return failure(["Periksa kembali isian yang ditandai."], fieldErrors);
  }

  return success(await deps.repository.update(parsed.data), { kind: "settings" });
}

export async function previewTitleImpacts(deps: { queries: SiteQueries }, newSiteName: string): Promise<TitleImpact[]> {
  const { queries } = deps;
  const [home, about, intros, services, portfolio, articles] = await Promise.all([
    queries.getHome(),
    queries.getAbout(),
    Promise.all(SECTION_KEYS.map(async (key) => ({ key, intro: await queries.getSectionIntro(key) }))),
    queries.listServices(),
    queries.listPortfolio(),
    queries.listAllArticles(),
  ]);

  const entries = [
    { label: "Beranda", title: home.metaTitle },
    { label: "Tentang", title: about.metaTitle },
    ...intros.flatMap(({ key, intro }) => (intro ? [{ label: `Intro ${SECTION_LABELS[key]}`, title: intro.metaTitle }] : [])),
    ...services.map((service) => ({ label: `Layanan: ${service.title}`, title: service.metaTitle })),
    ...portfolio.map((item) => ({ label: `Portofolio: ${item.title}`, title: item.metaTitle })),
    ...articles.map((article) => ({ label: `Artikel: ${article.title}`, title: article.metaTitle })),
  ];

  return findTitleImpacts(entries, newSiteName);
}
