import type { TeamMember } from "@/core/domain/team/team-member";
import { generalMedia } from "@/content/packs/general/media";

export const generalTeam: TeamMember[] = [
  {
    id: "team-larasati",
    name: "Larasati Wibowo",
    jobTitle: "Managing Partner",
    bio: "Larasati mendirikan All Fill Dev pada 2017 dan memimpin layanan konsultasi strategi bisnis. Ia banyak mendampingi pemilik usaha keluarga dan perusahaan menengah dalam menyusun rencana pertumbuhan dan struktur organisasi.",
    photo: generalMedia["team-1"],
    yearsExperience: 16,
    profiles: [],
    sortOrder: 1,
  },
  {
    id: "team-dimas",
    name: "Dimas Prasetyo",
    jobTitle: "Lead Konsultan Transformasi Digital",
    bio: "Dimas memimpin proyek digitalisasi dan migrasi sistem di All Fill Dev, mulai dari pemilihan aplikasi sampai pendampingan saat sistem mulai dipakai. Ia terbiasa menjembatani kebutuhan tim operasional dengan vendor teknologi.",
    photo: generalMedia["team-2"],
    yearsExperience: 11,
    profiles: [],
    sortOrder: 2,
  },
  {
    id: "team-hendra",
    name: "Hendra Kusuma",
    jobTitle: "Lead Konsultan Proses dan SOP",
    bio: "Hendra memimpin penyusunan SOP dan audit operasional di All Fill Dev. Ia sudah memetakan proses kerja di sektor distribusi, layanan kesehatan, dan koperasi, dan percaya prosedur terbaik adalah yang ditulis bersama pelaksananya.",
    photo: generalMedia["team-3"],
    yearsExperience: 13,
    profiles: [],
    sortOrder: 3,
  },
  {
    id: "team-nadia",
    name: "Nadia Rahmawati",
    jobTitle: "Lead Konsultan Kinerja dan SDM",
    bio: "Nadia menangani perancangan KPI dan program pelatihan SDM di All Fill Dev. Ia berfokus membuat sistem pengukuran kinerja yang sederhana, dipahami semua level, dan benar-benar dipakai dalam rapat rutin.",
    photo: generalMedia["team-4"],
    yearsExperience: 10,
    profiles: [],
    sortOrder: 4,
  },
];
