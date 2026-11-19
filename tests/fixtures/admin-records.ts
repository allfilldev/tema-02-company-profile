import type {
  ArticleRecord,
  PartnerRecord,
  PortfolioRecord,
  ServiceRecord,
  StatRecord,
  TestimonialRecord,
} from "@/core/domain/admin/records";
import type { MediaAsset } from "@/core/domain/shared/media-asset";

const NOW = "2026-11-20T03:00:00.000Z";

export function buildMediaAsset(overrides: Partial<MediaAsset> = {}): MediaAsset {
  return { id: "media-1", url: "/demo/general/cover.webp", alt: "Tim sedang berdiskusi", width: 1200, height: 800, ...overrides };
}

export function buildServiceRecord(overrides: Partial<ServiceRecord> = {}): ServiceRecord {
  return {
    id: "service-1",
    slug: "penyusunan-sop",
    title: "Penyusunan SOP",
    summary: "Dokumen prosedur yang rapi.",
    bodyMd: "## Cakupan\n\nIsi layanan.",
    cover: buildMediaAsset(),
    metaTitle: "Penyusunan SOP Perusahaan",
    metaDescription: null,
    faq: [{ question: "Berapa lama prosesnya?", answer: "Sekitar dua minggu." }],
    sortOrder: 1,
    isPublished: false,
    updatedAt: NOW,
    ...overrides,
  };
}

export function buildPortfolioRecord(overrides: Partial<PortfolioRecord> = {}): PortfolioRecord {
  return {
    id: "portfolio-1",
    slug: "sop-pabrik-roti",
    title: "SOP Pabrik Roti",
    clientName: "Roti Nusantara",
    category: "Manufaktur",
    summary: "Menyusun SOP produksi.",
    bodyMd: "## Hasil\n\nProduksi lebih rapi.",
    cover: buildMediaAsset(),
    gallery: [buildMediaAsset({ id: "media-2", alt: "Lini produksi" })],
    completedOn: "2026-03-01",
    metaTitle: null,
    metaDescription: null,
    sortOrder: 1,
    isPublished: false,
    updatedAt: NOW,
    ...overrides,
  };
}

export function buildStatRecord(overrides: Partial<StatRecord> = {}): StatRecord {
  return { id: "stat-1", key: "projects", label: "Proyek selesai", value: 120, suffix: "+", sortOrder: 1, updatedAt: NOW, ...overrides };
}

export function buildTestimonialRecord(overrides: Partial<TestimonialRecord> = {}): TestimonialRecord {
  return {
    id: "testimonial-1",
    name: "Dewi Lestari",
    jobTitle: "Direktur",
    company: "Roti Nusantara",
    quote: "Prosesnya jelas dan hasilnya rapi.",
    photo: buildMediaAsset({ id: "media-3", alt: "Dewi Lestari" }),
    sortOrder: 1,
    isPublished: false,
    updatedAt: NOW,
    ...overrides,
  };
}

export function buildPartnerRecord(overrides: Partial<PartnerRecord> = {}): PartnerRecord {
  return {
    id: "partner-1",
    name: "Mitra Logistik",
    logo: buildMediaAsset({ id: "media-4", alt: "Logo Mitra Logistik" }),
    url: "https://mitra.example",
    sortOrder: 1,
    isPublished: false,
    updatedAt: NOW,
    ...overrides,
  };
}

export function buildArticleRecord(overrides: Partial<ArticleRecord> = {}): ArticleRecord {
  return {
    id: "article-1",
    slug: "cara-menyusun-sop",
    title: "Cara Menyusun SOP",
    metaTitle: "Cara Menyusun SOP yang Mudah Dipatuhi",
    metaDescription: null,
    lead: "SOP yang baik singkat dan jelas.",
    bodyMd: "## Langkah\n\nMulai dari alur kerja.",
    cover: buildMediaAsset(),
    authorId: "team-1",
    faq: [{ question: "Apa itu SOP?", answer: "Prosedur operasional standar." }],
    status: "draft",
    publishedAt: null,
    updatedAt: NOW,
    ...overrides,
  };
}
