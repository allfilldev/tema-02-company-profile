const FIELD_LABELS: Record<string, string> = {
  slug: "Slug",
  title: "Judul",
  name: "Nama",
  summary: "Ringkasan",
  bodyMd: "Isi",
  cover: "Gambar sampul",
  metaTitle: "Meta title",
  metaDescription: "Meta description",
  faq: "Pertanyaan yang sering diajukan",
  lead: "Lead",
  authorId: "Penulis",
  clientName: "Nama klien",
  category: "Kategori",
  completedOn: "Tanggal selesai",
  gallery: "Galeri",
  jobTitle: "Jabatan",
  bio: "Bio singkat",
  yearsExperience: "Pengalaman",
  photo: "Foto",
  profiles: "Profil publik",
  key: "Kunci",
  label: "Label",
  value: "Nilai",
  suffix: "Akhiran",
  company: "Perusahaan",
  quote: "Kutipan",
  url: "Alamat situs",
  logo: "Logo",
};

export function fieldLabel(field: string): string {
  return FIELD_LABELS[field] ?? field;
}
