# Peta Struktur Proyek

Boilerplate company profile berbasis Next.js (App Router, TypeScript, Tailwind). Perbarui file ini setiap kali ada file atau folder yang ditambah, diganti nama, atau dipindah.

## Akar proyek

| Path | Tanggung jawab |
|---|---|
| `CLAUDE.md` | Aturan untuk AI, mengimpor `docs/rules/*.md` |
| `structure.md` | Peta struktur proyek ini |
| `AGENTS.md` | Catatan agen bawaan Next.js |
| `README.md` | Pengantar proyek bawaan scaffold |
| `.env.example` | Contoh variabel lingkungan (`DATA_SOURCE`, `SITE_URL`, `SITE_INDEXING`) |
| `vitest.config.ts` | Konfigurasi Vitest, tes ada di `tests/**/*.test.ts` |
| `next.config.ts`, `tsconfig.json`, `eslint.config.mjs` | Konfigurasi Next.js, TypeScript, dan ESLint |
| `THEME.md` (menyusul) | Panduan membuat tema baru dari desain |
| `UPDATING.md` (menyusul) | Cara menarik pembaruan boilerplate ke tema |

## Folder

| Path | Tanggung jawab |
|---|---|
| `docs/rules/` | Salinan aturan yang sudah disesuaikan: `rules.md`, `seo-rules.md`, `seo-for-new-website.md`, `eeat-rules.md` |
| `tests/` | Tes Vitest, mengikuti struktur `src/` (saat ini `tests/lib/text/`, `tests/lib/seo/`, `tests/lib/markdown/`, `tests/core/application/` termasuk `schemas.test.ts` dan `site-queries.test.ts`, `tests/infrastructure/images/`, `tests/content/packs/` berisi `general-media.test.ts`) |
| `tests/fixtures/` | Data bantu tes, bukan file tes. `content-pack.ts` berisi `buildTestPack()` yang mengembalikan paket konten valid baru (siteName "Nusa Karya") di setiap panggilan, dengan intro seksi untuk kesepuluh `SECTION_KEYS` |
| `public/` | Aset statis |
| `public/demo/<paket>/` | Gambar demo WebP per paket konten, satu file per kunci media (`<kunci>.webp`, maksimal 100 KB). Saat ini ada `public/demo/general/` berisi 50 gambar: 41 foto Pexels, logo Arunika Solusi, dan 8 logo mitra fiktif dengan latar transparan |
| `docs/credits/` | Kredit gambar per paket konten. `general.md` mencatat fotografer, halaman Pexels, dan lisensi setiap kunci media |
| `supabase/migrations/` (menyusul) | Skema, RLS, fungsi, bucket storage |
| `supabase/seed.sql` (menyusul) | Hasil generate dari paket konten, tidak diedit manual |
| `scripts/` | `import-demo-image.ts`: CLI `npm run image:import -- <file-sumber> <paket> <nama-file> [--logo]` yang mengonversi gambar ke WebP, menulis `public/demo/<paket>/<nama-file>.webp`, dan mencetak `<lebar> <tinggi> <ukuran-byte>`. Skrip create-theme, generate-seed, create-admin, generate-favicon menyusul |

## src/

