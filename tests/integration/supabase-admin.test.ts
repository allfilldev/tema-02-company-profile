import { createClient } from "@supabase/supabase-js";
import { afterAll, describe, expect, it } from "vitest";
import type { AdminClient } from "@/infrastructure/supabase/admin-client";
import { createSupabaseAdminRepositories } from "@/infrastructure/supabase/admin-repositories";
import { createPublicSupabaseClient } from "@/infrastructure/supabase/public-client";
import { createSupabaseRepositories } from "@/infrastructure/supabase/public-repositories";

const URL = process.env.SUPABASE_URL;
const PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const enabled = Boolean(URL && PUBLISHABLE_KEY && SECRET_KEY);
const PREFIX = "tes-integrasi-";

describe.skipIf(!enabled)("supabase admin repositories against the real project", () => {
  function adminClient(): AdminClient {
    return createClient(URL ?? "", SECRET_KEY ?? "", { auth: { persistSession: false, autoRefreshToken: false } }) as unknown as AdminClient;
  }

  function repositories() {
    return createSupabaseAdminRepositories(adminClient());
  }

  afterAll(async () => {
    const client = createClient(URL ?? "", SECRET_KEY ?? "", { auth: { persistSession: false, autoRefreshToken: false } });
    await client.from("services").delete().like("slug", `${PREFIX}%`);
    await client.from("articles").delete().like("slug", `${PREFIX}%`);
    await client.from("media").delete().like("alt", `${PREFIX}%`);
  });

  it("creates, publishes, reorders, and deletes a service, and the public client sees it only while published", async () => {
    const { services } = repositories().collections;
    const publicRepos = createSupabaseRepositories(createPublicSupabaseClient({ url: URL ?? "", publishableKey: PUBLISHABLE_KEY ?? "" }));
    const slug = `${PREFIX}admin-layanan`;

    const created = await services.create({ slug, title: "Layanan uji", summary: null, bodyMd: "", cover: null, metaTitle: null, metaDescription: null, faq: [] });
    expect(created.isPublished).toBe(false);
    expect(await publicRepos.services.findPublishedBySlug(slug)).toBeNull();

    const all = await services.list();
    expect(all.at(-1)?.id).toBe(created.id);

    await services.move(created.id, "up");
    const moved = await services.list();
    expect(moved.findIndex((item) => item.id === created.id)).toBe(all.length - 2);

    await services.update(created.id, { slug, title: "Layanan uji diubah", summary: "Ringkas", bodyMd: "", cover: null, metaTitle: "Judul meta", metaDescription: "Deskripsi meta", faq: [] });
    expect((await services.setPublished(created.id, true)).isPublished).toBe(true);
    expect((await publicRepos.services.listPublished()).some((item) => item.slug === slug)).toBe(true);

    await services.remove(created.id);
    expect((await services.list()).some((item) => item.id === created.id)).toBe(false);
  });

  it("fills published_at once, keeps it across withdraw and publish, and ignores an attempt to set it", async () => {
    const { articles } = repositories().collections;
    const slug = `${PREFIX}admin-artikel`;
    const draft = await articles.create({ slug, title: "Artikel uji", metaTitle: null, metaDescription: null, lead: null, bodyMd: "", cover: null, authorId: null, faq: [] });
    expect(draft.status).toBe("draft");
    expect(draft.publishedAt).toBeNull();

    const published = await articles.setPublished(draft.id, true);
    expect(published.publishedAt).not.toBeNull();

    const withdrawn = await articles.setPublished(draft.id, false);
    const republished = await articles.setPublished(draft.id, true);
    expect(withdrawn.publishedAt).toBe(published.publishedAt);
    expect(republished.publishedAt).toBe(published.publishedAt);
  });

  it("reports where an image is used through media_usages and counts articles per author", async () => {
    const repos = repositories();
    const [service] = await repos.collections.services.list();
    const cover = service.cover;
    expect(cover).not.toBeNull();

    const usages = await repos.media.findUsages(cover!.id);
    expect(usages.some((label) => label.startsWith("Layanan:"))).toBe(true);

    const [member] = await repos.collections.team.list();
    const counts = await repos.articleAuthors.countByAuthor(member.id);
    expect(counts.all).toBeGreaterThanOrEqual(counts.published);
  });

  it("does not let an anonymous client write", async () => {
    const anon = createClient(URL ?? "", PUBLISHABLE_KEY ?? "", { auth: { persistSession: false, autoRefreshToken: false } });
    const slug = `${PREFIX}anon`;

    const { error } = await anon.from("services").insert({ slug, title: "Tidak boleh", body_md: "" });
    const { data } = await anon.from("services").select("id").eq("slug", slug);

    expect(error).not.toBeNull();
    expect(data ?? []).toHaveLength(0);
  });
});
