import { ContactForm } from "@/components/site/sections/contact-form";
import { submitContactMessage } from "@/server/actions/site/contact";
import { PageHero } from "@/components/site/sections/page-hero";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Section } from "@/components/ui/section";
import type { ContactPageModel } from "@/server/site/models/contact";
import type { ReactNode } from "react";

type ContactViewProps = {
  model: ContactPageModel;
};

type ContactRowProps = {
  icon: string;
  label: string;
  children: ReactNode;
};

const FORM_HEADING = "Kirim pesan kepada kami";
const DETAILS_HEADING = "Informasi kontak";
const MAP_HEADING = "Lokasi kami";
const WHATSAPP_LINK_LABEL = "Chat lewat WhatsApp";
const HEADING_CLASS_NAME = "text-2xl font-bold tracking-tight text-foreground md:text-3xl";
const LINK_CLASS_NAME =
  "inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4 hover:text-primary-hover";

function phoneHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

function ContactRow({ icon, label, children }: ContactRowProps) {
  return (
    <div className="flex gap-3">
      <Icon name={icon} className="mt-1 size-5 shrink-0 text-primary" />
      <div>
        <dt className="text-sm font-semibold text-foreground">{label}</dt>
        <dd className="text-base text-muted-foreground">{children}</dd>
      </div>
    </div>
  );
}

export function ContactView({ model }: ContactViewProps) {
  const { intro, settings, whatsappUrl, isDemo } = model;
  const { address } = settings;

  return (
    <>
      <PageHero eyebrow={intro.eyebrow} title={intro.title} description={intro.description} />
      <Section id="formulir">
        <div className="grid gap-10 lg:grid-cols-3">
          <section aria-labelledby="formulir-title" className="lg:col-span-2">
            <h2 id="formulir-title" className={HEADING_CLASS_NAME}>
              {FORM_HEADING}
            </h2>
            <Card className="mt-6">
              <ContactForm isDemo={isDemo} whatsappUrl={whatsappUrl} onSubmit={isDemo ? undefined : submitContactMessage} />
            </Card>
          </section>
          <section aria-labelledby="informasi-title">
            <h2 id="informasi-title" className={HEADING_CLASS_NAME}>
              {DETAILS_HEADING}
            </h2>
            <address className="mt-6 not-italic">
              <dl className="space-y-5">
                <ContactRow icon="map-pin" label="Alamat">
                  {address.street}
                  <br />
                  {`${address.city}, ${address.region} ${address.postalCode}`}
                </ContactRow>
                <ContactRow icon="phone" label="Telepon">
                  <a href={phoneHref(settings.phone)} className={LINK_CLASS_NAME}>
                    {settings.phone}
                  </a>
                </ContactRow>
                <ContactRow icon="mail" label="Email">
                  <a href={`mailto:${settings.email}`} className={LINK_CLASS_NAME}>
                    {settings.email}
                  </a>
                </ContactRow>
                <ContactRow icon="message-circle" label="WhatsApp">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={LINK_CLASS_NAME}>
                    {WHATSAPP_LINK_LABEL}
                  </a>
                </ContactRow>
                {settings.openingHours ? (
                  <ContactRow icon="clock" label="Jam operasional">
                    {settings.openingHours}
                  </ContactRow>
                ) : null}
              </dl>
            </address>
          </section>
        </div>
      </Section>
      {settings.mapsEmbedUrl ? (
        <Section id="lokasi" title={MAP_HEADING}>
          <div className="aspect-video overflow-hidden rounded-lg border border-border">
            <iframe
              src={settings.mapsEmbedUrl}
              title={`Peta lokasi ${settings.siteName}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="size-full"
            />
          </div>
        </Section>
      ) : null}
    </>
  );
}
