# Membawa Pembaruan Boilerplate ke Tema

Perbaikan dan fitur baru selalu dikerjakan di boilerplate lebih dulu, lalu ditarik ke setiap tema. Tema tidak pernah mendorong ke boilerplate: URL push remote `upstream` dinonaktifkan.

## Langkah di dalam folder tema

1. Pastikan `git status` bersih (commit atau simpan dulu perubahan tema).
2. Jalankan `npm run theme:check`. Bila ada berkas folder terkunci yang berubah, kembalikan dulu (lihat bagian konflik).
3. Ambil pembaruan: `git fetch upstream`.
4. Gabungkan: `git merge upstream/main`.
5. Jalankan `npm install` bila `package-lock.json` ikut berubah.
6. Jalankan, satu berkas per perintah, tes yang relevan (`npx vitest run <satu-berkas>`), terutama tes di `tests/components/` dan `tests/styles/`.
7. Deploy ulang demo.

Memakai `git merge upstream/main` dan bukan `git pull upstream` disengaja: cabang tema pasti sudah menyimpang dari boilerplate, dan `git pull` tanpa strategi eksplisit berhenti dengan pertanyaan.

## Konflik

- **Folder terkunci** (daftar lengkap di `THEME.md`): konflik di sini berarti tema mengubah folder yang seharusnya tidak disentuh. Kembalikan berkas itu ke versi boilerplate dengan `git checkout upstream/main -- <path>` dan pindahkan kebutuhannya ke boilerplate.
- **`src/config/theme.ts`**: pertahankan `themeName` milik tema, ambil sisanya dari boilerplate bila itu pembaruan inti, dan pertahankan `enabledModules`, `contentPack`, dan `contentBlocks` pilihan tema.
- **`structure.md`**: berkasnya dipakai bersama, dan barisnya panjang sehingga konflik mudah terjadi. Ambil baris boilerplate untuk berkas milik boilerplate, pertahankan baris tema untuk berkas milik tema.
- **Tes kalibrasi desain** (`tests/components/skeletons/skeletons.test.tsx` dan `tests/components/views/pages.test.tsx`, lihat `THEME.md`): pertahankan versi tema, lalu baca perubahan boilerplate pada berkas itu dan terapkan pemeriksaan barunya (misalnya pemeriksaan heading) pada ekspektasi tema.
- **`package.json` dan `package-lock.json`**: gabungkan dependensi tema dengan dependensi baru boilerplate, lalu `npm install` untuk membangun ulang lockfile.

## Mengarahkan ulang `upstream`

`upstream` memakai URL `origin` boilerplate saat tema dibuat, atau path lokal bila boilerplate belum punya `origin`. Bila folder berpindah atau tema di-clone di mesin lain, arahkan ulang dengan `git remote set-url upstream <url-boilerplate>`, dan nonaktifkan push dengan `git remote set-url --push upstream DISABLED`.

## Aturan migrasi database

Migrasi database hanya boleh menambah: tabel baru, kolom baru dengan nilai bawaan, atau fungsi baru. Migrasi tidak boleh menghapus atau mengganti nama kolom yang dipakai versi sebelumnya, supaya situs yang kelak dibangun dari tema tetap bisa menerima pembaruan.
