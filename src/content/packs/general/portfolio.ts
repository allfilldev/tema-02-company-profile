import type { PortfolioItem } from "@/core/domain/portfolio/portfolio-item";
import { generalMedia } from "@/content/packs/general/media";

export const generalPortfolio: PortfolioItem[] = [
  {
    id: "portfolio-digitalisasi-gudang-distributor",
    slug: "digitalisasi-gudang-distributor",
    title: "Digitalisasi Gudang Distributor Produk Pertanian",
    clientName: "Taniwara",
    category: "Transformasi Digital",
    summary: "Mengganti pencatatan stok manual di dua gudang Taniwara dengan aplikasi persediaan yang memakai pemindai kode batang.",
    bodyMd: `## Apa tantangannya?

Taniwara, distributor produk pertanian, mencatat keluar-masuk barang di dua gudangnya dengan buku dan spreadsheet terpisah.

Selisih antara catatan dan stok fisik sering baru ketahuan saat stok opname, dan tim penjualan kerap menjanjikan barang yang ternyata sudah habis. Pemilik ingin memperbaiki hal ini tanpa mengganggu pengiriman harian ke pelanggan.

## Bagaimana kami mengerjakannya?

### Merapikan data barang

Langkah pertama justru bukan memilih aplikasi. Bersama tim gudang, kami menyeragamkan kode dan nama barang, lalu membersihkan data ganda sebelum dipindahkan.

### Memilih dan menyiapkan aplikasi

Kami membandingkan beberapa aplikasi persediaan siap pakai berdasarkan kebutuhan Taniwara. Setelah aplikasi dipilih, kami menyusun alur penerimaan, penyimpanan, dan pengeluaran barang yang memakai pemindai kode batang.

### Uji coba bertahap

Uji coba dimulai di gudang yang lebih kecil. Setelah alurnya stabil, penerapan diperluas ke gudang kedua, disertai pelatihan untuk petugas gudang dan admin penjualan.

Selama dua minggu pertama, pencatatan manual tetap disimpan sebagai cadangan sebelum akhirnya dihentikan.

## Apa hasilnya?

Proyek ditutup dengan serah terima panduan penggunaan dan penunjukan admin internal sebagai penanggung jawab aplikasi.

- Stok di kedua gudang tercatat dalam satu aplikasi yang sama.
- Tim penjualan bisa melihat ketersediaan barang sebelum menerima pesanan.
- Stok opname kini dilakukan bergilir per rak, tanpa perlu menutup gudang seharian.`,
    cover: generalMedia["portfolio-digitalisasi-gudang-distributor"],
    gallery: [
      generalMedia["portfolio-digitalisasi-gudang-distributor-1"],
      generalMedia["portfolio-digitalisasi-gudang-distributor-2"],
    ],
    completedOn: "2026-03-27",
    metaTitle: "Digitalisasi Gudang Distributor",
    metaDescription:
      "Studi proyek digitalisasi gudang distributor produk pertanian: merapikan data barang, memilih aplikasi persediaan, dan uji coba bertahap di dua gudang.",
    sortOrder: 1,
    updatedAt: "2026-04-08T03:00:00.000Z",
  },
  {
    id: "portfolio-sop-jaringan-klinik",
    slug: "sop-jaringan-klinik",
    title: "Penyusunan SOP untuk Jaringan Klinik",
    clientName: "Klinik Medivara",
    category: "Penyusunan SOP",
    summary: "Menyeragamkan alur pendaftaran, pelayanan, dan administrasi pasien di seluruh cabang Klinik Medivara.",
    bodyMd: `## Apa tantangannya?

Klinik Medivara berkembang dari satu lokasi menjadi beberapa cabang dalam waktu singkat. Setiap cabang menjalankan pendaftaran dan administrasi pasien dengan caranya sendiri, sehingga pengalaman pasien berbeda-beda dan laporan antarcabang sulit dibandingkan.

Manajemen ingin semua cabang memberi pengalaman setara sebelum membuka lokasi baru.

## Bagaimana kami mengerjakannya?

### Pemetaan alur di setiap cabang

Tim kami mengamati alur pasien dari pendaftaran sampai pembayaran di setiap cabang, lalu mewawancarai resepsionis, perawat, dan staf administrasi.

### Penyusunan prosedur inti

Dari hasil pemetaan, kami menyusun prosedur inti yang berlaku di semua cabang, ditambah catatan penyesuaian untuk cabang dengan layanan berbeda.

Prosedur klinis tetap menjadi wewenang tenaga medis klinik, sedangkan kami fokus pada alur administrasi dan pelayanan. Bahasa dokumennya dibuat sederhana agar mudah dipahami staf baru di cabang mana pun.

### Sosialisasi dan uji coba

Setiap prosedur diuji di satu cabang sebelum disahkan. Masukan dari cabang uji coba dipakai untuk merevisi prosedur sebelum diterapkan di cabang lain. Kami juga menyiapkan checklist ringkas yang ditempel di meja pendaftaran.

## Apa hasilnya?

- Satu set prosedur administrasi dan pelayanan yang dipakai di semua cabang.
- Checklist harian untuk resepsionis dan staf administrasi.
- Penanggung jawab dokumen di setiap cabang yang bertugas memperbarui prosedur.`,
    cover: generalMedia["portfolio-sop-jaringan-klinik"],
    gallery: [generalMedia["portfolio-sop-jaringan-klinik-1"], generalMedia["portfolio-sop-jaringan-klinik-2"]],
    completedOn: "2025-11-14",
    metaTitle: "SOP Pelayanan untuk Jaringan Klinik",
    metaDescription:
      "Studi proyek penyusunan SOP untuk jaringan klinik: pemetaan alur pasien di setiap cabang, prosedur inti yang seragam, dan checklist harian resepsionis.",
    sortOrder: 2,
    updatedAt: "2025-12-02T03:00:00.000Z",
  },
  {
    id: "portfolio-sistem-kpi-manufaktur",
    slug: "sistem-kpi-manufaktur",
    title: "Sistem KPI untuk Perusahaan Manufaktur",
    clientName: "Mandarasa Industri",
    category: "Manajemen Kinerja",
    summary: "Merancang KPI produksi yang terhubung dengan tujuan perusahaan dan dibahas rutin dalam rapat harian Mandarasa Industri.",
    bodyMd: `## Apa tantangannya?

Mandarasa Industri, produsen makanan kemasan, memiliki banyak laporan produksi, tetapi hanya sedikit yang dipakai untuk mengambil keputusan. Setiap bagian memakai ukuran sendiri, dan rapat bulanan lebih banyak membahas perbedaan angka daripada perbaikan.

Manajemen ingin angka produksi bisa dibaca dan dipakai supervisor setiap hari, bukan hanya di akhir bulan.

## Bagaimana kami mengerjakannya?

### Menurunkan tujuan perusahaan

Bersama manajemen, kami menurunkan tujuan perusahaan menjadi indikator untuk bagian produksi, gudang, dan pengendalian mutu. Jumlah indikator setiap bagian sengaja dibatasi agar fokus tidak terpecah.

### Menyusun kamus indikator

Setiap indikator dilengkapi definisi, rumus, sumber data, pemilik, dan frekuensi tinjauan. Kamus ini menjadi acuan bersama agar tidak ada lagi perbedaan cara menghitung.

Kami juga memeriksa sumber data setiap indikator supaya pencatatannya tidak menambah beban administrasi berlebihan.

### Membangun rapat dan dasbor

Kami merancang dasbor sederhana berbasis spreadsheet dan format rapat harian singkat di lantai produksi. Supervisor dilatih membaca angka dan menyepakati tindakan perbaikan.

Rapatnya dibuat ringkas, cukup untuk membahas penyimpangan kemarin dan rencana hari ini.

## Apa hasilnya?

- Kamus indikator yang disepakati semua bagian.
- Dasbor produksi yang diperbarui setiap hari oleh admin produksi.
- Rapat harian singkat yang membahas penyimpangan dan tindak lanjutnya.`,
    cover: generalMedia["portfolio-sistem-kpi-manufaktur"],
    gallery: [generalMedia["portfolio-sistem-kpi-manufaktur-1"], generalMedia["portfolio-sistem-kpi-manufaktur-2"]],
    completedOn: "2026-06-12",
    metaTitle: "Sistem KPI Perusahaan Manufaktur",
    metaDescription:
      "Studi proyek sistem KPI untuk perusahaan manufaktur: menurunkan tujuan menjadi indikator, menyusun kamus KPI, dan membangun rapat harian produksi.",
    sortOrder: 3,
    updatedAt: "2026-06-30T03:00:00.000Z",
  },
  {
    id: "portfolio-pelatihan-layanan-pelanggan-ritel",
    slug: "pelatihan-layanan-pelanggan-ritel",
    title: "Pelatihan Layanan Pelanggan untuk Jaringan Ritel",
    clientName: "Kencanaru Ritel",
    category: "Pelatihan SDM",
    summary: "Program pelatihan layanan pelanggan dan penanganan keluhan untuk staf toko dan kepala toko Kencanaru Ritel.",
    bodyMd: `## Apa tantangannya?

Kencanaru Ritel mengelola beberapa toko pakaian dan kebutuhan rumah tangga. Manajemen menerima keluhan berulang tentang cara staf menyambut pelanggan, menjawab pertanyaan produk, dan menangani penukaran barang.

Manajemen ingin standar layanan yang sama di semua toko, tanpa membuat staf terdengar kaku seperti membaca naskah.

## Bagaimana kami mengerjakannya?

### Mengamati situasi di toko

Sebelum menyusun materi, tim kami mengunjungi beberapa toko dan mengamati interaksi staf dengan pelanggan, baik pada jam sibuk maupun jam sepi.

Kami juga berbincang dengan kepala toko untuk memahami kendala yang mereka hadapi sehari-hari.

### Merancang program yang praktis

Materi disusun dari situasi yang kami temui di toko, seperti pelanggan yang mencari ukuran yang habis atau meminta penukaran tanpa struk. Sebagian besar sesi berisi bermain peran dan simulasi.

Peserta bergantian menjadi staf dan pelanggan, lalu mendapat masukan langsung dari fasilitator dan rekan sekelas.

### Melatih kepala toko sebagai pendamping

Kepala toko mendapat sesi tambahan agar bisa membimbing staf baru dan menjaga kebiasaan baik setelah pelatihan selesai.

## Apa hasilnya?

- Panduan layanan pelanggan yang ringkas untuk setiap toko.
- Skenario penanganan keluhan yang dipakai sebagai bahan latihan rutin.
- Kepala toko yang siap melatih ulang staf baru secara mandiri.`,
    cover: generalMedia["portfolio-pelatihan-layanan-pelanggan-ritel"],
    gallery: [
      generalMedia["portfolio-pelatihan-layanan-pelanggan-ritel-1"],
      generalMedia["portfolio-pelatihan-layanan-pelanggan-ritel-2"],
    ],
    completedOn: "2026-07-24",
    metaTitle: "Pelatihan Layanan Pelanggan Ritel",
    metaDescription:
      "Studi proyek pelatihan layanan pelanggan untuk jaringan ritel: pengamatan di toko, simulasi penanganan keluhan, dan pembekalan kepala toko.",
    sortOrder: 4,
    updatedAt: "2026-08-05T03:00:00.000Z",
  },
  {
    id: "portfolio-migrasi-erp-logistik",
    slug: "migrasi-erp-logistik",
    title: "Pendampingan Migrasi ERP Perusahaan Logistik",
    clientName: "Lintasbaru Logistik",
    category: "Transformasi Digital",
    summary: "Mendampingi Lintasbaru Logistik berpindah dari beberapa aplikasi terpisah ke satu sistem ERP, dari persiapan data sampai masa transisi.",
    bodyMd: `## Apa tantangannya?

Lintasbaru Logistik memakai aplikasi terpisah untuk pemesanan, armada, dan keuangan. Data harus dipindahkan secara manual antaraplikasi, sehingga penagihan sering terlambat dan laporan bulanan memakan waktu lama.

Manajemen sudah memutuskan beralih ke ERP, tetapi khawatir operasional terganggu selama masa peralihan.

## Bagaimana kami mengerjakannya?

### Menyusun kebutuhan dan memilih vendor

Kami memetakan proses dari pemesanan sampai penagihan, menyusun daftar kebutuhan, lalu mendampingi manajemen membandingkan penawaran dari beberapa vendor ERP. Perbandingan mencakup kesesuaian fitur, rencana implementasi, dukungan teknis, dan biaya setelah tahun pertama.

### Menyiapkan data dan alur kerja baru

Data pelanggan, tarif, dan armada dibersihkan sebelum dipindahkan. Kami juga menyusun ulang alur kerja agar sesuai dengan sistem baru, bukan sekadar memindahkan kebiasaan lama.

Setiap bagian menunjuk perwakilan untuk memeriksa hasil uji coba migrasi sebelum data final dipindahkan.

### Mengawal masa transisi

Selama masa peralihan, sistem lama dan baru berjalan berdampingan dalam waktu terbatas. Kami memantau selisih data, mencatat kendala, dan memastikan setiap bagian siap sebelum sistem lama dihentikan.

Pelatihan pemakai dilakukan per bagian dengan transaksi sehari-hari sebagai bahan latihan.

## Apa hasilnya?

- Pemesanan, armada, dan penagihan tercatat dalam satu sistem.
- Alur kerja baru yang terdokumentasi untuk setiap bagian.
- Tim internal yang terlatih menjadi penanggung jawab sistem.`,
    cover: generalMedia["portfolio-migrasi-erp-logistik"],
    gallery: [generalMedia["portfolio-migrasi-erp-logistik-1"], generalMedia["portfolio-migrasi-erp-logistik-2"]],
    completedOn: "2026-09-30",
    metaTitle: "Migrasi ERP Perusahaan Logistik",
    metaDescription:
      "Studi proyek migrasi ERP perusahaan logistik: pemilihan vendor, pembersihan data pelanggan dan armada, penyusunan alur kerja, dan pengawalan transisi.",
    sortOrder: 5,
    updatedAt: "2026-10-14T03:00:00.000Z",
  },
  {
    id: "portfolio-audit-proses-keuangan-koperasi",
    slug: "audit-proses-keuangan-koperasi",
    title: "Audit Proses Keuangan Koperasi Simpan Pinjam",
    clientName: "Koperasi Kopsara",
    category: "Audit Operasional",
    summary: "Memeriksa alur simpanan, pinjaman, dan penagihan Koperasi Kopsara untuk menemukan titik rawan dan peluang perbaikan.",
    bodyMd: `## Apa tantangannya?

Koperasi Kopsara melayani anggota dengan produk simpanan dan pinjaman. Pengurus ingin memastikan proses keuangan sehari-hari tetap tertib seiring bertambahnya anggota, terutama pada pencairan pinjaman dan penagihan angsuran.

Pengurus juga ingin dokumen prosesnya lebih rapi menjelang pemeriksaan rutin.

## Bagaimana kami mengerjakannya?

### Menetapkan ruang lingkup

Bersama pengurus, kami memilih tiga proses utama untuk diperiksa: penerimaan simpanan, pencairan pinjaman, dan penagihan angsuran. Ketiganya dipilih karena paling banyak melibatkan uang tunai dan persetujuan berlapis.

Pemeriksaan ini adalah audit operasional, bukan audit atas laporan keuangan.

### Menelusuri transaksi

Kami menelusuri contoh transaksi dari formulir sampai pencatatan, mewawancarai petugas, dan membandingkan praktik di lapangan dengan aturan internal koperasi. Pemeriksaan dilakukan tanpa menghentikan pelayanan kepada anggota.

### Menyusun rekomendasi

Setiap temuan dilengkapi penjelasan risiko dan rekomendasi yang realistis untuk ukuran koperasi, misalnya pemisahan tugas antara petugas yang menyetujui dan yang mencairkan pinjaman.

Rekomendasi dibahas bersama pengurus dan petugas agar pembagian tugas baru tetap masuk akal dengan jumlah staf yang ada.

## Apa hasilnya?

- Laporan temuan yang diurutkan berdasarkan tingkat risiko.
- Rencana perbaikan yang disetujui pengurus beserta penanggung jawabnya.
- Pembaruan prosedur pencairan dan penagihan yang disusun bersama petugas.`,
    cover: generalMedia["portfolio-audit-proses-keuangan-koperasi"],
    gallery: [
      generalMedia["portfolio-audit-proses-keuangan-koperasi-1"],
      generalMedia["portfolio-audit-proses-keuangan-koperasi-2"],
    ],
    completedOn: "2025-08-22",
    metaTitle: "Audit Proses Keuangan Koperasi",
    metaDescription:
      "Studi proyek audit operasional koperasi simpan pinjam: pemeriksaan alur simpanan, pencairan pinjaman, dan penagihan angsuran beserta rekomendasinya.",
    sortOrder: 6,
    updatedAt: "2025-09-10T03:00:00.000Z",
  },
];
