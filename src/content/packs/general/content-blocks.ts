import type { ContentBlock, ContentBlockItem } from "@/core/domain/content-block/content-block";

function iconItem(title: string, description: string, icon: string): ContentBlockItem {
  return { title, description, icon, media: null, link: null };
}

function faqItem(question: string, answer: string): ContentBlockItem {
  return { title: question, description: answer, icon: null, media: null, link: null };
}

function linkItem(label: string, href: string): ContentBlockItem {
  return { title: null, description: null, icon: null, media: null, link: { label, href } };
}

export const generalContentBlocks: ContentBlock[] = [
  {
    key: "how-we-work",
    eyebrow: "Cara kerja",
    title: "Empat tahap pendampingan kami",
    description: "Setiap proyek mengikuti alur yang sama, sehingga Anda tahu apa yang dikerjakan di setiap tahap.",
    items: [
      iconItem(
        "Diagnosis",
        "Kami mengamati proses di lapangan, mewawancarai tim, dan membaca data yang ada untuk menemukan akar masalah.",
        "search",
      ),
      iconItem(
        "Perancangan solusi",
        "Rekomendasi, SOP, KPI, atau rancangan sistem disusun bersama tim Anda dan disepakati sebelum dijalankan.",
        "clipboard-list",
      ),
      iconItem(
        "Pendampingan implementasi",
        "Kami mendampingi uji coba, pelatihan, dan masa transisi sampai cara kerja baru berjalan.",
        "users",
      ),
      iconItem(
        "Evaluasi dan serah terima",
        "Hasil ditinjau dengan ukuran yang disepakati di awal, lalu kami serahkan panduan agar tim bisa merawatnya sendiri.",
        "chart-line",
      ),
    ],
  },
  {
    key: "why-choose-us",
    eyebrow: "Keunggulan",
    title: "Mengapa bekerja dengan All Fill Dev",
    description: "Pendekatan kami sederhana: memahami pekerjaan Anda dulu, baru menyarankan perubahan.",
    items: [
      iconItem(
        "Berbasis lapangan",
        "Rekomendasi kami lahir dari pengamatan langsung di tempat kerja, bukan sekadar dari presentasi.",
        "map-pin",
      ),
      iconItem(
        "Bahasa yang mudah dipahami",
        "Dokumen dan laporan ditulis agar bisa dipahami pemilik usaha sampai staf yang baru bergabung.",
        "message-circle",
      ),
      iconItem(
        "Bertahap sesuai kemampuan",
        "Perubahan dirancang bertahap, disesuaikan dengan anggaran dan kesiapan tim Anda.",
        "layers",
      ),
      iconItem(
        "Bisa dirawat sendiri",
        "Setiap proyek ditutup dengan serah terima dan panduan, sehingga Anda tidak bergantung pada kami.",
        "shield-check",
      ),
    ],
  },
  {
    key: "home-faq",
    eyebrow: "FAQ",
    title: "Pertanyaan yang sering diajukan",
    description: null,
    items: [
      faqItem(
        "Apakah All Fill Dev melayani UMKM?",
        "Ya. Kami melayani UMKM, perusahaan menengah, dan korporasi. Cakupan pekerjaan kami sesuaikan dengan ukuran dan kebutuhan usaha Anda.",
      ),
      faqItem(
        "Bagaimana proses konsultasi dimulai?",
        "Hubungi kami lewat formulir kontak atau WhatsApp. Kami menjadwalkan diskusi awal untuk memahami kebutuhan Anda, lalu mengirim usulan ruang lingkup dan jadwal kerja.",
      ),
      faqItem(
        "Apakah konsultasi bisa dilakukan secara daring?",
        "Bisa. Diskusi dan pelatihan dapat dilakukan secara daring maupun tatap muka. Untuk diagnosis proses, kami biasanya tetap perlu melihat langsung tempat kerja Anda.",
      ),
      faqItem(
        "Berapa lama satu proyek berlangsung?",
        "Tergantung ruang lingkupnya. Penyusunan beberapa SOP bisa selesai dalam hitungan minggu, sedangkan migrasi sistem bisa memakan waktu beberapa bulan. Perkiraan jadwal kami cantumkan di usulan kerja.",
      ),
    ],
  },
  {
    key: "cta-banner",
    eyebrow: "Mulai sekarang",
    title: "Siap merapikan proses bisnis Anda?",
    description: "Ceritakan tantangan yang sedang Anda hadapi. Kami bantu memetakan langkah pertama yang paling masuk akal.",
    items: [linkItem("Jadwalkan Konsultasi", "/kontak"), linkItem("Lihat Layanan", "/layanan")],
  },
];