| Path | Tanggung jawab |
|---|---|
| `src/app/` | Rute Next.js. Saat ini masih berisi `layout.tsx`, `page.tsx`, `globals.css` bawaan scaffold |
| `src/app/(site)/` (menyusul) | Website publik |
| `src/app/admin/` (menyusul) | Panel admin |
| `src/core/domain/` | Entity dan interface repository per modul, tanpa impor dari infrastruktur, React, Next, atau Supabase. Satu tipe atau interface per file. Subfolder: `shared/` (`media-asset`, `faq-item`, `call-to-action`, `module-key`, `section-key`), `settings/` (`site-settings` dan repository-nya), `page/` (`home-content`, `section-intro`, `about-content`, `company-vision` bersama `CompanyValue`, `legal-page` bersama `LegalSlug`, `page-content-repository`), `service/`, `portfolio/`, `team/`, `stat/`, `testimonial/`, `partner/`, `article/` (`Article`, `ArticleWithAuthor`, `ArticlePage`), `content-block/` (`ContentBlock` bersama `ContentBlockItem`), `content-pack/` (`ContentPack`), `theme/` (`theme-config.ts`: `ThemeConfig`, `ContentBlockDefinition`, `ContentBlockItemField`), dan `repositories.ts` (tipe `Repositories`). Kontrak repository: daftar terurut `sortOrder` naik, artikel terurut `publishedAt` terbaru |
| `src/core/application/` | Use case dan skema Zod. Saat ini baru `schemas/`: `shared-fields.ts` (slug, meta title, meta description, media, FAQ, CTA), `site-schemas.ts` (pengaturan situs, beranda, intro seksi, tentang, visi, halaman hukum, blok konten), `catalog-schemas.ts` (layanan, portofolio, tim, statistik, testimoni, mitra), `article-schema.ts`, dan `content-pack-schema.ts` (paket konten dengan cek slug unik dan `authorId` yang ada di tim). `site/` berisi query situs yang menghormati modul aktif tema: `module-guard.ts` (`isModuleEnabled`, `isModuleKey`), `page-queries.ts` (pengaturan, beranda, tentang, visi, intro seksi, halaman hukum, blok konten), `catalog-queries.ts` (layanan, portofolio, tim, statistik, testimoni, mitra), `article-queries.ts` (`ARTICLES_PER_PAGE`, daftar artikel berhalaman, detail dengan penulis, artikel terkait), dan `site-queries.ts` (`createSiteQueries` menggabungkan semuanya). Use case lain menyusul |
| `src/infrastructure/supabase/` (menyusul) | Client, repository, storage |
| `src/infrastructure/fixtures/` | `fixture-repositories.ts`: `createFixtureRepositories(pack)` membuat `Repositories` yang membaca `ContentPack` di memori, mematuhi kontrak urutan (tanpa mengubah array paket) |
| `src/infrastructure/images/` | `optimize-webp.ts`: `optimizeToWebp(input, { maxWidth, maxBytes })` mengubah gambar ke WebP dengan sharp (tanpa memperbesar, transparansi tetap, kualitas turun bertahap lalu lebar dikecilkan sampai di bawah batas byte), beserta konstanta `PHOTO_MAX_WIDTH` (1920), `LOGO_MAX_WIDTH` (600), dan `MAX_IMAGE_BYTES` (102400) |
| `src/content/packs/<paket>/` | Paket konten demo. Saat ini baru `general/media.ts`: `GENERAL_MEDIA_KEYS`, tipe `GeneralMediaKey`, dan `generalMedia` (`Record<GeneralMediaKey, MediaAsset>`) berisi 50 gambar demo Arunika Solusi dengan alt bahasa Indonesia. Isi paket lainnya menyusul |
| `src/server/actions/` (menyusul) | Server actions publik dan admin |
| `src/server/container.ts` (menyusul) | Memilih repository sesuai `DATA_SOURCE` |
| `src/lib/text/` | Utilitas teks murni: `slug.ts` berisi `slugify` dan `isValidSlug` |
| `src/lib/seo/` | `limits.ts` (batas panjang dan jumlah untuk SEO), `title.ts` (`titleSuffix`, `maxMetaTitleLength`, `buildPageTitle`), `content-checks.ts` (`runContentChecks` dan `hasBlockingErrors`, pesan dalam bahasa Indonesia). Builder metadata dan JSON-LD menyusul |
| `src/lib/markdown/` | Analisis markdown murni: `code-blocks.ts` (membuang blok kode berpagar), `headings.ts` (`extractHeadings`, `analyzeHeadings`), `words.ts` (`countWords`), `links.ts` (`countLinks` internal dan eksternal) |
| `src/config/theme.ts` | `themeConfig`: nama tema, paket konten, modul aktif, dan definisi blok konten |
| `src/hooks/` (menyusul) | Hook client |
| `src/styles/` (menyusul) | `tokens.css`, `globals.css`, `fonts.ts` |
| `src/components/ui/` (menyusul) | Komponen dasar, dipakai publik dan admin |
| `src/components/site/layout/` (menyusul) | Header, Footer, WhatsAppButton |
| `src/components/site/sections/` (menyusul) | Hero, ServicesSection, PortfolioSection, dan lainnya |
| `src/components/site/views/` (menyusul) | HomeView, AboutView, ArticleDetailView, dan lainnya |
| `src/components/site/contract/` (menyusul) | Komponen wajib SEO dan E-E-A-T |
| `src/components/admin/` (menyusul) | Tata letak dan form admin |
| `src/components/skeletons/` (menyusul) | RouteSkeleton dan bagian-bagiannya |
