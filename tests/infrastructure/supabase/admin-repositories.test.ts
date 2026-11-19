import { describe, expect, it } from "vitest";
import { generalPack } from "@/content/packs/general";
import type { ServiceInput } from "@/core/domain/admin/records";
import type { AdminClient, AdminQuery } from "@/infrastructure/supabase/admin-client";
import { createSupabaseAdminRepositories } from "@/infrastructure/supabase/admin-repositories";
import type { QueryResult } from "@/infrastructure/supabase/public-repositories";

type Call = {
  table: string;
  op: "select" | "insert" | "update" | "delete";
  columns?: string;
  options?: { count?: "exact" };
  payload?: Record<string, unknown>;
  filters: [string, unknown][];
  ins: [string, readonly unknown[]][];
  order: [string, boolean][];
  range: [number, number] | null;
  single: "single" | "maybe" | null;
};

function createFakeAdminClient(respond: (call: Call) => QueryResult, rpcResult: QueryResult = { data: null, error: null }) {
  const calls: Call[] = [];
  const rpcCalls: { name: string; args: unknown }[] = [];

  function query(call: Call): AdminQuery {
    const self: AdminQuery = {
      eq(column, value) { call.filters.push([column, value]); return self; },
      in(column, values) { call.ins.push([column, values]); return self; },
      order(column, options) { call.order.push([column, options?.ascending ?? true]); return self; },
      range(from, to) { call.range = [from, to]; return self; },
      select(columns, options) { call.columns = columns; call.options = options; return self; },
      single() { call.single = "single"; return self; },
      maybeSingle() { call.single = "maybe"; return self; },
      then(onfulfilled, onrejected) { return Promise.resolve(respond(call)).then(onfulfilled, onrejected); },
    };
    return self;
  }

  function start(table: string, op: Call["op"], payload?: Record<string, unknown>, columns?: string, options?: { count?: "exact" }) {
    const call: Call = { table, op, columns, options, payload, filters: [], ins: [], order: [], range: null, single: null };
    calls.push(call);
    return query(call);
  }

  const client: AdminClient = {
    from: (table) => ({
      select: (columns, options) => start(table, "select", undefined, columns, options),
      insert: (values) => start(table, "insert", values as Record<string, unknown>),
      update: (values) => start(table, "update", values as Record<string, unknown>),
      delete: () => start(table, "delete"),
    }),
    rpc: (name, args) => {
      rpcCalls.push({ name, args });
      return Promise.resolve(rpcResult);
    },
  };

  return { client, calls, rpcCalls };
}

const ok = (data: unknown, count: number | null = null): QueryResult => ({ data, error: null, count });

const serviceInput: ServiceInput = {
  slug: "penyusunan-sop",
  title: "Penyusunan SOP",
  summary: null,
  bodyMd: "",
  cover: null,
  metaTitle: null,
  metaDescription: null,
  faq: [],
};

function storedService(overrides: Record<string, unknown> = {}) {
  return {
    id: "s1",
    slug: "penyusunan-sop",
    title: "Penyusunan SOP",
    summary: null,
    body_md: "",
    cover_media_id: null,
    meta_title: null,
    meta_description: null,
    faq: [],
    sort_order: 7,
    is_published: false,
    updated_at: "2026-11-20T03:00:00.000Z",
    ...overrides,
  };
}

