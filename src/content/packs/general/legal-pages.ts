import type { LegalPage } from "@/core/domain/page/legal-page";
import { generalSettings } from "@/content/packs/general/settings";

const UPDATED_AT = "2026-11-10T03:00:00.000Z";
const { email, phone, address } = generalSettings;
const officeAddress = `${address.street}, ${address.city}, ${address.region} ${address.postalCode}`;

export const generalLegalPages: LegalPage[] = [
  {
    slug: "privasi",
    title: "Kebijakan Privasi",
    intro:
      "Kebijakan ini menjelaskan data pribadi apa yang kami terima melalui situs Arunika Solusi, untuk apa data itu dipakai, dan bagaimana Anda dapat menghubungi kami tentang data tersebut.",
    sections: [
      {
        heading: "Data yang kami terima",
        bodyMd: `Data yang kami terima melalui situs ini antara lain:

- Data yang Anda isi di formulir kontak, seperti nama, alamat email, nomor telepon, dan isi pesan.
- Nomor WhatsApp dan isi percakapan bila Anda menghubungi kami melalui tombol WhatsApp.

Formulir kontak juga mencatat data teknis terbatas, misalnya alamat IP yang disimpan dalam bentuk hash, untuk mencegah spam dan pengiriman berulang.

Mohon tidak mengirimkan dokumen rahasia perusahaan atau data pribadi orang lain melalui formulir maupun WhatsApp sebelum ada kesepakatan kerja sama.`,
      },
      {
        heading: "Cara kami menggunakan data",
        bodyMd: `Data tersebut kami gunakan untuk membalas pertanyaan Anda, menindaklanjuti permintaan konsultasi, dan menyiapkan usulan kerja bila Anda memintanya.

Kami tidak menjual data pribadi Anda kepada pihak mana pun.`,
      },
      {
        heading: "Penyimpanan dan keamanan",
        bodyMd:
          "Kami menyimpan data hanya selama dibutuhkan untuk keperluan di atas dan membatasi aksesnya kepada tim yang menangani permintaan Anda. Kami berupaya menjaga keamanan data tersebut, tetapi tidak ada sistem elektronik yang sepenuhnya bebas risiko.",
      },
      {
        heading: "Layanan pihak ketiga",
        bodyMd:
          "Percakapan melalui WhatsApp juga tunduk pada kebijakan privasi penyedia layanan tersebut. Situs ini dapat memuat tautan ke situs lain yang memiliki kebijakan privasinya sendiri, sehingga kami menyarankan Anda membacanya saat mengunjungi situs tersebut.",
      },
      {
        heading: "Hak Anda atas data",
        bodyMd: `Anda dapat meminta kami menunjukkan, memperbaiki, atau menghapus data pribadi Anda yang kami simpan. Kirim permintaan ke ${email} dengan menyebutkan data yang dimaksud.`,
      },
      {
        heading: "Perubahan kebijakan dan kontak",
        bodyMd: `Kebijakan ini dapat diperbarui sewaktu-waktu, dan tanggal pembaruan terakhir selalu tercantum di halaman ini.

Pertanyaan tentang privasi dapat dikirim ke ${email}, disampaikan melalui telepon di ${phone}, atau lewat [halaman kontak](/kontak). Alamat kantor kami: ${officeAddress}.`,
      },
    ],
    metaDescription:
      "Kebijakan privasi Arunika Solusi: data yang kami terima lewat formulir kontak dan WhatsApp, cara kami memakainya, serta cara meminta perubahan data.",
    updatedAt: UPDATED_AT,
  },
  {
    slug: "syarat-ketentuan",
    title: "Syarat dan Ketentuan",
    intro:
      "Syarat dan ketentuan ini berlaku bagi setiap orang yang mengakses situs Arunika Solusi. Dengan menggunakan situs ini, Anda dianggap telah membaca dan menyetujui ketentuan di bawah.",
    sections: [
      {
        heading: "Tentang situs ini",
        bodyMd:
          "Situs ini dikelola oleh Arunika Solusi, konsultan manajemen dan transformasi digital yang berkantor di Jakarta Selatan. Situs ini menyajikan informasi tentang perusahaan, layanan, portofolio, dan artikel.",
      },
      {
        heading: "Informasi bersifat umum",
        bodyMd: `Artikel dan materi di situs ini adalah informasi umum, bukan nasihat yang disesuaikan dengan kondisi usaha Anda. Sebelum mengambil keputusan bisnis, pertimbangkan situasi Anda sendiri atau diskusikan dengan konsultan.

Kami berupaya menjaga informasi tetap akurat, tetapi kondisi dan peraturan dapat berubah. Untuk hal yang diatur pihak lain, periksa ketentuan terbaru langsung dari sumber resminya.`,
      },
      {
        heading: "Layanan dan kerja sama",
        bodyMd:
          "Uraian layanan di situs ini, yaitu konsultasi strategi bisnis, transformasi digital, penyusunan SOP, manajemen proyek, pelatihan SDM, dan audit operasional, adalah gambaran umum. Ruang lingkup, jadwal, dan biaya setiap pekerjaan ditetapkan dalam usulan dan perjanjian tertulis yang terpisah.",
      },
      {
        heading: "Hak kekayaan intelektual",
        bodyMd:
          "Teks, logo, dan materi lain di situs ini milik Arunika Solusi, kecuali disebutkan lain. Sebagian foto berasal dari pihak ketiga dan tetap tunduk pada lisensi pemiliknya. Penggunaan ulang materi kami di luar kutipan singkat yang menyebutkan sumbernya memerlukan izin tertulis dari kami.",
      },
      {
        heading: "Tautan ke situs lain",
        bodyMd:
          "Situs ini memuat tautan ke sumber resmi dan situs pihak ketiga. Kami tidak mengendalikan isi situs tersebut dan tidak bertanggung jawab atas perubahan isi maupun ketersediaannya.",
      },
      {
        heading: "Batasan tanggung jawab",
        bodyMd:
          "Keputusan yang diambil berdasarkan informasi umum di situs ini sepenuhnya menjadi tanggung jawab pembaca. Hak dan kewajiban dalam sebuah proyek hanya diatur dalam perjanjian kerja sama yang bersangkutan.",
      },
      {
        heading: "Perubahan ketentuan dan kontak",
        bodyMd: `Kami dapat memperbarui syarat dan ketentuan ini sewaktu-waktu. Versi terbaru selalu tersedia di halaman ini beserta tanggal pembaruannya. Pertanyaan dapat dikirim ke ${email} atau melalui [halaman kontak](/kontak).`,
      },
    ],
    metaDescription:
      "Syarat dan ketentuan situs Arunika Solusi, mencakup sifat informasi, layanan dan kerja sama, hak kekayaan intelektual, serta batas tanggung jawab.",
    updatedAt: UPDATED_AT,
  },
  {
    slug: "kebijakan-editorial",
    title: "Kebijakan Editorial",
    intro:
      "Kebijakan ini menjelaskan bagaimana tim Arunika Solusi menulis, memeriksa, dan memperbarui artikel di situs ini, supaya Anda bisa menilai seberapa jauh isinya dapat dipercaya.",
    sections: [
      {
        heading: "Tujuan konten",
        bodyMd:
          "Artikel kami bertujuan membantu pemilik usaha dan manajer memahami topik strategi, SOP, KPI, dan transformasi digital secara praktis. Kami menulis untuk menjawab pertanyaan yang sering muncul dalam pekerjaan konsultasi, bukan untuk mengejar jumlah artikel.",
      },
      {
        heading: "Penulis",
        bodyMd:
          "Setiap artikel ditulis oleh anggota tim Arunika Solusi yang menangani topik tersebut dalam pekerjaannya. Nama, jabatan, dan latar belakang penulis ditampilkan di setiap artikel dan di [halaman tentang kami](/tentang).",
      },
      {
        heading: "Sumber dan rujukan",
        bodyMd:
          "Kami mengutamakan sumber primer dan resmi, seperti situs pemerintah, lembaga statistik, dan badan standar. Setiap data atau klaim dari pihak ketiga disertai tautan ke sumbernya agar pembaca bisa memeriksanya sendiri.",
      },
      {
        heading: "Penggunaan pengalaman dan data",
        bodyMd: `Kami hanya menceritakan pengalaman yang benar-benar kami jalani dan tidak mengarang angka, studi kasus, maupun kutipan. Bila contoh yang sesuai belum tersedia, kami memilih tidak menampilkannya daripada membuat contoh fiktif.

Informasi rahasia klien tidak kami tampilkan. Ilustrasi selalu diberi label "Ilustrasi" dan tidak disajikan sebagai foto atau hasil nyata.`,
      },
      {
        heading: "Tanggal dan pembaruan",
        bodyMd:
          "Setiap artikel menampilkan tanggal terbit dan tanggal terakhir diperbarui. Kami meninjau artikel lama secara berkala dan memperbarui bagian yang sudah tidak relevan, termasuk tautan sumber yang berubah.",
      },
      {
        heading: "Koreksi",
        bodyMd: `Bila Anda menemukan kesalahan, kirimkan ke ${email} dengan menyebutkan judul artikel dan bagian yang dimaksud. Kesalahan yang terkonfirmasi kami perbaiki, dan tanggal pembaruan artikel kami sesuaikan.`,
      },
      {
        heading: "Kepentingan komersial",
        bodyMd:
          "Situs ini milik perusahaan konsultan yang menjual jasa. Beberapa artikel menautkan ke halaman layanan kami bila relevan dengan topiknya. Kami tidak memasang iklan berbayar di artikel, dan bila kelak ada konten bersponsor atau tautan afiliasi, kami akan menandainya dengan jelas.",
      },
    ],
    metaDescription:
      "Kebijakan editorial Arunika Solusi: siapa penulis artikel, sumber yang kami pakai, cara kami memperbarui dan mengoreksi isi, serta kepentingan komersial.",
    updatedAt: UPDATED_AT,
  },
];
