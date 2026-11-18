import type { Article } from "@/core/domain/article/article";
import type { Service } from "@/core/domain/service/service";
import type { SiteSettings } from "@/core/domain/settings/site-settings";
import { absoluteUrl } from "@/lib/seo/site-url";
import type { NavigationItem } from "@/server/site/navigation";

function singleLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function buildLink(label: string, url: string, description?: string): string {
  const link = `- [${singleLine(label)}](${url})`;
  return description ? `${link}: ${singleLine(description)}` : link;
}

function buildSection(heading: string, lines: string[]): string[] {
  return lines.length > 0 ? [`## ${heading}`, "", ...lines, ""] : [];
}

export function buildLlmsTxt(input: {
  siteUrl: string;
  settings: SiteSettings;
  navigation: NavigationItem[];
  services: Service[];
  articles: Article[];
}): string {
  const { siteUrl, settings, navigation, services, articles } = input;

  const pageLines = navigation.map((item) => buildLink(item.label, absoluteUrl(siteUrl, item.href)));
  const serviceLines = services.map((service) =>
    buildLink(service.title, absoluteUrl(siteUrl, `/layanan/${service.slug}`), service.summary),
  );
  const articleLines = articles.map((article) =>
    buildLink(article.title, absoluteUrl(siteUrl, `/artikel/${article.slug}`), article.lead),
  );

  const lines = [
    `# ${singleLine(settings.siteName)}`,
    "",
    `> ${singleLine(settings.tagline)}`,
    "",
    ...buildSection("Halaman utama", pageLines),
    ...buildSection("Layanan", serviceLines),
    ...buildSection("Artikel", articleLines),
  ];

  return `${lines.join("\n").trimEnd()}\n`;
}
