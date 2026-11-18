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
| `tests/` | Tes Vitest, mengikuti struktur `src/` (saat ini `tests/lib/text/`, `tests/lib/seo/`, `tests/lib/markdown/`) |
| `public/` | Aset statis |
| `public/demo/<paket>/` (menyusul) | Gambar demo WebP per paket konten |
| `supabase/migrations/` (menyusul) | Skema, RLS, fungsi, bucket storage |
| `supabase/seed.sql` (menyusul) | Hasil generate dari paket konten, tidak diedit manual |
| `scripts/` (menyusul) | create-theme, generate-seed, create-admin, generate-favicon |

## src/

| Path | Tanggung jawab |
|---|---|
| `src/app/` | Rute Next.js. Saat ini masih berisi `layout.tsx`, `page.tsx`, `globals.css` bawaan scaffold |
| `src/app/(site)/` (menyusul) | Website publik |
| `src/app/admin/` (menyusul) | Panel admin |
| `src/core/domain/` (menyusul) | Entity dan interface repository per modul |
| `src/core/application/` (menyusul) | Use case dan skema Zod per modul |
| `src/infrastructure/supabase/` (menyusul) | Client, repository, storage |
| `src/infrastructure/fixtures/` (menyusul) | Repository yang membaca paket konten |
| `src/infrastructure/images/` (menyusul) | Konversi WebP dengan sharp |
| `src/content/packs/<paket>/` (menyusul) | Paket konten demo |
| `src/server/actions/` (menyusul) | Server actions publik dan admin |
| `src/server/container.ts` (menyusul) | Memilih repository sesuai `DATA_SOURCE` |
| `src/lib/text/` | Utilitas teks murni: `slug.ts` berisi `slugify` dan `isValidSlug` |
| `src/lib/seo/` | `limits.ts` (batas panjang dan jumlah untuk SEO), `title.ts` (`titleSuffix`, `maxMetaTitleLength`, `buildPageTitle`), `content-checks.ts` (`runContentChecks` dan `hasBlockingErrors`, pesan dalam bahasa Indonesia). Builder metadata dan JSON-LD menyusul |
| `src/lib/markdown/` | Analisis markdown murni: `code-blocks.ts` (membuang blok kode berpagar), `headings.ts` (`extractHeadings`, `analyzeHeadings`), `words.ts` (`countWords`), `links.ts` (`countLinks` internal dan eksternal) |
| `src/config/theme.ts` (menyusul) | Konfigurasi tema |
| `src/hooks/` (menyusul) | Hook client |
| `src/styles/` (menyusul) | `tokens.css`, `globals.css`, `fonts.ts` |
| `src/components/ui/` (menyusul) | Komponen dasar, dipakai publik dan admin |
| `src/components/site/layout/` (menyusul) | Header, Footer, WhatsAppButton |
| `src/components/site/sections/` (menyusul) | Hero, ServicesSection, PortfolioSection, dan lainnya |
| `src/components/site/views/` (menyusul) | HomeView, AboutView, ArticleDetailView, dan lainnya |
| `src/components/site/contract/` (menyusul) | Komponen wajib SEO dan E-E-A-T |
| `src/components/admin/` (menyusul) | Tata letak dan form admin |
| `src/components/skeletons/` (menyusul) | RouteSkeleton dan bagian-bagiannya |
