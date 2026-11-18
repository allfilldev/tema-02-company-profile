import type { Partner } from "@/core/domain/partner/partner";
import { generalMedia } from "@/content/packs/general/media";

export const generalPartners: Partner[] = [
  { id: "partner-lintasbaru-logistik", name: "Lintasbaru Logistik", logo: generalMedia["partner-1"], url: null, sortOrder: 1 },
  { id: "partner-medivara", name: "Medivara", logo: generalMedia["partner-2"], url: null, sortOrder: 2 },
  { id: "partner-kopsara", name: "Kopsara", logo: generalMedia["partner-3"], url: null, sortOrder: 3 },
  { id: "partner-taniwara", name: "Taniwara", logo: generalMedia["partner-4"], url: null, sortOrder: 4 },
  { id: "partner-mandarasa-industri", name: "Mandarasa Industri", logo: generalMedia["partner-5"], url: null, sortOrder: 5 },
  { id: "partner-lumbaradigital", name: "LumbaraDigital", logo: generalMedia["partner-6"], url: null, sortOrder: 6 },
  { id: "partner-kencanaru-ritel", name: "Kencanaru Ritel", logo: generalMedia["partner-7"], url: null, sortOrder: 7 },
  { id: "partner-samudrava-pelayaran", name: "Samudrava Pelayaran", logo: generalMedia["partner-8"], url: null, sortOrder: 8 },
];
