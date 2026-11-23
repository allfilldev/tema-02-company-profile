import { describe, expect, it } from "vitest";
import { generalPack } from "@/content/packs/general";
import {
  createSupabaseRepositories,
  fetchRouteCatalog,
  type DataClient,
  type QueryBuilder,
  type QueryResult,
} from "@/infrastructure/supabase/public-repositories";

type Call = {
  table: string;
  columns: string;
  options?: { count?: "exact" };
  filters: [string, unknown][];
  ins: [string, readonly unknown[]][];
  order: [string, boolean][];
  range: [number, number] | null;
  single: "single" | "maybe" | null;
};

type Respond = (call: Call) => QueryResult;

function createFakeClient(respond: Respond, rpcResult?: QueryResult) {
  const calls: Call[] = [];
  const rpcCalls: { name: string; args: unknown }[] = [];

  function builder(call: Call): QueryBuilder {
    const self: QueryBuilder = {
      eq(column, value) {
        call.filters.push([column, value]);
        return self;
      },
      in(column, values) {
        call.ins.push([column, values]);
        return self;
      },
      order(column, options) {
        call.order.push([column, options?.ascending ?? true]);
        return self;
      },
      range(from, to) {
        call.range = [from, to];
        return self;
      },
      single() {
        call.single = "single";
        return self;
      },
      maybeSingle() {
        call.single = "maybe";
        return self;
      },
      then(onfulfilled, onrejected) {
        return Promise.resolve(respond(call)).then(onfulfilled, onrejected);
      },
    };
    return self;
  }

  const client: DataClient = {
    from(table) {
      return {
        select(columns, options) {
          const call: Call = { table, columns, options, filters: [], ins: [], order: [], range: null, single: null };
          calls.push(call);
          return builder(call);
        },
      };
    },
    rpc(name, args) {
      rpcCalls.push({ name, args });
      return Promise.resolve(rpcResult ?? { data: null, error: null });
    },
  };

  return { client, calls, rpcCalls };
}

const ok = (data: unknown, count: number | null = null): QueryResult => ({ data, error: null, count });

const sampleService = generalPack.services[0];
const serviceRow = {
  id: sampleService.id,
  slug: sampleService.slug,
  title: sampleService.title,
  summary: sampleService.summary,
  body_md: sampleService.bodyMd,
  cover_media_id: sampleService.cover!.id,
  meta_title: sampleService.metaTitle,
  meta_description: sampleService.metaDescription,
  faq: sampleService.faq,
  sort_order: sampleService.sortOrder,
  updated_at: sampleService.updatedAt,
};
const coverRow = { id: sampleService.cover!.id, url: sampleService.cover!.url, alt: sampleService.cover!.alt, width: sampleService.cover!.width, height: sampleService.cover!.height };

describe("services repository", () => {
  it("lists published services by sort order and loads their media in one query", async () => {
    const { client, calls } = createFakeClient((call) => (call.table === "services" ? ok([serviceRow]) : ok([coverRow])));

    const services = await createSupabaseRepositories(client).services.listPublished();

    expect(services).toEqual([sampleService]);
    expect(calls[0]).toMatchObject({ table: "services", filters: [["is_published", true]], order: [["sort_order", true]] });
    expect(calls).toHaveLength(2);
    expect(calls[1]).toMatchObject({ table: "media", ins: [["id", [coverRow.id]]] });
  });

  it("skips the media query when no row references media", async () => {
    const { client, calls } = createFakeClient(() => ok([{ ...serviceRow, cover_media_id: null }]));

    await createSupabaseRepositories(client).services.listPublished();

    expect(calls.map((call) => call.table)).toEqual(["services"]);
  });

  it("finds a published service by slug and returns null for an unknown slug", async () => {
    const found = createFakeClient((call) => (call.table === "services" ? ok(serviceRow) : ok([coverRow])));
    const missing = createFakeClient(() => ok(null));

    expect(await createSupabaseRepositories(found.client).services.findPublishedBySlug(sampleService.slug)).toEqual(sampleService);
    expect(found.calls[0]).toMatchObject({
      filters: [["slug", sampleService.slug], ["is_published", true]],
      single: "maybe",
    });
    expect(await createSupabaseRepositories(missing.client).services.findPublishedBySlug("nope")).toBeNull();
  });

  it("throws the supabase message when a query fails", async () => {
    const { client } = createFakeClient(() => ({ data: null, error: { message: "boom" } }));

    await expect(createSupabaseRepositories(client).services.listPublished()).rejects.toThrow(/services.*boom/);
  });
});

