export type LegalSlug = "privasi" | "syarat-ketentuan" | "kebijakan-editorial";

export type LegalPage = {
  slug: LegalSlug;
  title: string;
  intro: string;
  sections: { heading: string; bodyMd: string }[];
  metaDescription: string;
  updatedAt: string;
};
