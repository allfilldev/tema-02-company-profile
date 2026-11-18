import type { HomeContent } from "@/core/domain/page/home-content";
import { generalMedia } from "@/content/packs/general/media";

export const generalHome: HomeContent = {
  heroEyebrow: "Konsultan manajemen dan transformasi digital di Jakarta",
  metaTitle: "Konsultan Manajemen & Transformasi Digital",
  metaDescription:
    "Arunika Solusi, konsultan manajemen dan transformasi digital di Jakarta. Kami bantu UMKM dan korporasi menyusun SOP, KPI, dan langkah digitalisasi.",
  heroTitle: "Proses bisnis yang rapi, keputusan yang lebih terukur",
  heroSubtitle:
    "Arunika Solusi mendampingi UMKM dan korporasi menyusun strategi, SOP, KPI, dan langkah digitalisasi yang benar-benar dijalankan oleh tim.",
  heroImage: generalMedia.hero,
  primaryCta: { label: "Jadwalkan Konsultasi", href: "/kontak" },
  secondaryCta: { label: "Lihat Portofolio", href: "/portofolio" },
  updatedAt: "2026-11-10T03:00:00.000Z",
};
