import { describe, expect, it } from "vitest";
import { generalPack } from "@/content/packs/general";
import type { MediaAsset } from "@/core/domain/shared/media-asset";
import {
  collectMediaIds,
  toAboutContent,
  toArticle,
  toCompanyVision,
  toContentBlock,
  toHomeContent,
  toLegalPage,
  toMediaAsset,
  toPartner,
  toPortfolioItem,
  toSectionIntro,
  toService,
  toSiteSettings,
  toStat,
  toTeamMember,
  toTestimonial,
  type MediaMap,
} from "@/infrastructure/supabase/mappers";
import type {
  AboutContentRow,
  ArticleRow,
  ContentBlockItemRow,
  ContentBlockRow,
  HomeContentRow,
  LegalPageRow,
  MediaRow,
  PartnerRow,
  PortfolioRow,
  SectionIntroRow,
  ServiceRow,
  SiteSettingsRow,
  StatRow,
  TeamMemberRow,
  TestimonialRow,
} from "@/infrastructure/supabase/rows";

const mediaId = (asset: MediaAsset | null): string | null => asset?.id ?? null;

function mediaRow(asset: MediaAsset): MediaRow {
  return { id: asset.id, url: asset.url, alt: asset.alt, width: asset.width, height: asset.height };
}

const allAssets: MediaAsset[] = [];
const seen = new Set<string>();
JSON.stringify(generalPack, (_key, value) => {
  if (value && typeof value === "object" && "url" in value && "alt" in value && "width" in value && !seen.has(value.id)) {
    seen.add(value.id);
    allAssets.push(value as MediaAsset);
  }
  return value;
});
const media: MediaMap = new Map(allAssets.map((asset) => [asset.id, toMediaAsset(mediaRow(asset))]));

const { settings, home, about, vision } = generalPack;

describe("toMediaAsset", () => {
  it("keeps id, url, alt, and size", () => {
    const asset = generalPack.services[0].cover!;

    expect(toMediaAsset(mediaRow(asset))).toEqual(asset);
  });
});

describe("collectMediaIds", () => {
  it("collects media columns and gallery ids without duplicates or nulls", () => {
    const ids = collectMediaIds([
      { cover_media_id: "a", gallery_media_ids: ["b", "a", "c"], title: "x" },
      { logo_media_id: null, photo_media_id: "b", other: 3 },
      { media_id: "d" },
    ]);

    expect(ids.sort()).toEqual(["a", "b", "c", "d"]);
  });
});

