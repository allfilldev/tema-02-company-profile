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
| `npm run seed:generate` | Menulis `supabase/seed.sql` dari paket konten tema (tidak di-commit) |
| `npm run db:migrate` | Menerapkan migrasi ke project di `SUPABASE_DB_URL` (`.env.local`) |
| `npm run db:seed -- --yes` | Mengosongkan lalu mengisi data konten project Supabase dari `seed.sql` |
| `npm run admin:create -- <email>` | Membuat akun admin (password diketik di terminal) |
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
- `DATA_SOURCE`: `demo` untuk paket konten demo, atau `supabase` untuk membaca data dari Supabase dan mengaktifkan login admin.

Build mengunduh font dari jaringan, jadi lingkungan build harus punya akses internet.

### Mode Supabase

Dengan `DATA_SOURCE=supabase`, host (misalnya Vercel) wajib memiliki variabel berikut, dan semuanya harus ada sebelum `npm run build`:

- `SUPABASE_URL`: alamat project (`https://...supabase.co`).
- `SUPABASE_PUBLISHABLE_KEY`: kunci publik (anon atau publishable).
- `CONTACT_IP_SALT`: garam acak panjang untuk menghash alamat IP pengirim form kontak. Tanpa ini setiap pesan dari form kontak gagal dan hanya tercatat di log server.

`SUPABASE_SECRET_KEY` dan `SUPABASE_DB_URL` hanya dipakai skrip di komputer pengembang (`.env.local`, `npm run db:migrate`, `db:seed`, `admin:create`). Jangan atur keduanya di host.

## Panel admin

Dengan `DATA_SOURCE=supabase`, klien yang sudah login di `/admin/login` bisa mengubah isi yang dinamis. Di mode demo semua rute `/admin` menghasilkan 404.

| Rute | Isi |
|---|---|
| `/admin` | Dashboard: jumlah item per modul aktif dan pesan yang belum dibaca |
| `/admin/layanan`, `/admin/portofolio`, `/admin/tim`, `/admin/statistik`, `/admin/testimoni`, `/admin/partner`, `/admin/artikel` | Daftar, `/baru`, dan `/<id>` untuk setiap modul. Hanya modul yang aktif di tema yang tampil di menu; menu Tim juga tampil bila artikel aktif |
| `/admin/pesan` | Pesan masuk dari form kontak: tandai dibaca dan hapus |
| `/admin/media` | Pustaka gambar: unggah (browser mengecilkan foto ke 1920 px dan logo ke 600 px, server mengubahnya ke WebP di bawah 100 KB), ubah teks alternatif, hapus |
| `/admin/pengaturan` | Seluruh pengaturan situs, dengan peringatan judul halaman yang akan terpotong bila nama situs diubah |

Aturan yang dijaga panel:

- Draf boleh disimpan dengan isian minimal (judul atau nama dan slug). Saat menerbitkan, dan saat menyimpan item yang sudah terbit, semua aturan wajib (meta title dan description, FAQ, alt gambar, catatan kaki, tautan ke modul yang mati) memblokir penyimpanan.
- Artikel hanya bisa terbit bila penulisnya anggota tim yang terbit. Anggota tim yang masih menjadi penulis tidak bisa dihapus, dan yang menjadi penulis artikel terbit tidak bisa ditarik. Tanggal terbit artikel diisi otomatis dan tidak bisa diubah.
- Mengubah slug item terbit membuat URL lama menjadi 404 (peringatan tampil di formulir). Perubahan langsung tampil di website publik tanpa deploy ulang.
- Gambar yang masih dipakai konten tidak bisa dihapus.
- Isi permintaan server action dibatasi 4 MB (`bodySizeLimit` di `next.config.ts`), sehingga unggahan yang sudah dikecilkan browser tetap di bawah batas permintaan Vercel.
