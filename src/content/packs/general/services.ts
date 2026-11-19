import type { Service } from "@/core/domain/service/service";
import { generalMedia } from "@/content/packs/general/media";

export const generalServices: Service[] = [
  {
    id: "service-konsultasi-strategi-bisnis",
    slug: "konsultasi-strategi-bisnis",
    title: "Konsultasi Strategi Bisnis",
    summary: "Merumuskan arah usaha, prioritas, dan rencana kerja yang realistis berdasarkan data dan kondisi lapangan.",
    bodyMd: `## Untuk siapa layanan ini?

Layanan ini cocok bagi pemilik usaha dan manajemen yang merasa bisnisnya bergerak, tetapi arahnya kurang jelas.

Misalnya, penjualan naik namun laba tidak ikut naik, rencana membuka cabang belum punya hitungan yang kuat, atau tim sibuk mengerjakan terlalu banyak inisiatif sekaligus.

Kami juga sering diminta mendampingi saat bisnis berada di titik peralihan, misalnya ketika generasi kedua mulai memimpin usaha keluarga atau ketika perusahaan bersiap mencari pendanaan.

## Apa yang kami kerjakan?

### Diagnosis kondisi usaha

Kami meninjau data penjualan, biaya, dan operasional yang tersedia, lalu mewawancarai pemilik serta tim kunci. Tujuannya menemukan dua atau tiga masalah utama yang paling memengaruhi kinerja.

### Prioritas dan rencana kerja

Dari hasil diagnosis, kami menyusun beberapa pilihan strategi beserta konsekuensinya. Setelah Anda memilih, strategi itu kami turunkan menjadi rencana kerja per kuartal, lengkap dengan penanggung jawab dan ukuran keberhasilan.

### Tinjauan berkala

Strategi baru teruji saat dijalankan. Karena itu, kami menyediakan sesi tinjauan berkala untuk membahas kemajuan, hambatan, dan penyesuaian yang diperlukan.

Di setiap sesi, rencana dibandingkan dengan hasil untuk menyepakati apa yang perlu dipertahankan, diubah, atau dihentikan.

## Apa yang Anda terima?

- Ringkasan diagnosis dan akar masalah utama.
- Dokumen strategi satu halaman yang mudah dibagikan ke tim.
- Rencana kerja kuartalan beserta KPI pendukungnya.`,
    cover: generalMedia["service-konsultasi-strategi-bisnis"],
    metaTitle: "Konsultasi Strategi Bisnis untuk UMKM",
    metaDescription:
      "Konsultasi strategi bisnis untuk UMKM dan perusahaan: diagnosis kondisi usaha, penentuan prioritas, dan rencana kerja kuartalan yang realistis.",
    faq: [
      {
        question: "Apakah layanan ini hanya untuk perusahaan besar?",
        answer: "Tidak. Kami juga melayani UMKM. Kedalaman analisis kami sesuaikan dengan ukuran usaha dan data yang tersedia.",
      },
      {
        question: "Data apa saja yang perlu disiapkan?",
        answer:
          "Cukup data yang sudah Anda miliki, seperti laporan penjualan, catatan biaya, dan struktur tim. Bila datanya belum rapi, merapikannya menjadi bagian dari pekerjaan awal.",
      },
      {
        question: "Apakah kami ikut menjalankan strateginya?",
        answer:
          "Kami mendampingi lewat sesi tinjauan berkala. Pelaksanaan sehari-hari tetap dipegang tim Anda agar perubahan berjalan berkelanjutan.",
      },
    ],
    sortOrder: 1,
    updatedAt: "2026-10-06T03:00:00.000Z",
  },
  {
    id: "service-transformasi-digital",
    slug: "transformasi-digital",
    title: "Pendampingan Transformasi Digital",
    summary: "Memilih, menyiapkan, dan menjalankan sistem digital yang sesuai dengan proses dan kemampuan tim Anda.",
    bodyMd: `## Kapan bisnis membutuhkan layanan ini?

Layanan ini cocok bila Anda berencana mengganti pencatatan manual dengan aplikasi, sedang memilih sistem baru seperti ERP atau aplikasi kasir, atau merasa sistem yang sudah dibeli belum dipakai dengan maksimal oleh tim.

Layanan ini juga relevan bagi perusahaan yang ingin menghubungkan beberapa aplikasi terpisah, agar data tidak lagi dipindahkan secara manual dari satu bagian ke bagian lain.

## Bagaimana kami mendampingi?

### Pemetaan proses dan kebutuhan

Kami memetakan proses yang akan didigitalkan, memeriksa kesiapan data, dan menyusun daftar kebutuhan yang diurutkan berdasarkan prioritas.

### Pemilihan solusi

Kami membantu membandingkan pilihan solusi, mulai dari aplikasi siap pakai sampai sistem yang dibuat khusus. Perbandingan disusun berdasarkan kebutuhan Anda, bukan berdasarkan merek tertentu.

Kami juga membantu menyusun pertanyaan untuk vendor, menilai demo, dan memeriksa biaya jangka panjang di luar harga awal.

### Implementasi dan masa transisi

Kami mendampingi persiapan data, uji coba, pelatihan pemakai, dan masa peralihan dari cara lama ke sistem baru, sampai tim Anda percaya diri memakainya.

Setelah sistem berjalan, kami mengadakan evaluasi bersama pemakai untuk memastikan fitur penting benar-benar dipakai.

## Apa yang Anda terima?

- Peta proses dan daftar kebutuhan sistem.
- Matriks perbandingan pilihan solusi.
- Rencana implementasi dan migrasi data.
- Materi pelatihan untuk pemakai dan penanggung jawab internal.`,
    cover: generalMedia["service-transformasi-digital"],
    metaTitle: "Pendampingan Transformasi Digital",
    metaDescription:
      "Pendampingan transformasi digital dari pemetaan proses, pemilihan aplikasi, migrasi data, sampai pelatihan tim agar sistem baru benar-benar dipakai.",
    faq: [
      {
        question: "Apakah kami menjual atau membuat aplikasi?",
        answer:
          "Tidak. Kami berperan sebagai pendamping yang membantu Anda memilih dan menerapkan solusi. Pengembangan atau lisensi aplikasi tetap dilakukan oleh vendor pilihan Anda.",
      },
      {
        question: "Apakah layanan ini cocok untuk usaha kecil?",
        answer:
          "Cocok. Untuk usaha kecil, kami biasanya memulai dari langkah sederhana seperti merapikan pencatatan sebelum memilih aplikasi.",
      },
      {
        question: "Bagaimana keamanan data selama migrasi?",
        answer:
          "Kami menyusun prosedur migrasi yang membatasi akses data hanya untuk pihak yang berkepentingan dan memastikan ada cadangan data sebelum perpindahan dilakukan.",
      },
    ],
    sortOrder: 2,
    updatedAt: "2026-10-06T03:00:00.000Z",
  },
  {
    id: "service-penyusunan-sop",
    slug: "penyusunan-sop",
    title: "Penyusunan SOP",
    summary: "Menyusun SOP yang ditulis bersama pelaksananya, mudah dipahami, dan benar-benar dipakai di lapangan.",
    bodyMd: `## Mengapa SOP sering tidak dipakai?

Banyak perusahaan sudah memiliki SOP, tetapi dokumennya tersimpan di lemari dan jarang dibuka.

Penyebabnya hampir selalu sama: prosedur ditulis tanpa melibatkan pelaksana, bahasanya terlalu teknis, atau isinya sudah tidak sesuai dengan cara kerja terbaru.

Kami menyusun prosedur dengan urutan sebaliknya: dimulai dari lapangan dan ditulis bersama orang yang menjalankannya.

## Bagaimana kami menyusunnya?

### Pemetaan proses di lapangan

Kami mengamati pekerjaan secara langsung dan mewawancarai orang yang menjalankannya. Hasilnya berupa peta alur proses yang disepakati bersama sebelum prosedur ditulis.

Pada tahap ini sering ditemukan langkah ganda atau persetujuan berlapis yang bisa dipangkas lebih dulu.

### Penulisan bersama tim

Draf ditulis dengan kalimat pendek, satu tindakan per langkah, dan dilengkapi formulir atau checklist pendukung. Formatnya kami sesuaikan dengan kebiasaan tim, bisa berupa daftar langkah, diagram alur, atau checklist bergambar.

### Uji coba dan pengesahan

Setiap prosedur diuji oleh pelaksana sebelum disahkan. Masukan dari uji coba kami pakai untuk memperbaiki bagian yang membingungkan. Setelah disahkan, kami membantu sosialisasi agar tim memahami alasan di balik prosedur, bukan sekadar mematuhinya.

## Apa yang Anda terima?

- Dokumen SOP lengkap dengan nomor revisi dan penanggung jawab.
- Peta alur proses untuk setiap prosedur.
- Formulir dan checklist pendukung.
- Panduan singkat cara memperbarui dokumen secara mandiri.`,
    cover: generalMedia["service-penyusunan-sop"],
    metaTitle: "Jasa Penyusunan SOP Perusahaan",
    metaDescription:
      "Jasa penyusunan SOP yang ditulis bersama pelaksananya: pemetaan proses di lapangan, penulisan prosedur yang mudah dipahami, uji coba, dan pengesahan.",
    faq: [
      {
        question: "Berapa banyak SOP yang bisa disusun dalam satu proyek?",
        answer:
          "Jumlahnya bergantung pada ruang lingkup yang disepakati. Kami biasanya menyarankan mulai dari proses yang paling berdampak, lalu menambah secara bertahap.",
      },
      {
        question: "Apakah SOP bisa disusun untuk beberapa cabang sekaligus?",
        answer:
          "Bisa. Kami menyusun prosedur inti yang berlaku di semua cabang, lalu mencatat penyesuaian yang memang diperlukan di masing-masing lokasi.",
      },
      {
        question: "Apakah SOP ini bisa dipakai untuk persiapan ISO 9001?",
        answer:
          "Prosedur yang kami susun bisa menjadi bagian dari dokumentasi sistem manajemen mutu. Namun, sertifikasinya dilakukan oleh lembaga sertifikasi yang terpisah.",
      },
    ],
    sortOrder: 3,
    updatedAt: "2026-10-06T03:00:00.000Z",
  },
  {
    id: "service-manajemen-proyek",
    slug: "manajemen-proyek",
    title: "Pendampingan Manajemen Proyek",
    summary: "Menjaga proyek penting tetap sesuai jadwal, anggaran, dan sasaran lewat perencanaan dan pemantauan yang disiplin.",
    bodyMd: `## Kapan layanan ini dibutuhkan?

Layanan ini cocok untuk proyek yang penting bagi bisnis tetapi melibatkan banyak pihak, seperti pembukaan cabang, peluncuran produk, relokasi gudang, atau penerapan sistem baru.

Pada proyek seperti ini, keterlambatan kecil di satu bagian mudah merembet ke bagian lain.

Kami juga bisa masuk di tengah jalan, ketika proyek yang sudah berjalan mulai tertinggal dan butuh penataan ulang.

## Bagaimana kami mendampingi?

### Perencanaan proyek

Bersama tim Anda, kami menyusun ruang lingkup, jadwal, pembagian peran, anggaran, dan daftar risiko. Semua pihak menyepakati rencana ini sebelum pekerjaan dimulai.

Rencana dibuat cukup rinci untuk dipantau, tetapi tetap sederhana agar mudah diperbarui saat kondisi berubah.

### Pemantauan rutin

Kami memfasilitasi rapat kemajuan berkala, memperbarui jadwal, dan menandai pekerjaan yang mulai tertinggal. Masalah dibahas lebih awal, sebelum menjadi keterlambatan besar.

Setiap keputusan penting dan perubahan ruang lingkup dicatat, sehingga semua pihak memegang informasi yang sama.

### Penutupan dan evaluasi

Di akhir proyek, kami menyusun catatan pelajaran yang bisa dipakai untuk proyek berikutnya, sehingga kemampuan tim Anda mengelola proyek ikut bertambah.

## Apa yang Anda terima?

- Rencana proyek dan jadwal yang disepakati semua pihak.
- Daftar risiko beserta rencana penanganannya.
- Laporan kemajuan berkala yang ringkas.
- Catatan evaluasi di akhir proyek.`,
    cover: generalMedia["service-manajemen-proyek"],
    metaTitle: "Pendampingan Manajemen Proyek",
    metaDescription:
      "Pendampingan manajemen proyek untuk pembukaan cabang, peluncuran produk, atau penerapan sistem: rencana, pemantauan rutin, dan evaluasi akhir proyek.",
    faq: [
      {
        question: "Apakah kami bertindak sebagai manajer proyek penuh?",
        answer:
          "Bisa keduanya. Kami dapat memegang peran manajer proyek, atau mendampingi manajer proyek internal Anda sebagai penasihat.",
      },
      {
        question: "Metode manajemen proyek apa yang dipakai?",
        answer:
          "Kami menyesuaikan dengan jenis proyeknya. Proyek dengan ruang lingkup tetap biasanya memakai perencanaan bertahap, sedangkan proyek yang kebutuhannya sering berubah lebih cocok dikerjakan dalam siklus pendek.",
      },
      {
        question: "Aplikasi apa yang dipakai untuk memantau proyek?",
        answer:
          "Bila memungkinkan, kami memakai alat yang sudah dikenal tim Anda. Bila belum ada, kami membantu memilih alat sederhana yang mudah dirawat setelah proyek selesai.",
      },
    ],
    sortOrder: 4,
    updatedAt: "2026-10-06T03:00:00.000Z",
  },
  {
    id: "service-pelatihan-sdm",
    slug: "pelatihan-sdm",
    title: "Pelatihan SDM",
    summary: "Pelatihan praktis untuk supervisor dan staf, dirancang dari masalah yang benar-benar terjadi di tempat kerja Anda.",
    bodyMd: `## Pelatihan seperti apa yang kami selenggarakan?

Kami merancang pelatihan dari masalah yang benar-benar terjadi di tempat kerja Anda. Karena itu, setiap program dimulai dengan wawancara singkat dan pengamatan, bukan langsung memilih modul dari katalog.

Program bisa berupa satu sesi singkat atau rangkaian beberapa pertemuan, tergantung tujuan dan waktu peserta.

Topik yang paling sering diminta antara lain:

- Kepemimpinan untuk supervisor baru.
- Layanan pelanggan dan penanganan keluhan.
- Penerapan SOP dan budaya kerja yang tertib.
- Membaca dan memakai KPI dalam rapat tim.

## Bagaimana pelatihannya berlangsung?

### Materi berbasis kasus

Contoh dan latihan diambil dari situasi sehari-hari peserta, sehingga materi mudah dikaitkan dengan pekerjaan mereka.

### Praktik dan simulasi

Sebagian besar waktu dipakai untuk praktik, bermain peran, dan diskusi kelompok. Peserta pulang dengan rencana tindakan yang bisa langsung dicoba.

Untuk topik tertentu, dokumen dan formulir milik perusahaan Anda kami pakai sebagai bahan latihan.

### Tindak lanjut

Beberapa minggu setelah pelatihan, kami mengadakan sesi tindak lanjut untuk membahas apa yang sudah diterapkan dan hambatan yang muncul. Atasan peserta juga kami libatkan, karena dukungan mereka menentukan apakah kebiasaan baru bertahan.

## Apa yang Anda terima?

- Rancangan program dan materi pelatihan.
- Laporan pelaksanaan beserta masukan peserta.
- Rekomendasi tindak lanjut untuk atasan peserta.`,
    cover: generalMedia["service-pelatihan-sdm"],
    metaTitle: "Pelatihan SDM yang Praktis dan Terarah",
    metaDescription:
      "Pelatihan SDM untuk supervisor dan staf: kepemimpinan, layanan pelanggan, penerapan SOP, dan KPI, dengan materi berbasis kasus dan sesi tindak lanjut.",
    faq: [
      {
        question: "Apakah pelatihan bisa diadakan di kantor kami?",
        answer: "Bisa. Pelatihan dapat diadakan di lokasi Anda, di tempat lain yang disepakati, atau secara daring.",
      },
      {
        question: "Berapa jumlah peserta dalam satu kelas?",
        answer:
          "Kami menyarankan kelas yang cukup kecil agar setiap peserta sempat berlatih. Jumlah pastinya kami sepakati saat merancang program.",
      },
      {
        question: "Apakah materi bisa disesuaikan dengan industri kami?",
        answer: "Ya. Setiap program disusun ulang berdasarkan hasil wawancara dan pengamatan di tempat kerja Anda.",
      },
    ],
    sortOrder: 5,
    updatedAt: "2026-10-06T03:00:00.000Z",
  },
  {
    id: "service-audit-operasional",
    slug: "audit-operasional",
    title: "Audit Operasional",
    summary: "Menilai efektivitas dan efisiensi proses operasional untuk menemukan pemborosan, risiko, dan peluang perbaikan.",
    bodyMd: `## Apa itu audit operasional?

Audit operasional adalah pemeriksaan menyeluruh terhadap cara sebuah proses dijalankan, untuk menilai apakah proses itu efektif, efisien, dan terkendali.

Berbeda dengan audit laporan keuangan, fokusnya ada pada alur kerja, pembagian tugas, dan titik-titik yang rawan kesalahan.

Audit ini cocok dilakukan sebelum perusahaan berekspansi, setelah terjadi masalah berulang, atau ketika manajemen ingin memastikan prosedur yang ada benar-benar dijalankan.

## Bagaimana kami melakukannya?

### Penetapan ruang lingkup

Kami menyepakati proses yang akan diperiksa, misalnya pengadaan, persediaan, atau penagihan, beserta pertanyaan utama yang ingin dijawab. Ruang lingkup yang fokus membuat pemeriksaan lebih dalam dan hasilnya lebih mudah ditindaklanjuti.

### Pengumpulan bukti

Kami mengamati pekerjaan, mewawancarai pelaksana, menelusuri contoh transaksi, dan membandingkannya dengan prosedur yang berlaku. Setiap temuan kami konfirmasi kepada pemilik proses sebelum dimasukkan ke laporan.

### Laporan temuan dan rekomendasi

Setiap temuan dilengkapi penjelasan dampak, akar masalah, dan rekomendasi yang bisa dijalankan. Hasilnya kami paparkan kepada manajemen dan dibahas bersama sebelum laporan final diserahkan.

Laporan ditulis dengan bahasa lugas agar mudah ditindaklanjuti, bukan hanya disimpan sebagai arsip.

## Apa yang Anda terima?

- Laporan temuan yang diurutkan berdasarkan tingkat risiko.
- Rekomendasi perbaikan beserta usulan penanggung jawab.
- Rencana tindak lanjut yang bisa dipantau manajemen.`,
    cover: generalMedia["service-audit-operasional"],
    metaTitle: "Audit Operasional Perusahaan",
    metaDescription:
      "Audit operasional untuk menilai efektivitas proses pengadaan, persediaan, atau penagihan, lengkap dengan temuan, akar masalah, dan rekomendasi perbaikan.",
    faq: [
      {
        question: "Apakah audit operasional sama dengan audit keuangan?",
        answer:
          "Tidak. Audit operasional menilai cara kerja dan pengendalian proses. Kami tidak memberikan opini atas laporan keuangan.",
      },
      {
        question: "Apakah tim kami harus berhenti bekerja selama audit?",
        answer: "Tidak. Wawancara dan pengamatan kami jadwalkan agar tidak mengganggu operasional harian.",
      },
      {
        question: "Apa yang terjadi setelah laporan audit diserahkan?",
        answer:
          "Anda bisa menjalankan rekomendasi secara mandiri atau meminta kami mendampingi perbaikannya, misalnya lewat penyusunan SOP atau pelatihan.",
      },
    ],
    sortOrder: 6,
    updatedAt: "2026-10-06T03:00:00.000Z",
  },
];
