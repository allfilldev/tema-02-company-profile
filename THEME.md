# Panduan Membuat Tema

Panduan ini untuk siapa pun (manusia atau AI) yang mengubah sebuah desain menjadi tema company profile. Tema hanya mengubah lapisan tampilan. Data, SEO, E-E-A-T, dan (kelak) panel admin sudah selesai di boilerplate dan tidak disentuh.

## 1. Buat tema

Dari folder boilerplate (`template-builder/boilerplates/company-profile/`) jalankan:

```bash
npm run theme:new -- <nama-tema>
```

- Nama tema: huruf kecil, angka, dan tanda hubung tunggal, diawali huruf, maksimal 40 karakter (contoh `arunika`, `kopi-nusantara`).
- Boilerplate harus bersih (tanpa perubahan yang belum di-commit), karena hanya commit yang disalin.
- Hasilnya repo git di `themes/company-profile/<nama-tema>/` dengan remote `upstream` ke boilerplate (URL `origin` boilerplate bila ada, kalau tidak path lokalnya; push ke `upstream` dinonaktifkan), `themeName` terisi di `src/config/theme.ts`, dan satu commit `init: create <nama-tema> theme`.

Lanjutkan di folder tema: `npm install`. Untuk pratinjau, tambahkan satu entri ke `template-builder/.claude/launch.json` dengan nama unik, port yang belum dipakai, dan `runtimeArgs` `["--prefix", "themes/company-profile/<nama-tema>", "run", "dev", "--", "--port", "<port>"]` (nilai `<port>` sama dengan field `port` entri itu).

## 2. Terima desain

Desain datang sebagai link Figma, screenshot, atau HTML. Catat semua teks, gambar, dan section yang ada di desain sebelum mulai.

## 3. Token

Isi `src/styles/tokens.css` (warna semantik, font, radius, bayangan, lebar container) dan cerminannya di `src/styles/tokens.ts` (`tokenValues` dan `ogTheme`), lalu font di `src/styles/fonts.ts`. Komponen hanya boleh memakai kelas Tailwind berbasis token: tanpa warna mentah dan tanpa arbitrary value.

Token warna ditulis sebagai hex 6 digit (`#rrggbb`), karena itulah yang dibaca tes kesamaan; nilai `oklch`, `rgba`, atau hex 3 digit dari desain dikonversi dulu.

Periksa: `npx vitest run tests/styles/tokens.test.ts` (kesamaan CSS dan TypeScript, serta disiplin token).

## 4. Komponen dasar

Sesuaikan gaya `src/components/ui/` bila desain memintanya (misalnya tombol pill). API props tidak boleh berubah.

## 5. Tampilan

Tulis ulang `src/components/site/layout/`, `src/components/site/sections/`, dan `src/components/site/views/` mengikuti desain. Data datang dari model yang sudah disediakan rute, jadi tidak ada pengambilan data baru. Formulir di `ContactView` sudah terhubung ke server action `submitContactMessage` lewat prop `onSubmit` (hanya bila bukan mode demo); view yang ditulis ulang harus tetap meneruskan prop itu ke `ContactForm`. Komponen di `src/components/site/contract/` (breadcrumb, byline dan kotak penulis, isi markdown, FAQ, navigasi hukum, tanggal artikel, JSON-LD) hanya boleh berubah kelas gayanya, bukan elemen, atribut, id, atau teks labelnya.

`src/components/site/layout/route-guard.tsx` tetap milik boilerplate: ia menjaga satu `<h1>` di DOM setelah navigasi klien, jadi hanya bagian tampilan lain di `layout/` yang boleh ditulis ulang.

Periksa dengan menjalankan tes di `tests/components/` satu berkas per perintah. Ada dua jenis tes:

- **Tes kontrak, tidak boleh diubah:** satu `<h1>` per halaman, urutan heading, tautan, komponen kontrak, tombol WhatsApp, `route-guard`, dan `loading` (`tests/components/contract/`, `tests/components/og/`, `tests/components/layout/`, `tests/components/sections/`, `tests/components/ui/`, `tests/components/views/articles.test.tsx`, `tests/components/views/catalog.test.tsx`, `tests/components/views/not-found.test.tsx`, `tests/components/views/image-priority.test.tsx`, `tests/components/skeletons/loading.test.tsx`). Mengubah tes ini agar tema lolos adalah tanda aturan dilanggar.
- **Tes kalibrasi desain, wajib disesuaikan oleh tema:** `tests/components/skeletons/skeletons.test.tsx` (urutan blok skeleton, kelas, dan tinggi tiap halaman) dan `tests/components/views/pages.test.tsx` (urutan section beranda). Keduanya mengunci desain bawaan, jadi tema dengan susunan section berbeda mengubah ekspektasinya sesuai desainnya sendiri. Jangan melemahkan pemeriksaan satu `<h1>` dan urutan heading di dalamnya.

## 6. Section tanpa modul

Section desain yang tidak punya modul (langkah kerja, keunggulan, FAQ beranda, banner ajakan) dideklarasikan sebagai blok konten di `src/config/theme.ts` (`contentBlocks`: `key`, `label`, `itemFields`, `minItems`, `maxItems`). Teks section tidak boleh ditulis langsung di view.

Perhatikan: isi bawaan sebuah blok berada di paket konten, dan `src/content/packs/` terkunci untuk tema. Blok baru yang belum ada di paket harus ditambahkan (beserta isinya) di boilerplate lebih dulu, lalu ditarik ke tema (lihat `UPDATING.md`). Sampai itu selesai, pakai blok yang sudah ada.

