import { describe, expect, it } from "vitest";
import { buildNotFoundMetadata } from "@/server/site/models/not-found";
import { buildTestContext } from "../../../fixtures/site";

describe("buildNotFoundMetadata", () => {
  it("titles the page with the site name within the seo length limits", async () => {
    const context = await buildTestContext();
    const metadata = buildNotFoundMetadata(context.seoSite);

    expect(metadata.title).toEqual({ absolute: `Halaman tidak ditemukan | ${context.settings.siteName}` });
    const title = (metadata.title as { absolute: string }).absolute;
    expect(title.length).toBeGreaterThanOrEqual(30);
    expect(title.length).toBeLessThanOrEqual(60);
  });

  it("is never indexable, even when indexing is on", async () => {
    const indexed = buildNotFoundMetadata((await buildTestContext({ env: { indexingEnabled: true } })).seoSite);
    const hidden = buildNotFoundMetadata((await buildTestContext({ env: { indexingEnabled: false } })).seoSite);

    expect(indexed.robots).toEqual({ index: false, follow: false });
    expect(hidden.robots).toEqual({ index: false, follow: false });
  });

  it("does not declare a canonical url or open graph data for a missing page", async () => {
    const metadata = buildNotFoundMetadata((await buildTestContext()).seoSite);

    expect(metadata.alternates).toBeUndefined();
    expect(metadata.openGraph).toBeUndefined();
  });
});
