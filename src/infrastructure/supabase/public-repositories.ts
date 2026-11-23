import type { Repositories } from "@/core/domain/repositories";
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
  CompanyValueRow,
  CompanyVisionRow,
  ContentBlockItemRow,
  ContentBlockRow,
  HomeContentRow,
  LegalPageRow,
  MediaRow,
  MissionItemRow,
  PartnerRow,
  PortfolioRow,
  SectionIntroRow,
  ServiceRow,
  SiteSettingsRow,
  StatRow,
  TeamMemberRow,
  TestimonialRow,
} from "@/infrastructure/supabase/rows";

export type QueryResult = {
  data: unknown;
  error: { message: string; code?: string } | null;
  count?: number | null;
};

export interface QueryBuilder extends PromiseLike<QueryResult> {
  eq(column: string, value: unknown): QueryBuilder;
  in(column: string, values: readonly unknown[]): QueryBuilder;
  order(column: string, options?: { ascending?: boolean }): QueryBuilder;
  range(from: number, to: number): QueryBuilder;
  single(): QueryBuilder;
  maybeSingle(): QueryBuilder;
}

export interface DataClient {
  from(table: string): { select(columns: string, options?: { count?: "exact" }): QueryBuilder };
  rpc(name: string, args?: Record<string, unknown>): PromiseLike<QueryResult>;
}

export type RouteCatalogData = {
  services: string[];
  portfolio: string[];
  articles: string[];
  articleCount: number;
};

const MEDIA_COLUMNS = "id,url,alt,width,height";
const SETTINGS_COLUMNS =
  "site_name,tagline,logo_media_id,default_og_media_id,email,phone,whatsapp_number,whatsapp_message,address_street,address_city,address_region,postal_code,address_country,maps_embed_url,opening_hours,social_links,schema_type,founded_year,google_site_verification,ga_measurement_id,updated_at";
const HOME_COLUMNS =
  "hero_eyebrow,meta_title,meta_description,hero_title,hero_subtitle,hero_media_id,hero_primary_cta_label,hero_primary_cta_href,hero_secondary_cta_label,hero_secondary_cta_href,updated_at";
const SECTION_INTRO_COLUMNS = "section_key,eyebrow,title,description,meta_title,meta_description";
const ABOUT_COLUMNS = "summary,body_md,media_id,meta_title,meta_description,updated_at";
const LEGAL_COLUMNS = "slug,title,intro,sections,meta_description,updated_at";
const SERVICE_COLUMNS = "id,slug,title,summary,body_md,cover_media_id,meta_title,meta_description,faq,sort_order,updated_at";
const PORTFOLIO_COLUMNS =
  "id,slug,title,client_name,category,summary,body_md,cover_media_id,gallery_media_ids,completed_on,meta_title,meta_description,sort_order,updated_at";
const TEAM_COLUMNS = "id,name,job_title,bio,photo_media_id,years_experience,profiles,sort_order";
const STAT_COLUMNS = "key,label,value,suffix,sort_order";
const TESTIMONIAL_COLUMNS = "id,name,job_title,company,quote,photo_media_id,sort_order";
const PARTNER_COLUMNS = "id,name,logo_media_id,url,sort_order";
const ARTICLE_COLUMNS =
  "id,slug,title,meta_title,meta_description,lead,body_md,cover_media_id,author_id,faq,published_at,updated_at";
const BLOCK_COLUMNS = "id,block_key,eyebrow,title,description";
const BLOCK_ITEM_COLUMNS = "id,block_id,title,description,icon,media_id,link_label,link_href,sort_order";

export async function execute(query: PromiseLike<QueryResult>, label: string): Promise<QueryResult> {
  const result = await query;
  if (result.error) {
    throw new Error(`Supabase ${label}: ${result.error.message}`);
  }
  return result;
}

const RANGE_NOT_SATISFIABLE_CODE = "PGRST103";

async function executePage(query: PromiseLike<QueryResult>, label: string): Promise<QueryResult> {
  const result = await query;
  if (result.error?.code === RANGE_NOT_SATISFIABLE_CODE) {
    return { data: [], error: null, count: 0 };
  }
  return execute(Promise.resolve(result), label);
}

async function selectRows<Row>(
  client: DataClient,
  table: string,
  columns: string,
  apply: (query: QueryBuilder) => QueryBuilder = (query) => query,
): Promise<Row[]> {
  const { data } = await execute(apply(client.from(table).select(columns)), table);
  return (data ?? []) as Row[];
}

