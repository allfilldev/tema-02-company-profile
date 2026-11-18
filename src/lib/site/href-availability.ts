import type { ModuleKey } from "@/core/domain/shared/module-key";

const MODULE_BY_SECTION: Record<string, ModuleKey> = {
  layanan: "services",
  portofolio: "portfolio",
  artikel: "articles",
};

function sectionOf(href: string): string | null {
  const trimmed = href.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return null;
  }
  const end = trimmed.search(/[?#]/);
  const pathname = end === -1 ? trimmed : trimmed.slice(0, end);
  return pathname.split("/").find((segment) => segment.length > 0) ?? null;
}

export function isHrefAvailable(href: string, enabledModules: readonly ModuleKey[]): boolean {
  const section = sectionOf(href);
  if (section === null || !Object.hasOwn(MODULE_BY_SECTION, section)) {
    return true;
  }
  return enabledModules.includes(MODULE_BY_SECTION[section]);
}
