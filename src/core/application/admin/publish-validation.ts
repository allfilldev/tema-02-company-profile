import type { ZodType } from "zod";
import type { AdminModule, AdminRecordByModule } from "@/core/domain/admin/records";
import type { ModuleKey } from "@/core/domain/shared/module-key";
import {
  missingPublishFields,
  toPublishableArticle,
  toPublishablePartner,
  toPublishablePortfolioItem,
  toPublishableService,
  toPublishableTeamMember,
  toPublishableTestimonial,
} from "@/core/application/admin/to-publishable";
import { createArticleSchema } from "@/core/application/schemas/article-schema";
import {
  createPortfolioItemSchema,
  createServiceSchema,
  partnerSchema,
  teamMemberSchema,
  testimonialSchema,
} from "@/core/application/schemas/catalog-schemas";
import { checkMarkdownBody } from "@/lib/markdown/body-rules";
import { runContentChecks, type ContentKind } from "@/lib/seo/content-checks";

export type PublishValidation = {
  fieldErrors: Record<string, string>;
  blocking: string[];
  warnings: string[];
};

const MISSING_MESSAGE = "Wajib diisi sebelum terbit.";
const FIELD_COVERED_CHECKS = ["meta-title-length", "meta-description-length", "slug-format"];
const MARKDOWN_IMAGE_ALT_PATTERN = /!\[([^\]]*)\]\(/g;

type ContentRecord = AdminRecordByModule["services"] | AdminRecordByModule["portfolio"] | AdminRecordByModule["articles"];

type PublishContext = {
  siteName: string;
  enabledModules: readonly ModuleKey[];
};

function applyZodIssues(schema: ZodType, entity: unknown, fieldErrors: Record<string, string>): void {
  const result = schema.safeParse(entity);
  if (result.success) {
    return;
  }
  for (const issue of result.error.issues) {
    const field = String(issue.path[0] ?? "form");
    if (!(field in fieldErrors)) {
      fieldErrors[field] = issue.message;
    }
  }
}

function contentKind(module: AdminModule): ContentKind | null {
  if (module === "services") return "service";
  if (module === "portfolio") return "portfolio";
  if (module === "articles") return "article";
  return null;
}

function schemaAndEntity(module: AdminModule, record: AdminRecordByModule[AdminModule], siteName: string): { schema: ZodType; entity: unknown } | null {
  switch (module) {
    case "services": {
      const entity = toPublishableService(record as AdminRecordByModule["services"]);
      return entity ? { schema: createServiceSchema(siteName), entity } : null;
    }
    case "portfolio": {
      const entity = toPublishablePortfolioItem(record as AdminRecordByModule["portfolio"]);
      return entity ? { schema: createPortfolioItemSchema(siteName), entity } : null;
    }
    case "articles": {
      const entity = toPublishableArticle(record as AdminRecordByModule["articles"]);
      return entity ? { schema: createArticleSchema(siteName), entity } : null;
    }
    case "team": {
      const entity = toPublishableTeamMember(record as AdminRecordByModule["team"]);
      return entity ? { schema: teamMemberSchema, entity } : null;
    }
    case "testimonials": {
      const entity = toPublishableTestimonial(record as AdminRecordByModule["testimonials"]);
      return entity ? { schema: testimonialSchema, entity } : null;
    }
    case "partners":
      return { schema: partnerSchema, entity: toPublishablePartner(record as AdminRecordByModule["partners"]) };
    case "stats":
      return null;
  }
}

function collectImageAlts(record: ContentRecord): string[] {
  const alts: string[] = [];
  if (record.cover) alts.push(record.cover.alt);
  if ("gallery" in record) alts.push(...record.gallery.map((asset) => asset.alt));
  for (const match of record.bodyMd.matchAll(MARKDOWN_IMAGE_ALT_PATTERN)) {
    alts.push(match[1]);
  }
  return alts;
}

export function validateForPublish(
  module: AdminModule,
  record: AdminRecordByModule[AdminModule],
  context: PublishContext,
): PublishValidation {
  const fieldErrors: Record<string, string> = {};
  const blocking: string[] = [];
  const warnings: string[] = [];

  for (const field of missingPublishFields(module, record as never)) {
    fieldErrors[field] = MISSING_MESSAGE;
  }

  const parsed = schemaAndEntity(module, record, context.siteName);
  if (parsed) {
    applyZodIssues(parsed.schema, parsed.entity, fieldErrors);
  }

  const kind = contentKind(module);
  if (kind) {
    const content = record as ContentRecord;
    const checks = runContentChecks({
      kind,
      siteName: context.siteName,
      metaTitle: content.metaTitle ?? "",
      metaDescription: content.metaDescription ?? "",
      slug: content.slug,
      bodyMd: content.bodyMd,
      lead: "lead" in content ? (content.lead ?? "") : null,
      faqCount: "faq" in content ? content.faq.length : 0,
      imageAlts: collectImageAlts(content),
    });
    for (const check of checks) {
      if (check.passed) continue;
      if (check.severity === "warning") {
        warnings.push(check.message);
      } else if (!FIELD_COVERED_CHECKS.includes(check.id)) {
        blocking.push(check.message);
      }
    }

    const body = checkMarkdownBody(content.bodyMd, context.enabledModules);
    blocking.push(...body.blocking);
    warnings.push(...body.warnings);
  }

  return { fieldErrors, blocking, warnings };
}

export function hasPublishProblems(validation: PublishValidation): boolean {
  return Object.keys(validation.fieldErrors).length > 0 || validation.blocking.length > 0;
}
