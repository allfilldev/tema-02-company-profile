import type {
  AdminCollectionRepository,
  AdminCollections,
  ArticleAdminRepository,
  MediaAdminRepository,
  MessageAdminRepository,
  MoveDirection,
  SettingsAdminRepository,
} from "@/core/domain/admin/admin-repositories";
import type { AdminModule } from "@/core/domain/admin/records";
import type { AdminClient } from "@/infrastructure/supabase/admin-client";
import {
  articleInputToRow,
  partnerInputToRow,
  portfolioInputToRow,
  serviceInputToRow,
  settingsToRow,
  statInputToRow,
  teamMemberInputToRow,
  testimonialInputToRow,
  toArticleRecord,
  toContactMessage,
  toMediaRecord,
  toPartnerRecord,
  toPortfolioRecord,
  toServiceRecord,
  toStatRecord,
  toTeamMemberRecord,
  toTestimonialRecord,
  type AdminArticleRow,
  type AdminMediaRow,
  type AdminMessageRow,
  type AdminPartnerRow,
  type AdminPortfolioRow,
  type AdminServiceRow,
  type AdminStatRow,
  type AdminTeamRow,
  type AdminTestimonialRow,
} from "@/infrastructure/supabase/admin-mappers";
import type { MediaMap } from "@/infrastructure/supabase/mappers";
import { toSiteSettings } from "@/infrastructure/supabase/mappers";
import { execute, loadMedia } from "@/infrastructure/supabase/public-repositories";
import type { SiteSettingsRow } from "@/infrastructure/supabase/rows";

const SERVICE_COLUMNS = "id,slug,title,summary,body_md,cover_media_id,meta_title,meta_description,faq,sort_order,is_published,updated_at";
const PORTFOLIO_COLUMNS =
  "id,slug,title,client_name,category,summary,body_md,cover_media_id,gallery_media_ids,completed_on,meta_title,meta_description,sort_order,is_published,updated_at";
const TEAM_COLUMNS = "id,name,job_title,bio,photo_media_id,years_experience,profiles,sort_order,is_published,updated_at";
const STAT_COLUMNS = "id,key,label,value,suffix,sort_order,updated_at";
const TESTIMONIAL_COLUMNS = "id,name,job_title,company,quote,photo_media_id,sort_order,is_published,updated_at";
const PARTNER_COLUMNS = "id,name,logo_media_id,url,sort_order,is_published,updated_at";
const ARTICLE_COLUMNS =
  "id,slug,title,meta_title,meta_description,lead,body_md,cover_media_id,author_id,faq,status,published_at,updated_at";
const MEDIA_COLUMNS = "id,storage_path,url,alt,width,height,size_bytes,created_at";
const MESSAGE_COLUMNS = "id,name,email,phone,message,is_read,created_at";
const SETTINGS_COLUMNS =
  "site_name,tagline,logo_media_id,default_og_media_id,email,phone,whatsapp_number,whatsapp_message,address_street,address_city,address_region,postal_code,address_country,maps_embed_url,opening_hours,social_links,schema_type,founded_year,google_site_verification,ga_measurement_id,updated_at";

type CollectionConfig<Row, Rec, Input> = {
  table: string;
  columns: string;
  order: { column: string; ascending: boolean };
  hasSortOrder: boolean;
  newRowDefaults: Record<string, unknown>;
  publishPatch(published: boolean): Record<string, unknown>;
  toRecord(row: Row, media: MediaMap): Rec;
  toRow(input: Input): Record<string, unknown>;
};

