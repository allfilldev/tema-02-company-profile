import type { ArticleWithAuthor } from "@/core/domain/article/article";
import type { PortfolioItem } from "@/core/domain/portfolio/portfolio-item";
import type { Service } from "@/core/domain/service/service";
import type { FaqItem } from "@/core/domain/shared/faq-item";
import type { MediaAsset } from "@/core/domain/shared/media-asset";
import type { SiteSettings } from "@/core/domain/settings/site-settings";
import type { TeamMember } from "@/core/domain/team/team-member";
import { absoluteAssetUrl, absoluteUrl } from "@/lib/seo/site-url";
import { SITE_ROUTES } from "@/lib/site/routes";

export type JsonLd = Record<string, unknown>;

export type BreadcrumbItem = { name: string; path: string };

const SCHEMA_CONTEXT = "https://schema.org";

function imageField(media: MediaAsset | null, siteUrl: string): JsonLd {
  return media ? { image: absoluteAssetUrl(siteUrl, media.url) } : {};
}

function organizationReference(settings: SiteSettings, siteUrl: string): JsonLd {
  return {
    "@type": settings.schemaType,
    name: settings.siteName,
    url: absoluteUrl(siteUrl, "/"),
  };
}

export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function buildOrganizationJsonLd(settings: SiteSettings, siteUrl: string): JsonLd {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": settings.schemaType,
    name: settings.siteName,
    url: absoluteUrl(siteUrl, "/"),
    ...(settings.logo ? { logo: absoluteAssetUrl(siteUrl, settings.logo.url) } : {}),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.phone,
      email: settings.email,
      contactType: "customer service",
      availableLanguage: "id",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address.street,
      addressLocality: settings.address.city,
      addressRegion: settings.address.region,
      postalCode: settings.address.postalCode,
      addressCountry: settings.address.country,
    },
    ...(settings.socialLinks.length > 0 ? { sameAs: settings.socialLinks.map((link) => link.url) } : {}),
    ...(settings.foundedYear !== null ? { foundingDate: String(settings.foundedYear) } : {}),
    publishingPrinciples: absoluteUrl(siteUrl, "/kebijakan-editorial"),
  };
}

export function buildWebSiteJsonLd(settings: SiteSettings, siteUrl: string): JsonLd {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "WebSite",
    name: settings.siteName,
    url: absoluteUrl(siteUrl, "/"),
    inLanguage: "id-ID",
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[], siteUrl: string): JsonLd {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(siteUrl, item.path),
    })),
  };
}

export function buildServiceJsonLd(service: Service, settings: SiteSettings, siteUrl: string): JsonLd {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "Service",
    name: service.title,
    description: service.summary,
    provider: organizationReference(settings, siteUrl),
    url: absoluteUrl(siteUrl, `${SITE_ROUTES.services}/${service.slug}`),
    ...imageField(service.cover, siteUrl),
  };
}

export function buildPortfolioJsonLd(item: PortfolioItem, settings: SiteSettings, siteUrl: string): JsonLd {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "CreativeWork",
    name: item.title,
    description: item.summary,
    creator: organizationReference(settings, siteUrl),
    ...(item.completedOn ? { dateCreated: item.completedOn } : {}),
    ...imageField(item.cover, siteUrl),
    url: absoluteUrl(siteUrl, `${SITE_ROUTES.portfolio}/${item.slug}`),
  };
}

export function buildArticleJsonLd(article: ArticleWithAuthor, settings: SiteSettings, siteUrl: string): JsonLd {
  const articleUrl = absoluteUrl(siteUrl, `${SITE_ROUTES.articles}/${article.slug}`);
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "BlogPosting",
    headline: article.title,
    description: article.metaDescription,
    ...imageField(article.cover, siteUrl),
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Person",
      name: article.author.name,
      jobTitle: article.author.jobTitle,
      worksFor: organizationReference(settings, siteUrl),
      url: absoluteUrl(siteUrl, SITE_ROUTES.about),
      ...(article.author.profiles.length > 0 ? { sameAs: article.author.profiles } : {}),
    },
    publisher: {
      ...organizationReference(settings, siteUrl),
      ...(settings.logo
        ? { logo: { "@type": "ImageObject", url: absoluteAssetUrl(siteUrl, settings.logo.url) } }
        : {}),
    },
    mainEntityOfPage: articleUrl,
  };
}

export function buildPersonJsonLd(member: TeamMember, settings: SiteSettings, siteUrl: string): JsonLd {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "Person",
    name: member.name,
    jobTitle: member.jobTitle,
    worksFor: organizationReference(settings, siteUrl),
    ...imageField(member.photo, siteUrl),
    ...(member.profiles.length > 0 ? { sameAs: member.profiles } : {}),
  };
}

export function buildFaqJsonLd(items: FaqItem[]): JsonLd | null {
  if (items.length === 0) {
    return null;
  }
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
