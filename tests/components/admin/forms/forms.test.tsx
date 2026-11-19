import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ArticleForm } from "@/components/admin/forms/article-form";
import { PartnerForm } from "@/components/admin/forms/partner-form";
import { PortfolioForm } from "@/components/admin/forms/portfolio-form";
import { ServiceForm } from "@/components/admin/forms/service-form";
import { StatForm } from "@/components/admin/forms/stat-form";
import { TeamForm } from "@/components/admin/forms/team-form";
import { TestimonialForm } from "@/components/admin/forms/testimonial-form";
import { readCollectionForm } from "@/lib/admin/form-data";
import { INITIAL_ADMIN_FORM_STATE } from "@/lib/admin/form-state";
import type { AdminModule } from "@/core/domain/admin/records";
import {
  buildArticleRecord,
  buildMediaAsset,
  buildPartnerRecord,
  buildPortfolioRecord,
  buildServiceRecord,
  buildStatRecord,
  buildTestimonialRecord,
} from "../../../fixtures/admin-records";
import { buildTeamMemberRecord } from "../../../fixtures/admin-repositories";

const action = async () => INITIAL_ADMIN_FORM_STATE;
const media = [buildMediaAsset()];
const siteName = "Nusa Karya";

type ModuleCase = {
  module: AdminModule;
  draft: ReactElement;
  published: ReactElement;
  publishable: boolean;
};

const CASES: ModuleCase[] = [
  {
    module: "services",
    draft: <ServiceForm record={buildServiceRecord()} media={media} siteName={siteName} action={action} />,
    published: <ServiceForm record={buildServiceRecord({ isPublished: true })} media={media} siteName={siteName} action={action} />,
    publishable: true,
  },
  {
    module: "portfolio",
    draft: <PortfolioForm record={buildPortfolioRecord()} media={media} siteName={siteName} action={action} />,
    published: <PortfolioForm record={buildPortfolioRecord({ isPublished: true })} media={media} siteName={siteName} action={action} />,
    publishable: true,
  },
  {
    module: "team",
    draft: <TeamForm record={buildTeamMemberRecord({ isPublished: false })} media={media} action={action} />,
    published: <TeamForm record={buildTeamMemberRecord({ isPublished: true })} media={media} action={action} />,
    publishable: true,
  },
  {
    module: "stats",
    draft: <StatForm record={buildStatRecord()} action={action} />,
    published: <StatForm record={buildStatRecord()} action={action} />,
    publishable: false,
  },
  {
    module: "testimonials",
    draft: <TestimonialForm record={buildTestimonialRecord()} media={media} action={action} />,
    published: <TestimonialForm record={buildTestimonialRecord({ isPublished: true })} media={media} action={action} />,
    publishable: true,
  },
  {
    module: "partners",
    draft: <PartnerForm record={buildPartnerRecord()} media={media} action={action} />,
    published: <PartnerForm record={buildPartnerRecord({ isPublished: true })} media={media} action={action} />,
    publishable: true,
  },
  {
    module: "articles",
    draft: <ArticleForm record={buildArticleRecord()} media={media} siteName={siteName} authors={[buildTeamMemberRecord()]} action={action} />,
    published: (
      <ArticleForm
        record={buildArticleRecord({ status: "published", publishedAt: "2026-11-01T00:00:00.000Z" })}
        media={media}
        siteName={siteName}
        authors={[buildTeamMemberRecord()]}
        action={action}
      />
    ),
    publishable: true,
  },
];

function controlTags(markup: string): string[] {
  return [...markup.matchAll(/<(?:input|select|textarea)\b[^>]*>/g)].map((match) => match[0]).filter((tag) => !/type="hidden"/.test(tag));
}

function attribute(tag: string, name: string): string | null {
  return new RegExp(`\\b${name}="([^"]*)"`).exec(tag)?.[1] ?? null;
}