function createCollection<Row extends object, Rec, Input>(
  client: AdminClient,
  config: CollectionConfig<Row, Rec, Input>,
) {
  const { table, columns } = config;

  async function toRecords(rows: Row[]): Promise<Rec[]> {
    const media = await loadMedia(client, rows as unknown as Record<string, unknown>[]);
    return rows.map((row) => config.toRecord(row, media));
  }

  async function toOne(row: Row): Promise<Rec> {
    return (await toRecords([row]))[0];
  }

  async function nextSortOrder(): Promise<number> {
    const { data } = await execute(
      client.from(table).select("sort_order").order("sort_order", { ascending: false }).range(0, 0),
      table,
    );
    const top = (data as { sort_order: number }[] | null)?.[0]?.sort_order ?? 0;
    return top + 1;
  }

  async function writeOne(query: PromiseLike<{ data: unknown; error: { message: string } | null }>): Promise<Rec> {
    const { data } = await execute(query, table);
    return toOne(data as Row);
  }

  return {
    async list(): Promise<Rec[]> {
      const { data } = await execute(
        client.from(table).select(columns).order(config.order.column, { ascending: config.order.ascending }),
        table,
      );
      return toRecords((data ?? []) as Row[]);
    },
    async findById(id: string): Promise<Rec | null> {
      const { data } = await execute(client.from(table).select(columns).eq("id", id).maybeSingle(), table);
      return data ? toOne(data as Row) : null;
    },
    async create(input: Input): Promise<Rec> {
      const sortOrder = config.hasSortOrder ? { sort_order: await nextSortOrder() } : {};
      const row = { ...config.toRow(input), ...config.newRowDefaults, ...sortOrder };
      return writeOne(client.from(table).insert(row).select(columns).single());
    },
    async update(id: string, input: Input): Promise<Rec> {
      return writeOne(client.from(table).update(config.toRow(input)).eq("id", id).select(columns).single());
    },
    async remove(id: string): Promise<void> {
      await execute(client.from(table).delete().eq("id", id), table);
    },
    async setPublished(id: string, published: boolean): Promise<Rec> {
      return writeOne(client.from(table).update(config.publishPatch(published)).eq("id", id).select(columns).single());
    },
    async move(id: string, direction: MoveDirection): Promise<void> {
      await execute(client.rpc("move_sort_order", { p_table: table, p_id: id, p_direction: direction }), "move_sort_order");
    },
  };
}

const flagPatch = (published: boolean) => ({ is_published: published });
const flagDefaults = { is_published: false };

function buildCollections(client: AdminClient): AdminCollections {
  const bySortOrder = { column: "sort_order", ascending: true };

  const services = createCollection(client, {
    table: "services", columns: SERVICE_COLUMNS, order: bySortOrder, hasSortOrder: true, newRowDefaults: flagDefaults,
    publishPatch: flagPatch, toRecord: (row: AdminServiceRow, media) => toServiceRecord(row, media), toRow: serviceInputToRow,
  });
  const portfolio = createCollection(client, {
    table: "portfolio_items", columns: PORTFOLIO_COLUMNS, order: bySortOrder, hasSortOrder: true, newRowDefaults: flagDefaults,
    publishPatch: flagPatch, toRecord: (row: AdminPortfolioRow, media) => toPortfolioRecord(row, media), toRow: portfolioInputToRow,
  });
  const team = createCollection(client, {
    table: "team_members", columns: TEAM_COLUMNS, order: bySortOrder, hasSortOrder: true, newRowDefaults: flagDefaults,
    publishPatch: flagPatch, toRecord: (row: AdminTeamRow, media) => toTeamMemberRecord(row, media), toRow: teamMemberInputToRow,
  });
  const stats = createCollection(client, {
    table: "stats", columns: STAT_COLUMNS, order: bySortOrder, hasSortOrder: true, newRowDefaults: {},
    publishPatch: () => ({}), toRecord: (row: AdminStatRow) => toStatRecord(row), toRow: statInputToRow,
  });
  const testimonials = createCollection(client, {
    table: "testimonials", columns: TESTIMONIAL_COLUMNS, order: bySortOrder, hasSortOrder: true, newRowDefaults: flagDefaults,
    publishPatch: flagPatch, toRecord: (row: AdminTestimonialRow, media) => toTestimonialRecord(row, media), toRow: testimonialInputToRow,
  });
  const partners = createCollection(client, {
    table: "partners", columns: PARTNER_COLUMNS, order: bySortOrder, hasSortOrder: true, newRowDefaults: flagDefaults,
    publishPatch: flagPatch, toRecord: (row: AdminPartnerRow, media) => toPartnerRecord(row, media), toRow: partnerInputToRow,
  });
  const articles = createCollection(client, {
    table: "articles", columns: ARTICLE_COLUMNS, order: { column: "updated_at", ascending: false }, hasSortOrder: false,
    newRowDefaults: { status: "draft" }, publishPatch: (published) => ({ status: published ? "published" : "draft" }),
    toRecord: (row: AdminArticleRow, media) => toArticleRecord(row, media), toRow: articleInputToRow,
  });

  return { services, portfolio, team, stats, testimonials, partners, articles } as unknown as {
    [Module in AdminModule]: AdminCollectionRepository<Module>;
  };
}