describe("articles repository", () => {
  const sampleArticle = { ...generalPack.articles[0], cover: null };
  const articleRow = {
    id: sampleArticle.id,
    slug: sampleArticle.slug,
    title: sampleArticle.title,
    meta_title: sampleArticle.metaTitle,
    meta_description: sampleArticle.metaDescription,
    lead: sampleArticle.lead,
    body_md: sampleArticle.bodyMd,
    cover_media_id: null,
    author_id: sampleArticle.authorId,
    faq: sampleArticle.faq,
    published_at: sampleArticle.publishedAt,
    updated_at: sampleArticle.updatedAt,
  };

  it("pages published articles newest first with an exact total", async () => {
    const { client, calls } = createFakeClient(() => ok([articleRow], 23));

    const page = await createSupabaseRepositories(client).articles.listPublished({ offset: 9, limit: 9 });

    expect(page).toEqual({ items: [sampleArticle], total: 23 });
    expect(calls[0]).toMatchObject({
      table: "articles",
      options: { count: "exact" },
      filters: [["status", "published"]],
      order: [["published_at", false]],
      range: [9, 17],
    });
  });

  it("returns an empty page when the requested range is past the last article", async () => {
    const { client } = createFakeClient(() => ({
      data: null,
      error: { message: "Requested range not satisfiable", code: "PGRST103" },
      count: null,
    }));

    const page = await createSupabaseRepositories(client).articles.listPublished({ offset: 9, limit: 9 });

    expect(page).toEqual({ items: [], total: 0 });
  });

  it("still throws on other article query errors", async () => {
    const { client } = createFakeClient(() => ({ data: null, error: { message: "boom", code: "42501" }, count: null }));

    await expect(createSupabaseRepositories(client).articles.listPublished({ offset: 0, limit: 9 })).rejects.toThrow(
      /articles.*boom/,
    );
  });

  it("lists every published article newest first", async () => {
    const { client, calls } = createFakeClient(() => ok([articleRow]));

    expect(await createSupabaseRepositories(client).articles.listAllPublished()).toEqual([sampleArticle]);
    expect(calls[0]).toMatchObject({ filters: [["status", "published"]], order: [["published_at", false]], range: null });
  });

  it("finds a published article by slug", async () => {
    const { client, calls } = createFakeClient(() => ok(articleRow));

    expect(await createSupabaseRepositories(client).articles.findPublishedBySlug(sampleArticle.slug)).toEqual(sampleArticle);
    expect(calls[0]).toMatchObject({ filters: [["slug", sampleArticle.slug], ["status", "published"]], single: "maybe" });
  });
});

