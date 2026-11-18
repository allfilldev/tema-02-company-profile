import type { LegalSlug } from "@/core/domain/page/legal-page";
import type { ModuleKey } from "@/core/domain/shared/module-key";

export type NavigationItem = {
  label: string;
  href: string;
};

export type LegalLink = {
  slug: LegalSlug;
  label: string;
  href: string;
  rel: string | null;
};

type NavigationEntry = NavigationItem & { module: ModuleKey | null };

const NAVIGATION_ENTRIES: readonly NavigationEntry[] = [
  { label: "Beranda", href: "/", module: null },
  { label: "Tentang", href: "/tentang", module: null },
  { label: "Layanan", href: "/layanan", module: "services" },
  { label: "Portofolio", href: "/portofolio", module: "portfolio" },
  { label: "Artikel", href: "/artikel", module: "articles" },
  { label: "Kontak", href: "/kontak", module: null },
];

export const LEGAL_LINKS: readonly LegalLink[] = [
  { slug: "privasi", label: "Kebijakan privasi", href: "/privasi", rel: "privacy-policy" },
  { slug: "syarat-ketentuan", label: "Syarat dan ketentuan", href: "/syarat-ketentuan", rel: "terms-of-service" },
  { slug: "kebijakan-editorial", label: "Kebijakan editorial", href: "/kebijakan-editorial", rel: null },
];

export function buildNavigation(enabledModules: readonly ModuleKey[]): NavigationItem[] {
  return NAVIGATION_ENTRIES.filter((entry) => entry.module === null || enabledModules.includes(entry.module)).map(
    ({ label, href }) => ({ label, href }),
  );
}