export type SupabaseAdminRepositories = {
  collections: AdminCollections;
  articleAuthors: ArticleAdminRepository;
  media: MediaAdminRepository;
  messages: MessageAdminRepository;
  settings: SettingsAdminRepository;
};

export function createSupabaseAdminRepositories(client: AdminClient): SupabaseAdminRepositories {
  async function countArticles(authorId: string, publishedOnly: boolean): Promise<number> {
    const base = client.from("articles").select("id", { count: "exact" }).eq("author_id", authorId);
    const { count } = await execute(publishedOnly ? base.eq("status", "published") : base, "articles");
    return count ?? 0;
  }

  return {
    collections: buildCollections(client),
    articleAuthors: {
      async countByAuthor(teamMemberId) {
        const [all, published] = await Promise.all([countArticles(teamMemberId, false), countArticles(teamMemberId, true)]);
        return { all, published };
      },
    },
    media: {
      async list() {
        const { data } = await execute(client.from("media").select(MEDIA_COLUMNS).order("created_at", { ascending: false }), "media");
        return ((data ?? []) as AdminMediaRow[]).map(toMediaRecord);
      },
      async findById(id) {
        const { data } = await execute(client.from("media").select(MEDIA_COLUMNS).eq("id", id).maybeSingle(), "media");
        return data ? toMediaRecord(data as AdminMediaRow) : null;
      },
      async create(record) {
        const { data } = await execute(
          client
            .from("media")
            .insert({
              storage_path: record.storagePath,
              public_path: null,
              url: record.url,
              alt: record.alt,
              width: record.width,
              height: record.height,
              size_bytes: record.sizeBytes,
            })
            .select(MEDIA_COLUMNS)
            .single(),
          "media",
        );
        return toMediaRecord(data as AdminMediaRow);
      },
      async updateAlt(id, alt) {
        const { data } = await execute(client.from("media").update({ alt }).eq("id", id).select(MEDIA_COLUMNS).single(), "media");
        return toMediaRecord(data as AdminMediaRow);
      },
      async remove(id) {
        await execute(client.from("media").delete().eq("id", id), "media");
      },
      async findUsages(id) {
        const { data } = await execute(client.rpc("media_usages", { p_media_id: id }), "media_usages");
        return ((data ?? []) as { label: string }[]).map((usage) => usage.label);
      },
    },
    messages: {
      async list() {
        const { data } = await execute(
          client.from("contact_messages").select(MESSAGE_COLUMNS).order("created_at", { ascending: false }),
          "contact_messages",
        );
        return ((data ?? []) as AdminMessageRow[]).map(toContactMessage);
      },
      async markRead(id) {
        await execute(client.from("contact_messages").update({ is_read: true }).eq("id", id), "contact_messages");
      },
      async remove(id) {
        await execute(client.from("contact_messages").delete().eq("id", id), "contact_messages");
      },
      async countUnread() {
        const { count } = await execute(
          client.from("contact_messages").select("id", { count: "exact" }).eq("is_read", false),
          "contact_messages",
        );
        return count ?? 0;
      },
    },
    settings: {
      async get() {
        const { data } = await execute(client.from("site_settings").select(SETTINGS_COLUMNS).single(), "site_settings");
        const row = data as SiteSettingsRow;
        return toSiteSettings(row, await loadMedia(client, [row as unknown as Record<string, unknown>]));
      },
      async update(settings) {
        const { data } = await execute(
          client.from("site_settings").update(settingsToRow(settings)).eq("id", true).select(SETTINGS_COLUMNS).single(),
          "site_settings",
        );
        const row = data as SiteSettingsRow;
        return toSiteSettings(row, await loadMedia(client, [row as unknown as Record<string, unknown>]));
      },
    },
  };
}
