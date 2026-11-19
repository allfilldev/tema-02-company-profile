import { ContactForm } from "@/components/site/sections/contact-form";
import { submitContactMessage } from "@/server/actions/site/contact";
import { PageHero } from "@/components/site/sections/page-hero";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { ContentSection } from "@/components/site/sections/content-section";
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
const MAP_EYEBROW = "Kunjungi kami";
const WHATSAPP_LINK_LABEL = "Chat lewat WhatsApp";
const HEADING_CLASS_NAME = "text-2xl font-extrabold tracking-tighter text-foreground md:text-3xl";
const DARK_HEADING_CLASS_NAME = "text-2xl font-extrabold tracking-tighter text-surface-inverse-foreground md:text-3xl";
const LINK_CLASS_NAME =
  "inline-flex min-h-11 items-center font-medium text-accent underline underline-offset-4 hover:text-surface-inverse-foreground";

function phoneHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

function ContactRow({ icon, label, children }: ContactRowProps) {
  return (
    <div className="flex gap-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-surface-inverse-foreground/10 text-highlight">
        <Icon name={icon} className="size-5 shrink-0" />
      </span>
      <div>
        <dt className="text-sm font-semibold text-surface-inverse-foreground">{label}</dt>
        <dd className="text-base text-surface-inverse-foreground/80">{children}</dd>
      </div>
    </div>
  );
}

export function ContactView({ model }: ContactViewProps) {
  const { intro, settings, whatsappUrl, isDemo } = model;
  const { address } = settings;

  return (
    <div className="page-enter">
      <PageHero eyebrow={intro.eyebrow} title={intro.title} description={intro.description} />
      <ContentSection id="formulir">
        <div className="grid gap-10 lg:grid-cols-3">
          <section aria-labelledby="formulir-title" className="lg:col-span-2">
            <h2 id="formulir-title" className={HEADING_CLASS_NAME}>
              {FORM_HEADING}
            </h2>
            <Card className="mt-6 p-6 md:p-8">
              <ContactForm isDemo={isDemo} whatsappUrl={whatsappUrl} onSubmit={isDemo ? undefined : submitContactMessage} />
            </Card>
          </section>
          <section
            aria-labelledby="informasi-title"
            className="rounded-2xl bg-surface-inverse p-6 text-surface-inverse-foreground shadow-soft md:p-8"
          >
            <h2 id="informasi-title" className={DARK_HEADING_CLASS_NAME}>
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
      </ContentSection>
      {settings.mapsEmbedUrl ? (
        <Reveal>
          <ContentSection id="lokasi" tone="surface-muted" eyebrow={MAP_EYEBROW} title={MAP_HEADING}>
            <div className="aspect-video overflow-hidden rounded-2xl border border-border shadow-soft">
              <iframe
                src={settings.mapsEmbedUrl}
                title={`Peta lokasi kantor kami`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="size-full"
              />
            </div>
          </ContentSection>
        </Reveal>
      ) : null}
    </div>
  );
}