describe("site settings and page content", () => {
  it("maps site settings", () => {
    const row: SiteSettingsRow = {
      site_name: settings.siteName,
      tagline: settings.tagline,
      logo_media_id: mediaId(settings.logo),
      default_og_media_id: mediaId(settings.defaultOgImage),
      email: settings.email,
      phone: settings.phone,
      whatsapp_number: settings.whatsappNumber,
      whatsapp_message: settings.whatsappMessage,
      address_street: settings.address.street,
      address_city: settings.address.city,
      address_region: settings.address.region,
      postal_code: settings.address.postalCode,
      address_country: settings.address.country,
      maps_embed_url: settings.mapsEmbedUrl,
      opening_hours: settings.openingHours,
      social_links: settings.socialLinks,
      schema_type: settings.schemaType,
      founded_year: settings.foundedYear,
      google_site_verification: settings.googleSiteVerification,
      ga_measurement_id: settings.gaMeasurementId,
      updated_at: settings.updatedAt,
    };

    expect(toSiteSettings(row, media)).toEqual(settings);
  });

  it("maps home content and drops a call to action with an empty label", () => {
    const row: HomeContentRow = {
      hero_eyebrow: home.heroEyebrow,
      meta_title: home.metaTitle,
      meta_description: home.metaDescription,
      hero_title: home.heroTitle,
      hero_subtitle: home.heroSubtitle,
      hero_media_id: mediaId(home.heroImage),
      hero_primary_cta_label: home.primaryCta?.label ?? null,
      hero_primary_cta_href: home.primaryCta?.href ?? null,
      hero_secondary_cta_label: home.secondaryCta?.label ?? null,
      hero_secondary_cta_href: home.secondaryCta?.href ?? null,
      updated_at: home.updatedAt,
    };

    expect(toHomeContent(row, media)).toEqual(home);
    expect(toHomeContent({ ...row, hero_primary_cta_label: "" }, media).primaryCta).toBeNull();
    expect(toHomeContent({ ...row, hero_secondary_cta_href: null }, media).secondaryCta).toBeNull();
  });

  it("maps every section intro", () => {
    for (const intro of generalPack.sectionIntros) {
      const row: SectionIntroRow = {
        section_key: intro.key,
        eyebrow: intro.eyebrow,
        title: intro.title,
        description: intro.description,
        meta_title: intro.metaTitle,
        meta_description: intro.metaDescription,
      };
      expect(toSectionIntro(row)).toEqual(intro);
    }
  });

  it("maps about content", () => {
    const row: AboutContentRow = {
      summary: about.summary,
      body_md: about.bodyMd,
      media_id: mediaId(about.image),
      meta_title: about.metaTitle,
      meta_description: about.metaDescription,
      updated_at: about.updatedAt,
    };

    expect(toAboutContent(row, media)).toEqual(about);
  });

  it("maps vision, missions, and values in sort order", () => {
    const missions = vision.missions.map((content, index) => ({ content, sort_order: vision.missions.length - index }));
    const values = vision.values.map((value, index) => ({ ...value, sort_order: index }));

    const result = toCompanyVision({ vision: vision.vision }, missions, values);

    expect(result.vision).toBe(vision.vision);
    expect(result.missions).toEqual([...vision.missions].reverse());
    expect(result.values).toEqual(vision.values);
  });

  it.each(generalPack.legalPages)("maps the legal page $slug", (page) => {
    const row: LegalPageRow = {
      slug: page.slug,
      title: page.title,
      intro: page.intro,
      sections: page.sections.map((section) => ({ heading: section.heading, body_md: section.bodyMd })),
      meta_description: page.metaDescription,
      updated_at: page.updatedAt,
    };

    expect(toLegalPage(row)).toEqual(page);
  });
});

