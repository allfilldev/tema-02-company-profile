import type { SiteQueries } from "@/core/application/site/site-queries";
import type { SiteSettings } from "@/core/domain/settings/site-settings";
import type { ThemeConfig } from "@/core/domain/theme/theme-config";
import { buildOrganizationJsonLd, buildWebSiteJsonLd, type JsonLd } from "@/lib/seo/json-ld";
import type { SeoSite } from "@/lib/seo/metadata";
import { buildWhatsAppUrl } from "@/lib/site/whatsapp";
import { buildNavigation, type NavigationItem } from "@/server/site/navigation";
import type { SiteEnv } from "@/server/site/site-env";

export type SiteContext = {
  settings: SiteSettings;
  theme: ThemeConfig;
  env: SiteEnv;
  seoSite: SeoSite;
  navigation: NavigationItem[];
  whatsappUrl: string;
  organizationJsonLd: JsonLd;
  webSiteJsonLd: JsonLd;
};

const DEFAULT_OG_IMAGE_PATH = "/opengraph-image";

export async function getSiteContext(queries: SiteQueries, env: SiteEnv, theme: ThemeConfig): Promise<SiteContext> {
  const settings = await queries.getSettings();

  return {
    settings,
    theme,
    env,
    seoSite: {
      siteName: settings.siteName,
      siteUrl: env.siteUrl,
      indexingEnabled: env.indexingEnabled,
      defaultOgImagePath: DEFAULT_OG_IMAGE_PATH,
      defaultOgImageAlt: `${settings.siteName}, ${settings.tagline}`,
    },
    navigation: buildNavigation(theme.enabledModules),
    whatsappUrl: buildWhatsAppUrl(settings.whatsappNumber, settings.whatsappMessage),
    organizationJsonLd: buildOrganizationJsonLd(settings, env.siteUrl),
    webSiteJsonLd: buildWebSiteJsonLd(settings, env.siteUrl),
  };
}
