import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/contract/breadcrumbs";
import { JsonLd } from "@/components/site/contract/json-ld";
import { LegalView } from "@/components/site/views/legal-view";
import { Container } from "@/components/ui/container";
import { themeConfig } from "@/config/theme";
import { getSiteQueries } from "@/server/container";
import { getLegalPageModel } from "@/server/site/models/legal";
import { getSiteContext } from "@/server/site/site-context";
import { getSiteEnv } from "@/server/site/site-env";

const LEGAL_SLUG = "privasi";

async function loadLegalModel() {
  const queries = getSiteQueries();
  const context = await getSiteContext(queries, getSiteEnv(), themeConfig);
  const model = await getLegalPageModel(queries, context, LEGAL_SLUG);
  if (!model) {
    notFound();
  }
  return model;
}

export async function generateMetadata(): Promise<Metadata> {
  const model = await loadLegalModel();
  return model.seo.metadata;
}

export default async function PrivacyPage() {
  const model = await loadLegalModel();

  return (
    <>
      <JsonLd data={model.seo.jsonLd} />
      {model.seo.breadcrumbs.length > 1 ? (
        <Container className="pt-4">
          <Breadcrumbs items={model.seo.breadcrumbs} />
        </Container>
      ) : null}
      <LegalView model={model} />
    </>
  );
}
