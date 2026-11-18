import type { ContentBlock } from "@/core/domain/content-block/content-block";
import type { ContentPack } from "@/core/domain/content-pack/content-pack";
import type { FaqItem } from "@/core/domain/shared/faq-item";
import type { MediaAsset } from "@/core/domain/shared/media-asset";

const UPDATED_AT = "2026-11-10T08:00:00.000Z";
const PUBLISHED_AT_LATEST = "2026-11-05T08:00:00.000Z";
const PUBLISHED_AT_EARLIER = "2026-10-20T08:00:00.000Z";

function buildMedia(id: string, alt: string): MediaAsset {
  return { id, url: `/demo/nusa-karya/${id}.webp`, alt, width: 1200, height: 800 };
}

function buildFaq(topic: string, count: number): FaqItem[] {
  return Array.from({ length: count }, (_, index) => ({
    question: `Apa yang perlu diketahui tentang ${topic} (bagian ${index + 1})?`,
    answer: `Jawaban singkat dan jelas tentang ${topic} untuk pertanyaan nomor ${index + 1}.`,
  }));
}

export function buildTestPack(): ContentPack {
  return {
    settings: {
      siteName: "Nusa Karya",
      tagline: "Mitra digital untuk bisnis yang ingin tumbuh",
      logo: buildMedia("logo", "Logo Nusa Karya"),
      defaultOgImage: buildMedia("og-default", "Tim Nusa Karya sedang berdiskusi di kantor"),
      email: "halo@nusakarya.example.com",
      phone: "+62 21 5550 1234",
      whatsappNumber: "6281234567890",
      whatsappMessage: "Halo, saya ingin berkonsultasi tentang layanan Nusa Karya.",
      address: {
        street: "Jl. Merdeka No. 10",
        city: "Bandung",
        region: "Jawa Barat",
        postalCode: "40111",
        country: "Indonesia",
      },
      mapsEmbedUrl: "https://www.google.com/maps/embed?pb=nusa-karya",
      openingHours: "Senin–Jumat 09.00–17.00 WIB",
      socialLinks: [
        { platform: "Instagram", url: "https://www.instagram.com/nusakarya" },
        { platform: "LinkedIn", url: "https://www.linkedin.com/company/nusakarya" },
      ],
      schemaType: "LocalBusiness",
      foundedYear: 2015,
      googleSiteVerification: "verification-token-nusa-karya",
      gaMeasurementId: "G-NUSAKARYA1",
      updatedAt: UPDATED_AT,
    },
    home: {
      heroEyebrow: "Studio digital di Bandung",
      metaTitle: "Studio Digital dan Website Perusahaan",
      metaDescription:
        "Nusa Karya adalah studio digital di Bandung yang merancang website perusahaan yang cepat, rapi, dan mudah ditemukan di Google. Konsultasi gratis.",
      heroTitle: "Website perusahaan yang membuat bisnis Anda dipercaya",
      heroSubtitle: "Kami merancang dan membangun website yang cepat, rapi, dan mudah ditemukan di Google.",
      heroImage: buildMedia("hero", "Tim Nusa Karya mempresentasikan rancangan website kepada klien"),
      primaryCta: { label: "Konsultasi Gratis", href: "/kontak" },
      secondaryCta: { label: "Lihat Portofolio", href: "/portofolio" },
      updatedAt: UPDATED_AT,
    },
    sectionIntros: [
      {
        key: "services",
        eyebrow: "Layanan",
        title: "Layanan kami",
        description: "Solusi digital yang kami kerjakan.",
        metaTitle: "Layanan Digital untuk Bisnis",
        metaDescription:
          "Pembuatan website company profile dan desain identitas merek dari Nusa Karya, dikerjakan bertahap dan dijelaskan dengan bahasa yang mudah dipahami.",
      },
      {
        key: "portfolio",
        eyebrow: "Portofolio",
        title: "Proyek terbaru",
        description: null,
        metaTitle: "Portofolio Proyek Website",
        metaDescription:
          "Lihat proyek website terbaru yang dikerjakan Nusa Karya, termasuk toko kopi lokal dan klinik keluarga, lengkap dengan ringkasan pekerjaannya.",
      },
      {
        key: "team",
        eyebrow: "Tim",
        title: "Orang di balik Nusa Karya",
        description: null,
        metaTitle: "Tim Studio Digital Nusa Karya",
        metaDescription:
          "Kenali tim Nusa Karya, mulai dari direktur kreatif sampai kepala teknologi yang menangani desain, pengembangan, dan performa setiap proyek website.",
      },
      {
        key: "articles",
        eyebrow: "Artikel",
        title: "Wawasan dari tim kami",
        description: null,
        metaTitle: "Artikel Website dan SEO",
        metaDescription:
          "Artikel dari tim Nusa Karya tentang memilih jasa pembuatan website dan SEO untuk website perusahaan, ditulis singkat dan bisa langsung dipraktikkan.",
      },
      {
        key: "stats",
        eyebrow: "Angka",
        title: "Nusa Karya dalam angka",
        description: null,
        metaTitle: "Nusa Karya dalam Angka",
        metaDescription:
          "Angka tentang Nusa Karya, termasuk jumlah proyek yang sudah selesai dan lamanya tim berpengalaman membangun website untuk berbagai bidang usaha.",
      },
      {
        key: "testimonials",
        eyebrow: "Testimoni",
        title: "Kata klien kami",
        description: null,
        metaTitle: "Testimoni Klien Studio Digital",
        metaDescription:
          "Baca pengalaman klien yang pernah memakai jasa Nusa Karya, mulai dari proses kerja yang jelas sampai hasil website yang sesuai dengan harapan mereka.",
      },
      {
        key: "partners",
        eyebrow: "Mitra",
        title: "Mitra yang bekerja bersama kami",
        description: null,
        metaTitle: "Mitra Studio Digital Nusa Karya",
        metaDescription:
          "Mitra yang bekerja bersama Nusa Karya, termasuk penyedia hosting yang membantu menjaga website klien tetap cepat, aman, dan mudah dikelola.",
      },
      {
        key: "vision",
        eyebrow: "Visi dan misi",
        title: "Arah yang kami tuju",
        description: null,
        metaTitle: "Visi dan Misi Nusa Karya",
        metaDescription:
          "Visi dan misi Nusa Karya sebagai mitra digital usaha lokal, serta nilai jujur dan rapi yang kami pegang di setiap pekerjaan bersama klien.",
      },
      {
        key: "about",
        eyebrow: "Tentang kami",
        title: "Tentang Nusa Karya",
        description: null,
        metaTitle: "Tentang Nusa Karya",
        metaDescription:
          "Kenali Nusa Karya, studio digital di Bandung yang membantu usaha kecil dan menengah membangun website perusahaan yang profesional dan terpercaya.",
      },
      {
        key: "contact",
        eyebrow: "Kontak",
        title: "Hubungi kami",
        description: "Ceritakan kebutuhan Anda, kami akan membalas dalam satu hari kerja.",
        metaTitle: "Hubungi Studio Digital Kami",
        metaDescription:
          "Hubungi Nusa Karya untuk membahas kebutuhan website Anda. Ceritakan rencana bisnis Anda dan kami akan membalas dalam satu hari kerja.",
      },
    ],
    about: {
      summary: "Nusa Karya adalah studio digital yang membantu usaha kecil dan menengah tampil profesional secara online.",
      bodyMd: "Kami berdiri sejak 2015 dan sudah mengerjakan banyak website perusahaan untuk berbagai bidang usaha.",
      metaTitle: "Tentang Nusa Karya",
      image: buildMedia("about", "Suasana ruang kerja tim Nusa Karya di Bandung"),
      metaDescription:
        "Kenali Nusa Karya, studio digital di Bandung yang membantu usaha kecil dan menengah membangun website perusahaan yang profesional dan terpercaya.",
      updatedAt: UPDATED_AT,
    },
    vision: {
      vision: "Menjadi mitra digital yang paling dipercaya oleh usaha lokal di Indonesia.",
      missions: ["Membangun website yang cepat dan mudah ditemukan.", "Menjelaskan setiap pekerjaan dengan bahasa yang mudah dipahami."],
      values: [
        { title: "Jujur", description: "Kami menyampaikan apa adanya, termasuk batas dari setiap solusi." },
        { title: "Rapi", description: "Setiap hasil kerja kami periksa sebelum diserahkan kepada klien." },
      ],
    },
    services: [
      {
        id: "service-website",
        slug: "pembuatan-website",
        title: "Pembuatan Website Company Profile",
        summary: "Website perusahaan yang cepat, rapi, dan siap dikelola sendiri oleh tim Anda.",
        bodyMd: "Kami mulai dari memahami bisnis Anda, lalu merancang struktur halaman, desain, dan konten yang sesuai.",
        cover: buildMedia("service-website", "Contoh tampilan website company profile di laptop dan ponsel"),
        metaTitle: "Pembuatan Website Company Profile",
        metaDescription:
          "Jasa pembuatan website company profile yang cepat, rapi, dan ramah SEO. Konsultasikan kebutuhan website perusahaan Anda bersama tim Nusa Karya.",
        faq: buildFaq("pembuatan website", 3),
        sortOrder: 1,
        updatedAt: UPDATED_AT,
      },
      {
        id: "service-branding",
        slug: "desain-identitas-merek",
        title: "Desain Identitas Merek Perusahaan",
        summary: "Logo dan panduan visual yang membuat bisnis Anda mudah dikenali.",
        bodyMd: "Kami menyusun logo, warna, dan huruf yang konsisten di website maupun materi cetak.",
        cover: buildMedia("service-branding", "Contoh logo dan panduan warna untuk identitas merek perusahaan"),
        metaTitle: "Desain Identitas Merek Perusahaan",
        metaDescription:
          "Layanan desain identitas merek mulai dari logo hingga panduan visual agar bisnis Anda konsisten dan mudah dikenali di semua media.",
        faq: [],
        sortOrder: 2,
        updatedAt: UPDATED_AT,
      },
    ],
    portfolio: [
      {
        id: "portfolio-kopi",
        slug: "website-toko-kopi-nusantara",
        title: "Website Toko Kopi Nusantara",
        clientName: "Kopi Nusantara",
        category: "Website Company Profile",
        summary: "Website katalog dan profil usaha untuk jaringan toko kopi lokal.",
        bodyMd: "Kami membangun website yang menampilkan produk, cerita usaha, dan lokasi toko.",
        cover: buildMedia("portfolio-kopi", "Tampilan beranda website Toko Kopi Nusantara"),
        gallery: [buildMedia("portfolio-kopi-gallery", "Halaman katalog produk Toko Kopi Nusantara")],
        completedOn: "2026-06-15",
        metaTitle: "Website Toko Kopi Nusantara",
        metaDescription:
          "Studi kasus pembuatan website untuk Toko Kopi Nusantara, lengkap dengan katalog produk, profil usaha, dan informasi lokasi toko di Bandung.",
        sortOrder: 1,
        updatedAt: UPDATED_AT,
      },
      {
        id: "portfolio-klinik",
        slug: "website-klinik-sehat-sentosa",
        title: "Website Klinik Sehat Sentosa",
        clientName: "Klinik Sehat Sentosa",
        category: "Website Company Profile",
        summary: "Website layanan dan jadwal dokter untuk klinik keluarga.",
        bodyMd: "Kami menyusun halaman layanan, jadwal dokter, dan formulir kontak yang mudah dipakai pasien.",
        cover: buildMedia("portfolio-klinik", "Tampilan beranda website Klinik Sehat Sentosa"),
        gallery: [],
        completedOn: null,
        metaTitle: "Website Klinik Sehat Sentosa",
        metaDescription:
          "Studi kasus pembuatan website Klinik Sehat Sentosa dengan halaman layanan, jadwal dokter, dan formulir kontak yang mudah digunakan oleh pasien.",
        sortOrder: 2,
        updatedAt: UPDATED_AT,
      },
    ],
    team: [
      {
        id: "team-rina",
        name: "Rina Wulandari",
        jobTitle: "Direktur Kreatif",
        bio: "Rina memimpin tim desain dan sudah merancang puluhan website perusahaan sejak 2015.",
        photo: buildMedia("team-rina", "Foto Rina Wulandari, Direktur Kreatif Nusa Karya"),
        yearsExperience: 11,
        profiles: ["https://www.linkedin.com/in/rina-wulandari"],
        sortOrder: 1,
      },
      {
        id: "team-bima",
        name: "Bima Pratama",
        jobTitle: "Kepala Teknologi",
        bio: "Bima mengurus pengembangan website dan memastikan performa setiap proyek tetap terjaga.",
        photo: null,
        yearsExperience: null,
        profiles: [],
        sortOrder: 2,
      },
    ],
    stats: [
      { key: "projects_completed", label: "Proyek selesai", value: 120, suffix: "+", sortOrder: 1 },
      { key: "years_active", label: "Tahun berpengalaman", value: 11, suffix: null, sortOrder: 2 },
    ],
    testimonials: [
      {
        id: "testimonial-sari",
        name: "Sari Anggraini",
        jobTitle: "Pemilik",
        company: "Kopi Nusantara",
        quote: "Prosesnya jelas dan hasilnya sesuai harapan kami.",
        photo: null,
        sortOrder: 1,
      },
    ],
    partners: [
      {
        id: "partner-cloudsa",
        name: "Cloudsa Hosting",
        logo: buildMedia("partner-cloudsa", "Logo Cloudsa Hosting"),
        url: "https://cloudsa.example.com",
        sortOrder: 1,
      },
    ],
    articles: [
      {
        id: "article-memilih-jasa-website",
        slug: "cara-memilih-jasa-pembuatan-website",
        title: "Cara Memilih Jasa Pembuatan Website yang Tepat",
        metaTitle: "Cara Memilih Jasa Pembuatan Website",
        metaDescription:
          "Panduan memilih jasa pembuatan website untuk bisnis Anda, mulai dari menilai portofolio, membandingkan penawaran, hingga menyiapkan kebutuhan awal.",
        lead: "Pilih jasa pembuatan website dengan melihat portofolio nyata, proses kerja yang jelas, dan dukungan setelah website selesai.",
        bodyMd: "## Apa yang perlu dilihat dari portofolio?\n\nPeriksa hasil kerja nyata dan hubungi klien sebelumnya bila memungkinkan.",
        cover: buildMedia("article-memilih-jasa-website", "Dua orang membandingkan penawaran jasa pembuatan website"),
        authorId: "team-rina",
        faq: buildFaq("memilih jasa website", 3),
        publishedAt: PUBLISHED_AT_LATEST,
        updatedAt: UPDATED_AT,
      },
      {
        id: "article-seo-website-perusahaan",
        slug: "panduan-seo-website-perusahaan",
        title: "Panduan SEO untuk Website Perusahaan",
        metaTitle: "Panduan SEO untuk Website Perusahaan",
        metaDescription:
          "Langkah praktis SEO untuk website perusahaan: menulis judul dan deskripsi yang tepat, mengatur struktur heading, serta menjaga kecepatan halaman.",
        lead: "SEO website perusahaan dimulai dari judul yang jelas, struktur heading yang rapi, dan halaman yang cepat dibuka.",
        bodyMd: "## Apa saja dasar SEO untuk website perusahaan?\n\nMulailah dari judul, deskripsi, dan kecepatan halaman.",
        cover: null,
        authorId: "team-bima",
        faq: buildFaq("SEO website perusahaan", 4),
        publishedAt: PUBLISHED_AT_EARLIER,
        updatedAt: UPDATED_AT,
      },
    ],
    contentBlocks: [
      {
        key: "how-we-work",
        eyebrow: "Cara kerja",
        title: "Bagaimana kami bekerja",
        description: "Tiga langkah sederhana dari diskusi hingga website tayang.",
        items: [
          { title: "Diskusi kebutuhan", description: "Kami mendengarkan tujuan bisnis Anda.", icon: "message", media: null, link: null },
          { title: "Perancangan", description: "Kami menyusun desain dan struktur halaman.", icon: "layout", media: null, link: null },
          {
            title: "Peluncuran",
            description: "Kami menayangkan website dan mendampingi Anda.",
            icon: "rocket",
            media: null,
            link: { label: "Mulai konsultasi", href: "/kontak" },
          },
        ],
      },
    ],
    legalPages: [
      {
        slug: "privasi",
        title: "Kebijakan Privasi",
        intro: "Halaman ini menjelaskan data apa yang kami kumpulkan dan untuk apa kami memakainya.",
        sections: [{ heading: "Data yang kami kumpulkan", bodyMd: "Kami hanya menyimpan data yang Anda kirim melalui formulir kontak." }],
        metaDescription:
          "Kebijakan privasi Nusa Karya menjelaskan data apa yang kami kumpulkan melalui website, bagaimana kami menggunakannya, dan cara menghubungi kami.",
        updatedAt: UPDATED_AT,
      },
      {
        slug: "syarat-ketentuan",
        title: "Syarat dan Ketentuan",
        intro: "Halaman ini berisi ketentuan penggunaan website Nusa Karya.",
        sections: [{ heading: "Penggunaan website", bodyMd: "Konten website ini disediakan sebagai informasi umum tentang layanan kami." }],
        metaDescription:
          "Syarat dan ketentuan penggunaan website Nusa Karya, mencakup penggunaan konten, batas tanggung jawab, dan cara menghubungi kami untuk pertanyaan.",
        updatedAt: UPDATED_AT,
      },
      {
        slug: "kebijakan-editorial",
        title: "Kebijakan Editorial",
        intro: "Halaman ini menjelaskan bagaimana kami menulis dan memperbarui artikel.",
        sections: [{ heading: "Penulis dan sumber", bodyMd: "Setiap artikel ditulis oleh anggota tim kami dan mencantumkan sumber yang dipakai." }],
        metaDescription:
          "Kebijakan editorial Nusa Karya menjelaskan siapa penulis artikel kami, bagaimana kami memilih sumber, serta cara kami memperbarui dan mengoreksi konten.",
        updatedAt: UPDATED_AT,
      },
    ],
  };
}

