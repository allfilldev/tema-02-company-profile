# Boilerplate Company Profile

Boilerplate Next.js untuk memproduksi tema website company profile. Satu salinan boilerplate (lewat `npm run theme:new`) menjadi satu tema dengan satu desain, yang dideploy sebagai demo katalog dalam mode demo tanpa Supabase.

## Memulai

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Nilai bawaan: `DATA_SOURCE=demo` dan `SITE_INDEXING=off` (lihat `.env.example`).

## Skrip

| Perintah | Fungsi |
|---|---|
| `npm run dev`, `npm run build`, `npm run start` | Server pengembangan, build, dan server produksi |
| `npm run theme:new -- <nama-tema>` | Membuat tema baru di `../../themes/company-profile/<nama-tema>/` (dijalankan dari boilerplate) |
| `npm run theme:check` | Melaporkan perubahan di folder terkunci (dijalankan di dalam tema) |
| `npm run favicon -- <simbol.png>` | Membuat set favicon dari simbol persegi |
| `npm run image:import -- <file> <paket> <nama> [--logo]` | Mengonversi gambar demo ke WebP |

## Dokumen

- `THEME.md`: cara mengubah desain menjadi tema.
- `UPDATING.md`: cara membawa pembaruan boilerplate ke tema.
- `structure.md`: peta struktur proyek.
- `docs/rules/`: aturan kode, SEO, dan E-E-A-T.

## Deploy

Tiga variabel lingkungan ditanam saat build untuk halaman yang diprarender (canonical, sitemap, robots, RSS, JSON-LD, dan URL Open Graph), jadi semuanya harus diatur sebelum `npm run build`, bukan sesudahnya:

- `SITE_URL`: alamat produksi tanpa path, query, atau hash, misalnya `https://contoh.co.id`. Build produksi dengan `SITE_INDEXING=on` akan gagal bila kosong atau mengarah ke localhost.
- `SITE_INDEXING`: biarkan `off` (atau kosong) sampai situs resmi tayang, lalu ubah ke `on` dan build ulang.
- `DATA_SOURCE`: `demo` untuk paket konten demo. `supabase` belum tersedia.

Build mengunduh font dari jaringan, jadi lingkungan build harus punya akses internet.
