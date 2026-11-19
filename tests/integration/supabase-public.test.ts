import { createClient } from "@supabase/supabase-js";
import { afterAll, describe, expect, it } from "vitest";
import { createPublicSupabaseClient } from "@/infrastructure/supabase/public-client";
import { createSupabaseRepositories, fetchRouteCatalog } from "@/infrastructure/supabase/public-repositories";

const URL = process.env.SUPABASE_URL;
const PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const enabled = Boolean(URL && PUBLISHABLE_KEY);
const PREFIX = "tes-integrasi-";

describe.skipIf(!enabled)("supabase public reads", () => {
  const createdSlugs: string[] = [];

  function publicClient() {
    return createPublicSupabaseClient({ url: URL ?? "", publishableKey: PUBLISHABLE_KEY ?? "" });
  }

  function secretClient() {
    return createClient(URL ?? "", SECRET_KEY ?? "", { auth: { persistSession: false, autoRefreshToken: false } });
  }

  afterAll(async () => {
    if (SECRET_KEY && createdSlugs.length > 0) {
      await secretClient().from("services").delete().in("slug", createdSlugs);
      await secretClient().from("articles").delete().in("slug", createdSlugs);
    }
  });

  it("reads the published services", async () => {
    const services = await createSupabaseRepositories(publicClient()).services.listPublished();

    expect(services.length).toBeGreaterThan(0);
    expect(services.every((service) => !service.slug.startsWith(PREFIX))).toBe(true);
  });

  it.skipIf(!SECRET_KEY)("never exposes drafts to the public client, checked on the raw tables", async () => {
    const draftService = `${PREFIX}layanan`;
    const draftArticle = `${PREFIX}artikel`;
    createdSlugs.push(draftService, draftArticle);
    const insertedService = await secretClient()
      .from("services")
      .insert({ slug: draftService, title: "Draf layanan", sort_order: 9999, is_published: false });
    const insertedArticle = await secretClient().from("articles").insert({ slug: draftArticle, title: "Draf artikel", status: "draft" });

    expect(insertedService.error).toBeNull();
    expect(insertedArticle.error).toBeNull();

    const rawServices = await publicClient().from("services").select("slug").eq("slug", draftService);
    const rawArticles = await publicClient().from("articles").select("slug").eq("slug", draftArticle);

    expect(rawServices.error).toBeNull();
    expect(rawServices.data).toEqual([]);
    expect(rawArticles.error).toBeNull();
    expect(rawArticles.data).toEqual([]);
    expect((await fetchRouteCatalog(publicClient())).services).not.toContain(draftService);
  });

  it.skipIf(!SECRET_KEY)("does not let the public client read an existing contact message", async () => {
    const inserted = await secretClient()
      .from("contact_messages")
      .insert({ name: `${PREFIX}pesan`, email: "tes@contoh.id", message: "Pesan uji integrasi.", ip_hash: `${PREFIX}hash` })
      .select("id")
      .single();

    expect(inserted.error).toBeNull();

    try {
      const visible = await publicClient().from("contact_messages").select("id");

      expect(visible.data ?? []).toEqual([]);
    } finally {
      await secretClient().from("contact_messages").delete().eq("ip_hash", `${PREFIX}hash`);
    }
  });

  it("builds a route catalog from published slugs only", async () => {
    const catalog = await fetchRouteCatalog(publicClient());

    expect(catalog.services.every((slug) => !slug.startsWith(PREFIX))).toBe(true);
    expect(catalog.articleCount).toBe(catalog.articles.length);
  });
});
