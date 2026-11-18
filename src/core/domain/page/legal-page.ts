export const LEGAL_SLUGS = ["privasi", "syarat-ketentuan", "kebijakan-editorial"] as const;

export type LegalSlug = (typeof LEGAL_SLUGS)[number];

export type LegalPage = {
  slug: LegalSlug;
  title: string;
  intro: string;
  sections: { heading: string; bodyMd: string }[];
  metaDescription: string;
  updatedAt: string;
};
