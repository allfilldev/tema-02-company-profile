import type { MediaAsset } from "@/core/domain/shared/media-asset";

export type SiteSettings = {
  siteName: string;
  tagline: string;
  logo: MediaAsset | null;
  defaultOgImage: MediaAsset | null;
  email: string;
  phone: string;
  whatsappNumber: string;
  whatsappMessage: string;
  address: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  mapsEmbedUrl: string | null;
  openingHours: string | null;
  socialLinks: { platform: string; url: string }[];
  schemaType: "Organization" | "LocalBusiness";
  foundedYear: number | null;
  googleSiteVerification: string | null;
  gaMeasurementId: string | null;
  updatedAt: string;
};