async function selectOne<Row>(
  client: DataClient,
  table: string,
  columns: string,
  apply: (query: QueryBuilder) => QueryBuilder,
): Promise<Row | null> {
  const { data } = await execute(apply(client.from(table).select(columns)), table);
  return (data ?? null) as Row | null;
}

export async function loadMedia(client: DataClient, rows: readonly Record<string, unknown>[]): Promise<MediaMap> {
  const ids = collectMediaIds(rows);
  if (ids.length === 0) {
    return new Map();
  }
  const mediaRows = await selectRows<MediaRow>(client, "media", MEDIA_COLUMNS, (query) => query.in("id", ids));
  return new Map(mediaRows.map((row) => [row.id, toMediaAsset(row)]));
}

function asRecords(rows: readonly object[]): Record<string, unknown>[] {
  return rows as Record<string, unknown>[];
}

function bySortOrder(query: QueryBuilder): QueryBuilder {
  return query.order("sort_order", { ascending: true });
}

function newestFirst(query: QueryBuilder): QueryBuilder {
  return query.eq("status", "published").order("published_at", { ascending: false });
}

export function createSupabaseRepositories(client: DataClient): Repositories {
  return {
    siteSettings: {
      async get() {
        const row = await selectOne<SiteSettingsRow>(client, "site_settings", SETTINGS_COLUMNS, (query) => query.single());
        if (!row) {
          throw new Error("Supabase site_settings: no settings row exists");
        }
        return toSiteSettings(row, await loadMedia(client, asRecords([row])));
      },
    },
    pageContent: {
      async getHome() {
        const row = await selectOne<HomeContentRow>(client, "home_content", HOME_COLUMNS, (query) => query.single());
        if (!row) {
          throw new Error("Supabase home_content: no home row exists");
        }
        return toHomeContent(row, await loadMedia(client, asRecords([row])));
      },
      async getAbout() {
        const row = await selectOne<AboutContentRow>(client, "about_content", ABOUT_COLUMNS, (query) => query.single());
        if (!row) {
          throw new Error("Supabase about_content: no about row exists");
        }
        return toAboutContent(row, await loadMedia(client, asRecords([row])));
      },
      async getVision() {
        const [vision, missions, values] = await Promise.all([
          selectOne<CompanyVisionRow>(client, "company_vision", "vision", (query) => query.single()),
          selectRows<MissionItemRow>(client, "mission_items", "content,sort_order", bySortOrder),
          selectRows<CompanyValueRow>(client, "company_values", "title,description,sort_order", bySortOrder),
        ]);
        if (!vision) {
          throw new Error("Supabase company_vision: no vision row exists");
        }
        return toCompanyVision(vision, missions, values);
      },
      async findSectionIntro(key) {
        const row = await selectOne<SectionIntroRow>(client, "section_intros", SECTION_INTRO_COLUMNS, (query) =>
          query.eq("section_key", key).maybeSingle(),
        );
        return row ? toSectionIntro(row) : null;
      },
      async findLegalPage(slug) {
        const row = await selectOne<LegalPageRow>(client, "legal_pages", LEGAL_COLUMNS, (query) =>
          query.eq("slug", slug).maybeSingle(),
        );
        return row ? toLegalPage(row) : null;
      },
    },
    services: {
      async listPublished() {
        const rows = await selectRows<ServiceRow>(client, "services", SERVICE_COLUMNS, (query) =>
          bySortOrder(query.eq("is_published", true)),
        );
        const media = await loadMedia(client, asRecords(rows));
        return rows.map((row) => toService(row, media));
      },
      async findPublishedBySlug(slug) {
        const row = await selectOne<ServiceRow>(client, "services", SERVICE_COLUMNS, (query) =>
          query.eq("slug", slug).eq("is_published", true).maybeSingle(),
        );
        return row ? toService(row, await loadMedia(client, asRecords([row]))) : null;
      },
    },
    portfolio: {
      async listPublished() {
        const rows = await selectRows<PortfolioRow>(client, "portfolio_items", PORTFOLIO_COLUMNS, (query) =>
          bySortOrder(query.eq("is_published", true)),
        );
        const media = await loadMedia(client, asRecords(rows));
        return rows.map((row) => toPortfolioItem(row, media));
      },
      async findPublishedBySlug(slug) {
        const row = await selectOne<PortfolioRow>(client, "portfolio_items", PORTFOLIO_COLUMNS, (query) =>
          query.eq("slug", slug).eq("is_published", true).maybeSingle(),
        );
        return row ? toPortfolioItem(row, await loadMedia(client, asRecords([row]))) : null;
      },
    },
    team: {
      async listPublished() {
        const rows = await selectRows<TeamMemberRow>(client, "team_members", TEAM_COLUMNS, (query) =>
          bySortOrder(query.eq("is_published", true)),
        );
        const media = await loadMedia(client, asRecords(rows));
        return rows.map((row) => toTeamMember(row, media));
      },
      async findById(id) {
        const row = await selectOne<TeamMemberRow>(client, "team_members", TEAM_COLUMNS, (query) =>
          query.eq("id", id).eq("is_published", true).maybeSingle(),
        );
        return row ? toTeamMember(row, await loadMedia(client, asRecords([row]))) : null;
      },
    },
    stats: {
      async list() {
        const rows = await selectRows<StatRow>(client, "stats", STAT_COLUMNS, bySortOrder);
        return rows.map(toStat);
      },
    },
    testimonials: {
      async listPublished() {
        const rows = await selectRows<TestimonialRow>(client, "testimonials", TESTIMONIAL_COLUMNS, (query) =>
          bySortOrder(query.eq("is_published", true)),
        );
        const media = await loadMedia(client, asRecords(rows));
        return rows.map((row) => toTestimonial(row, media));
      },
    },
    partners: {
      async listPublished() {
        const rows = await selectRows<PartnerRow>(client, "partners", PARTNER_COLUMNS, (query) =>
          bySortOrder(query.eq("is_published", true)),
        );
        const media = await loadMedia(client, asRecords(rows));
        return rows.map((row) => toPartner(row, media));
      },
    },
    media: {
      async listAll() {
        const rows = await selectRows<MediaRow>(client, "media", MEDIA_COLUMNS, (query) => query);
        return rows.map(toMediaAsset);
      },
    },
    articles: {
      async listPublished({ offset, limit }) {
        const { data, count } = await executePage(
          newestFirst(client.from("articles").select(ARTICLE_COLUMNS, { count: "exact" })).range(offset, offset + limit - 1),
          "articles",
        );
        const rows = (data ?? []) as ArticleRow[];
        const media = await loadMedia(client, asRecords(rows));
        return { items: rows.map((row) => toArticle(row, media)), total: count ?? 0 };
      },
      async listAllPublished() {
        const rows = await selectRows<ArticleRow>(client, "articles", ARTICLE_COLUMNS, newestFirst);
        const media = await loadMedia(client, asRecords(rows));
        return rows.map((row) => toArticle(row, media));
      },
      async findPublishedBySlug(slug) {
        const row = await selectOne<ArticleRow>(client, "articles", ARTICLE_COLUMNS, (query) =>
          query.eq("slug", slug).eq("status", "published").maybeSingle(),
        );
        return row ? toArticle(row, await loadMedia(client, asRecords([row]))) : null;
      },
    },
    contentBlocks: {
      async findPublishedByKey(key) {
        const block = await selectOne<ContentBlockRow>(client, "content_blocks", BLOCK_COLUMNS, (query) =>
          query.eq("block_key", key).eq("is_published", true).maybeSingle(),
        );
        if (!block) {
          return null;
        }
        const items = await selectRows<ContentBlockItemRow>(client, "content_block_items", BLOCK_ITEM_COLUMNS, (query) =>
          bySortOrder(query.eq("block_id", block.id)),
        );
        return toContentBlock(block, items, await loadMedia(client, asRecords(items)));
      },
    },
  };
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export async function fetchRouteCatalog(client: DataClient): Promise<RouteCatalogData> {
  const { data } = await execute(client.rpc("site_route_catalog"), "site_route_catalog");
  const catalog = data as Partial<RouteCatalogData> | null;

  if (
    !catalog ||
    !isStringArray(catalog.services) ||
    !isStringArray(catalog.portfolio) ||
    !isStringArray(catalog.articles) ||
    typeof catalog.articleCount !== "number"
  ) {
    throw new Error("Supabase returned a malformed route catalog");
  }

  return {
    services: catalog.services,
    portfolio: catalog.portfolio,
    articles: catalog.articles,
    articleCount: catalog.articleCount,
  };
}