describe("collection repositories", () => {
  it("lists every service including drafts, ordered by sort order", async () => {
    const { client, calls } = createFakeAdminClient(() => ok([storedService(), storedService({ id: "s2", is_published: true })]));

    const services = await createSupabaseAdminRepositories(client).collections.services.list();

    expect(services.map((service) => service.isPublished)).toEqual([false, true]);
    expect(calls[0]).toMatchObject({ table: "services", op: "select", filters: [], order: [["sort_order", true]] });
  });

  it("lists articles newest update first", async () => {
    const { client, calls } = createFakeAdminClient(() => ok([]));

    await createSupabaseAdminRepositories(client).collections.articles.list();

    expect(calls[0]).toMatchObject({ table: "articles", filters: [], order: [["updated_at", false]] });
  });

  it("creates a draft service at the end of the list", async () => {
    const { client, calls } = createFakeAdminClient((call) => {
      if (call.op === "select") return ok([{ sort_order: 6 }]);
      return ok(storedService());
    });

    const created = await createSupabaseAdminRepositories(client).collections.services.create(serviceInput);

    const insert = calls.find((call) => call.op === "insert")!;
    expect(calls[0]).toMatchObject({ table: "services", op: "select", columns: "sort_order", order: [["sort_order", false]], range: [0, 0] });
    expect(insert.payload).toMatchObject({ slug: "penyusunan-sop", sort_order: 7, is_published: false });
    expect(insert.single).toBe("single");
    expect(created.id).toBe("s1");
  });

  it("starts the order at 1 when the table is empty", async () => {
    const { client, calls } = createFakeAdminClient((call) => (call.op === "select" ? ok([]) : ok(storedService())));

    await createSupabaseAdminRepositories(client).collections.services.create(serviceInput);

    expect(calls.find((call) => call.op === "insert")!.payload).toMatchObject({ sort_order: 1 });
  });

  it("updates one row by id without touching order or status", async () => {
    const { client, calls } = createFakeAdminClient(() => ok(storedService({ title: "Baru" })));

    await createSupabaseAdminRepositories(client).collections.services.update("s1", { ...serviceInput, title: "Baru" });

    const update = calls[0];
    expect(update).toMatchObject({ op: "update", filters: [["id", "s1"]], single: "single" });
    expect(Object.keys(update.payload!)).not.toContain("sort_order");
    expect(Object.keys(update.payload!)).not.toContain("is_published");
  });

  it("publishes by flipping only the flag and deletes by id", async () => {
    const { client, calls } = createFakeAdminClient(() => ok(storedService({ is_published: true })));
    const services = createSupabaseAdminRepositories(client).collections.services;

    await services.setPublished("s1", true);
    await services.remove("s1");

    expect(calls[0].payload).toEqual({ is_published: true });
    expect(calls[1]).toMatchObject({ op: "delete", filters: [["id", "s1"]] });
  });

  it("moves through the database function with the table name", async () => {
    const { client, rpcCalls } = createFakeAdminClient(() => ok(null));

    await createSupabaseAdminRepositories(client).collections.portfolio.move("p1", "down");

    expect(rpcCalls).toEqual([{ name: "move_sort_order", args: { p_table: "portfolio_items", p_id: "p1", p_direction: "down" } }]);
  });

  it("never sends published_at when writing an article", async () => {
    const article = generalPack.articles[0];
    const row = {
      id: "a1", slug: article.slug, title: article.title, meta_title: null, meta_description: null, lead: null, body_md: "",
      cover_media_id: null, author_id: null, faq: [], status: "draft", published_at: null, updated_at: "2026-11-20T03:00:00.000Z",
    };
    const { client, calls } = createFakeAdminClient((call) => (call.op === "select" && call.columns === "id" ? ok([]) : ok(row)));
    const articles = createSupabaseAdminRepositories(client).collections.articles;
    const input = { slug: article.slug, title: article.title, metaTitle: null, metaDescription: null, lead: null, bodyMd: "", cover: null, authorId: null, faq: [] };

    await articles.create(input);
    await articles.update("a1", input);
    await articles.setPublished("a1", true);
    await articles.setPublished("a1", false);

    const written = calls.filter((call) => call.op === "insert" || call.op === "update");
    expect(written).toHaveLength(4);
    for (const call of written) {
      expect(Object.keys(call.payload!)).not.toContain("published_at");
    }
    expect(written[0].payload).toMatchObject({ status: "draft" });
    expect(written[2].payload).toEqual({ status: "published" });
    expect(written[3].payload).toEqual({ status: "draft" });
  });

  it("surfaces a database error with its message", async () => {
    const { client } = createFakeAdminClient(() => ({ data: null, error: { message: "duplicate key" } }));

    await expect(createSupabaseAdminRepositories(client).collections.services.remove("s1")).rejects.toThrow(/services.*duplicate key/);
  });
});

