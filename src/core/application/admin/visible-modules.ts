import type { AdminModule } from "@/core/domain/admin/records";
import type { ModuleKey } from "@/core/domain/shared/module-key";

const MENU_ORDER: readonly AdminModule[] = ["services", "portfolio", "team", "stats", "testimonials", "partners", "articles"];

export function visibleAdminModules(enabledModules: readonly ModuleKey[]): AdminModule[] {
  return MENU_ORDER.filter((module) => {
    if (module === "team") {
      return enabledModules.includes("team") || enabledModules.includes("articles");
    }
    return enabledModules.includes(module);
  });
}