## 7. Modul dan paket konten

Atur `enabledModules` di `src/config/theme.ts` dan pilih `contentPack`. Modul yang dimatikan hilang dari navigasi, sitemap, RSS, dan `llms.txt`, dan rutenya menghasilkan 404 asli. Bila desain butuh isi industri yang belum ada, buat paket baru di boilerplate (`src/content/packs/<paket>/`), bukan di repo tema, supaya bisa dipakai ulang.

## 8. Skeleton

Sesuaikan `src/components/skeletons/` dengan susunan dan tinggi section yang baru, dengan selisih 20 px atau kurang pada lebar 1280 px, supaya halaman tidak melompat saat isi menggantikan skeleton. Perbarui ekspektasi urutan blok dan kelas di `tests/components/skeletons/skeletons.test.tsx` (tes kalibrasi desain, lihat langkah 5) agar sama dengan skeleton baru, lalu jalankan `npx vitest run tests/components/skeletons/skeletons.test.tsx` dan ukur di pratinjau browser.

## 9. Cek admin

Mode `DATA_SOURCE=supabase` dan login admin sudah tersedia. Panel di balik login masih berupa dashboard sementara sampai antarmuka admin selesai (Rencana 3b), jadi langkah ini baru memeriksa bahwa website publik berjalan di atas Supabase dengan token tema dan login berfungsi.

1. Siapkan `.env.local` di folder tema berisi `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `SUPABASE_DB_URL`, dan `CONTACT_IP_SALT` dari project Supabase pengembangan bersama (jangan di-commit).
2. `npm run db:migrate` (bila migrasi belum diterapkan), lalu `npm run seed:generate` dan `npm run db:seed -- --yes`. Perintah terakhir mengosongkan data konten, media, dan pesan di project bersama, lalu mengisinya dari paket konten tema ini.
3. `npm run admin:create -- <email>` bila akun admin belum ada (password diketik di terminal).
4. Jalankan pratinjau dengan `DATA_SOURCE=supabase` (entri `company-profile-supabase` di `.claude/launch.json`, port 3002), lalu periksa beranda, halaman layanan, artikel, dan kontak dengan token tema, serta login di `/admin/login`.

## 10. Demo

Identitas paket demo `general` adalah All Fill Dev: nama situs, nomor WhatsApp, dan teks nama tanpa logo gambar. Email, telepon, alamat, dan seluruh isi lain adalah contoh yang disesuaikan per tema lewat paket konten. Identitas ini hanya untuk demo katalog, situs klien memakai nama, logo, kontak, dan WhatsApp klien. Set favicon yang sudah ada di `public/` masih dibuat dari logo lama paket demo dan harus dibuat ulang dari simbol All Fill Dev.

1. Siapkan simbol persegi dari logo (wordmark panjang tidak terbaca di 16 dan 32 px), lalu jalankan `npm run favicon -- <simbol.png>`. Skrip menolak sumber yang tidak persegi.
2. Deploy ke Vercel dengan `DATA_SOURCE=demo` dan `SITE_INDEXING=off`. `SITE_URL` diisi alamat demo.
3. Catatan lisensi: foto manusia nyata dari Pexels di paket demo dipasangkan dengan testimoni fiktif. Foto itu harus diganti sebelum tema dipakai di situs klien.

## 11. Periksa

Jalankan `npm run theme:check`. Perintah ini harus lolos: ia melaporkan berkas folder terkunci yang berubah dan berkas yang perlu ditinjau. Lalu pastikan:

- Satu `<h1>` per halaman dan komponen kontrak utuh.
- Tidak ada nilai warna mentah dan tidak ada teks section yang ditulis langsung di view.
- Tombol "Chat WhatsApp Sekarang" ada.
- `structure.md` sudah diperbarui bila ada berkas yang ditambah, diganti nama, atau dipindah.

## Yang boleh diubah

`src/styles/`, `src/components/ui/` (gaya saja), `src/components/site/layout/` (kecuali `src/components/site/layout/route-guard.tsx`), `src/components/site/sections/`, `src/components/site/views/`, `src/components/site/og/` (kartu gambar Open Graph, memakai token), `src/components/skeletons/`, `src/config/theme.ts`, dan favicon di `public/`.

## Yang tidak boleh diubah

Folder berikut terkunci. Perubahan di sini dikerjakan di boilerplate, lalu ditarik ke tema lewat `upstream`. `npm run theme:check` melaporkan setiap berkas yang berubah di sana, dan konflik saat menarik pembaruan di folder ini berarti aturan dilanggar.

- `src/core/`
- `src/infrastructure/`
- `src/server/`
- `src/lib/`
- `src/app/`
- `src/proxy.ts`
- `src/components/site/layout/route-guard.tsx`
- `src/content/packs/`
- `src/components/admin/`
- `supabase/`
- `docs/rules/`
- `scripts/`
- `next.config.ts`
- `public/demo/`
- `docs/credits/`

## Yang perlu ditinjau

Perubahan di sini tidak otomatis pelanggaran, tetapi `npm run theme:check` mencantumkannya untuk ditinjau:

- `src/components/site/contract/`: hanya kelas gaya yang boleh berubah.
- `package.json` dan `package-lock.json`: dependensi tambahan harus benar-benar dibutuhkan desain.
- `tests/`: tes baru boleh ditambah, dan dua tes kalibrasi desain (langkah 5) disesuaikan dengan desain tema. Tes kontrak yang sudah ada tidak diubah supaya tema lolos.