function fieldNames(markup: string): string[] {
  return [...markup.matchAll(/<(?:input|select|textarea)\b[^>]*\bname="([^"]+)"/g)].map((match) => match[1]);
}

describe.each(CASES)("$module form", ({ module, draft, published, publishable }) => {
  it("gives every visible control a label that points at it", () => {
    const markup = renderToStaticMarkup(draft);
    const controls = controlTags(markup).filter((tag) => attribute(tag, "name") !== "intent");

    expect(controls.length).toBeGreaterThan(0);
    for (const tag of controls) {
      const id = attribute(tag, "id");
      expect(id, tag).not.toBeNull();
      expect(markup, tag).toContain(`for="${id}"`);
    }
  });

  it("posts every field that readCollectionForm reads", () => {
    const markup = renderToStaticMarkup(draft);
    const names = fieldNames(markup);
    const expected = readCollectionForm(module, new FormData());

    for (const name of [...Object.keys(expected.values), ...Object.keys(expected.mediaIds)]) {
      if (name === "faq") {
        expect(names.some((candidate) => candidate.startsWith("faq["))).toBe(true);
      } else {
        expect(names, name).toContain(name);
      }
    }
  });

  it(publishable ? "offers draft and publish buttons on a draft and a single save button once published" : "offers one save button and no publish button", () => {
    const draftMarkup = renderToStaticMarkup(draft);
    const publishedMarkup = renderToStaticMarkup(published);

    if (publishable) {
      expect(draftMarkup).toContain("Simpan draf");
      expect(draftMarkup).toContain("Simpan dan terbitkan");
      expect(publishedMarkup).not.toContain("Simpan draf");
      expect(publishedMarkup).not.toContain("Simpan dan terbitkan");
    } else {
      expect(draftMarkup).not.toContain("Simpan dan terbitkan");
    }
    expect(publishedMarkup).toMatch(/>Simpan</);
  });
});

describe("article form", () => {
  const authors = [
    buildTeamMemberRecord({ id: "team-1", name: "Rina Wulandari", isPublished: true }),
    buildTeamMemberRecord({ id: "team-2", name: "Bayu Pratama", isPublished: false }),
  ];

  it("offers only published team members as authors", () => {
    const markup = renderToStaticMarkup(<ArticleForm record={buildArticleRecord()} media={media} siteName={siteName} authors={authors} action={action} />);

    expect(markup).toContain("Rina Wulandari");
    expect(markup).not.toContain("Bayu Pratama");
  });

  it("shows the publication date as read-only text without a date input", () => {
    const markup = renderToStaticMarkup(
      <ArticleForm
        record={buildArticleRecord({ status: "published", publishedAt: "2026-11-01T00:00:00.000Z" })}
        media={media}
        siteName={siteName}
        authors={authors}
        action={action}
      />,
    );

    expect(markup).not.toContain('type="date"');
    expect(markup).not.toContain('name="publishedAt"');
    expect(markup).toContain("1 November 2026");
  });
});

describe("portfolio form", () => {
  it("posts every gallery image id in order", () => {
    const markup = renderToStaticMarkup(
      <PortfolioForm
        record={buildPortfolioRecord({ gallery: [buildMediaAsset({ id: "media-2" }), buildMediaAsset({ id: "media-5" })] })}
        media={media}
        siteName={siteName}
        action={action}
      />,
    );

    expect(markup.match(/name="gallery" value="media-\d"/g)).toEqual(['name="gallery" value="media-2"', 'name="gallery" value="media-5"']);
  });
});

describe("article form with an unpublished author", () => {
  it("keeps the current author selectable so saving a draft does not clear it", () => {
    const markup = renderToStaticMarkup(
      <ArticleForm
        record={buildArticleRecord({ authorId: "team-2" })}
        media={media}
        siteName={siteName}
        authors={[buildTeamMemberRecord({ id: "team-2", name: "Bayu Pratama", isPublished: false })]}
        action={action}
      />,
    );

    expect(markup).toContain("Bayu Pratama (belum terbit)");
  });
});

