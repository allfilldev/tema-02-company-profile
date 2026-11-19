import { createContentPackSchema } from "../../src/core/application/schemas/content-pack-schema";
import type { ContentPack } from "../../src/core/domain/content-pack/content-pack";
import type { MediaAsset } from "../../src/core/domain/shared/media-asset";
import { stableUuid } from "./stable-uuid";

export const SEED_TRUNCATE_TABLES = [
  "content_block_items",
  "content_blocks",
  "articles",
  "partners",
  "testimonials",
  "stats",
  "team_members",
  "portfolio_items",
  "services",
  "company_values",
  "mission_items",
  "company_vision",
  "legal_pages",
  "about_content",
  "section_intros",
  "home_content",
  "site_settings",
  "contact_messages",
  "media",
] as const;

export type SeedOptions = {
  mediaSizeBytes?: (asset: MediaAsset) => number;
};

type SqlValue = string | number | boolean | null;

function literal(value: SqlValue): string {
  if (value === null) {
    return "null";
  }
  if (typeof value === "number") {
    return String(value);
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  return `'${value.replace(/'/g, "''")}'`;
}

function jsonLiteral(value: unknown): string {
  return `${literal(JSON.stringify(value))}::jsonb`;
}

function uuidArrayLiteral(ids: readonly string[]): string {
  return ids.length === 0 ? "'{}'::uuid[]" : `array[${ids.map((id) => literal(id)).join(", ")}]::uuid[]`;
}

function insert(table: string, columns: readonly string[], rows: readonly string[][]): string {
  if (rows.length === 0) {
    return "";
  }
  const values = rows.map((row) => `(${row.join(", ")})`).join(",\n");
  return `insert into public.${table} (${columns.join(", ")}) values\n${values};\n`;
}

function mediaId(asset: MediaAsset | null): string | null {
  return asset ? stableUuid("media", asset.id) : null;
}

function collectAssets(pack: ContentPack): MediaAsset[] {
  const seen = new Map<string, MediaAsset>();
  JSON.stringify(pack, (_key, value: unknown) => {
    const candidate = value as Partial<MediaAsset> | null;
    if (candidate && typeof candidate === "object" && typeof candidate.id === "string" && typeof candidate.url === "string" && typeof candidate.alt === "string") {
      seen.set(candidate.id, candidate as MediaAsset);
    }
    return value;
  });
  return [...seen.values()];
}

function assertValidPack(pack: ContentPack): void {
  const result = createContentPackSchema(pack.settings.siteName).safeParse(pack);
  if (!result.success) {
    const details = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
    throw new Error(`Content pack is invalid: ${details}`);
  }
}

export function buildSeedSql(pack: ContentPack, options: SeedOptions = {}): string {
  assertValidPack(pack);

  const sizeOf = options.mediaSizeBytes ?? (() => 0);
  const { settings, home, about, vision } = pack;
  const statements: string[] = [
    "begin;\n",
    `truncate table ${SEED_TRUNCATE_TABLES.map((table) => `public.${table}`).join(", ")} restart identity cascade;\n`,
  ];

  statements.push(
    insert(
      "media",
      ["id", "public_path", "url", "alt", "width", "height", "size_bytes"],
      collectAssets(pack).map((asset) => [
        literal(stableUuid("media", asset.id)),
        literal(asset.url),
        literal(asset.url),
        literal(asset.alt),
        literal(asset.width),
        literal(asset.height),
        literal(sizeOf(asset)),
      ]),
    ),
  );

  statements.push(
    insert(
      "site_settings",
      [
        "id", "site_name", "tagline", "logo_media_id", "default_og_media_id", "email", "phone", "whatsapp_number",
        "whatsapp_message", "address_street", "address_city", "address_region", "postal_code", "address_country",
        "maps_embed_url", "opening_hours", "social_links", "schema_type", "founded_year", "google_site_verification",
        "ga_measurement_id", "updated_at",
      ],
      [[
        "true", literal(settings.siteName), literal(settings.tagline), literal(mediaId(settings.logo)),
        literal(mediaId(settings.defaultOgImage)), literal(settings.email), literal(settings.phone),
        literal(settings.whatsappNumber), literal(settings.whatsappMessage), literal(settings.address.street),
        literal(settings.address.city), literal(settings.address.region), literal(settings.address.postalCode),
        literal(settings.address.country), literal(settings.mapsEmbedUrl), literal(settings.openingHours),
        jsonLiteral(settings.socialLinks), literal(settings.schemaType), literal(settings.foundedYear),
        literal(settings.googleSiteVerification), literal(settings.gaMeasurementId), literal(settings.updatedAt),
      ]],
    ),
  );

  statements.push(
    insert(
      "home_content",
      [
        "id", "hero_eyebrow", "hero_title", "hero_subtitle", "hero_media_id", "hero_primary_cta_label",
        "hero_primary_cta_href", "hero_secondary_cta_label", "hero_secondary_cta_href", "meta_title",
        "meta_description", "updated_at",
      ],
      [[
        "true", literal(home.heroEyebrow), literal(home.heroTitle), literal(home.heroSubtitle),
        literal(mediaId(home.heroImage)), literal(home.primaryCta?.label ?? null), literal(home.primaryCta?.href ?? null),
        literal(home.secondaryCta?.label ?? null), literal(home.secondaryCta?.href ?? null), literal(home.metaTitle),
        literal(home.metaDescription), literal(home.updatedAt),
      ]],
    ),
  );

  statements.push(
    insert(
      "section_intros",
      ["section_key", "eyebrow", "title", "description", "meta_title", "meta_description"],
      pack.sectionIntros.map((intro) => [
        literal(intro.key), literal(intro.eyebrow), literal(intro.title), literal(intro.description),
        literal(intro.metaTitle), literal(intro.metaDescription),
      ]),
    ),
  );

  statements.push(
    insert(
      "about_content",
      ["id", "summary", "body_md", "media_id", "meta_title", "meta_description", "updated_at"],
      [["true", literal(about.summary), literal(about.bodyMd), literal(mediaId(about.image)), literal(about.metaTitle), literal(about.metaDescription), literal(about.updatedAt)]],
    ),
  );

  statements.push(insert("company_vision", ["id", "vision"], [["true", literal(vision.vision)]]));
  statements.push(
    insert(
      "mission_items",
      ["id", "content", "sort_order"],
      vision.missions.map((content, index) => [literal(stableUuid("mission", String(index))), literal(content), literal(index + 1)]),
    ),
  );
  statements.push(
    insert(
      "company_values",
      ["id", "title", "description", "sort_order"],
      vision.values.map((value, index) => [literal(stableUuid("value", String(index))), literal(value.title), literal(value.description), literal(index + 1)]),
    ),
  );

  statements.push(
    insert(
      "team_members",
      ["id", "name", "job_title", "bio", "photo_media_id", "years_experience", "profiles", "sort_order", "is_published"],
      pack.team.map((member) => [
        literal(stableUuid("team", member.id)), literal(member.name), literal(member.jobTitle), literal(member.bio),
        literal(mediaId(member.photo)), literal(member.yearsExperience), jsonLiteral(member.profiles),
        literal(member.sortOrder), "true",
      ]),
    ),
  );

  statements.push(
    insert(
      "services",
      ["id", "slug", "title", "summary", "body_md", "cover_media_id", "meta_title", "meta_description", "faq", "sort_order", "is_published", "updated_at"],
      pack.services.map((service) => [
        literal(stableUuid("service", service.id)), literal(service.slug), literal(service.title), literal(service.summary),
        literal(service.bodyMd), literal(mediaId(service.cover)), literal(service.metaTitle),
        literal(service.metaDescription), jsonLiteral(service.faq), literal(service.sortOrder), "true",
        literal(service.updatedAt),
      ]),
    ),
  );

  statements.push(
    insert(
      "portfolio_items",
      [
        "id", "slug", "title", "client_name", "category", "summary", "body_md", "cover_media_id", "gallery_media_ids",
        "completed_on", "meta_title", "meta_description", "sort_order", "is_published", "updated_at",
      ],
      pack.portfolio.map((item) => [
        literal(stableUuid("portfolio", item.id)), literal(item.slug), literal(item.title), literal(item.clientName),
        literal(item.category), literal(item.summary), literal(item.bodyMd), literal(mediaId(item.cover)),
        uuidArrayLiteral(item.gallery.map((asset) => stableUuid("media", asset.id))), literal(item.completedOn),
        literal(item.metaTitle), literal(item.metaDescription), literal(item.sortOrder), "true", literal(item.updatedAt),
      ]),
    ),
  );

  statements.push(
    insert(
      "stats",
      ["id", "key", "label", "value", "suffix", "sort_order"],
      pack.stats.map((stat) => [
        literal(stableUuid("stat", stat.key)), literal(stat.key), literal(stat.label), literal(stat.value),
        literal(stat.suffix), literal(stat.sortOrder),
      ]),
    ),
  );

  statements.push(
    insert(
      "testimonials",
      ["id", "name", "job_title", "company", "quote", "photo_media_id", "sort_order", "is_published"],
      pack.testimonials.map((item) => [
        literal(stableUuid("testimonial", item.id)), literal(item.name), literal(item.jobTitle), literal(item.company),
        literal(item.quote), literal(mediaId(item.photo)), literal(item.sortOrder), "true",
      ]),
    ),
  );

  statements.push(
    insert(
      "partners",
      ["id", "name", "logo_media_id", "url", "sort_order", "is_published"],
      pack.partners.map((partner) => [
        literal(stableUuid("partner", partner.id)), literal(partner.name), literal(mediaId(partner.logo)),
        literal(partner.url), literal(partner.sortOrder), "true",
      ]),
    ),
  );

  statements.push(
    insert(
      "articles",
      [
        "id", "slug", "title", "meta_title", "meta_description", "lead", "body_md", "cover_media_id", "author_id", "faq",
        "status", "published_at", "updated_at",
      ],
      pack.articles.map((article) => [
        literal(stableUuid("article", article.id)), literal(article.slug), literal(article.title),
        literal(article.metaTitle), literal(article.metaDescription), literal(article.lead), literal(article.bodyMd),
        literal(mediaId(article.cover)), literal(stableUuid("team", article.authorId)), jsonLiteral(article.faq),
        "'published'", literal(article.publishedAt), literal(article.updatedAt),
      ]),
    ),
  );

  statements.push(
    insert(
      "content_blocks",
      ["id", "block_key", "eyebrow", "title", "description", "is_published"],
      pack.contentBlocks.map((block) => [
        literal(stableUuid("block", block.key)), literal(block.key), literal(block.eyebrow), literal(block.title),
        literal(block.description), "true",
      ]),
    ),
  );

  const blockItemRows = pack.contentBlocks.flatMap((block) =>
    block.items.map((item, index) => [
      literal(stableUuid("block-item", `${block.key}:${index}`)), literal(stableUuid("block", block.key)),
      literal(item.title), literal(item.description), literal(item.icon), literal(mediaId(item.media)),
      literal(item.link?.label ?? null), literal(item.link?.href ?? null), literal(index + 1),
    ]),
  );
  statements.push(
    insert(
      "content_block_items",
      ["id", "block_id", "title", "description", "icon", "media_id", "link_label", "link_href", "sort_order"],
      blockItemRows,
    ),
  );

  statements.push(
    insert(
      "legal_pages",
      ["slug", "title", "intro", "sections", "meta_description", "updated_at"],
      pack.legalPages.map((page) => [
        literal(page.slug), literal(page.title), literal(page.intro),
        jsonLiteral(page.sections.map((section) => ({ heading: section.heading, body_md: section.bodyMd }))),
        literal(page.metaDescription), literal(page.updatedAt),
      ]),
    ),
  );

  statements.push("commit;\n");
  return statements.join("\n");
}
