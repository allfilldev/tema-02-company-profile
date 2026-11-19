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

  it.skipIf(!SECRET_KEY)("never exposes drafts to the public client", async () => {
    const draftService = `${PREFIX}layanan`;
    const draftArticle = `${PREFIX}artikel`;
    createdSlugs.push(draftService, draftArticle);
    await secretClient().from("services").insert({ slug: draftService, title: "Draf layanan", sort_order: 9999, is_published: false });
    await secretClient().from("articles").insert({ slug: draftArticle, title: "Draf artikel", status: "draft" });

    const repositories = createSupabaseRepositories(publicClient());
    const services = await repositories.services.listPublished();

    expect(services.map((service) => service.slug)).not.toContain(draftService);
    expect(await repositories.services.findPublishedBySlug(draftService)).toBeNull();
    expect(await repositories.articles.findPublishedBySlug(draftArticle)).toBeNull();
    expect((await fetchRouteCatalog(publicClient())).services).not.toContain(draftService);
  });

  it("does not let the public client read contact messages", async () => {
    const { data } = await publicClient().from("contact_messages").select("id");

    expect(data ?? []).toEqual([]);
  });

  it("builds a route catalog from published slugs only", async () => {
    const catalog = await fetchRouteCatalog(publicClient());

    expect(catalog.services.every((slug) => !slug.startsWith(PREFIX))).toBe(true);
    expect(catalog.articleCount).toBe(catalog.articles.length);
  });
});
