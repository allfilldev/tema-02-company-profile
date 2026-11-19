import { PageHero } from "@/components/site/sections/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { NOT_FOUND_TITLE } from "@/lib/site/not-found";

const NOT_FOUND_DESCRIPTION =
  "Alamat yang Anda tuju tidak tersedia atau sudah dipindahkan. Periksa kembali alamatnya, atau kembali ke beranda dan hubungi kami bila membutuhkan bantuan.";

export function NotFoundView() {
  return (
    <PageHero title={NOT_FOUND_TITLE} description={NOT_FOUND_DESCRIPTION}>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/" variant="inverse">
          Kembali ke beranda
        </ButtonLink>
        <ButtonLink href="/kontak" variant="secondary">
          Hubungi kami
        </ButtonLink>
      </div>
    </PageHero>
  );
}
