import type { SiteSettings } from "@/core/domain/settings/site-settings";

export interface SiteSettingsRepository {
  get(): Promise<SiteSettings>;
}
