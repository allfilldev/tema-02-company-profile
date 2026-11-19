import type { AdminModule } from "@/core/domain/admin/records";

type FieldKind = "required" | "nullable" | "body" | "integer" | "number" | "date" | "lines";

type MediaIds = Record<string, string | string[] | null>;

export type CollectionFormValues = {
  values: Record<string, unknown>;
  mediaIds: MediaIds;
  publish: boolean;
};

type ModuleFormSpec = {
  fields: [string, FieldKind][];
  singleMedia: string[];
  multiMedia: string[];
  faq: boolean;
};

const MODULE_FORMS: Record<AdminModule, ModuleFormSpec> = {
  services: {
    fields: [["slug", "required"], ["title", "required"], ["summary", "nullable"], ["bodyMd", "body"], ["metaTitle", "nullable"], ["metaDescription", "nullable"]],
    singleMedia: ["cover"],
    multiMedia: [],
    faq: true,
  },
  portfolio: {
    fields: [
      ["slug", "required"], ["title", "required"], ["clientName", "nullable"], ["category", "nullable"], ["summary", "nullable"],
      ["bodyMd", "body"], ["completedOn", "date"], ["metaTitle", "nullable"], ["metaDescription", "nullable"],
    ],
    singleMedia: ["cover"],
    multiMedia: ["gallery"],
    faq: false,
  },
  team: {
    fields: [["name", "required"], ["jobTitle", "nullable"], ["bio", "nullable"], ["yearsExperience", "integer"], ["profiles", "lines"]],
    singleMedia: ["photo"],
    multiMedia: [],
    faq: false,
  },
  stats: {
    fields: [["key", "required"], ["label", "required"], ["value", "number"], ["suffix", "nullable"]],
    singleMedia: [],
    multiMedia: [],
    faq: false,
  },
  testimonials: {
    fields: [["name", "required"], ["jobTitle", "nullable"], ["company", "nullable"], ["quote", "nullable"]],
    singleMedia: ["photo"],
    multiMedia: [],
    faq: false,
  },
  partners: {
    fields: [["name", "required"], ["url", "nullable"]],
    singleMedia: ["logo"],
    multiMedia: [],
    faq: false,
  },
  articles: {
    fields: [
      ["slug", "required"], ["title", "required"], ["metaTitle", "nullable"], ["metaDescription", "nullable"], ["lead", "nullable"],
      ["bodyMd", "body"], ["authorId", "nullable"],
    ],
    singleMedia: ["cover"],
    multiMedia: [],
    faq: true,
  },
};

const FAQ_FIELD_PATTERN = /^faq\[(\d+)\]\[(question|answer)\]$/;
const SOCIAL_FIELD_PATTERN = /^social\[(\d+)\]\[(platform|url)\]$/;

function text(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function normalizeLineBreaks(value: string): string {
  return value.replace(/\r\n?/g, "\n");
}

function readField(formData: FormData, name: string, kind: FieldKind): unknown {
  const raw = text(formData, name);
  const trimmed = raw.trim();

  switch (kind) {
    case "required":
      return trimmed;
    case "nullable":
      return trimmed.length > 0 ? trimmed : null;
    case "body":
      return normalizeLineBreaks(raw);
    case "date":
      return trimmed.length > 0 ? trimmed : null;
    case "integer":
      if (trimmed.length === 0) return null;
      return /^-?\d+$/.test(trimmed) ? Number(trimmed) : undefined;
    case "number":
      if (trimmed.length === 0) return undefined;
      return Number.isFinite(Number(trimmed)) ? Number(trimmed) : undefined;
    case "lines":
      return normalizeLineBreaks(raw)
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
  }
}

function readIndexedPairs(formData: FormData, pattern: RegExp, keys: [string, string]): Record<string, string>[] {
  const rows = new Map<number, Record<string, string>>();
  for (const [name, value] of formData.entries()) {
    const match = pattern.exec(name);
    if (!match || typeof value !== "string") continue;
    const row = rows.get(Number(match[1])) ?? {};
    row[match[2]] = value.trim();
    rows.set(Number(match[1]), row);
  }
  return [...rows.entries()]
    .sort(([left], [right]) => left - right)
    .map(([, row]) => ({ [keys[0]]: row[keys[0]] ?? "", [keys[1]]: row[keys[1]] ?? "" }))
    .filter((row) => row[keys[0]].length > 0 || row[keys[1]].length > 0);
}

function readMediaIds(formData: FormData, single: string[], multi: string[]): MediaIds {
  const ids: MediaIds = {};
  for (const name of single) {
    const value = text(formData, name).trim();
    ids[name] = value.length > 0 ? value : null;
  }
  for (const name of multi) {
    ids[name] = formData.getAll(name).filter((value): value is string => typeof value === "string" && value.trim().length > 0).map((value) => value.trim());
  }
  return ids;
}

export function readCollectionForm(module: AdminModule, formData: FormData): CollectionFormValues {
  const spec = MODULE_FORMS[module];
  const values: Record<string, unknown> = {};

  for (const [name, kind] of spec.fields) {
    values[name] = readField(formData, name, kind);
  }
  if (spec.faq) {
    values.faq = readIndexedPairs(formData, FAQ_FIELD_PATTERN, ["question", "answer"]);
  }

  return {
    values,
    mediaIds: readMediaIds(formData, spec.singleMedia, spec.multiMedia),
    publish: text(formData, "intent") === "publish",
  };
}

export type SettingsFormValues = {
  values: Record<string, unknown>;
  mediaIds: MediaIds;
};

export function readSettingsForm(formData: FormData): SettingsFormValues {
  const nullable = (name: string) => readField(formData, name, "nullable");
  const required = (name: string) => readField(formData, name, "required");

  return {
    values: {
      siteName: required("siteName"),
      tagline: required("tagline"),
      email: required("email"),
      phone: required("phone"),
      whatsappNumber: required("whatsappNumber"),
      whatsappMessage: required("whatsappMessage"),
      address: {
        street: required("addressStreet"),
        city: required("addressCity"),
        region: required("addressRegion"),
        postalCode: required("postalCode"),
        country: required("addressCountry"),
      },
      mapsEmbedUrl: nullable("mapsEmbedUrl"),
      openingHours: nullable("openingHours"),
      socialLinks: readIndexedPairs(formData, SOCIAL_FIELD_PATTERN, ["platform", "url"]),
      schemaType: required("schemaType"),
      foundedYear: readField(formData, "foundedYear", "integer"),
      googleSiteVerification: nullable("googleSiteVerification"),
      gaMeasurementId: nullable("gaMeasurementId"),
    },
    mediaIds: readMediaIds(formData, ["logo", "defaultOgImage"], []),
  };
}
