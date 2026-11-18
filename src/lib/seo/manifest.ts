import type { MetadataRoute } from "next";
import type { SiteSettings } from "@/core/domain/settings/site-settings";

const SHORT_NAME_MAX_LENGTH = 12;

function shortenName(name: string): string {
  if (name.length <= SHORT_NAME_MAX_LENGTH) {
    return name;
  }

  let shortened = "";
  for (const word of name.split(/\s+/)) {
    const candidate = shortened ? `${shortened} ${word}` : word;
    if (candidate.length > SHORT_NAME_MAX_LENGTH) {
      break;
    }
    shortened = candidate;
  }

  return shortened || name.slice(0, SHORT_NAME_MAX_LENGTH);
}

export function buildManifest(
  settings: SiteSettings,
  colors: { themeColor: string; backgroundColor: string },
): MetadataRoute.Manifest {
  return {
    name: settings.siteName,
    short_name: shortenName(settings.siteName),
    description: settings.tagline,
    start_url: "/",
    display: "standalone",
    theme_color: colors.themeColor,
    background_color: colors.backgroundColor,
    lang: "id",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
