import type { AboutContent } from "@/core/domain/page/about-content";
import { generalMedia } from "@/content/packs/general/media";

const bodyMd = `## Siapa kami?

Perusahaan kami berdiri di Jakarta pada 2017. Kami berawal dari tim kecil yang membantu usaha keluarga menuliskan cara kerja mereka, lalu berkembang menjadi konsultan manajemen dan transformasi digital untuk UMKM maupun korporasi.

Cara kami memandang pekerjaan ini sederhana: membuat proses yang selama ini samar menjadi terang, sehingga pemilik dan tim bisa mengambil keputusan dengan lebih yakin.

## Bagaimana kami bekerja?

Kami tidak datang membawa template siap pakai. Setiap proyek dimulai dari diagnosis di lapangan: mengamati pekerjaan, mewawancarai tim, dan membaca data yang sudah ada. Rekomendasi baru disusun setelah masalahnya jelas.

Setelah itu kami bekerja berdampingan dengan tim klien sampai solusinya berjalan. Dokumen, sistem, dan pelatihan yang kami serahkan dirancang agar bisa dirawat sendiri oleh klien setelah proyek selesai.

## Siapa yang kami layani?

- Pemilik UMKM yang ingin usahanya tidak lagi bergantung pada satu orang.
- Perusahaan menengah yang sedang menambah cabang atau lini usaha.
- Korporasi yang membutuhkan pendamping independen untuk audit proses, migrasi sistem, atau pelatihan.`;

export const generalAbout: AboutContent = {
  summary:
    "Kami adalah konsultan manajemen dan transformasi digital di Jakarta yang membantu UMKM dan korporasi merapikan proses, mengukur kinerja, dan memakai teknologi secara tepat guna.",
  bodyMd,
  image: generalMedia.about,
  metaTitle: "Tentang Kami, Konsultan Manajemen Jakarta",
  metaDescription:
    "Kenali kami, konsultan manajemen dan transformasi digital di Jakarta yang membantu UMKM dan korporasi merapikan proses dan mengukur kinerja.",
  updatedAt: "2026-11-10T03:00:00.000Z",
};