describe("other repositories", () => {
  it("reads the settings singleton", async () => {
    const settings = generalPack.settings;
    const row = {
      site_name: settings.siteName,
      tagline: settings.tagline,
      logo_media_id: null,
      default_og_media_id: null,
      email: settings.email,
      phone: settings.phone,
      whatsapp_number: settings.whatsappNumber,
      whatsapp_message: settings.whatsappMessage,
      address_street: settings.address.street,
      address_city: settings.address.city,
      address_region: settings.address.region,
      postal_code: settings.address.postalCode,
      address_country: settings.address.country,
      maps_embed_url: null,
      opening_hours: settings.openingHours,
      social_links: [],
      schema_type: settings.schemaType,
      founded_year: settings.foundedYear,
      google_site_verification: null,
      ga_measurement_id: null,
      updated_at: settings.updatedAt,
    };
    const { client, calls } = createFakeClient(() => ok(row));

    expect(await createSupabaseRepositories(client).siteSettings.get()).toEqual(settings);
    expect(calls[0]).toMatchObject({ table: "site_settings", single: "single" });
  });

  it("lists stats by sort order without a publish filter", async () => {
    const stat = generalPack.stats[0];
    const { client, calls } = createFakeClient(() => ok([{ key: stat.key, label: stat.label, value: stat.value, suffix: stat.suffix, sort_order: stat.sortOrder }]));

    expect(await createSupabaseRepositories(client).stats.list()).toEqual([stat]);
    expect(calls[0]).toMatchObject({ table: "stats", filters: [], order: [["sort_order", true]] });
  });

  it("finds a published team member by id", async () => {
    const member = generalPack.team[0];
    const row = {
      id: member.id,
      name: member.name,
      job_title: member.jobTitle,
      bio: member.bio,
      photo_media_id: null,
      years_experience: member.yearsExperience,
      profiles: member.profiles,
      sort_order: member.sortOrder,
    };
    const { client, calls } = createFakeClient(() => ok(row));

    expect(await createSupabaseRepositories(client).team.findById(member.id)).toEqual({ ...member, photo: null });
    expect(calls[0]).toMatchObject({ table: "team_members", filters: [["id", member.id], ["is_published", true]], single: "maybe" });
  });

  it("assembles vision from three tables", async () => {
    const vision = generalPack.vision;
    const { client, calls } = createFakeClient((call) => {
      if (call.table === "company_vision") return ok({ vision: vision.vision });
      if (call.table === "mission_items") return ok(vision.missions.map((content, index) => ({ content, sort_order: index })));
      return ok(vision.values.map((value, index) => ({ ...value, sort_order: index })));
    });

    expect(await createSupabaseRepositories(client).pageContent.getVision()).toEqual(vision);
    expect(calls.map((call) => call.table).sort()).toEqual(["company_values", "company_vision", "mission_items"]);
  });

  it("finds a published content block with its items", async () => {
    const block = generalPack.contentBlocks[0];
    const { client, calls } = createFakeClient((call) => {
      if (call.table === "content_blocks") {
        return ok({ id: "b1", block_key: block.key, eyebrow: block.eyebrow, title: block.title, description: block.description });
      }
      return ok(
        block.items.map((item, index) => ({
          id: `i${index}`,
          block_id: "b1",
          title: item.title,
          description: item.description,
          icon: item.icon,
          media_id: null,
          link_label: item.link?.label ?? null,
          link_href: item.link?.href ?? null,
          sort_order: index,
        })),
      );
    });

    expect(await createSupabaseRepositories(client).contentBlocks.findPublishedByKey(block.key)).toEqual(block);
    expect(calls[0]).toMatchObject({ table: "content_blocks", filters: [["block_key", block.key], ["is_published", true]], single: "maybe" });
    expect(calls[1]).toMatchObject({ table: "content_block_items", filters: [["block_id", "b1"]], order: [["sort_order", true]] });
  });

  it("returns null for a missing content block, legal page, and section intro", async () => {
    const { client } = createFakeClient(() => ok(null));
    const repositories = createSupabaseRepositories(client);

    expect(await repositories.contentBlocks.findPublishedByKey("x")).toBeNull();
    expect(await repositories.pageContent.findLegalPage("privasi")).toBeNull();
    expect(await repositories.pageContent.findSectionIntro("services")).toBeNull();
  });
});

describe("fetchRouteCatalog", () => {
  it("maps the rpc result", async () => {
    const { client, rpcCalls } = createFakeClient(
      () => ok(null),
      ok({ services: ["a"], portfolio: [], articles: ["x", "y"], articleCount: 2 }),
    );

    expect(await fetchRouteCatalog(client)).toEqual({ services: ["a"], portfolio: [], articles: ["x", "y"], articleCount: 2 });
    expect(rpcCalls[0].name).toBe("site_route_catalog");
  });

  it("rejects a malformed rpc result", async () => {
    const { client } = createFakeClient(() => ok(null), ok({ services: "nope" }));

    await expect(fetchRouteCatalog(client)).rejects.toThrow(/route catalog/);
  });
});

describe("media repository", () => {
  it("lists every media row as an asset with its url and dimensions", async () => {
    const { client, calls } = createFakeClient(() =>
      ok([
        { id: "m1", url: "https://files.example/a.webp", alt: "A", width: 1920, height: 1280 },
        { id: "m2", url: "/demo/general/b.webp", alt: "B", width: 600, height: 160 },
      ]),
    );

    const media = await createSupabaseRepositories(client).media.listAll();

    expect(calls[0].table).toBe("media");
    expect(calls[0].columns).toBe("id,url,alt,width,height");
    expect(media).toEqual([
      { id: "m1", url: "https://files.example/a.webp", alt: "A", width: 1920, height: 1280 },
      { id: "m2", url: "/demo/general/b.webp", alt: "B", width: 600, height: 160 },
    ]);
  });
});