describe("articles by author", () => {
  it("counts all and published articles of a team member", async () => {
    const { client, calls } = createFakeAdminClient((call) => ok([], call.filters.some(([column]) => column === "status") ? 1 : 3));

    const counts = await createSupabaseAdminRepositories(client).articleAuthors.countByAuthor("t1");

    expect(counts).toEqual({ all: 3, published: 1 });
    expect(calls.map((call) => call.filters)).toEqual([[["author_id", "t1"]], [["author_id", "t1"], ["status", "published"]]]);
  });
});

describe("media, messages, and settings repositories", () => {
  it("creates a media row for an uploaded file and lists usages through the rpc", async () => {
    const row = { id: "m1", storage_path: "uploads/a.webp", url: "https://abc.supabase.co/storage/v1/object/public/media/uploads/a.webp", alt: "Alt", width: 800, height: 600, size_bytes: 40000, created_at: "2026-11-20T03:00:00.000Z" };
    const { client, calls, rpcCalls } = createFakeAdminClient(() => ok(row), { data: [{ source: "services", label: "Layanan: A" }], error: null });
    const media = createSupabaseAdminRepositories(client).media;

    const created = await media.create({ url: row.url, alt: "Alt", width: 800, height: 600, sizeBytes: 40000, storagePath: "uploads/a.webp" });
    const usages = await media.findUsages("m1");

    expect(calls[0].payload).toEqual({ storage_path: "uploads/a.webp", public_path: null, url: row.url, alt: "Alt", width: 800, height: 600, size_bytes: 40000 });
    expect(created.sizeBytes).toBe(40000);
    expect(rpcCalls[0]).toEqual({ name: "media_usages", args: { p_media_id: "m1" } });
    expect(usages).toEqual(["Layanan: A"]);
  });

  it("orders messages newest first, marks them read, and counts the unread", async () => {
    const { client, calls } = createFakeAdminClient((call) => (call.op === "select" && call.options?.count ? ok([], 4) : ok([])));
    const messages = createSupabaseAdminRepositories(client).messages;

    await messages.list();
    await messages.markRead("c1");
    const unread = await messages.countUnread();

    expect(calls[0]).toMatchObject({ table: "contact_messages", order: [["created_at", false]] });
    expect(calls[1]).toMatchObject({ op: "update", payload: { is_read: true }, filters: [["id", "c1"]] });
    expect(calls[2].filters).toEqual([["is_read", false]]);
    expect(unread).toBe(4);
  });

  it("updates the single settings row", async () => {
    const settings = generalPack.settings;
    const row = {
      site_name: settings.siteName, tagline: settings.tagline, logo_media_id: null, default_og_media_id: null, email: settings.email,
      phone: settings.phone, whatsapp_number: settings.whatsappNumber, whatsapp_message: settings.whatsappMessage,
      address_street: settings.address.street, address_city: settings.address.city, address_region: settings.address.region,
      postal_code: settings.address.postalCode, address_country: settings.address.country, maps_embed_url: null,
      opening_hours: settings.openingHours, social_links: [], schema_type: settings.schemaType, founded_year: settings.foundedYear,
      google_site_verification: null, ga_measurement_id: null, updated_at: settings.updatedAt,
    };
    const { client, calls } = createFakeAdminClient(() => ok(row));

    const saved = await createSupabaseAdminRepositories(client).settings.update({ ...settings, logo: null });

    expect(calls[0]).toMatchObject({ table: "site_settings", op: "update", filters: [["id", true]] });
    expect(calls[0].payload).toMatchObject({ site_name: settings.siteName, logo_media_id: null });
    expect(Object.keys(calls[0].payload!)).not.toContain("updated_at");
    expect(saved.siteName).toBe(settings.siteName);
  });
});