describe("catalog entities", () => {
  it.each(generalPack.services)("maps the service $slug", (service) => {
    const row: ServiceRow = {
      id: service.id,
      slug: service.slug,
      title: service.title,
      summary: service.summary,
      body_md: service.bodyMd,
      cover_media_id: mediaId(service.cover),
      meta_title: service.metaTitle,
      meta_description: service.metaDescription,
      faq: service.faq,
      sort_order: service.sortOrder,
      updated_at: service.updatedAt,
    };

    expect(toService(row, media)).toEqual(service);
  });

  it("rejects a published service without a meta title and names the table", () => {
    const service = generalPack.services[0];
    const row: ServiceRow = {
      id: service.id,
      slug: service.slug,
      title: service.title,
      summary: service.summary,
      body_md: service.bodyMd,
      cover_media_id: null,
      meta_title: null,
      meta_description: service.metaDescription,
      faq: [],
      sort_order: 1,
      updated_at: service.updatedAt,
    };

    expect(() => toService(row, media)).toThrow(/services/);
  });

  it("rejects malformed faq json", () => {
    const service = generalPack.services[0];
    const row = {
      id: service.id,
      slug: service.slug,
      title: service.title,
      summary: service.summary,
      body_md: service.bodyMd,
      cover_media_id: null,
      meta_title: service.metaTitle,
      meta_description: service.metaDescription,
      faq: [{ question: "q" }],
      sort_order: 1,
      updated_at: service.updatedAt,
    } satisfies ServiceRow;

    expect(() => toService(row, media)).toThrow(/faq/);
  });

  it.each(generalPack.portfolio)("maps the portfolio item $slug and keeps gallery order", (item) => {
    const row: PortfolioRow = {
      id: item.id,
      slug: item.slug,
      title: item.title,
      client_name: item.clientName,
      category: item.category,
      summary: item.summary,
      body_md: item.bodyMd,
      cover_media_id: mediaId(item.cover),
      gallery_media_ids: item.gallery.map((asset) => asset.id),
      completed_on: item.completedOn,
      meta_title: item.metaTitle,
      meta_description: item.metaDescription,
      sort_order: item.sortOrder,
      updated_at: item.updatedAt,
    };

    expect(toPortfolioItem(row, media)).toEqual(item);
  });

  it("skips gallery ids that are missing from the media map", () => {
    const item = generalPack.portfolio[0];
    const row: PortfolioRow = {
      id: item.id,
      slug: item.slug,
      title: item.title,
      client_name: item.clientName,
      category: item.category,
      summary: item.summary,
      body_md: item.bodyMd,
      cover_media_id: null,
      gallery_media_ids: ["missing-id", ...item.gallery.map((asset) => asset.id)],
      completed_on: null,
      meta_title: item.metaTitle,
      meta_description: item.metaDescription,
      sort_order: 1,
      updated_at: item.updatedAt,
    };

    expect(toPortfolioItem(row, media).gallery).toEqual(item.gallery);
  });

  it.each(generalPack.team)("maps the team member $name", (member) => {
    const row: TeamMemberRow = {
      id: member.id,
      name: member.name,
      job_title: member.jobTitle,
      bio: member.bio,
      photo_media_id: mediaId(member.photo),
      years_experience: member.yearsExperience,
      profiles: member.profiles,
      sort_order: member.sortOrder,
    };

    expect(toTeamMember(row, media)).toEqual(member);
  });

  it.each(generalPack.stats)("maps the stat $key", (stat) => {
    const row: StatRow = { key: stat.key, label: stat.label, value: stat.value, suffix: stat.suffix, sort_order: stat.sortOrder };

    expect(toStat(row)).toEqual(stat);
  });

  it.each(generalPack.testimonials)("maps the testimonial from $name", (testimonial) => {
    const row: TestimonialRow = {
      id: testimonial.id,
      name: testimonial.name,
      job_title: testimonial.jobTitle,
      company: testimonial.company,
      quote: testimonial.quote,
      photo_media_id: mediaId(testimonial.photo),
      sort_order: testimonial.sortOrder,
    };

    expect(toTestimonial(row, media)).toEqual(testimonial);
  });

  it.each(generalPack.partners)("maps the partner $name", (partner) => {
    const row: PartnerRow = {
      id: partner.id,
      name: partner.name,
      logo_media_id: mediaId(partner.logo),
      url: partner.url,
      sort_order: partner.sortOrder,
    };

    expect(toPartner(row, media)).toEqual(partner);
  });
});

describe("articles and content blocks", () => {
  it.each(generalPack.articles)("maps the article $slug", (article) => {
    const row: ArticleRow = {
      id: article.id,
      slug: article.slug,
      title: article.title,
      meta_title: article.metaTitle,
      meta_description: article.metaDescription,
      lead: article.lead,
      body_md: article.bodyMd,
      cover_media_id: mediaId(article.cover),
      author_id: article.authorId,
      faq: article.faq,
      published_at: article.publishedAt,
      updated_at: article.updatedAt,
    };

    expect(toArticle(row, media)).toEqual(article);
  });

  it("rejects a published article without an author", () => {
    const article = generalPack.articles[0];
    const row: ArticleRow = {
      id: article.id,
      slug: article.slug,
      title: article.title,
      meta_title: article.metaTitle,
      meta_description: article.metaDescription,
      lead: article.lead,
      body_md: article.bodyMd,
      cover_media_id: null,
      author_id: null,
      faq: [],
      published_at: article.publishedAt,
      updated_at: article.updatedAt,
    };

    expect(() => toArticle(row, media)).toThrow(/articles/);
  });

  it.each(generalPack.contentBlocks)("maps the content block $key in item order", (block) => {
    const blockRow: ContentBlockRow = {
      id: `block-${block.key}`,
      block_key: block.key,
      eyebrow: block.eyebrow,
      title: block.title,
      description: block.description,
    };
    const itemRows: ContentBlockItemRow[] = block.items.map((item, index) => ({
      id: `item-${block.key}-${index}`,
      block_id: blockRow.id,
      title: item.title,
      description: item.description,
      icon: item.icon,
      media_id: mediaId(item.media),
      link_label: item.link?.label ?? null,
      link_href: item.link?.href ?? null,
      sort_order: block.items.length - index,
    }));

    const result = toContentBlock(blockRow, [...itemRows].reverse(), media);

    expect(result).toEqual({ ...block, items: [...block.items].reverse() });
  });
});
