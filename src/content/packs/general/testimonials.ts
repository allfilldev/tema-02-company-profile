import type { Testimonial } from "@/core/domain/testimonial/testimonial";
import { generalMedia } from "@/content/packs/general/media";

export const generalTestimonials: Testimonial[] = [
  {
    id: "testimonial-maya-kartika",
    name: "Maya Kartika",
    jobTitle: "Pemilik",
    company: "Kafe Teras Pagi",
    quote:
      "Dulu setiap barista punya cara sendiri meracik menu. Setelah SOP disusun bersama tim Arunika, rasa minuman di dua outlet kami seragam dan karyawan baru lebih cepat mandiri.",
    photo: generalMedia["testimonial-1"],
    sortOrder: 1,
  },
  {
    id: "testimonial-fitri-handayani",
    name: "Fitri Handayani",
    jobTitle: "Manajer Operasional",
    company: "Klinik Medivara",
    quote:
      "Alur pendaftaran pasien di semua cabang kini mengikuti prosedur yang sama. Yang paling kami hargai, dokumennya disusun bersama perawat dan resepsionis, bukan dari balik meja.",
    photo: generalMedia["testimonial-2"],
    sortOrder: 2,
  },
  {
    id: "testimonial-bagas-saputra",
    name: "Bagas Saputra",
    jobTitle: "Pendiri",
    company: "Taniwara",
    quote:
      "Kami sempat ragu memulai digitalisasi gudang karena takut ribet. Ternyata prosesnya bertahap, dimulai dari merapikan kode barang, sehingga tim gudang tidak kaget saat aplikasi mulai dipakai.",
    photo: generalMedia["testimonial-3"],
    sortOrder: 3,
  },
  {
    id: "testimonial-clara-wijaya",
    name: "Clara Wijaya",
    jobTitle: "Pemilik",
    company: "Kedai Kopi Lembayung",
    quote:
      "Sesi konsultasi strategi membantu saya melihat menu mana yang benar-benar menguntungkan. Sekarang saya punya beberapa angka sederhana yang saya pantau setiap minggu.",
    photo: generalMedia["testimonial-4"],
    sortOrder: 4,
  },
  {
    id: "testimonial-anggi-pratiwi",
    name: "Anggi Pratiwi",
    jobTitle: "Pemilik",
    company: "Toko Bunga Kirana",
    quote:
      "Pelatihan layanan pelanggannya sangat praktis. Tim kami belajar menangani komplain lewat simulasi, bukan sekadar teori, dan sekarang mereka jauh lebih tenang menghadapi pelanggan yang kecewa.",
    photo: generalMedia["testimonial-5"],
    sortOrder: 5,
  },
];
