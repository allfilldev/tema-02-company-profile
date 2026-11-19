import type { SiteSettings } from "@/core/domain/settings/site-settings";
import { generalMedia } from "@/content/packs/general/media";

export const generalSettings: SiteSettings = {
  siteName: "All Fill Dev",
  tagline: "Konsultan manajemen dan transformasi digital untuk UMKM dan korporasi",
  logo: generalMedia.logo,
  defaultOgImage: null,
  email: "halo@allfilldev.example",
  phone: "+62 895-3264-22692",
  whatsappNumber: "62895326422692",
  whatsappMessage: "Halo, saya ingin konsultasi pembuatan website. Paket mana yang cocok untuk usaha saya?",
  address: {
    street: "Pd. Bukit Agung No.1 Blok H, Sumurboto, Kec. Banyumanik",
    city: "Semarang",
    region: "Jawa Tengah",
    postalCode: "-",
    country: "ID",
  },
  mapsEmbedUrl: null,
  openingHours: "Senin sampai Sabtu, 07.00 sampai 22.00 WIB",
  socialLinks: [],
  schemaType: "Organization",
  foundedYear: 2017,
  googleSiteVerification: null,
  gaMeasurementId: null,
  updatedAt: "2026-11-10T03:00:00.000Z",
};
