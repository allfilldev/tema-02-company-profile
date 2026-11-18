import { MODULE_KEYS, type ModuleKey } from "@/core/domain/shared/module-key";
import type { ThemeConfig } from "@/core/domain/theme/theme-config";

export function isModuleEnabled(theme: ThemeConfig, key: ModuleKey): boolean {
  return theme.enabledModules.includes(key);
}

export function isModuleKey(key: string): key is ModuleKey {
  return (MODULE_KEYS as readonly string[]).includes(key);
}