const EMPTY_BLOCK_ITEM = { title: null, description: null, icon: null, media: null, link: null };

export function buildTestLinkedBlocks(): ContentBlock[] {
  return [
    {
      key: "how-we-work",
      eyebrow: "Cara kerja",
      title: "Bagaimana kami bekerja",
      description: null,
      items: [
        { ...EMPTY_BLOCK_ITEM, title: "Diskusi", description: "Kami mendengarkan.", icon: "message", link: { label: "Lihat layanan", href: "/layanan" } },
        { ...EMPTY_BLOCK_ITEM, title: "Peluncuran", description: "Kami menayangkan.", icon: "rocket", link: { label: "Mulai konsultasi", href: "/kontak" } },
      ],
    },
    {
      key: "why-choose-us",
      eyebrow: "Keunggulan",
      title: "Mengapa memilih kami",
      description: null,
      items: [
        { ...EMPTY_BLOCK_ITEM, title: "Berpengalaman", description: "Lebih dari sepuluh tahun.", icon: "award" },
        { ...EMPTY_BLOCK_ITEM, title: "Transparan", description: "Biaya jelas.", icon: "shield-check" },
      ],
    },
    {
      key: "home-faq",
      eyebrow: "FAQ",
      title: "Pertanyaan umum",
      description: null,
      items: [{ ...EMPTY_BLOCK_ITEM, title: "Berapa lama prosesnya?", description: "Sekitar empat minggu." }],
    },
    {
      key: "cta-banner",
      eyebrow: null,
      title: "Siap memulai?",
      description: "Ceritakan kebutuhan Anda.",
      items: [
        { ...EMPTY_BLOCK_ITEM, link: { label: "Lihat Layanan", href: "/layanan" } },
        { ...EMPTY_BLOCK_ITEM, link: { label: "Lihat Portofolio", href: "/portofolio" } },
        { ...EMPTY_BLOCK_ITEM, link: { label: "Baca Artikel", href: "/artikel" } },
        { ...EMPTY_BLOCK_ITEM, link: { label: "Hubungi Kami", href: "/kontak" } },
      ],
    },
  ];
}
