This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy

Tiga variabel lingkungan ditanam saat build untuk halaman yang diprarender (canonical, sitemap, robots, RSS, JSON-LD, dan URL Open Graph), jadi semuanya harus diatur sebelum `npm run build`, bukan sesudahnya:

- `SITE_URL`: alamat produksi tanpa path, query, atau hash, misalnya `https://contoh.co.id`. Build produksi dengan `SITE_INDEXING=on` akan gagal bila kosong atau mengarah ke localhost.
- `SITE_INDEXING`: biarkan `off` (atau kosong) sampai situs resmi tayang, lalu ubah ke `on` dan build ulang.
- `DATA_SOURCE`: `demo` untuk paket konten demo. `supabase` belum tersedia.

Build mengunduh font dari jaringan, jadi lingkungan build harus punya akses internet.
