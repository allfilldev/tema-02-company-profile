import type { SiteQueries } from "@/core/application/site/site-queries";
import type { SectionIntro } from "@/core/domain/page/section-intro";
import type { Service } from "@/core/domain/service/service";
import { buildFaqJsonLd, buildServiceJsonLd, type JsonLd } from "@/lib/seo/json-ld";
import type { SiteContext } from "@/server/site/site-context";
import {
  buildPageSeo,
  HOME_BREADCRUMB,
  requireSectionIntro,
  takeOthers,
  type PageSeoResult,
} from "@/server/site/models/page-seo";
import { SITE_ROUTES } from "@/lib/site/routes";

const SERVICES_PATH = SITE_ROUTES.services;
const SERVICES_BREADCRUMB = { name: "Layanan", path: SERVICES_PATH };
const OTHER_SERVICES_LIMIT = 3;

export type ServicesIndexModel = {
  seo: PageSeoResult;
  intro: SectionIntro;
  services: Service[];
};

export type ServiceDetailModel = {
  seo: PageSeoResult;
  service: Service;
  others: Service[];
};

export async function getServicesIndexModel(
  queries: SiteQueries,
  context: SiteContext,
): Promise<ServicesIndexModel | null> {
  if (!queries.isModuleEnabled("services")) {
    return null;
  }

  const [intro, services] = await Promise.all([requireSectionIntro(queries, "services"), queries.listServices()]);

  return {
    seo: buildPageSeo(context, {
      path: SERVICES_PATH,
      title: intro.metaTitle,
      description: intro.metaDescription,
      ogImagePath: null,
      breadcrumbs: [HOME_BREADCRUMB, SERVICES_BREADCRUMB],
      jsonLd: [],
    }),
    intro,
    services,
  };
}

export async function getServiceDetailModel(
  queries: SiteQueries,
  context: SiteContext,
  slug: string,
): Promise<ServiceDetailModel | null> {
  const service = await queries.getService(slug);
  if (!service) {
    return null;
  }

  const services = await queries.listServices();
  const path = `${SERVICES_PATH}/${service.slug}`;
  const faqJsonLd = buildFaqJsonLd(service.faq);
  const jsonLd: JsonLd[] = [
    buildServiceJsonLd(service, context.settings, context.env.siteUrl),
    ...(faqJsonLd ? [faqJsonLd] : []),
  ];

  return {
    seo: buildPageSeo(context, {
      path,
      title: service.metaTitle,
      description: service.metaDescription,
      ogImagePath: `${path}/opengraph-image`,
      breadcrumbs: [HOME_BREADCRUMB, SERVICES_BREADCRUMB, { name: service.title, path }],
      jsonLd,
    }),
    service,
    others: takeOthers(services, service.slug, OTHER_SERVICES_LIMIT),
  };
}

export async function listServiceSlugs(queries: SiteQueries): Promise<string[]> {
  const services = await queries.listServices();
  return services.map((service) => service.slug);
}
